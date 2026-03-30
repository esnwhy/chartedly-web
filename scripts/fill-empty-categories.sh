#!/bin/bash
# Fill all empty/low categories with products
# Run after the food pipeline finishes

cd /opt/chartedly
export $(grep -v '^#' .env | xargs)

echo "=== FILL EMPTY CATEGORIES $(date) ==="

# Step 1: Fetch all categories from Rakuten
echo "[1] Fetching ALL categories..."
node scripts/fetch-rakuten.mjs --all 2>&1 | tail -10

# Step 2: AI Enrich new products
echo "[2] AI Enriching..."
node scripts/ai-enrich.mjs 2>&1 | tail -10

# Step 3: AI Category Gate (the big one - reviews every product)
echo "[3] AI Category Gate..."
PYTHONIOENCODING=utf-8 python3 scripts/ai-category-gate.py 2>&1 | tail -15

# Step 4: Dedup
echo "[4] Dedup..."
node scripts/dedup-products.mjs --force 2>&1 | tail -5

# Step 5: Fix links
echo "[5] Fix links..."
PYTHONIOENCODING=utf-8 python3 scripts/fix-all-links.py 2>&1 | tail -3

# Step 6: Coverage check
echo "[6] Coverage check..."
PYTHONIOENCODING=utf-8 python3 scripts/coverage-check.py

# Step 7: Build
echo "[7] Building..."
npm run build 2>&1 | tail -3

echo "=== DONE $(date) ==="
