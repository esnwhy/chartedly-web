/**
 * Fetch clean product images from Amazon JP search results.
 *
 * Replaces Rakuten/picsum/external images with clean Amazon CDN images
 * by searching Amazon JP for each product name and extracting the first
 * result's s-image src URL.
 *
 * Usage:
 *   node scripts/fetch-amazon-images.mjs                 # process all products
 *   node scripts/fetch-amazon-images.mjs --limit 10      # process first 10 only
 *   node scripts/fetch-amazon-images.mjs --force         # re-download even if local image exists
 *   node scripts/fetch-amazon-images.mjs --limit 5 --force
 *
 * What it does:
 *   1. Reads each product JSON in src/content/products/
 *   2. Skips products that already have a local image (unless --force)
 *   3. Searches Amazon JP: https://www.amazon.co.jp/s?k={productName}
 *   4. Parses the HTML to find the first <img class="s-image"> src
 *   5. Upgrades the URL to a larger size (_AC_SL1500_)
 *   6. Downloads the image to public/images/products/{slug}.jpg
 *   7. Updates the product JSON's "image" field
 *   8. Saves a progress log so interrupted runs can be resumed
 *
 * Rate limit: 1 request every 3 seconds minimum.
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PRODUCTS_DIR = path.join(__dirname, '..', 'src', 'content', 'products');
const IMAGES_DIR = path.join(__dirname, '..', 'public', 'images', 'products');
const PROGRESS_FILE = path.join(__dirname, '..', '.amazon-image-progress.json');

// Ensure images directory exists
fs.mkdirSync(IMAGES_DIR, { recursive: true });

// ── CLI Args ────────────────────────────────────────────
const args = process.argv.slice(2);
const limitIdx = args.indexOf('--limit');
const LIMIT = limitIdx >= 0 ? parseInt(args[limitIdx + 1], 10) : Infinity;
const FORCE = args.includes('--force');

// ── Constants ───────────────────────────────────────────
const RATE_LIMIT_MS = 3000; // 3 seconds between requests
const AMAZON_SEARCH_BASE = 'https://www.amazon.co.jp/s';
const AMAZON_IMAGE_CDN = 'https://m.media-amazon.co.jp/images/I';

// Rotate through a few realistic User-Agent strings to reduce fingerprinting
const USER_AGENTS = [
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36',
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36',
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:124.0) Gecko/20100101 Firefox/124.0',
];

let uaIndex = 0;
function nextUserAgent() {
  const ua = USER_AGENTS[uaIndex % USER_AGENTS.length];
  uaIndex++;
  return ua;
}

function buildHeaders() {
  return {
    'User-Agent': nextUserAgent(),
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
    'Accept-Language': 'ja-JP,ja;q=0.9,en-US;q=0.8,en;q=0.7',
    'Accept-Encoding': 'gzip, deflate, br',
    'Cache-Control': 'no-cache',
    'Pragma': 'no-cache',
    'Sec-Fetch-Dest': 'document',
    'Sec-Fetch-Mode': 'navigate',
    'Sec-Fetch-Site': 'none',
    'Upgrade-Insecure-Requests': '1',
  };
}

// ── Rate Limiter ────────────────────────────────────────
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

let lastRequestAt = 0;
async function rateLimitedFetch(url, options = {}) {
  const now = Date.now();
  const elapsed = now - lastRequestAt;
  if (elapsed < RATE_LIMIT_MS) {
    await sleep(RATE_LIMIT_MS - elapsed);
  }
  lastRequestAt = Date.now();
  return fetch(url, { ...options, redirect: 'follow' });
}

// ── Progress Tracking ───────────────────────────────────
function loadProgress() {
  if (!fs.existsSync(PROGRESS_FILE)) return { done: {}, failed: {} };
  try {
    return JSON.parse(fs.readFileSync(PROGRESS_FILE, 'utf-8'));
  } catch {
    return { done: {}, failed: {} };
  }
}

function saveProgress(progress) {
  fs.writeFileSync(PROGRESS_FILE, JSON.stringify(progress, null, 2) + '\n');
}

// ── Amazon Search ───────────────────────────────────────

/**
 * Extract the s-image src from Amazon search result HTML.
 * Returns the raw src URL or null if not found.
 */
