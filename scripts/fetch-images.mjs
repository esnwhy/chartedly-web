/**
 * Fetch product images from Amazon/Rakuten URLs.
 *
 * Usage:
 *   node scripts/fetch-images.mjs                  # process all products
 *   node scripts/fetch-images.mjs biore-uv-aqua-rich  # process one product
 *
 * What it does:
 *   1. Reads each product JSON in src/content/products/
 *   2. If buyUrl points to Amazon or Rakuten and image is missing or external
 *   3. Fetches the page, extracts the product image (og:image)
 *   4. Downloads the image to public/images/products/
 *   5. Updates the JSON file's "image" field to the local path
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PRODUCTS_DIR = path.join(__dirname, '..', 'src', 'content', 'products');
const IMAGES_DIR = path.join(__dirname, '..', 'public', 'images', 'products');

// Ensure images dir exists
fs.mkdirSync(IMAGES_DIR, { recursive: true });

const targetSlug = process.argv[2] || null;

// User-Agent to avoid being blocked
const HEADERS = {
  'User-Agent':
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
  'Accept-Language': 'en-US,en;q=0.5',
};

/**
 * Extract og:image from HTML
 */
function extractOgImage(html) {
  // Try og:image first
  const ogMatch = html.match(/<meta\s+(?:property|name)=["']og:image["']\s+content=["']([^"']+)["']/i)
    || html.match(/content=["']([^"']+)["']\s+(?:property|name)=["']og:image["']/i);
  if (ogMatch) return ogMatch[1];

  // Amazon-specific: look for main product image
  const amzMatch = html.match(/"hiRes"\s*:\s*"(https:\/\/m\.media-amazon\.com\/images\/[^"]+)"/);
  if (amzMatch) return amzMatch[1];

  // Amazon landingImage
  const landingMatch = html.match(/id=["']landingImage["'][^>]*src=["']([^"']+)["']/);
  if (landingMatch) return landingMatch[1];

  // Rakuten: look for product image
  const rakutenMatch = html.match(/<meta\s+property=["']og:image["']\s+content=["']([^"']+)["']/i);
  if (rakutenMatch) return rakutenMatch[1];

  return null;
}

/**
 * Download image to local file
 */
async function downloadImage(url, destPath) {
  const res = await fetch(url, { headers: HEADERS, redirect: 'follow' });
  if (!res.ok) throw new Error(`Failed to download image: ${res.status}`);

  const buffer = Buffer.from(await res.arrayBuffer());
  fs.writeFileSync(destPath, buffer);
  return buffer.length;
}

/**
 * Process a single product
 */
async function processProduct(jsonFile) {
  const slug = path.basename(jsonFile, '.json');
  if (slug.startsWith('_')) return; // skip template

  const jsonPath = path.join(PRODUCTS_DIR, jsonFile);
  const data = JSON.parse(fs.readFileSync(jsonPath, 'utf-8'));

  // Skip if no buyUrl
  if (!data.buyUrl || data.buyUrl === 'https://www.amazon.co.jp') {
    console.log(`⏭  ${slug}: no specific buyUrl, skipping`);
    return;
  }

  // Skip if already has a local image
  if (data.image && data.image.startsWith('/images/')) {
    console.log(`✅ ${slug}: already has local image`);
    return;
  }

  const isAmazon = data.buyUrl.includes('amazon.co.jp') || data.buyUrl.includes('amazon.com');
  const isRakuten = data.buyUrl.includes('rakuten.co.jp');

  if (!isAmazon && !isRakuten) {
    console.log(`⏭  ${slug}: buyUrl is not Amazon/Rakuten, skipping`);
    return;
  }

  console.log(`🔍 ${slug}: fetching page ${data.buyUrl}...`);

  try {
    const res = await fetch(data.buyUrl, { headers: HEADERS, redirect: 'follow' });
    if (!res.ok) {
      console.log(`❌ ${slug}: failed to fetch page (${res.status})`);
      return;
    }

    const html = await res.text();
    const imageUrl = extractOgImage(html);

    if (!imageUrl) {
      console.log(`❌ ${slug}: could not find product image on page`);
      return;
    }

    console.log(`📸 ${slug}: found image, downloading...`);

    // Determine extension from URL
    const ext = imageUrl.match(/\.(jpg|jpeg|png|webp|gif)/i)?.[1] || 'jpg';
    const destFilename = `${slug}.${ext}`;
    const destPath = path.join(IMAGES_DIR, destFilename);

    const bytes = await downloadImage(imageUrl, destPath);
    const localPath = `/images/products/${destFilename}`;

    // Update JSON
    data.image = localPath;
    fs.writeFileSync(jsonPath, JSON.stringify(data, null, 2) + '\n');

    console.log(`✅ ${slug}: saved ${(bytes / 1024).toFixed(1)}KB → ${localPath}`);
  } catch (err) {
    console.log(`❌ ${slug}: error — ${err.message}`);
  }
}

// Main
const files = fs.readdirSync(PRODUCTS_DIR).filter((f) => f.endsWith('.json'));

if (targetSlug) {
  const file = `${targetSlug}.json`;
  if (files.includes(file)) {
    await processProduct(file);
  } else {
    console.log(`Product "${targetSlug}" not found.`);
  }
} else {
  console.log(`\n📦 Processing ${files.length} products...\n`);
  for (const file of files) {
    await processProduct(file);
  }
  console.log('\n✨ Done!\n');
}
