#!/bin/bash
# Seed low categories + fetch all missing images + rebuild
cd /opt/chartedly
source .env && export ANTHROPIC_API_KEY RAKUTEN_APP_ID RAKUTEN_ACCESS_KEY RAKUTEN_AFFILIATE_ID

echo "=== SEED + IMAGES $(date) ==="

echo "[1] Seeding low categories..."
PYTHONIOENCODING=utf-8 python3 scripts/seed-missing-categories.py 2>&1 | tail -20

echo "[2] Fetching brand images..."
node scripts/fetch-brand-images.mjs 2>&1 | tail -15

echo "[3] Background removal..."
PYTHONIOENCODING=utf-8 python3 scripts/remove-backgrounds.py 2>&1 | tail -5

echo "[4] Centering..."
PYTHONIOENCODING=utf-8 python3 scripts/center-products.py 2>&1 | tail -5

echo "[5] Fix links..."
PYTHONIOENCODING=utf-8 python3 scripts/fix-all-links.py 2>&1 | tail -3

echo "[6] Building..."
npm run build 2>&1 | tail -3

echo "[7] Coverage..."
PYTHONIOENCODING=utf-8 python3 scripts/coverage-check.py

echo "=== DONE $(date) ==="
