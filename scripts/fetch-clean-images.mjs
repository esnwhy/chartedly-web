/**
 * Fetch CLEAN product images via Rakuten Item Search API
 *
 * Strategy: Search for each product on Rakuten, preferring drug store sellers
 * (matsukiyo, sundrug, soukai, etc.) which have clean catalog-style images.
 * Then download the full-resolution image via shop.r10s.jp CDN.
 *
 * Usage:
 *   node scripts/fetch-clean-images.mjs
 *   node scripts/fetch-clean-images.mjs --limit 10
 *   node scripts/fetch-clean-images.mjs --force   (re-download all)
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PRODUCTS_DIR = path.join(__dirname, '..', 'src', 'content', 'products');
const IMAGES_DIR = path.join(__dirname, '..', 'public', 'images', 'products');

fs.mkdirSync(IMAGES_DIR, { recursive: true });

// Rakuten API credentials
const APP_ID = 'c6fa6ed2-114f-4025-bf99-3ac4a17d44d0';
const ACCESS_KEY = 'pk_HlDOZRpiz5L7Zns0y04QYD5RlJf9721qEbJd166GmYK';
const SEARCH_API = 'https://openapi.rakuten.co.jp/ichibams/api/IchibaItem/Search/20220601';

const API_HEADERS = {
  'Referer': 'https://chartedly.com/',
  'Origin': 'https://chartedly.com',
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120.0.0.0',
};

// Preferred clean-image sellers (drug stores, official shops)
const CLEAN_SHOPS = [
  'matsukiyo', 'sundrug', 'soukai', 'kusurinofukutaro',
  'kusuriaoki', 'lohaco-yahoo', 'benri-navi', 'auc-',
  'biccamera', 'yamada-denki', 'edion', 'yodobashi',
  'shiseido', 'fancl', 'etvos', 'orbis', 'attenir',
  'cosmedecorte', 'sk-2', 'lancome', 'laroche-posay',
];

const args = process.argv.slice(2);
const limitArg = args.indexOf('--limit') >= 0 ? parseInt(args[args.indexOf('--limit') + 1], 10) : 999;
const force = args.includes('--force');

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// ── Load original Japanese names from discoveries ──────
const GDRIVE_DIR = 'g:/マイドライブ/Chartedly';
const DISCOVERIES_CSV = path.join(GDRIVE_DIR, 'rakuten-discoveries.csv');

function parseCSV(text) {
  const result = [];
  let fields = []; let current = ''; let inQuotes = false;
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (ch === '"') { if (inQuotes && text[i+1] === '"') { current += '"'; i++; } else inQuotes = !inQuotes; }
    else if (ch === ',' && !inQuotes) { fields.push(current); current = ''; }
    else if ((ch === '\n' || ch === '\r') && !inQuotes) { if (current || fields.length > 0) { fields.push(current); result.push(fields); fields = []; current = ''; } if (ch === '\r' && text[i+1] === '\n') i++; }
    else current += ch;
  }
  if (current || fields.length > 0) { fields.push(current); result.push(fields); }
  return result;
}

// Build map: slug → original Japanese name from discoveries
const jaNameMap = new Map();
if (fs.existsSync(DISCOVERIES_CSV)) {
  const rows = parseCSV(fs.readFileSync(DISCOVERIES_CSV, 'utf-8'));
  if (rows.length > 1) {
    const headers = rows[0].map(h => h.trim());
    const nameIdx = headers.indexOf('name');
    const slugIdx = headers.indexOf('slug');
    for (let i = 1; i < rows.length; i++) {
      const cols = rows[i];
      const slug = (cols[slugIdx] || '').trim();
      const name = (cols[nameIdx] || '').trim();
      if (slug && name) jaNameMap.set(slug, name);
    }
  }
}

// Also build from products.csv
const PRODUCTS_CSV = path.join(GDRIVE_DIR, 'products.csv');
if (fs.existsSync(PRODUCTS_CSV)) {
  const rows = parseCSV(fs.readFileSync(PRODUCTS_CSV, 'utf-8'));
  if (rows.length > 1) {
    const headers = rows[0].map(h => h.trim());
    const nameIdx = headers.indexOf('name');
    const slugIdx = headers.indexOf('slug');
    for (let i = 1; i < rows.length; i++) {
      const cols = rows[i];
      const slug = (cols[slugIdx] || '').trim();
      const name = (cols[nameIdx] || '').trim();
      if (slug && name && !jaNameMap.has(slug)) jaNameMap.set(slug, name);
    }
  }
}
console.log(`   ${jaNameMap.size} Japanese product names loaded`);

// ── Convert thumbnail URL to full-res r10s.jp URL ──────
function toFullResUrl(thumbnailUrl) {
  if (!thumbnailUrl) return null;

  // Remove size parameter
  let url = thumbnailUrl.replace(/\?_ex=\d+x\d+/, '');

  // Convert thumbnail CDN to shop CDN for full resolution
  // thumbnail.image.rakuten.co.jp/@0_mall/SHOP/... → shop.r10s.jp/SHOP/...
  // thumbnail.image.rakuten.co.jp/@0_gold/SHOP/... → shop.r10s.jp/gold/SHOP/...
  url = url.replace('https://thumbnail.image.rakuten.co.jp/@0_mall/', 'https://shop.r10s.jp/');
  url = url.replace('https://thumbnail.image.rakuten.co.jp/@0_gold/', 'https://shop.r10s.jp/gold/');

  return url;
}

// ── Search for clean image ─────────────────────────────
async function searchCleanImage(productName, brand) {
  // Build search query: strip marketing prefixes and SEO spam
  let cleanName = productName
    .replace(/^[＼／\\\/].*?[＼／\\\/]\s*/g, '')   // Remove ＼...／ campaign prefixes
    .replace(/【[^】]*】/g, '')                      // Remove 【...】 brackets
    .replace(/\[[^\]]*\]/g, '')                      // Remove [...] brackets
    .replace(/●[^●]*●/g, '')                        // Remove ●...● markers
    .replace(/^\d+日.*?(OFF|off|％)／?\s*/g, '')     // Remove "19日...OFF" prefixes
    .replace(/★[^★]*★/g, '')                        // Remove star markers
    .replace(/ポイント\d+倍[！!]?\s*/g, '')           // Remove point multiplier text
    .replace(/送料無料\s*/g, '')                      // Remove free shipping
    .replace(/\s{2,}/g, ' ')                         // Collapse whitespace
    .trim();

  let shortName = cleanName.split(/[|｜]/)[0].trim().substring(0, 60);
  if (!shortName || shortName.length < 3) shortName = productName.substring(0, 60);
  const query = brand ? `${brand} ${shortName}` : shortName;

  const params = new URLSearchParams({
    applicationId: APP_ID,
    accessKey: ACCESS_KEY,
    keyword: query,
    hits: '10',
    imageFlag: '1',
    availability: '1',
    formatVersion: '2',
  });

  try {
    const res = await fetch(`${SEARCH_API}?${params}`, { headers: API_HEADERS });
    if (!res.ok) return null;

    const data = await res.json();
    const items = data.Items || [];
    if (items.length === 0) return null;

    // Strategy: prefer drug store / official shop images (they're clean catalog shots)
    // Look through results for a preferred seller
    let bestItem = null;
    let bestScore = -1;

    for (const item of items) {
      const shopCode = (item.shopCode || '').toLowerCase();
      const images = item.mediumImageUrls || item.smallImageUrls || [];
      if (images.length === 0) continue;

      let score = 0;

      // Prefer drug store sellers (clean catalog images)
      if (CLEAN_SHOPS.some((s) => shopCode.includes(s))) {
        score += 10;
      }

      // Prefer images with barcode-like filenames (these are always clean product shots)
      const imgUrl = images[0];
      if (/\/\d{10,}/.test(imgUrl)) {
        score += 5; // Barcode filename = clean catalog image
      }

      // Prefer imgrc images (Rakuten product gallery = usually clean)
      if (/imgrc/.test(imgUrl)) {
        score += 3;
      }

      // Avoid thum/ images (usually marketing thumbnails)
      if (/thum/i.test(imgUrl)) {
        score -= 2;
      }

      // Avoid campaign/sale images
      if (/marathon|sale|campaign|banner/i.test(imgUrl)) {
        score -= 5;
      }

      if (score > bestScore) {
        bestScore = score;
        bestItem = item;
      }
    }

    // Fall back to first result if no preferred seller found
    if (!bestItem) bestItem = items[0];

    const images = bestItem.mediumImageUrls || bestItem.smallImageUrls || [];
    if (images.length === 0) return null;

    // Get the first image URL and convert to full resolution
    const thumbUrl = images[0];
    const fullUrl = toFullResUrl(thumbUrl);

    return {
      fullUrl,
      thumbUrl,
      shopCode: bestItem.shopCode,
      shopName: bestItem.shopName,
    };
  } catch (err) {
    return null;
  }
}

