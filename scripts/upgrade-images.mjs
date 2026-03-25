/**
 * Multi-Source Product Image Upgrader
 *
 * Priority chain:
 *   Strategy 1: Rakuten High-Res URL Transform (FREE, instant) — shop.r10s.jp
 *   Strategy 2: Yahoo Shopping API (FREE, no key needed)
 *   Strategy 3: Rakuten Product Page og:image scrape (FREE, slower)
 *
 * Usage:
 *   node scripts/upgrade-images.mjs
 *   node scripts/upgrade-images.mjs --limit 10
 *   node scripts/upgrade-images.mjs --force          # re-process even if image >100KB
 *   node scripts/upgrade-images.mjs --limit 5 --force
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');
const GDRIVE_DIR = 'g:/マイドライブ/Chartedly';
const DISCOVERIES_CSV = path.join(GDRIVE_DIR, 'rakuten-discoveries.csv');
const PRODUCTS_CSV = path.join(GDRIVE_DIR, 'products.csv');
const PRODUCTS_DIR = path.join(ROOT, 'src', 'content', 'products');
const IMAGES_DIR = path.join(ROOT, 'public', 'images', 'products');
const PROGRESS_FILE = path.join(ROOT, '.image-upgrade-progress.json');

// ── CLI flags ────────────────────────────────────────
const args = process.argv.slice(2);
const flagIdx = (f) => args.indexOf(f);
const limitArg = flagIdx('--limit') >= 0 ? parseInt(args[flagIdx('--limit') + 1], 10) : 9999;
const forceMode = args.includes('--force');

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const HEADERS = {
  'User-Agent':
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
  Accept: 'image/webp,image/*,*/*;q=0.8',
};

// ── CSV Parser (handles quoted fields) ───────────────
function parseCSV(text) {
  const result = [];
  let fields = [];
  let current = '';
  let inQuotes = false;
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (ch === '"') {
      if (inQuotes && text[i + 1] === '"') { current += '"'; i++; }
      else inQuotes = !inQuotes;
    } else if (ch === ',' && !inQuotes) {
      fields.push(current); current = '';
    } else if ((ch === '\n' || ch === '\r') && !inQuotes) {
      if (current || fields.length > 0) { fields.push(current); result.push(fields); fields = []; current = ''; }
      if (ch === '\r' && text[i + 1] === '\n') i++;
    } else {
      current += ch;
    }
  }
  if (current || fields.length > 0) { fields.push(current); result.push(fields); }
  return result;
}

function csvToRows(text) {
  const rows = parseCSV(text);
  if (rows.length === 0) return [];
  const headers = rows[0].map((h) => h.trim());
  return rows.slice(1).map((cols) => {
    const obj = {};
    headers.forEach((h, i) => { obj[h] = (cols[i] || '').trim(); });
    return obj;
  });
}

// ── Load CSVs ────────────────────────────────────────
const discoveries = fs.existsSync(DISCOVERIES_CSV)
  ? csvToRows(fs.readFileSync(DISCOVERIES_CSV, 'utf-8'))
  : [];

const productsCSV = fs.existsSync(PRODUCTS_CSV)
  ? csvToRows(fs.readFileSync(PRODUCTS_CSV, 'utf-8'))
  : [];

// Build slug → Rakuten thumbnail URL map
const slugToRakutenUrl = new Map();
for (const row of productsCSV) {
  if (row.slug && row.imageUrl) slugToRakutenUrl.set(row.slug, row.imageUrl);
}
for (const d of discoveries) {
  if (d.slug && d.imageUrl) slugToRakutenUrl.set(d.slug, d.imageUrl);
}

// Build slug → buyUrl from discoveries
const slugToBuyUrl = new Map();
for (const d of discoveries) {
  if (d.slug && d.buyUrl) slugToBuyUrl.set(d.slug, d.buyUrl);
}

// ── Progress tracking ────────────────────────────────
let progress = {};
if (fs.existsSync(PROGRESS_FILE)) {
  try { progress = JSON.parse(fs.readFileSync(PROGRESS_FILE, 'utf-8')); } catch { progress = {}; }
}
function saveProgress() {
  fs.writeFileSync(PROGRESS_FILE, JSON.stringify(progress, null, 2));
}

