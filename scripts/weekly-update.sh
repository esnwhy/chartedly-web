#!/bin/bash
# ============================================
# Chartedly Weekly Update Script
# Runs every Monday at 3AM JST via cron
#
# Weekly: new products + price updates
# Monthly (1st Monday): re-score ALL products
# ============================================
#
# Cron entries:
# Weekly update: 0 3 * * 1 /opt/chartedly/scripts/weekly-update.sh >> /opt/chartedly/update.log 2>&1
# Monthly rescore: 0 4 1 * * /opt/chartedly/scripts/monthly-rescore.sh >> /opt/chartedly/rescore.log 2>&1
#

set -e
cd /opt/chartedly

# Load environment
export $(grep -v '^#' .env | xargs)

LOG="/opt/chartedly/update.log"
echo "$(date) — Starting weekly update..." >> "$LOG"

# Pull latest code
git pull origin master 2>&1 >> "$LOG" || true

# ── Step 1a: Fetch new Rakuten rankings ──
echo "[1a] Fetching Rakuten rankings..." >> "$LOG"
node scripts/fetch-rakuten.mjs --all 2>&1 | tail -5 >> "$LOG"

# ── Step 1b: Fetch new Yahoo Shopping products ──
echo "[1b] Fetching Yahoo Shopping products..." >> "$LOG"
node scripts/fetch-yahoo.mjs --all 2>&1 | tail -5 >> "$LOG"

# ── Step 2: AI Enrich ──
# Check if it's the 1st Monday of the month → RESCORE ALL
DAY_OF_MONTH=$(date +%d)
if [ "$DAY_OF_MONTH" -le 7 ]; then
  echo "[2] MONTHLY RESCORE: Re-evaluating ALL products..." >> "$LOG"
  node scripts/ai-enrich.mjs --rescore 2>&1 | tail -10 >> "$LOG"
else
  echo "[2] Enriching new products only..." >> "$LOG"
  node scripts/ai-enrich.mjs 2>&1 | tail -10 >> "$LOG"
fi

# ── Step 2b: Cleanup junk products (shoes, car parts, etc.) ──
echo "[2b] Cleaning up junk products..." >> "$LOG"
PYTHONIOENCODING=utf-8 python3 scripts/cleanup-products.py 2>&1 | tail -10 >> "$LOG"

# ── Step 2c: Dedup products (refills, bulk, duplicates) ──
echo "[2c] Running deduplication filter..." >> "$LOG"
node scripts/dedup-products.mjs --force 2>&1 | tail -10 >> "$LOG"

# ── Step 2d: Fix Amazon affiliate links (movemate04-22 tag) ──
echo "[2d] Fixing affiliate links..." >> "$LOG"
PYTHONIOENCODING=utf-8 python3 scripts/fix-all-links.py 2>&1 | tail -10 >> "$LOG"

# ── Step 3: Sync products ──
echo "[3] Syncing products..." >> "$LOG"
node scripts/sync-products.mjs 2>&1 | tail -5 >> "$LOG"

# ── Step 4: Process images (new products only) ──
echo "[4] Processing images..." >> "$LOG"
PYTHONIOENCODING=utf-8 python3 scripts/remove-backgrounds.py 2>&1 | tail -5 >> "$LOG"
PYTHONIOENCODING=utf-8 python3 scripts/center-products.py 2>&1 | tail -5 >> "$LOG"

# ── Step 5: Build site ──
echo "[5] Building site..." >> "$LOG"
npm run build 2>&1 | tail -3 >> "$LOG"

# ── Step 6: Commit & push if changes ──
git add -A
if git diff --staged --quiet; then
  echo "[6] No changes to commit" >> "$LOG"
else
  COMMIT_MSG="Weekly update $(date +%Y-%m-%d)"
  if [ "$DAY_OF_MONTH" -le 7 ]; then
    COMMIT_MSG="Monthly rescore + weekly update $(date +%Y-%m-%d)"
  fi
  git commit -m "$COMMIT_MSG" >> "$LOG" 2>&1
  git push origin master >> "$LOG" 2>&1
  echo "[6] Changes committed and pushed" >> "$LOG"
fi

echo "$(date) — Done!" >> "$LOG"
echo "" >> "$LOG"