// ── Download Image ─────────────────────────────────────
async function downloadImage(url, slug) {
  try {
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Accept': 'image/webp,image/*,*/*',
        'Referer': 'https://www.rakuten.co.jp/',
      },
      redirect: 'follow',
    });
    if (!res.ok) return null;

    const buffer = Buffer.from(await res.arrayBuffer());
    if (buffer.length < 2000) return null; // Too small = error page

    const contentType = res.headers.get('content-type') || '';
    let ext = 'jpg';
    if (contentType.includes('png')) ext = 'png';
    else if (contentType.includes('webp')) ext = 'webp';

    const filename = `${slug}.${ext}`;
    fs.writeFileSync(path.join(IMAGES_DIR, filename), buffer);
    return { path: `/images/products/${filename}`, size: buffer.length };
  } catch {
    return null;
  }
}

// ── Main ───────────────────────────────────────────────
console.log('\n🖼️  Clean Image Fetcher (via Rakuten Item Search)\n');

const productFiles = fs.readdirSync(PRODUCTS_DIR)
  .filter((f) => f.endsWith('.json') && !f.startsWith('_'));

console.log(`   ${productFiles.length} products found\n`);

let upgraded = 0;
let skipped = 0;
let failed = 0;
let processed = 0;

for (const file of productFiles) {
  if (processed >= limitArg) break;

  const slug = file.replace('.json', '');
  const jsonPath = path.join(PRODUCTS_DIR, file);
  const product = JSON.parse(fs.readFileSync(jsonPath, 'utf-8'));

  // Skip if already has a good local image (unless --force)
  if (!force && product.image && product.image.startsWith('/images/')) {
    // Check file size — if under 5KB it's probably a bad image
    const imgPath = path.join(__dirname, '..', 'public', product.image);
    if (fs.existsSync(imgPath)) {
      const stats = fs.statSync(imgPath);
      if (stats.size > 10000) { // >10KB = probably OK
        skipped++;
        continue;
      }
    }
  }

  processed++;
  process.stdout.write(`   [${processed}] ${slug} ... `);

  // Search Rakuten using Japanese name (much better search results)
  const jaName = jaNameMap.get(slug) || product.name;
  const result = await searchCleanImage(jaName, '');

  if (!result) {
    console.log('❌ not found');
    failed++;
    await sleep(1500);
    continue;
  }

  // Try full-res first, then thumbnail
  let dl = await downloadImage(result.fullUrl, slug);
  if (!dl) {
    dl = await downloadImage(result.thumbUrl.replace(/\?_ex=\d+x\d+/, '?_ex=800x800'), slug);
  }

  if (dl) {
    product.image = dl.path;
    fs.writeFileSync(jsonPath, JSON.stringify(product, null, 2) + '\n');
    const sizeKB = (dl.size / 1024).toFixed(0);
    console.log(`✅ ${sizeKB}KB from ${result.shopCode}`);
    upgraded++;
  } else {
    console.log(`❌ download failed`);
    failed++;
  }

  await sleep(1500); // Rate limit
}

console.log(`
╔══════════════════════════════════════════════════╗
║  Summary                                        ║
║  Clean images:  ${String(upgraded).padStart(4)}                           ║
║  Skipped (OK):  ${String(skipped).padStart(4)}                           ║
║  Failed:        ${String(failed).padStart(4)}                           ║
╚══════════════════════════════════════════════════╝
`);