// ── Strategy 1: Rakuten High-Res URL Transform ──────
function transformRakutenUrl(thumbnailUrl) {
  if (!thumbnailUrl) return null;

  // @0_mall pattern:
  // thumbnail.image.rakuten.co.jp/@0_mall/SHOP/cabinet/PATH.jpg?_ex=400x400
  // → shop.r10s.jp/SHOP/cabinet/PATH.jpg
  const mallMatch = thumbnailUrl.match(
    /thumbnail\.image\.rakuten\.co\.jp\/@0_mall\/([^?]+)/
  );
  if (mallMatch) {
    return `https://shop.r10s.jp/${mallMatch[1]}`;
  }

  // @0_gold pattern:
  // thumbnail.image.rakuten.co.jp/@0_gold/SHOP/PATH.jpg?_ex=400x400
  // → shop.r10s.jp/gold/SHOP/PATH.jpg
  const goldMatch = thumbnailUrl.match(
    /thumbnail\.image\.rakuten\.co\.jp\/@0_gold\/([^?]+)/
  );
  if (goldMatch) {
    return `https://shop.r10s.jp/gold/${goldMatch[1]}`;
  }

  return null;
}

async function downloadImage(url, slug, tag) {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 15000);
    const res = await fetch(url, {
      headers: { ...HEADERS, Referer: 'https://www.rakuten.co.jp/' },
      redirect: 'follow',
      signal: controller.signal,
    });
    clearTimeout(timeout);
    if (!res.ok) return null;

    const buffer = Buffer.from(await res.arrayBuffer());
    if (buffer.length < 1000) return null; // error page or empty

    const contentType = res.headers.get('content-type') || '';
    let ext = 'jpg';
    if (contentType.includes('png')) ext = 'png';
    else if (contentType.includes('webp')) ext = 'webp';
    else if (url.match(/\.(png|webp|gif)/i)) ext = url.match(/\.(png|webp|gif)/i)[1].toLowerCase();

    const filename = `${slug}.${ext}`;
    const filePath = path.join(IMAGES_DIR, filename);
    fs.writeFileSync(filePath, buffer);
    return { localPath: `/images/products/${filename}`, size: buffer.length, strategy: tag };
  } catch {
    return null;
  }
}

async function strategy1_RakutenHiRes(slug, rakutenUrl) {
  const hiResUrl = transformRakutenUrl(rakutenUrl);
  if (!hiResUrl) return null;

  const result = await downloadImage(hiResUrl, slug, 'S1:r10s');
  if (result && result.size >= 5000) return result;

  // Fallback: just remove ?_ex= constraint from original thumbnail URL
  const noSizeUrl = rakutenUrl.replace(/\?_ex=\d+x\d+/, '');
  const result2 = await downloadImage(noSizeUrl, slug, 'S1:noex');
  if (result2 && result2.size >= 5000) return result2;

  return null;
}

// ── Strategy 2: Yahoo Shopping API ──────────────────
async function strategy2_Yahoo(slug, productName) {
  try {
    const query = encodeURIComponent(productName.substring(0, 60));
    const url = `https://shopping.yahooapis.jp/ShoppingWebService/V3/itemSearch?appid=dj00aiZpPXh4eHh4eHh4eHh4eCZzPWNvbnN1bWVyc2VjcmV0Jng9MDA-&query=${query}&results=5&image_size=600`;

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 15000);
    const res = await fetch(url, {
      headers: { 'User-Agent': HEADERS['User-Agent'] },
      signal: controller.signal,
    });
    clearTimeout(timeout);
    if (!res.ok) return null;

    const data = await res.json();
    const hits = data?.hits || [];

    // Prefer known drugstore shops
    const preferredShops = ['kusuriaoki', 'sundrug', 'matsukiyo', 'lohaco', 'rakuten24', 'soukai'];

    // Sort: preferred shops first
    const sorted = [...hits].sort((a, b) => {
      const aStore = (a.seller?.name || '').toLowerCase();
      const bStore = (b.seller?.name || '').toLowerCase();
      const aPreferred = preferredShops.some((s) => aStore.includes(s));
      const bPreferred = preferredShops.some((s) => bStore.includes(s));
      if (aPreferred && !bPreferred) return -1;
      if (!aPreferred && bPreferred) return 1;
      return 0;
    });

    for (const hit of sorted) {
      let imgUrl = hit.image?.medium || hit.image?.small || '';
      if (!imgUrl) continue;

      // Upgrade Yahoo image size: /g/ (146px) or /c/ (76px) → /n/ (900px) or /l/ (600px)
      imgUrl = imgUrl.replace(/\/g\//, '/n/').replace(/\/c\//, '/n/');

      const result = await downloadImage(imgUrl, slug, 'S2:yahoo');
      if (result && result.size >= 10000) return result;
    }
    return null;
  } catch {
    return null;
  }
}