function extractSImageSrc(html) {
  // Amazon renders s-image tags; we look for the class in the HTML source.
  // The src is usually a small thumbnail — we'll replace the size suffix later.
  // Pattern: <img ... class="s-image" ... src="https://..."
  // Attribute order varies, so we look for the class first, then backtrack to src.

  // Strategy 1: Find the first occurrence of class="s-image" and locate src nearby
  const classMarker = 'class="s-image"';
  const classIdx = html.indexOf(classMarker);
  if (classIdx === -1) return null;

  // Search a 500-char window around the class attribute for src=
  const windowStart = Math.max(0, classIdx - 300);
  const windowEnd = Math.min(html.length, classIdx + 300);
  const window = html.slice(windowStart, windowEnd);

  // Match src="https://..." within this window
  const srcMatch = window.match(/src=["'](https:\/\/[^"']+)["']/);
  if (srcMatch) return srcMatch[1];

  // Strategy 2: data-src (lazy-loaded images)
  const dataSrcMatch = window.match(/data-src=["'](https:\/\/[^"']+)["']/);
  if (dataSrcMatch) return dataSrcMatch[1];

  return null;
}

/**
 * Extract ASIN from Amazon HTML. Used as a fallback to construct a clean URL.
 * ASINs appear in data-asin attributes on product containers.
 */
