/**
 * Improve product images by sourcing cleaner photos from Yahoo Shopping.
 *
 * Priority chain:
 *   1. Check current image quality (size, existence)
 *   2. Search Yahoo Shopping API for clean product photos
 *   3. Download best match, run rembg + center-products.py
 *
 * Usage:
 *   node scripts/improve-images.mjs --limit 5 --force
 *   node scripts/improve-images.mjs --min-size 20
 *   node scripts/improve-images.mjs --force --limit 10
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { execSync } from 'node:child_process';
import { pipeline } from 'node:stream/promises';
import { createWriteStream } from 'node:fs';
import { Readable } from 'node:stream';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const PRODUCTS_DIR = path.join(ROOT, 'src', 'content', 'products');
const IMAGES_DIR = path.join(ROOT, 'public', 'images', 'products');

// ── CLI Args ──────────────────────────────────────────
const args = process.argv.slice(2);
function getArg(name, defaultVal) {
  const idx = args.indexOf(name);
  if (idx < 0) return defaultVal;
  return args[idx + 1];
}
const LIMIT = getArg('--limit', null) ? parseInt(getArg('--limit'), 10) : null;
const FORCE = args.includes('--force');
const MIN_SIZE_KB = getArg('--min-size', '30') ? parseInt(getArg('--min-size', '30'), 10) : 30;
const GOOD_SIZE_KB = 50; // Images above this are considered "good"

// ── Yahoo Shopping API ────────────────────────────────
const YAHOO_APP_ID = 'dj00aiZpPXh4eHh4eHh4eHh4eCZzPWNvbnN1bWVyc2VjcmV0Jng9MDA-';
const YAHOO_API = 'https://shopping.yahooapis.jp/ShoppingWebService/V3/itemSearch';

// Known clean sellers (drugstores with professional product photos)
const CLEAN_SELLERS = ['kusuriaoki', 'sundrug', 'matsukiyo', 'lohaco', 'cosmeland',
  'kenkocom', 'soukai', 'wellness-web', 'rakuten24', 'aeonbody'];

// ── Brand → Japanese name mapping ─────────────────────
const BRAND_JP = {
  'La Roche-Posay': 'ラロッシュポゼ',
  'Shiseido': '資生堂',
  'SK-II': 'SK-II',
  'SK2': 'SK-II',
  'FANCL': 'ファンケル',
  'Anessa': 'アネッサ',
  'Canmake': 'キャンメイク',
  'Kao': '花王',
  'Biore': 'ビオレ',
  'Kose': 'コーセー',
  'KOSÉ': 'コーセー',
  'Rohto': 'ロート製薬',
  'DHC': 'DHC',
  'Hada Labo': '肌ラボ',
  'MUJI': '無印良品',
  'Decorte': 'コスメデコルテ',
  'Cosme Decorte': 'コスメデコルテ',
  'Albion': 'アルビオン',
  'Kanebo': 'カネボウ',
  'SUQQU': 'スック',
  'Lunasol': 'ルナソル',
  'Elixir': 'エリクシール',
  'Takami': 'タカミ',
  'Obagi': 'オバジ',
  'Curél': 'キュレル',
  'Curel': 'キュレル',
  'Nivea': 'ニベア',
  'Panasonic': 'パナソニック',
  'SHARP': 'シャープ',
  'Sharp': 'シャープ',
  'Zojirushi': '象印',
  'IRIS OHYAMA': 'アイリスオーヤマ',
  'Iris Ohyama': 'アイリスオーヤマ',
  'ReFa': 'リファ',
  'MTG': 'MTG',
  'Tsubaki': 'ツバキ',
  'Atenia': 'アテニア',
  'Attenir': 'アテニア',
  'Lancôme': 'ランコム',
  'Lancome': 'ランコム',
  'COSORI': 'COSORI',
  'Brita': 'ブリタ',
  'BRITA': 'ブリタ',
  'Shark': 'シャーク',
  'Moroccanoil': 'モロッカンオイル',
  'Yunth': 'ユンス',
  'Sabon': 'サボン',
  'Kerastase': 'ケラスターゼ',
  'Kérastase': 'ケラスターゼ',
  'Allie': 'アリィー',
  'Skin Aqua': 'スキンアクア',
  'DECENCIA': 'ディセンシア',
  'Decencia': 'ディセンシア',
  'Chifure': 'ちふれ',
  'ETVOS': 'エトヴォス',
  'Toray': '東レ',
  'SodaStream': 'ソーダストリーム',
  'd\'Alba': 'ダルバ',
  // Generic fallback — brands not in this map use their original name
};

// ── Type → Japanese mapping for search queries ────────
const TYPE_JP = {
  'Sunscreen': '日焼け止め',
  'Sunscreen Milk': 'UV ミルク',
  'Sunscreen Gel': 'UV ジェル',
  'Essence / Toner': 'エッセンス',
  'Toner': '化粧水',
  'Serum': '美容液',
  'Cleansing Oil': 'クレンジングオイル',
  'Oil Cleanser': 'クレンジングオイル',
  'Shampoo': 'シャンプー',
  'Hair Oil': 'ヘアオイル',
  'Hair Growth Tonic': '育毛トニック',
  'Foundation': 'ファンデーション',
  'Face Powder': 'フェイスパウダー',
  'Moisturizer': '保湿クリーム',
  'Cream': 'クリーム',
  'Lotion': '化粧水',
  'Rice Cooker': '炊飯器',
  'Air Fryer': 'エアフライヤー',
  'Vacuum': '掃除機',
  'Microwave': '電子レンジ',
  'Hair Dryer': 'ドライヤー',
  'Air Purifier': '空気清浄機',
  'Water Filter': '浄水器',
  'Water Filter Cartridge': '浄水カートリッジ',
  'Supplement': 'サプリメント',
  'Brush': 'ブラシ',
  'Hair Iron': 'ヘアアイロン',
};

// ── Helpers ───────────────────────────────────────────
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

function getImagePath(slug) {
  return path.join(IMAGES_DIR, `${slug}.png`);
}

function getImageSizeKB(filePath) {
  try {
    const stat = fs.statSync(filePath);
    return Math.round(stat.size / 1024);
  } catch {
    return 0;
  }
}

function hasTransparentBackground(filePath) {
  // Quick check: PNG files with transparency tend to be larger and have PNG signature
  try {
    const buf = fs.readFileSync(filePath);
    // Check PNG signature
    if (buf[0] !== 0x89 || buf[1] !== 0x50) return false;
    // Check for RGBA (color type 6) in IHDR chunk
    // IHDR starts at offset 8 (after signature), chunk length at 8-11, type at 12-15
    // Color type is at offset 25
    if (buf.length > 25 && buf[25] === 6) return true;
    return false;
  } catch {
    return false;
  }
}

function needsImprovement(slug) {
  const imgPath = getImagePath(slug);
  const sizeKB = getImageSizeKB(imgPath);

  if (sizeKB === 0) return { needs: true, reason: 'missing' };
  if (sizeKB < 5) return { needs: true, reason: `tiny (${sizeKB}KB)` };
  if (FORCE) return { needs: true, reason: 'forced' };
  if (sizeKB < MIN_SIZE_KB) return { needs: true, reason: `small (${sizeKB}KB < ${MIN_SIZE_KB}KB)` };

  // Good images: large PNG with transparency
  if (sizeKB >= GOOD_SIZE_KB && hasTransparentBackground(imgPath)) {
    return { needs: false, reason: `good (${sizeKB}KB, transparent)` };
  }

  return { needs: false, reason: `ok (${sizeKB}KB)` };
}

// ── Yahoo Shopping Search ─────────────────────────────
async function searchYahoo(query) {
  const params = new URLSearchParams({
    appid: YAHOO_APP_ID,
    query,
    results: '10',
    sort: '-score',
  });

  const url = `${YAHOO_API}?${params}`;
  const res = await fetch(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120.0.0.0',
    },
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Yahoo API ${res.status}: ${text.substring(0, 200)}`);
  }

  return res.json();
}

function buildSearchQuery(product) {
  const brand = product.brand || '';
  const type = product.type || '';
  const name = product.name || '';

  // Get Japanese brand name
  const brandJP = BRAND_JP[brand] || brand;

  // Get Japanese type
  const typeJP = TYPE_JP[type] || type;

  // Primary: brand + type in Japanese
  const primary = `${brandJP} ${typeJP}`.trim();

  // Fallback: brand + product name keywords
  const nameKeywords = name
    .replace(/[()[\]【】]/g, ' ')
    .replace(/\b(the|for|and|with|in|on|set|pack|refill|eco)\b/gi, '')
    .trim()
    .split(/\s+/)
    .slice(0, 3)
    .join(' ');
  const fallback = `${brandJP} ${nameKeywords}`.trim();

  return { primary, fallback };
}

function scoreYahooHit(hit) {
  let score = 0;
  const sellerName = (hit.seller?.name || '').toLowerCase();

  // Prefer known clean sellers
  for (const cleanSeller of CLEAN_SELLERS) {
    if (sellerName.includes(cleanSeller)) {
      score += 50;
      break;
    }
  }

  // Prefer items with reviews (indicates real products, not bundles)
  const reviewCount = hit.review?.count || 0;
  if (reviewCount > 100) score += 30;
  else if (reviewCount > 10) score += 15;

  // Prefer items with good images
  if (hit.image?.medium) score += 10;

  return score;
}

function getImageUrl(hit) {
  let url = hit.image?.medium || hit.image?.small || '';
  if (!url) return '';

  // Upgrade to high-res: /g/ or /c/ → /n/ for ~900px
  url = url.replace(/\/[gc]\//, '/n/');
  return url;
}

// ── Download Image ────────────────────────────────────
async function downloadImage(url, destPath) {
  const res = await fetch(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120.0.0.0',
      'Accept': 'image/*',
    },
  });

  if (!res.ok) throw new Error(`Download failed ${res.status}`);

  const contentType = res.headers.get('content-type') || '';
  if (!contentType.includes('image')) {
    throw new Error(`Not an image: ${contentType}`);
  }

  const arrayBuf = await res.arrayBuffer();
  const buf = Buffer.from(arrayBuf);

  if (buf.length < 1000) {
    throw new Error(`Image too small: ${buf.length} bytes`);
  }

  fs.writeFileSync(destPath, buf);
  return Math.round(buf.length / 1024);
}

// ── Post-processing ───────────────────────────────────
function runRembg(slug) {
  const imgPath = getImagePath(slug);
  try {
    execSync(`python -m rembg i "${imgPath}" "${imgPath}"`, {
      cwd: ROOT,
      timeout: 60000,
      stdio: 'pipe',
    });
    return true;
  } catch (e) {
    // Try rembg directly
    try {
      execSync(`rembg i "${imgPath}" "${imgPath}"`, {
        cwd: ROOT,
        timeout: 60000,
        stdio: 'pipe',
      });
      return true;
    } catch {
      console.log(`      [warn] rembg not available, skipping bg removal`);
      return false;
    }
  }
}

function runCenter(slug) {
  const imgPath = getImagePath(slug);
  try {
    // Use the center-products.py script logic inline with Python
    execSync(`python -c "
from PIL import Image
from pathlib import Path
img = Image.open(r'${imgPath.replace(/\\/g, '\\\\')}').convert('RGBA')
alpha = img.split()[3]
bbox = alpha.getbbox()
if bbox:
    cropped = img.crop(bbox)
    cw, ch = cropped.size
    padding = int(max(cw, ch) * 0.10)
    canvas_size = max(cw, ch) + padding * 2
    canvas = Image.new('RGBA', (canvas_size, canvas_size), (0, 0, 0, 0))
    x = (canvas_size - cw) // 2
    y = (canvas_size - ch) // 2
    canvas.paste(cropped, (x, y), cropped)
    canvas.save(r'${imgPath.replace(/\\/g, '\\\\')}', 'PNG', optimize=True)
"`, {
      cwd: ROOT,
      timeout: 30000,
      stdio: 'pipe',
    });
    return true;
  } catch {
    console.log(`      [warn] centering failed, skipping`);
    return false;
  }
}

// ── Main ──────────────────────────────────────────────
console.log(`
==========================================================
  Chartedly Image Improver
  Yahoo Shopping clean image sourcing
==========================================================
  Limit:    ${LIMIT || 'ALL'}
  Force:    ${FORCE}
  Min size: ${MIN_SIZE_KB}KB
----------------------------------------------------------
`);

// Load all product JSONs
const productFiles = fs.readdirSync(PRODUCTS_DIR)
  .filter(f => f.endsWith('.json') && !f.startsWith('_'))
  .sort();

console.log(`  Found ${productFiles.length} products\n`);

let processed = 0;
let improved = 0;
let skipped = 0;
let failed = 0;

for (const file of productFiles) {
  if (LIMIT && processed >= LIMIT) break;

  const slug = file.replace('.json', '');
  const productPath = path.join(PRODUCTS_DIR, file);
  const product = JSON.parse(fs.readFileSync(productPath, 'utf-8'));

  // Step 1: Check if image needs improvement
  const check = needsImprovement(slug);
  if (!check.needs) {
    skipped++;
    continue;
  }

  processed++;
  const pad = `[${processed}/${LIMIT || productFiles.length}]`;
  console.log(`${pad} ${slug}`);
  console.log(`      Reason: ${check.reason}`);
  console.log(`      Brand: ${product.brand} | Type: ${product.type}`);

  // Step 2: Search Yahoo Shopping
  const queries = buildSearchQuery(product);
  let downloaded = false;

  for (const [label, query] of [['primary', queries.primary], ['fallback', queries.fallback]]) {
    if (downloaded) break;

    console.log(`      Search (${label}): "${query}"`);

    try {
      const data = await searchYahoo(query);
      const hits = data.hits || [];

      if (hits.length === 0) {
        console.log(`      No results`);
        continue;
      }

      // Score and sort hits
      const scored = hits.map(h => ({ hit: h, score: scoreYahooHit(h) }));
      scored.sort((a, b) => b.score - a.score);

      // Try top 3 results
      for (let i = 0; i < Math.min(3, scored.length); i++) {
        const { hit } = scored[i];
        const imageUrl = getImageUrl(hit);

        if (!imageUrl) continue;

        const sellerName = hit.seller?.name || 'unknown';
        console.log(`      Try #${i + 1}: ${sellerName} — ${(hit.name || '').substring(0, 50)}`);

        try {
          const destPath = getImagePath(slug);
          const sizeKB = await downloadImage(imageUrl, destPath);

          if (sizeKB < 3) {
            console.log(`      Skip: too small (${sizeKB}KB)`);
            continue;
          }

          console.log(`      Downloaded: ${sizeKB}KB from ${imageUrl.substring(0, 80)}`);
          downloaded = true;
          break;
        } catch (e) {
          console.log(`      Download failed: ${e.message}`);
        }
      }

      // Rate limit between API calls
      await sleep(2000);
    } catch (e) {
      console.log(`      API error: ${e.message}`);
      await sleep(2000);
    }
  }

  if (!downloaded) {
    console.log(`      FAILED — no suitable image found`);
    failed++;
    continue;
  }

  // Step 3: Post-process — remove background + center
  console.log(`      Post-processing...`);
  const didRembg = runRembg(slug);
  if (didRembg) {
    runCenter(slug);
  }

  const finalSizeKB = getImageSizeKB(getImagePath(slug));
  console.log(`      DONE: ${finalSizeKB}KB`);

  improved++;

  // Rate limit before next product
  await sleep(1000);
}

// ── Summary ───────────────────────────────────────────
console.log(`
==========================================================
  Summary
==========================================================
  Processed:  ${processed}
  Improved:   ${improved}
  Skipped:    ${skipped} (already good)
  Failed:     ${failed}
  Total:      ${productFiles.length} products
==========================================================
`);