// ── Strategy 3: Rakuten Product Page og:image ───────
async function strategy3_RakutenOgImage(slug, buyUrl) {
  if (!buyUrl) return null;

  try {
    // Extract the actual Rakuten item page URL from affiliate link
    let pageUrl = buyUrl;
    const pcMatch = buyUrl.match(/[?&]pc=([^&]+)/);
    if (pcMatch) {
      pageUrl = decodeURIComponent(pcMatch[1]);
    }

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 20000);
    const res = await fetch(pageUrl, {
      headers: {
        'User-Agent': HEADERS['User-Agent'],
        Accept: 'text/html,application/xhtml+xml',
      },
      redirect: 'follow',
      signal: controller.signal,
    });
    clearTimeout(timeout);
    if (!res.ok) return null;

    const html = await res.text();

    // Extract og:image
    const ogMatch = html.match(/<meta\s+property="og:image"\s+content="([^"]+)"/i)
      || html.match(/<meta\s+content="([^"]+)"\s+property="og:image"/i);
    if (!ogMatch) return null;

    let ogImageUrl = ogMatch[1];

    // Try to convert to shop.r10s.jp for full res
    const r10sUrl = transformRakutenUrl(ogImageUrl);
    if (r10sUrl) {
      const result = await downloadImage(r10sUrl, slug, 'S3:og+r10s');
      if (result && result.size >= 5000) return result;
    }

    // Fallback: download og:image directly (remove size constraints)
    ogImageUrl = ogImageUrl.replace(/\?_ex=\d+x\d+/, '');
    const result = await downloadImage(ogImageUrl, slug, 'S3:og');
    if (result && result.size >= 5000) return result;

    return null;
  } catch {
    return null;
  }
}

// ── Find Rakuten URL for a product ───────────────────
function findRakutenUrl(slug, product) {
  // 1. Direct slug match from CSV maps
  if (slugToRakutenUrl.has(slug)) return slugToRakutenUrl.get(slug);

  // 2. Check if the current image field is a rakuten thumbnail URL
  if (product.image && product.image.includes('thumbnail.image.rakuten.co.jp')) {
    return product.image;
  }

  // 3. Fuzzy match from discoveries by product name
  const pName = (product.name || '').toLowerCase();
  if (pName.length > 5) {
    for (const d of discoveries) {
      const dName = (d.name || '').toLowerCase();
      if (dName && dName.includes(pName.substring(0, 20))) {
        return d.imageUrl;
      }
    }
  }

  return null;
}

function findBuyUrl(slug, product) {
  if (product.buyUrl && product.buyUrl.includes('rakuten')) return product.buyUrl;
  if (slugToBuyUrl.has(slug)) return slugToBuyUrl.get(slug);
  // Check discoveries
  for (const d of discoveries) {
    if (d.slug === slug && d.buyUrl) return d.buyUrl;
  }
  return null;
}

// ── Check if existing local image is already high-quality ──
function existingImageSize(slug) {
  for (const ext of ['jpg', 'webp', 'png']) {
    const fp = path.join(IMAGES_DIR, `${slug}.${ext}`);
    if (fs.existsSync(fp)) {
      return fs.statSync(fp).size;
    }
  }
  return 0;
}

