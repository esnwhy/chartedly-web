/**
 * Fetch Rakuten Ichiba Rankings → Chartedly product candidates
 *
 * Usage:
 *   node scripts/fetch-rakuten.mjs
 *   node scripts/fetch-rakuten.mjs --genre 216492        # Specific genre (sunscreen)
 *   node scripts/fetch-rakuten.mjs --keyword "日焼け止め"  # Keyword search
 *   node scripts/fetch-rakuten.mjs --all                  # All configured categories
 *
 * Output:
 *   - Prints ranked products to console
 *   - Appends new discoveries to g:/マイドライブ/Chartedly/rakuten-discoveries.csv
 *   - Optionally merges into products.csv with --merge flag
 *
 * Requirements:
 *   Set RAKUTEN_APP_ID in .env or pass via environment variable
 *   Register free at: https://webservice.rakuten.co.jp/
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// ── Config ─────────────────────────────────────────────
const RAKUTEN_APP_ID = process.env.RAKUTEN_APP_ID || 'c6fa6ed2-114f-4025-bf99-3ac4a17d44d0';
const RAKUTEN_ACCESS_KEY = process.env.RAKUTEN_ACCESS_KEY || 'pk_HlDOZRpiz5L7Zns0y04QYD5RlJf9721qEbJd166GmYK';
const RAKUTEN_AFFILIATE_ID = process.env.RAKUTEN_AFFILIATE_ID || '520a0491.97d8289b.520a0492.f21fca06';
// Auto-detect: Google Drive on Windows, local fallback on VPS/Linux
const GDRIVE_DIR_WIN = 'g:/マイドライブ/Chartedly';
const LOCAL_DATA_DIR = path.join(__dirname, '..', 'data');
const GDRIVE_DIR = fs.existsSync(GDRIVE_DIR_WIN) ? GDRIVE_DIR_WIN : LOCAL_DATA_DIR;
if (!fs.existsSync(GDRIVE_DIR)) fs.mkdirSync(GDRIVE_DIR, { recursive: true });
const DISCOVERIES_CSV = path.join(GDRIVE_DIR, 'rakuten-discoveries.csv');
const PRODUCTS_CSV = path.join(GDRIVE_DIR, 'products.csv');

// New OpenAPI endpoints (2024+) require Referer + accessKey
const RANKING_API = 'https://openapi.rakuten.co.jp/ichibaranking/api/IchibaItem/Ranking/20220601';
const SEARCH_API = 'https://openapi.rakuten.co.jp/ichibams/api/IchibaItem/Search/20220601';

const API_HEADERS = {
  'Referer': 'https://chartedly.com/',
  'Origin': 'https://chartedly.com',
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120.0.0.0',
};

// Chartedly's target categories with Rakuten genre IDs
// Based on ATLAS research: 25 categories for foreigners in Japan
const CATEGORIES = {
  // ═══ TIER 1: CORE (Launch) ═══

  // 1. Sunscreen — #1 searched J-beauty product
  'sunscreen':       { genreId: 216492, category: 'Beauty', subcategory: 'Skincare', type: 'Sunscreen' },
  // 2. Skincare — Evergreen demand
  'skincare':        { genreId: 100944, category: 'Beauty', subcategory: 'Skincare', type: 'Skincare' },
  'face-wash':       { genreId: 210498, category: 'Beauty', subcategory: 'Skincare', type: 'Face Wash' },
  'face-mask':       { genreId: 308434, category: 'Beauty', subcategory: 'Skincare', type: 'Face Mask' },
  // 3. SIM / eSIM / Pocket WiFi — Every tourist needs
  'sim-card':        { genreId: 509336, category: 'Travel & Connectivity', subcategory: 'SIM & WiFi', type: 'SIM Card' },
  'pocket-wifi':     { genreId: 564394, category: 'Travel & Connectivity', subcategory: 'SIM & WiFi', type: 'Pocket WiFi' },
  // 4. OTC Medicine — Language barrier = huge need
  'medicine':        { genreId: 100945, category: 'Health', subcategory: 'OTC Medicine', type: 'Medicine' },
  'pain-relief':     { genreId: 401541, category: 'Health', subcategory: 'OTC Medicine', type: 'Pain Relief' },
  // 5. Kitchen Knives — High AOV, iconic Japan
  'kitchen-knife':   { genreId: 200956, category: 'Kitchen', subcategory: 'Knives', type: 'Kitchen Knife' },

  // ═══ TIER 2: GROWTH (Month 3-6) ═══

  // 6. Cosmetics & Makeup
  'cosmetics':       { genreId: 100939, category: 'Beauty', subcategory: 'Cosmetics', type: 'Cosmetics' },
  'lip':             { genreId: 503224, category: 'Beauty', subcategory: 'Cosmetics', type: 'Lip' },
  'foundation':      { genreId: 503222, category: 'Beauty', subcategory: 'Cosmetics', type: 'Foundation' },
  // 7. Supplements & Vitamins
  'supplements':     { genreId: 100938, category: 'Health', subcategory: 'Supplements', type: 'Supplement' },
  // 8. Japanese Snacks & Sweets
  'snacks':          { genreId: 201351, category: 'Food & Drink', subcategory: 'Snacks & Sweets', type: 'Snacks' },
  'chocolate':       { genreId: 201336, category: 'Food & Drink', subcategory: 'Snacks & Sweets', type: 'Chocolate' },
  // 9. Rice Cookers & Kitchen Appliances
  'rice-cooker':     { genreId: 204558, category: 'Electronics', subcategory: 'Kitchen Appliances', type: 'Rice Cooker' },
  'kettle':          { genreId: 564972, category: 'Electronics', subcategory: 'Kitchen Appliances', type: 'Electric Kettle' },
  // 10. Anime & Manga Merch
  'anime-figures':   { genreId: 204780, category: 'Anime & Manga', subcategory: 'Figures & Collectibles', type: 'Figure' },
  'trading-cards':   { genreId: 509890, category: 'Anime & Manga', subcategory: 'Trading Cards', type: 'Cards' },

  // ═══ TIER 3: EXPANSION ═══

  // 11. Hair Care
  'haircare':        { genreId: 100940, category: 'Beauty', subcategory: 'Haircare', type: 'Shampoo' },
  'hair-treatment':  { genreId: 503236, category: 'Beauty', subcategory: 'Haircare', type: 'Treatment' },
  // 12. Stationery
  'stationery':      { genreId: 100606, category: 'Stationery', subcategory: 'Pens & Writing', type: 'Pen' },
  'notebook':        { genreId: 503678, category: 'Stationery', subcategory: 'Notebooks', type: 'Notebook' },
  // 13. Tea & Matcha
  'green-tea':       { genreId: 201265, category: 'Food & Drink', subcategory: 'Tea & Matcha', type: 'Green Tea' },
  'matcha':          { genreId: 510915, category: 'Food & Drink', subcategory: 'Tea & Matcha', type: 'Matcha' },
  // 14. Whisky & Sake
  'whisky':          { genreId: 201197, category: 'Food & Drink', subcategory: 'Whisky & Sake', type: 'Whisky' },
  'sake':            { genreId: 201178, category: 'Food & Drink', subcategory: 'Whisky & Sake', type: 'Sake' },
  // 15. Cooling & Seasonal
  'cooling':         { genreId: 503958, category: 'Seasonal', subcategory: 'Summer Cooling', type: 'Cooling Product' },
  // 16. Baby & Kids
  'baby':            { genreId: 100533, category: 'Baby & Kids', subcategory: 'Baby Essentials', type: 'Baby' },
  // 17. Pet Products
  'pet-dog':         { genreId: 101205, category: 'Pet', subcategory: 'Dog', type: 'Dog Supplies' },
  'pet-cat':         { genreId: 101213, category: 'Pet', subcategory: 'Cat', type: 'Cat Supplies' },
  // 18. Electronics & Gadgets
  'earphones':       { genreId: 564498, category: 'Electronics', subcategory: 'Gadgets', type: 'Earphones' },
  'electronics':     { genreId: 562637, category: 'Electronics', subcategory: 'Home Appliances', type: 'Appliance' },
  // 19. Cleaning & Household
  'cleaning':        { genreId: 302399, category: 'Home & Living', subcategory: 'Cleaning', type: 'Cleaning' },
  // 20. Seasonings & Condiments
  'seasoning':       { genreId: 201282, category: 'Food & Drink', subcategory: 'Seasonings', type: 'Seasoning' },
  // 21. Coffee
  'coffee':          { genreId: 204145, category: 'Food & Drink', subcategory: 'Coffee', type: 'Coffee' },
  // 22. DIY & Tools
  'diy-tools':       { genreId: 112893, category: 'DIY & Tools', subcategory: 'Tools', type: 'Tool' },
};

// ── Rate Limiter ───────────────────────────────────────
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// ── API Calls ──────────────────────────────────────────
async function fetchRanking(genreId, page = 1) {
  const params = new URLSearchParams({
    applicationId: RAKUTEN_APP_ID,
    accessKey: RAKUTEN_ACCESS_KEY,
    affiliateId: RAKUTEN_AFFILIATE_ID,
    genreId: String(genreId),
    page: String(page),
    formatVersion: '2',
  });

  const res = await fetch(`${RANKING_API}?${params}`, { headers: API_HEADERS });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Ranking API error ${res.status}: ${text}`);
  }
  return res.json();
}

async function searchItems(keyword, page = 1) {
  const params = new URLSearchParams({
    applicationId: RAKUTEN_APP_ID,
    accessKey: RAKUTEN_ACCESS_KEY,
    affiliateId: RAKUTEN_AFFILIATE_ID,
    keyword,
    hits: '30',
    page: String(page),
    sort: '-reviewAverage',
    availability: '1',
    imageFlag: '1',
    hasReviewFlag: '1',
    formatVersion: '2',
  });

  const res = await fetch(`${SEARCH_API}?${params}`, { headers: API_HEADERS });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Search API error ${res.status}: ${text}`);
  }
  return res.json();
}

// ── Transform Rakuten Item → Chartedly Product ─────────
function transformItem(item, rank, categoryInfo) {
  const name = item.itemName
    .replace(/【[^】]*】/g, '')       // Remove 【...】 brackets
    .replace(/\[[^\]]*\]/g, '')       // Remove [...] brackets
    .replace(/\s{2,}/g, ' ')         // Collapse whitespace
    .trim()
    .substring(0, 100);               // Truncate long names

  // Extract brand from shop name or item name
  const brand = item.shopName || 'Unknown';

  // Build slug from item name (romanized approximation)
  const slug = name
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .substring(0, 50)
    || `rakuten-${item.itemCode.replace(/[^a-zA-Z0-9]/g, '-')}`;

  // Get best image URL
  const imageUrl = item.mediumImageUrls?.[0]?.replace('?_ex=128x128', '?_ex=400x400')
    || item.smallImageUrls?.[0]?.replace('?_ex=64x64', '?_ex=400x400')
    || '';

  // Price formatting
  const price = `¥${Number(item.itemPrice).toLocaleString()}`;

  // Score estimation from review average (0-5 → 0-100)
  const reviewScore = item.reviewAverage ? Math.round(Number(item.reviewAverage) * 20) : 0;

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
    buyUrl: item.affiliateUrl || item.itemUrl || '',
    rakutenItemCode: item.itemCode,
    reviewCount: item.reviewCount || 0,
    reviewAverage: item.reviewAverage || 0,
    shopName: item.shopName || '',
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

const DISCOVERY_HEADERS = [
  'slug', 'name', 'brand', 'imageUrl', 'category', 'subcategory', 'type',
  'price', 'score', 'rank', 'badge', 'buyUrl', 'rakutenItemCode',
  'reviewCount', 'reviewAverage', 'shopName', 'dateDiscovered',
];

function appendToDiscoveries(products) {
  const isNew = !fs.existsSync(DISCOVERIES_CSV);
  const lines = [];
  if (isNew) {
    lines.push(DISCOVERY_HEADERS.join(','));
  }

  for (const p of products) {
    lines.push(DISCOVERY_HEADERS.map((h) => escapeCSV(p[h])).join(','));
  }

  fs.appendFileSync(DISCOVERIES_CSV, lines.join('\n') + '\n', 'utf-8');
}

// Load existing product slugs from products.csv to detect duplicates
function loadExistingSlugs() {
  const slugs = new Set();
  if (!fs.existsSync(PRODUCTS_CSV)) return slugs;

  const text = fs.readFileSync(PRODUCTS_CSV, 'utf-8');
  const lines = text.split('\n');
  if (lines.length < 2) return slugs;

  // Find slug column index
  const headers = lines[0].split(',').map((h) => h.trim());
  const slugIdx = headers.indexOf('slug');
  if (slugIdx < 0) return slugs;

  for (let i = 1; i < lines.length; i++) {
    const cols = lines[i].split(',');
    if (cols[slugIdx]) slugs.add(cols[slugIdx].trim().replace(/"/g, ''));
  }
  return slugs;
}

// ── Main ───────────────────────────────────────────────
const args = process.argv.slice(2);
const genreArg = args.indexOf('--genre') >= 0 ? args[args.indexOf('--genre') + 1] : null;
const keywordArg = args.indexOf('--keyword') >= 0 ? args[args.indexOf('--keyword') + 1] : null;
const doAll = args.includes('--all');
const doMerge = args.includes('--merge');

if (!RAKUTEN_APP_ID || !RAKUTEN_ACCESS_KEY) {
  console.log(`
╔══════════════════════════════════════════════════════════════╗
║  Rakuten API セットアップが必要です                            ║
║                                                              ║
║  1. https://webservice.rakuten.co.jp/ でアカウント登録        ║
║  2. アプリを作成して applicationId + accessKey を取得          ║
║  3. このスクリプトの Config セクションにキーを設定              ║
║                                                              ║
║  登録は無料・即時発行です！                                     ║
╚══════════════════════════════════════════════════════════════╝
`);
  process.exit(1);
}

console.log('\n🛒 Rakuten Ranking Fetcher for Chartedly\n');

const existingSlugs = loadExistingSlugs();
const allProducts = [];

async function fetchCategory(key, config) {
  console.log(`\n📦 Category: ${key} (genreId: ${config.genreId})`);
  console.log('   ' + '-'.repeat(50));

  try {
    const data = await fetchRanking(config.genreId);
    const items = data.Items || [];

    console.log(`   Found ${items.length} ranked items\n`);

    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      const rank = i + 1;
      const product = transformItem(item, rank, config);

      const isExisting = existingSlugs.has(product.slug);
      const marker = isExisting ? '  (already in products.csv)' : ' ✨ NEW';

      console.log(`   #${String(rank).padStart(2)} | ★${Number(product.reviewAverage).toFixed(1)} (${product.reviewCount} reviews) | ${product.price}`);
      console.log(`       ${product.name.substring(0, 70)}${marker}`);

      if (!isExisting) {
        allProducts.push(product);
      }
    }
  } catch (err) {
    console.log(`   ❌ Error: ${err.message}`);
  }
}

async function searchByKeyword(keyword) {
  console.log(`\n🔍 Keyword search: "${keyword}"`);
  console.log('   ' + '-'.repeat(50));

  try {
    const data = await searchItems(keyword);
    const items = data.Items || [];

    console.log(`   Found ${items.length} items\n`);

    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      const product = transformItem(item, i + 1, null);

      const isExisting = existingSlugs.has(product.slug);
      const marker = isExisting ? '  (already in products.csv)' : ' ✨ NEW';

      console.log(`   #${String(i + 1).padStart(2)} | ★${Number(product.reviewAverage).toFixed(1)} (${product.reviewCount} reviews) | ${product.price}`);
      console.log(`       ${product.name.substring(0, 70)}${marker}`);

      if (!isExisting) {
        allProducts.push(product);
      }
    }
  } catch (err) {
    console.log(`   ❌ Error: ${err.message}`);
  }
}

// Execute based on args
if (doAll) {
  for (const [key, config] of Object.entries(CATEGORIES)) {
    await fetchCategory(key, config);
    await sleep(1200); // Rate limit: ~1 req/sec
  }
} else if (genreArg) {
  const genreId = parseInt(genreArg, 10);
  const matchingCat = Object.entries(CATEGORIES).find(([, c]) => c.genreId === genreId);
  await fetchCategory(
    matchingCat ? matchingCat[0] : `genre-${genreId}`,
    matchingCat ? matchingCat[1] : { genreId, category: 'Other', subcategory: 'Other', type: 'Product' }
  );
} else if (keywordArg) {
  await searchByKeyword(keywordArg);
} else {
  // Default: fetch sunscreen + skincare rankings
  await fetchCategory('sunscreen', CATEGORIES.sunscreen);
  await sleep(1200);
  await fetchCategory('skincare', CATEGORIES.skincare);
}

// Save discoveries
if (allProducts.length > 0) {
  appendToDiscoveries(allProducts);
  console.log(`\n✅ ${allProducts.length} new products saved to:`);
  console.log(`   ${DISCOVERIES_CSV}`);
} else {
  console.log('\nℹ️  No new products discovered (all already in products.csv)');
}

// Summary
console.log(`
╔══════════════════════════════════════════════════╗
║  Summary                                        ║
║  New discoveries: ${String(allProducts.length).padStart(4)}                          ║
║  Already known:   ${String(existingSlugs.size).padStart(4)}                          ║
║                                                  ║
║  Next steps:                                     ║
║  1. Review rakuten-discoveries.csv               ║
║  2. Pick products to add to Chartedly            ║
║  3. Copy rows to products.csv                    ║
║  4. Add your own score/pros/cons/review          ║
║  5. Run: node scripts/sync-products.mjs          ║
╚══════════════════════════════════════════════════╝
`);