function extractFirstAsin(html) {
  const asinMatch = html.match(/data-asin=["']([A-Z0-9]{10})["']/);
  return asinMatch ? asinMatch[1] : null;
}

/**
 * Given a raw Amazon image URL (small thumbnail), return a large clean version.
 * Amazon image URLs follow the pattern:
 *   https://m.media-amazon.com/images/I/{imageId}._AC_US40_.jpg
 *   https://m.media-amazon.co.jp/images/I/{imageId}._AC_SL160_.jpg
 * We strip the size/modifier part and replace with _AC_SL1500_ for a clean large image.
 */
function upgradeImageUrl(rawUrl) {
  if (!rawUrl) return null;

  // Extract the image ID part (everything before the first ._)
  // e.g. "71abc123XY._AC_US40_.jpg" → "71abc123XY"
  const idMatch = rawUrl.match(/\/images\/I\/([A-Za-z0-9+]+)\./);
  if (!idMatch) return null;

  const imageId = idMatch[1];

  // Use the JP CDN for consistency, with a clean 1500px size and white background
  return `${AMAZON_IMAGE_CDN}/${imageId}._AC_SL1500_.jpg`;
}

/**
 * Search Amazon JP for a product and return a clean large image URL.
 * Returns null if nothing is found.
 */
async function searchAmazonForImage(productName) {
  const searchUrl = `${AMAZON_SEARCH_BASE}?k=${encodeURIComponent(productName)}&ref=sr_pg_1`;

  let res;
  try {
    res = await rateLimitedFetch(searchUrl, { headers: buildHeaders() });
  } catch (err) {
    throw new Error(`Network error: ${err.message}`);
  }

  if (res.status === 503 || res.status === 429) {
    throw new Error(`Rate limited by Amazon (${res.status}) — try again later`);
  }

  if (!res.ok) {
    throw new Error(`Amazon returned ${res.status}`);
  }

  const html = await res.text();

  // Check if we hit a CAPTCHA / robot check page
  if (
    html.includes('Type the characters you see in this image') ||
    html.includes('Enter the characters you see below') ||
    html.includes('api-services-support@amazon.com') ||
    html.length < 5000
  ) {
    throw new Error('Amazon CAPTCHA detected — wait a few minutes before retrying');
  }

  const rawSrc = extractSImageSrc(html);
  if (!rawSrc) {
    // Log ASIN for manual recovery
    const asin = extractFirstAsin(html);
    if (asin) {
      return { imageUrl: null, asin, note: `ASIN found (${asin}) but no image src extracted` };
    }
    return null;
  }

  const cleanUrl = upgradeImageUrl(rawSrc);
  if (!cleanUrl) {
    return { imageUrl: rawSrc, asin: null, note: 'Could not upgrade URL, using raw src' };
  }

  // Also extract ASIN for reference
  const asin = extractFirstAsin(html);
  return { imageUrl: cleanUrl, asin, note: null };
}

// ── Image Downloader ────────────────────────────────────

/**
 * Download an image URL to a local file path.
 * Returns bytes written, or throws on failure.
 */
async function downloadImage(imageUrl, destPath) {
  const res = await rateLimitedFetch(imageUrl, {
    headers: {
      'User-Agent': nextUserAgent(),
      'Accept': 'image/webp,image/avif,image/*,*/*;q=0.8',
      'Referer': 'https://www.amazon.co.jp/',
    },
  });

  if (!res.ok) {
    throw new Error(`Image download failed: ${res.status} ${res.statusText}`);
  }

  const buffer = Buffer.from(await res.arrayBuffer());
  if (buffer.length < 1000) {
    throw new Error(`Downloaded file is too small (${buffer.length} bytes) — likely an error page`);
  }

  fs.writeFileSync(destPath, buffer);
  return buffer.length;
}

// ── Product Processing ──────────────────────────────────

/**
 * Determine whether a product should be processed.
 * Returns true if the image field is not already a clean local file.
 */
function needsProcessing(data) {
  const img = data.image || '';

  // Already a local webp/jpg — skip unless --force
  if (img.startsWith('/images/')) return FORCE;

  // Picsum placeholder, Rakuten image, Amazon image, empty, or anything external
  return true;
}

/**
 * Process a single product JSON file:
 * 1. Check if it needs processing
 * 2. Search Amazon JP
 * 3. Download image
 * 4. Update JSON
 */
async function processProduct(jsonFile, progress) {
  const slug = path.basename(jsonFile, '.json');

  // Skip template files
  if (slug.startsWith('_')) return { status: 'skip', reason: 'template file' };

  // Skip if already successfully done in a previous run (unless --force)
  if (!FORCE && progress.done[slug]) {
    return { status: 'skip', reason: 'already done in previous run' };
  }

  const jsonPath = path.join(PRODUCTS_DIR, jsonFile);
  let data;
  try {
    data = JSON.parse(fs.readFileSync(jsonPath, 'utf-8'));
  } catch (err) {
    return { status: 'error', reason: `Could not parse JSON: ${err.message}` };
  }

  if (!needsProcessing(data)) {
    return { status: 'skip', reason: 'already has local image' };
  }

  const productName = data.name || slug.replace(/-/g, ' ');

  // Search Amazon
  let searchResult;
  try {
    searchResult = await searchAmazonForImage(productName);
  } catch (err) {
    progress.failed[slug] = { reason: err.message, at: new Date().toISOString() };
    saveProgress(progress);
    return { status: 'error', reason: err.message };
  }

  if (!searchResult || !searchResult.imageUrl) {
    const note = searchResult?.note || 'No image found on Amazon JP';
    progress.failed[slug] = { reason: note, at: new Date().toISOString() };
    saveProgress(progress);
    return { status: 'not_found', reason: note, asin: searchResult?.asin };
  }

  // Download image
  const destPath = path.join(IMAGES_DIR, `${slug}.jpg`);
  let bytes;
  try {
    bytes = await downloadImage(searchResult.imageUrl, destPath);
  } catch (err) {
    progress.failed[slug] = { reason: err.message, imageUrl: searchResult.imageUrl, at: new Date().toISOString() };
    saveProgress(progress);
    return { status: 'error', reason: `Download failed: ${err.message}` };
  }

  // Update the JSON
  const localPath = `/images/products/${slug}.jpg`;
  data.image = localPath;
  try {
    fs.writeFileSync(jsonPath, JSON.stringify(data, null, 2) + '\n');
  } catch (err) {
    return { status: 'error', reason: `Could not write JSON: ${err.message}` };
  }

  // Record success
  progress.done[slug] = {
    asin: searchResult.asin,
    imageUrl: searchResult.imageUrl,
    bytes,
    at: new Date().toISOString(),
  };
  delete progress.failed[slug];
  saveProgress(progress);

  return {
    status: 'ok',
    asin: searchResult.asin,
    imageUrl: searchResult.imageUrl,
    bytes,
    localPath,
  };
}

// ── Main ────────────────────────────────────────────────

const progress = loadProgress();

const allFiles = fs.readdirSync(PRODUCTS_DIR)
  .filter((f) => f.endsWith('.json') && !f.startsWith('_'));

// Determine which files to process
let toProcess = allFiles;

if (!FORCE) {
  // In normal mode, skip files whose products already have local images
  // (progress file handles previously-succeeded Amazon searches)
  toProcess = allFiles.filter((f) => {
    const slug = f.replace('.json', '');
    if (progress.done[slug]) return false; // already done
    try {
      const data = JSON.parse(fs.readFileSync(path.join(PRODUCTS_DIR, f), 'utf-8'));
      return needsProcessing(data);
    } catch {
      return true; // process it to surface the parse error
    }
  });
}

if (isFinite(LIMIT)) {
  toProcess = toProcess.slice(0, LIMIT);
}

// Summary header
console.log(`
╔══════════════════════════════════════════════════════════════╗
║  Amazon JP Image Fetcher for Chartedly                       ║
╚══════════════════════════════════════════════════════════════╝

  Total product files : ${allFiles.length}
  To process          : ${toProcess.length}${isFinite(LIMIT) ? ` (limited to ${LIMIT})` : ''}
  Force re-download   : ${FORCE ? 'yes' : 'no'}
  Rate limit          : ${RATE_LIMIT_MS / 1000}s between requests
  Progress file       : .amazon-image-progress.json

`);

if (toProcess.length === 0) {
  console.log('Nothing to do — all products already have local images.');
  console.log('Use --force to re-download existing images.\n');
  process.exit(0);
}

// Results tracking
const results = { ok: [], not_found: [], error: [], skip: [] };

for (let i = 0; i < toProcess.length; i++) {
  const file = toProcess[i];
  const slug = file.replace('.json', '');
  const num = `[${String(i + 1).padStart(String(toProcess.length).length)}/${toProcess.length}]`;

  process.stdout.write(`${num} ${slug} ... `);

  const result = await processProduct(file, progress);

  switch (result.status) {
    case 'ok':
      console.log(`OK  ${(result.bytes / 1024).toFixed(0)}KB  ASIN:${result.asin || 'unknown'}  -> ${result.localPath}`);
      results.ok.push(slug);
      break;

    case 'skip':
      console.log(`SKIP  (${result.reason})`);
      results.skip.push(slug);
      break;

    case 'not_found':
      console.log(`NOT FOUND  ${result.reason}${result.asin ? `  ASIN:${result.asin}` : ''}`);
      results.not_found.push(slug);
      break;

    case 'error':
      console.log(`ERROR  ${result.reason}`);
      results.error.push(slug);

      // If it's a CAPTCHA, abort immediately — further requests will also fail
      if (result.reason.includes('CAPTCHA')) {
        console.log('\nAborted: Amazon is showing a CAPTCHA. Wait a few minutes and retry.\n');
        break;
      }
      break;
  }
}

// ── Final Summary ───────────────────────────────────────

const totalDone = Object.keys(progress.done).length;
const totalFailed = Object.keys(progress.failed).length;

console.log(`
╔══════════════════════════════════════════════════════════════╗
║  Summary                                                     ║
╠══════════════════════════════════════════════════════════════╣
║  This run:                                                   ║
║    Downloaded      : ${String(results.ok.length).padEnd(4)} products                            ║
║    Not found       : ${String(results.not_found.length).padEnd(4)} products                            ║
║    Errors          : ${String(results.error.length).padEnd(4)} products                            ║
║    Skipped         : ${String(results.skip.length).padEnd(4)} products                            ║
╠══════════════════════════════════════════════════════════════╣
║  All-time (progress file):                                   ║
║    Successfully done : ${String(totalDone).padEnd(4)} products                          ║
║    Still failing     : ${String(totalFailed).padEnd(4)} products                          ║
╚══════════════════════════════════════════════════════════════╝
`);

if (results.not_found.length > 0) {
  console.log('Not found on Amazon JP:');
  results.not_found.forEach((s) => console.log(`  - ${s}`));
  console.log('');
}

if (results.error.length > 0) {
  console.log('Errors (will retry on next run):');
  results.error.forEach((s) => console.log(`  - ${s}`));
  console.log('');
}

if (totalFailed > 0) {
  console.log(`See .amazon-image-progress.json for details on all ${totalFailed} failed products.`);
  console.log('');
}
