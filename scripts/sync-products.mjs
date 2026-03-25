/**
 * Sync products from Google Drive CSV → website
 *
 * ONE COMMAND does everything:
 *   node scripts/sync-products.mjs
 *
 * What it does:
 *   1. Reads products.csv from Google Drive (g:/マイドライブ/Chartedly/products.csv)
 *   2. Creates/updates product JSON files in src/content/products/
 *   3. Downloads product images from imageUrl column
 *   4. Removes products that are no longer in CSV
 *
 * CSV columns:
 *   slug, name, brand, imageUrl, category, subcategory, type, price, score,
 *   rank, badge, buyUrl, pros, cons, specs, shortDescription, review, dateAdded, featured
 *
 * imageUrl: Paste the direct image URL here (right-click product image on Amazon → "Copy image address")
 * pros/cons: Separate items with | (e.g., "Good thing 1|Good thing 2")
 * specs: Use key:value pairs with | (e.g., "SPF:50+|Volume:50ml")
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const GDRIVE_CSV = 'g:/マイドライブ/Chartedly/products.csv';
const PRODUCTS_DIR = path.join(__dirname, '..', 'src', 'content', 'products');
const IMAGES_DIR = path.join(__dirname, '..', 'public', 'images', 'products');

fs.mkdirSync(IMAGES_DIR, { recursive: true });

// ── CSV Parser ──────────────────────────────────────────
function parseCSV(text) {
  const result = [];
  let fields = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (ch === '"') {
      if (inQuotes && text[i + 1] === '"') {
        current += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (ch === ',' && !inQuotes) {
      fields.push(current);
      current = '';
    } else if ((ch === '\n' || ch === '\r') && !inQuotes) {
      if (current || fields.length > 0) {
        fields.push(current);
        result.push(fields);
        fields = [];
        current = '';
      }
      if (ch === '\r' && text[i + 1] === '\n') i++;
    } else {
      current += ch;
    }
  }
  if (current || fields.length > 0) {
    fields.push(current);
    result.push(fields);
  }
  return result;
}

function csvToRows(text) {
  const rows = parseCSV(text);
  if (rows.length === 0) return [];
  const headers = rows[0].map((h) => h.trim());
  return rows.slice(1).map((cols) => {
    const obj = {};
    headers.forEach((h, i) => {
      obj[h] = (cols[i] || '').trim();
    });
    return obj;
  });
}

// ── Row → JSON ──────────────────────────────────────────
function toProductJSON(row) {
  const parsePipeList = (val) =>
    val ? val.split('|').map((s) => s.trim()).filter(Boolean) : [];

  const parseSpecs = (val) => {
    if (!val) return {};
    const specs = {};
    val.split('|').forEach((pair) => {
      const idx = pair.indexOf(':');
      if (idx > 0) {
        specs[pair.substring(0, idx).trim()] = pair.substring(idx + 1).trim();
      }
    });
    return specs;
  };

  // Build radar object if any radar values exist
  const radarQ = parseInt(row.radar_quality, 10);
  const radarV = parseInt(row.radar_value, 10);
  const radarP = parseInt(row.radar_popularity, 10);
  const radarE = parseInt(row.radar_ease, 10);
  const radarI = parseInt(row.radar_innovation, 10);
  const hasRadar = !isNaN(radarQ) && radarQ > 0;

  const product = {
    name: row.name || '',
    brand: row.brand || '',
    image: '',
    category: row.category || 'Beauty',
    subcategory: row.subcategory || 'Skincare',
    type: row.type || '',
    price: row.price || '',
    score: parseInt(row.score, 10) || 0,
    rank: row.rank ? parseInt(row.rank, 10) : undefined,
    badge: row.badge || undefined,
    buyUrl: row.buyUrl || '',
    pros: parsePipeList(row.pros),
    cons: parsePipeList(row.cons),
    specs: parseSpecs(row.specs),
    shortDescription: row.shortDescription || '',
    review: row.review || '',
    comparisonSlug: row.comparisonSlug || '',
    dateAdded: row.dateAdded || new Date().toISOString().split('T')[0],
    featured: row.featured === 'true',
  };

  if (hasRadar) {
    product.radar = {
      quality: radarQ || 70,
      value: radarV || 70,
      popularity: radarP || 70,
      ease: radarE || 70,
      innovation: radarI || 70,
    };
  }

  return product;
}

// ── Image Downloader ────────────────────────────────────
const HEADERS = {
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
  Accept: 'image/webp,image/*,*/*;q=0.8',
};

