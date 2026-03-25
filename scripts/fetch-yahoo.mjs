/**
 * Fetch Yahoo Shopping Item Search → Chartedly product candidates
 *
 * Usage:
 *   node scripts/fetch-yahoo.mjs --all                  # All configured categories
 *   node scripts/fetch-yahoo.mjs --query "日焼け止め"     # Specific search
 *   node scripts/fetch-yahoo.mjs --query "rice cooker"   # English search
 *
 * Output:
 *   - Prints discovered products to console
 *   - Appends new discoveries to yahoo-discoveries.csv
 *   - Format compatible with ai-enrich.mjs pipeline
 *
 * Yahoo Shopping API is free — no validated key needed.
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { shouldFilter, isFuzzyDuplicate } from './dedup-products.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// ── Config ─────────────────────────────────────────────
const YAHOO_APP_ID = 'dj00aiZpPXh4eHh4eHh4eHh4eCZzPWNvbnN1bWVyc2VjcmV0Jng9MDA-';
const SEARCH_API = 'https://shopping.yahooapis.jp/ShoppingWebService/V3/itemSearch';

// Auto-detect: Google Drive on Windows, local fallback on VPS/Linux
const GDRIVE_DIR_WIN = 'g:/マイドライブ/Chartedly';
const LOCAL_DATA_DIR = path.join(__dirname, '..', 'data');
const GDRIVE_DIR = fs.existsSync(GDRIVE_DIR_WIN) ? GDRIVE_DIR_WIN : LOCAL_DATA_DIR;
if (!fs.existsSync(GDRIVE_DIR)) fs.mkdirSync(GDRIVE_DIR, { recursive: true });
const YAHOO_DISCOVERIES_CSV = path.join(GDRIVE_DIR, 'yahoo-discoveries.csv');
const PRODUCTS_CSV = path.join(GDRIVE_DIR, 'products.csv');
const RAKUTEN_DISCOVERIES_CSV = path.join(GDRIVE_DIR, 'rakuten-discoveries.csv');

// Yahoo Shopping search categories (Japanese terms for best results)
const CATEGORIES = {
  'sunscreen':       { query: '日焼け止め',       category: 'Beauty', subcategory: 'Skincare', type: 'Sunscreen' },
  'toner':           { query: '化粧水',          category: 'Beauty', subcategory: 'Skincare', type: 'Toner' },
  'serum':           { query: '美容液',          category: 'Beauty', subcategory: 'Skincare', type: 'Serum' },
  'shampoo':         { query: 'シャンプー',       category: 'Beauty', subcategory: 'Haircare', type: 'Shampoo' },
  'foundation':      { query: 'ファンデーション',  category: 'Beauty', subcategory: 'Cosmetics', type: 'Foundation' },
  'rice-cooker':     { query: '炊飯器',          category: 'Electronics', subcategory: 'Kitchen', type: 'Rice Cooker' },
  'vacuum':          { query: '掃除機',          category: 'Electronics', subcategory: 'Home Appliances', type: 'Vacuum' },
  'air-purifier':    { query: '空気清浄機',       category: 'Electronics', subcategory: 'Home Appliances', type: 'Air Purifier' },
  'supplements':     { query: 'サプリメント',     category: 'Health', subcategory: 'Supplements', type: 'Supplement' },
  'baby':            { query: 'ベビー用品',       category: 'Baby', subcategory: 'Baby Care', type: 'Baby' },
  'coffee':          { query: 'コーヒー',         category: 'Food', subcategory: 'Coffee & Tea', type: 'Coffee' },
  'kettle':          { query: '電気ケトル',       category: 'Electronics', subcategory: 'Kitchen', type: 'Kettle' },
};

// ── Rate Limiter ───────────────────────────────────────
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// ── API Call ───────────────────────────────────────────
async function searchYahoo(query, page = 1) {
  const params = new URLSearchParams({
    appid: YAHOO_APP_ID,
    query,
    results: '30',
    sort: '-score',
    start: String((page - 1) * 30 + 1),
  });

  const url = `${SEARCH_API}?${params}`;
  const res = await fetch(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120.0.0.0',
    },
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Yahoo API error ${res.status}: ${text}`);
  }
  return res.json();
}

// ── Transform Yahoo Item → Chartedly Product ──────────
function transformItem(hit, rank, categoryInfo) {
  const name = (hit.name || '')
    .replace(/【[^】]*】/g, '')       // Remove 【...】 brackets
    .replace(/\[[^\]]*\]/g, '')       // Remove [...] brackets
    .replace(/\s{2,}/g, ' ')         // Collapse whitespace
    .trim()
    .substring(0, 100);               // Truncate long names

  // Extract brand from seller or product name
  const brand = hit.seller?.name || hit.brand?.name || 'Unknown';

  // Build slug from item name
  const slug = name
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .substring(0, 50)
    || `yahoo-${(hit.code || '').replace(/[^a-zA-Z0-9]/g, '-').substring(0, 30)}`;

  // Get best image URL — use /n/ suffix for 900px if available
  let imageUrl = '';
  if (hit.image?.medium) {
    imageUrl = hit.image.medium;
  } else if (hit.image?.small) {
    imageUrl = hit.image.small;
  }
  // Upgrade image resolution: replace /g/ or /c/ path with /n/ for 900px
  if (imageUrl) {
    imageUrl = imageUrl.replace(/\/[gc]\//, '/n/');
  }

  // Price
  const price = `¥${Number(hit.price || 0).toLocaleString()}`;

  // Score estimation from review average (0-5 → 0-100)
  const reviewAvg = hit.review?.rate || 0;
  const reviewCount = hit.review?.count || 0;
  const reviewScore = reviewAvg ? Math.round(Number(reviewAvg) * 20) : 0;

  // Yahoo Shopping URL
  const buyUrl = hit.url || '';

  return {
    slug,
    name,
    brand,
    imageUrl,
    category: categoryInfo?.category || 'Other',
    subcategory: categoryInfo?.subcategory || 'Other',
    type: categoryInfo?.type || 'Product',
    price,
    score: reviewScore,
    rank: rank || undefined,
    badge: rank === 1 ? 'top-pick' : undefined,
    buyUrl,
    rakutenItemCode: '', // Empty — this is a Yahoo product
    yahooItemCode: hit.code || '',
    reviewCount,
    reviewAverage: reviewAvg,
    shopName: hit.seller?.name || '',
    dateDiscovered: new Date().toISOString().split('T')[0],
  };
}

// ── CSV Helpers ────────────────────────────────────────
function escapeCSV(val) {
  const str = String(val ?? '');
  if (str.includes(',') || str.includes('"') || str.includes('\n')) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

// Same headers as rakuten-discoveries.csv for pipeline compatibility
const DISCOVERY_HEADERS = [
  'slug', 'name', 'brand', 'imageUrl', 'category', 'subcategory', 'type',
  'price', 'score', 'rank', 'badge', 'buyUrl', 'rakutenItemCode',
  'reviewCount', 'reviewAverage', 'shopName', 'dateDiscovered',
];

function appendToDiscoveries(products) {
  const isNew = !fs.existsSync(YAHOO_DISCOVERIES_CSV);
  const lines = [];
  if (isNew) {
    lines.push(DISCOVERY_HEADERS.join(','));
  }

  for (const p of products) {
    lines.push(DISCOVERY_HEADERS.map((h) => escapeCSV(p[h])).join(','));
  }

  fs.appendFileSync(YAHOO_DISCOVERIES_CSV, lines.join('\n') + '\n', 'utf-8');
}

// ── Load existing slugs from all CSVs ─────────────────
function loadExistingSlugs() {
  const slugs = new Set();
  const names = []; // For fuzzy matching

  for (const csvPath of [PRODUCTS_CSV, RAKUTEN_DISCOVERIES_CSV, YAHOO_DISCOVERIES_CSV]) {
    if (!fs.existsSync(csvPath)) continue;
    const text = fs.readFileSync(csvPath, 'utf-8');
    const lines = text.split('\n');
    if (lines.length < 2) continue;

    const headers = lines[0].split(',').map((h) => h.trim().replace(/"/g, ''));
    const slugIdx = headers.indexOf('slug');
    const nameIdx = headers.indexOf('name');
    if (slugIdx < 0) continue;

    for (let i = 1; i < lines.length; i++) {
      // Simple split — good enough for slug/name detection
      const cols = lines[i].split(',');
      const slug = (cols[slugIdx] || '').trim().replace(/"/g, '');
      if (slug) {
        slugs.add(slug);
        if (nameIdx >= 0) {
          const name = (cols[nameIdx] || '').trim().replace(/"/g, '');
          if (name) names.push({ slug, name });
        }
      }
    }
  }
  return { slugs, names };
}

// ── Main ──────────────────────────────────────────────
const args = process.argv.slice(2);
const queryArg = args.indexOf('--query') >= 0 ? args[args.indexOf('--query') + 1] : null;
const doAll = args.includes('--all');

if (!doAll && !queryArg) {
  console.log(`
Usage:
  node scripts/fetch-yahoo.mjs --all                  Search all categories
  node scripts/fetch-yahoo.mjs --query "日焼け止め"     Specific search
`);
  process.exit(0);
}

console.log('\n🛒 Yahoo Shopping Fetcher for Chartedly\n');

const { slugs: existingSlugs, names: existingNames } = loadExistingSlugs();
const allProducts = [];
let skippedDedup = 0;
let skippedExisting = 0;

async function searchCategory(key, config) {
  console.log(`\n📦 Category: ${key} — "${config.query}"`);
  console.log('   ' + '-'.repeat(50));

  try {
    const data = await searchYahoo(config.query);
    const hits = data.hits || [];

    console.log(`   Found ${hits.length} items\n`);

    for (let i = 0; i < hits.length; i++) {
      const hit = hits[i];
      const rank = i + 1;
      const product = transformItem(hit, rank, config);

      // Skip if slug already exists
      if (existingSlugs.has(product.slug)) {
        if (verbose) console.log(`   #${String(rank).padStart(2)} | SKIP (already known): ${product.name.substring(0, 50)}`);
        skippedExisting++;
        continue;
      }

      // Apply dedup filter
      const filterReason = shouldFilter(product.name, product.slug);
      if (filterReason) {
        console.log(`   #${String(rank).padStart(2)} | SKIP (${filterReason}): ${product.name.substring(0, 50)}`);
        skippedDedup++;
        continue;
      }

      // Check fuzzy match against existing products
      const fuzzyMatch = existingNames.find((e) => isFuzzyDuplicate(product.name, e.name));
      if (fuzzyMatch) {
        console.log(`   #${String(rank).padStart(2)} | SKIP (fuzzy match: ${fuzzyMatch.slug}): ${product.name.substring(0, 50)}`);
        skippedDedup++;
        continue;
      }

      console.log(`   #${String(rank).padStart(2)} | ★${Number(product.reviewAverage).toFixed(1)} (${product.reviewCount} reviews) | ${product.price}`);
      console.log(`       ${product.name.substring(0, 70)} ✨ NEW`);

      allProducts.push(product);
      existingSlugs.add(product.slug);
      existingNames.push({ slug: product.slug, name: product.name });
    }
  } catch (err) {
    console.log(`   ❌ Error: ${err.message}`);
  }
}

async function searchByQuery(query) {
  console.log(`\n🔍 Search: "${query}"`);
  console.log('   ' + '-'.repeat(50));

  try {
    const data = await searchYahoo(query);
    const hits = data.hits || [];

    console.log(`   Found ${hits.length} items\n`);

    for (let i = 0; i < hits.length; i++) {
      const hit = hits[i];
      const rank = i + 1;
      const product = transformItem(hit, rank, null);

      if (existingSlugs.has(product.slug)) {
        skippedExisting++;
        continue;
      }

      const filterReason = shouldFilter(product.name, product.slug);
      if (filterReason) {
        console.log(`   #${String(rank).padStart(2)} | SKIP (${filterReason}): ${product.name.substring(0, 50)}`);
        skippedDedup++;
        continue;
      }

      const fuzzyMatch = existingNames.find((e) => isFuzzyDuplicate(product.name, e.name));
      if (fuzzyMatch) {
        console.log(`   #${String(rank).padStart(2)} | SKIP (fuzzy match: ${fuzzyMatch.slug}): ${product.name.substring(0, 50)}`);
        skippedDedup++;
        continue;
      }

      console.log(`   #${String(rank).padStart(2)} | ★${Number(product.reviewAverage).toFixed(1)} (${product.reviewCount} reviews) | ${product.price}`);
      console.log(`       ${product.name.substring(0, 70)} ✨ NEW`);

      allProducts.push(product);
      existingSlugs.add(product.slug);
      existingNames.push({ slug: product.slug, name: product.name });
    }
  } catch (err) {
    console.log(`   ❌ Error: ${err.message}`);
  }
}

// Execute
const verbose = args.includes('--verbose');

if (doAll) {
  for (const [key, config] of Object.entries(CATEGORIES)) {
    await searchCategory(key, config);
    await sleep(1000); // Rate limit: 1 req/sec
  }
} else if (queryArg) {
  await searchByQuery(queryArg);
}

// Save discoveries
if (allProducts.length > 0) {
  appendToDiscoveries(allProducts);
  console.log(`\n✅ ${allProducts.length} new products saved to:`);
  console.log(`   ${YAHOO_DISCOVERIES_CSV}`);
} else {
  console.log('\nℹ️  No new products discovered.');
}

// Summary
console.log(`
╔══════════════════════════════════════════════════╗
║  Yahoo Shopping Summary                          ║
║  New discoveries:   ${String(allProducts.length).padStart(4)}                         ║
║  Skipped (exists):  ${String(skippedExisting).padStart(4)}                         ║
║  Skipped (dedup):   ${String(skippedDedup).padStart(4)}                         ║
║  Already known:     ${String(existingSlugs.size).padStart(4)}                         ║
║                                                  ║
║  Next steps:                                     ║
║  1. Review yahoo-discoveries.csv                 ║
║  2. Run: node scripts/ai-enrich.mjs              ║
║  3. Run: node scripts/sync-products.mjs          ║
╚══════════════════════════════════════════════════╝
`);
