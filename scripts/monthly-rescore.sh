#!/bin/bash
# ============================================
# Chartedly Monthly Rescore Script
# Re-scores ALL products through Claude API
# Cron: 0 4 1 * * /opt/chartedly/scripts/monthly-rescore.sh >> /opt/chartedly/rescore.log 2>&1
# ============================================

set -e
cd /opt/chartedly

# Load environment
export $(grep -v '^#' .env | xargs)

echo "$(date) — Monthly rescore started"

# Re-score ALL products (ignores progress file, re-generates scores/radar/pros/cons)
node scripts/ai-enrich.mjs --rescore 2>&1 | tail -20

# Sync enriched products to JSON/pages
node scripts/sync-products.mjs 2>&1 | tail -5

# Rebuild site
npm run build 2>&1 | tail -5

echo "$(date) — Monthly rescore done"