async function downloadImage(url, slug) {
  try {
    const res = await fetch(url, { headers: HEADERS, redirect: 'follow' });
    if (!res.ok) return null;

    const contentType = res.headers.get('content-type') || '';
    let ext = 'jpg';
    if (contentType.includes('png')) ext = 'png';
    else if (contentType.includes('webp')) ext = 'webp';
    else if (url.match(/\.(png|webp|gif)/i)) ext = url.match(/\.(png|webp|gif)/i)[1];

    const buffer = Buffer.from(await res.arrayBuffer());
    const filename = `${slug}.${ext}`;
    fs.writeFileSync(path.join(IMAGES_DIR, filename), buffer);
    return `/images/products/${filename}`;
  } catch {
    return null;
  }
}

// ── Main ────────────────────────────────────────────────
console.log('\n🔄 Syncing products from Google Drive...\n');

// 1. Read CSV
if (!fs.existsSync(GDRIVE_CSV)) {
  console.log(`❌ CSV not found: ${GDRIVE_CSV}`);
  process.exit(1);
}

const csvText = fs.readFileSync(GDRIVE_CSV, 'utf-8');
const rows = csvToRows(csvText);
console.log(`📋 Found ${rows.length} products in CSV\n`);

// 2. Track which slugs are in CSV
const csvSlugs = new Set();
let created = 0;
let updated = 0;
let imagesDownloaded = 0;

for (const row of rows) {
  if (!row.slug) continue;
  csvSlugs.add(row.slug);

  const product = toProductJSON(row);
  const jsonPath = path.join(PRODUCTS_DIR, `${row.slug}.json`);
  const isNew = !fs.existsSync(jsonPath);

  // Preserve existing local image if no new imageUrl provided
  if (!isNew) {
    const existing = JSON.parse(fs.readFileSync(jsonPath, 'utf-8'));
    if (existing.image && existing.image.startsWith('/images/') && !row.imageUrl) {
      product.image = existing.image;
    }
  }

  // Download image from imageUrl if provided
  if (row.imageUrl) {
    process.stdout.write(`📸 ${row.slug}: downloading image... `);
    const localPath = await downloadImage(row.imageUrl, row.slug);
    if (localPath) {
      product.image = localPath;
      imagesDownloaded++;
      console.log('✅');
    } else {
      console.log('❌ failed');
      // Fallback to placeholder
      if (!product.image) {
        product.image = `https://picsum.photos/seed/${row.slug}/400/600`;
      }
    }
  } else if (!product.image) {
    // No imageUrl and no existing image → placeholder
    product.image = `https://picsum.photos/seed/${row.slug}/400/600`;
  }

  const clean = JSON.parse(JSON.stringify(product));
  fs.writeFileSync(jsonPath, JSON.stringify(clean, null, 2) + '\n');

  if (isNew) {
    console.log(`✨ ${row.slug} (new)`);
    created++;
  } else {
    console.log(`✏️  ${row.slug}`);
    updated++;
  }
}

// 3. Remove products not in CSV (cleanup)
const existingFiles = fs.readdirSync(PRODUCTS_DIR).filter((f) => f.endsWith('.json'));
let removed = 0;
for (const file of existingFiles) {
  const slug = file.replace('.json', '');
  if (slug.startsWith('_')) continue;
  if (!csvSlugs.has(slug)) {
    fs.unlinkSync(path.join(PRODUCTS_DIR, file));
    console.log(`🗑️  ${slug} (removed — not in CSV)`);
    removed++;
  }
}

console.log(`
✅ Sync complete!
   ${created} new | ${updated} updated | ${removed} removed | ${imagesDownloaded} images downloaded
`);
