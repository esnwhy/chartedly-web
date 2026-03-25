/**
 * Brand Image Fetcher — Gets clean official product images
 *
 * Uses Playwright headless browser to:
 * 1. Search Google Images for "{brand} {product name} official product"
 * 2. Filter for clean white-background product shots
 * 3. Download the best match
 *
 * Usage:
 *   node scripts/fetch-brand-images.mjs              # all products
 *   node scripts/fetch-brand-images.mjs --limit 10   # first 10
 *   node scripts/fetch-brand-images.mjs --force       # re-download all
 *   node scripts/fetch-brand-images.mjs --min-size 80 # skip images > 80KB
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PRODUCTS_DIR = path.join(__dirname, '..', 'src', 'content', 'products');
const IMAGES_DIR = path.join(__dirname, '..', 'public', 'images', 'products');
const PROGRESS_FILE = path.join(__dirname, '..', '.brand-image-progress.json');

fs.mkdirSync(IMAGES_DIR, { recursive: true });

// ── Args ────────────────────────────────────────────
const args = process.argv.slice(2);
const limitIdx = args.indexOf('--limit');
const LIMIT = limitIdx >= 0 ? parseInt(args[limitIdx + 1], 10) : Infinity;
const FORCE = args.includes('--force');
const minSizeIdx = args.indexOf('--min-size');
const MIN_SIZE_KB = minSizeIdx >= 0 ? parseInt(args[minSizeIdx + 1], 10) : 100;

// ── Progress tracking ───────────────────────────────
let progress = {};
if (fs.existsSync(PROGRESS_FILE) && !FORCE) {
  progress = JSON.parse(fs.readFileSync(PROGRESS_FILE, 'utf-8'));
}
function saveProgress() {
  fs.writeFileSync(PROGRESS_FILE, JSON.stringify(progress, null, 2));
}

// ── Load products ───────────────────────────────────
const products = fs.readdirSync(PRODUCTS_DIR)
  .filter(f => f.endsWith('.json') && !f.startsWith('_'))
  .map(f => {
    const data = JSON.parse(fs.readFileSync(path.join(PRODUCTS_DIR, f), 'utf-8'));
    return { slug: f.replace('.json', ''), ...data };
  })
  .sort((a, b) => (b.score || 0) - (a.score || 0)); // highest score first

console.log(`\n🖼️  Brand Image Fetcher (Playwright + Google Images)\n`);
console.log(`   📂 ${products.length} products found`);
console.log(`   🔧 Limit: ${LIMIT === Infinity ? 'ALL' : LIMIT} | Force: ${FORCE ? 'YES' : 'NO'} | Min size: ${MIN_SIZE_KB}KB`);
console.log(`   ─────────────────────────────────────────\n`);

// ── Check if product needs upgrade ──────────────────
function needsUpgrade(product) {
  if (FORCE) return true;
  if (progress[product.slug]?.status === 'done') return false;

  // Check current image file size
  const localPath = product.image?.startsWith('/')
    ? path.join(__dirname, '..', 'public', product.image)
    : null;

  if (!localPath || !fs.existsSync(localPath)) return true;

  const stats = fs.statSync(localPath);
  const sizeKB = stats.size / 1024;

  // If image is smaller than threshold, it needs upgrade
  if (sizeKB < MIN_SIZE_KB) return true;

  return false;
}

// ── Build search query ──────────────────────────────
function buildSearchQuery(product) {
  // Clean up the product name — remove long Rakuten keyword spam
  let name = product.name || '';

  // If name is too long (Rakuten style), use just brand + type
  if (name.length > 60) {
    name = `${product.brand || ''} ${product.type || product.subcategory || ''}`.trim();
  }

  const brand = product.brand || '';

  // Build a clean search query
  return `${brand} ${name} product official`.trim();
}

// ── Main ────────────────────────────────────────────
const browser = await chromium.launch({
  headless: true,
  args: ['--disable-blink-features=AutomationControlled']
});

const context = await browser.newContext({
  userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  locale: 'en-US',
  viewport: { width: 1280, height: 720 },
});

let upgraded = 0;
let skipped = 0;
let failed = 0;
let processed = 0;

for (const product of products) {
  if (processed >= LIMIT) break;
  processed++;

  const padded = `[${String(processed).padStart(3)}]`;

  if (!needsUpgrade(product)) {
    console.log(`   ${padded} ${product.slug.substring(0, 45).padEnd(45)} ⏭️  skip (good quality)`);
    skipped++;
    continue;
  }

  const query = buildSearchQuery(product);

  try {
    const page = await context.newPage();

    // Use DuckDuckGo image search (more reliable than Google for scraping)
    // First get the vqd token
    const ddgQuery = encodeURIComponent(query);
    const tokenPage = await context.newPage();
    await tokenPage.goto(`https://duckduckgo.com/?q=${ddgQuery}&iax=images&ia=images`, {
      waitUntil: 'networkidle',
      timeout: 15000,
    });
    await tokenPage.waitForTimeout(2000);

    // Extract image URLs from DuckDuckGo results
    const allUrls = await tokenPage.evaluate(() => {
      const results = [];
      // DDG stores image data in tile elements
      const tiles = document.querySelectorAll('.tile--img__media img, .tile--img img');
      tiles.forEach(img => {
        const src = img.getAttribute('data-src') || img.getAttribute('src');
        if (src && src.startsWith('http') && !src.includes('duckduckgo')) {
          results.push(src);
        }
      });
      // Also try getting from link hrefs
      const links = document.querySelectorAll('a.tile--img__sub');
      links.forEach(a => {
        const href = a.getAttribute('href');
        if (href && href.startsWith('http')) results.push(href);
      });
      // Also try the detail panel images
      const detailImgs = document.querySelectorAll('.detail__media img');
      detailImgs.forEach(img => {
        const src = img.getAttribute('src');
        if (src && src.startsWith('http')) results.push(src);
      });
      return results.slice(0, 8);
    });

    // If DDG didn't return results, try Bing as fallback
    if (allUrls.length === 0) {
      await tokenPage.goto(`https://www.bing.com/images/search?q=${ddgQuery}&qft=+filterui:photo-photo+filterui:imagesize-large`, {
        waitUntil: 'domcontentloaded',
        timeout: 15000,
      });
      await tokenPage.waitForTimeout(1500);

      const bingUrls = await tokenPage.evaluate(() => {
        const results = [];
        document.querySelectorAll('a.iusc').forEach(a => {
          try {
            const m = JSON.parse(a.getAttribute('m') || '{}');
            if (m.murl) results.push(m.murl);
          } catch {}
        });
        // Fallback: get img src
        document.querySelectorAll('.mimg').forEach(img => {
          const src = img.getAttribute('src');
          if (src && src.startsWith('http')) results.push(src);
        });
        return results.slice(0, 8);
      });
      allUrls.push(...bingUrls);
    }

    await tokenPage.close();

    await page.close();

    if (allUrls.length === 0) {
      console.log(`   ${padded} ${product.slug.substring(0, 45).padEnd(45)} ❌ no images found`);
      progress[product.slug] = { status: 'failed', reason: 'no_images' };
      failed++;
      saveProgress();
      continue;
    }

    // Try downloading the best image
    let downloaded = false;
    for (const imgUrl of allUrls) {
      try {
        const res = await fetch(imgUrl, {
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
            'Accept': 'image/webp,image/*,*/*',
            'Referer': 'https://www.google.com/',
          },
          redirect: 'follow',
          signal: AbortSignal.timeout(10000),
        });

        if (!res.ok) continue;

        const contentType = res.headers.get('content-type') || '';
        if (!contentType.includes('image')) continue;

        const buffer = Buffer.from(await res.arrayBuffer());

        // Skip tiny images (likely thumbnails or icons)
        if (buffer.length < 10000) continue; // < 10KB

        // Determine extension
        let ext = 'jpg';
        if (contentType.includes('png')) ext = 'png';
        else if (contentType.includes('webp')) ext = 'webp';

        const filename = `${product.slug}.${ext}`;
        const filepath = path.join(IMAGES_DIR, filename);
        fs.writeFileSync(filepath, buffer);

        // Update product JSON
        const productPath = path.join(PRODUCTS_DIR, `${product.slug}.json`);
        const productData = JSON.parse(fs.readFileSync(productPath, 'utf-8'));
        productData.image = `/images/products/${filename}`;
        fs.writeFileSync(productPath, JSON.stringify(productData, null, 2) + '\n');

        const sizeKB = Math.round(buffer.length / 1024);
        console.log(`   ${padded} ${product.slug.substring(0, 45).padEnd(45)} ✅ ${sizeKB}KB (${ext})`);

        progress[product.slug] = { status: 'done', source: imgUrl, size: buffer.length };
        upgraded++;
        downloaded = true;
        break;
      } catch {
        continue;
      }
    }

    if (!downloaded) {
      console.log(`   ${padded} ${product.slug.substring(0, 45).padEnd(45)} ❌ download failed`);
      progress[product.slug] = { status: 'failed', reason: 'download_failed' };
      failed++;
    }

    saveProgress();

    // Rate limit — be respectful to Google
    await new Promise(r => setTimeout(r, 3000));

  } catch (err) {
    console.log(`   ${padded} ${product.slug.substring(0, 45).padEnd(45)} ❌ ${err.message?.substring(0, 40)}`);
    progress[product.slug] = { status: 'failed', reason: err.message };
    failed++;
    saveProgress();
  }
}

await browser.close();

console.log(`
╔══════════════════════════════════════════════════════╗
║  📊 Brand Image Fetch Summary                       ║
╠══════════════════════════════════════════════════════╣
║  ✅ Upgraded:          ${String(upgraded).padStart(3)}                          ║
║  ⏭️  Skipped (good):    ${String(skipped).padStart(3)}                          ║
║  ❌ Failed:            ${String(failed).padStart(3)}                          ║
║  📦 Processed:         ${String(processed).padStart(3)}                          ║
╚══════════════════════════════════════════════════════╝
`);