// ══════════════════════════════════════════════════════
// ── MAIN ─────────────────────────────────────────────
// ══════════════════════════════════════════════════════
async function main() {
  // Ensure images directory exists
  if (!fs.existsSync(IMAGES_DIR)) fs.mkdirSync(IMAGES_DIR, { recursive: true });

  const productFiles = fs.readdirSync(PRODUCTS_DIR)
    .filter((f) => f.endsWith('.json') && !f.startsWith('_'));

  console.log(`\n🖼️  Multi-Source Image Upgrader\n`);
  console.log(`   📂 ${productFiles.length} products found`);
  console.log(`   📄 ${discoveries.length} Rakuten discoveries loaded`);
  console.log(`   📄 ${productsCSV.length} products.csv rows loaded`);
  console.log(`   🔧 Limit: ${limitArg === 9999 ? 'ALL' : limitArg} | Force: ${forceMode ? 'YES' : 'no'}`);
  console.log(`   ─────────────────────────────────────────\n`);

  const stats = { s1: 0, s2: 0, s3: 0, skippedGood: 0, skippedDone: 0, failed: 0, total: 0 };
  let processed = 0;

  for (const file of productFiles) {
    if (processed >= limitArg) break;

    const slug = file.replace('.json', '');
    const jsonPath = path.join(PRODUCTS_DIR, file);
    const product = JSON.parse(fs.readFileSync(jsonPath, 'utf-8'));

    // Skip if already processed in a previous run (unless --force)
    if (!forceMode && progress[slug]?.status === 'done') {
      stats.skippedDone++;
      continue;
    }

    // Skip if current image is already high quality (>100KB)
    const currentSize = existingImageSize(slug);
    if (!forceMode && currentSize > 100_000) {
      stats.skippedGood++;
      progress[slug] = { status: 'done', strategy: 'already-good', size: currentSize };
      continue;
    }

    processed++;
    stats.total++;
    const sizeLabel = currentSize > 0 ? `(current: ${(currentSize / 1024).toFixed(0)}KB)` : '(no local image)';
    process.stdout.write(`   [${String(processed).padStart(3)}] ${slug.substring(0, 45).padEnd(45)} ${sizeLabel.padEnd(20)}`);

    // ── Strategy 1: Rakuten r10s.jp high-res ──
    const rakutenUrl = findRakutenUrl(slug, product);
    let result = null;

    if (rakutenUrl) {
      result = await strategy1_RakutenHiRes(slug, rakutenUrl);
    }

    if (result && result.size >= 50_000) {
      // Good enough from Strategy 1
    } else {
      // ── Strategy 2: Yahoo Shopping ──
      await sleep(2000); // Rate limit
      const yahooResult = await strategy2_Yahoo(slug, product.name);
      if (yahooResult && (!result || yahooResult.size > result.size)) {
        result = yahooResult;
      }
    }

    if (!result || result.size < 50_000) {
      // ── Strategy 3: Rakuten og:image ──
      const buyUrl = findBuyUrl(slug, product);
      if (buyUrl) {
        await sleep(2000); // Rate limit
        const ogResult = await strategy3_RakutenOgImage(slug, buyUrl);
        if (ogResult && (!result || ogResult.size > result.size)) {
          result = ogResult;
        }
      }
    }

    if (result) {
      // Update product JSON
      if (product.image !== result.localPath) {
        product.image = result.localPath;
        fs.writeFileSync(jsonPath, JSON.stringify(product, null, 2) + '\n');
      }
      const sizeKB = (result.size / 1024).toFixed(0);
      const tag = result.strategy;
      const emoji = tag.startsWith('S1') ? '🟢' : tag.startsWith('S2') ? '🟡' : '🔵';
      console.log(`${emoji} ${sizeKB}KB [${tag}]`);

      if (tag.startsWith('S1')) stats.s1++;
      else if (tag.startsWith('S2')) stats.s2++;
      else stats.s3++;

      progress[slug] = { status: 'done', strategy: tag, size: result.size };
    } else {
      console.log(`❌ no source found`);
      stats.failed++;
      progress[slug] = { status: 'failed' };
    }

    saveProgress();
  }

  console.log(`
╔══════════════════════════════════════════════════════╗
║  📊 Image Upgrade Summary                           ║
╠══════════════════════════════════════════════════════╣
║  🟢 Strategy 1 (Rakuten r10s.jp):  ${String(stats.s1).padStart(4)}              ║
║  🟡 Strategy 2 (Yahoo Shopping):   ${String(stats.s2).padStart(4)}              ║
║  🔵 Strategy 3 (Rakuten og:image): ${String(stats.s3).padStart(4)}              ║
║  ────────────────────────────────────────────────    ║
║  ✅ Total upgraded:                ${String(stats.s1 + stats.s2 + stats.s3).padStart(4)}              ║
║  ⏭️  Skipped (already good >100KB): ${String(stats.skippedGood).padStart(4)}              ║
║  ⏭️  Skipped (prev run complete):   ${String(stats.skippedDone).padStart(4)}              ║
║  ❌ Failed (no source found):      ${String(stats.failed).padStart(4)}              ║
║  📦 Processed this run:            ${String(stats.total).padStart(4)}              ║
╚══════════════════════════════════════════════════════╝
`);
}

main().catch((err) => {
  console.error('Fatal error:', err);
  process.exit(1);
});
