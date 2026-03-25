/**
 * Convert products.csv → individual JSON files in src/content/products/
 *
 * Usage:
 *   node scripts/csv-to-products.mjs
 *   node scripts/csv-to-products.mjs --fetch-images   (also fetch product images)
 *
 * CSV format:
 *   - First row = headers
 *   - Use | to separate list items (pros, cons)
 *   - Use key:value|key:value for specs
 *   - badge: "top-pick", "budget-pick", or empty
 *   - rank: number or empty
 *   - featured: true or false
 *
 * You can edit the CSV in Google Sheets, Excel, or any text editor.
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const CSV_PATH = path.join(__dirname, '..', 'products.csv');
const PRODUCTS_DIR = path.join(__dirname, '..', 'src', 'content', 'products');

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

function toProductJSON(row) {
  // Parse pipe-separated lists
  const parsePipeList = (val) =>
    val ? val.split('|').map((s) => s.trim()).filter(Boolean) : [];

  // Parse specs: "key:value|key:value"
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

  return {
    name: row.name || '',
    brand: row.brand || '',
    image: '', // will be filled by fetch-images script
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
}

// Main
const csvText = fs.readFileSync(CSV_PATH, 'utf-8');
const rows = csvToRows(csvText);

console.log(`\n📋 Found ${rows.length} products in CSV\n`);

let created = 0;
let updated = 0;

for (const row of rows) {
  if (!row.slug) {
    console.log(`⏭  Skipping row with no slug`);
    continue;
  }

  const product = toProductJSON(row);
  const jsonPath = path.join(PRODUCTS_DIR, `${row.slug}.json`);

  // If file exists, preserve the image field (don't overwrite local images)
  if (fs.existsSync(jsonPath)) {
    const existing = JSON.parse(fs.readFileSync(jsonPath, 'utf-8'));
    if (existing.image && existing.image.startsWith('/images/')) {
      product.image = existing.image;
    }
    updated++;
  } else {
    created++;
  }

  // Remove undefined values for clean JSON
  const clean = JSON.parse(JSON.stringify(product));

  fs.writeFileSync(jsonPath, JSON.stringify(clean, null, 2) + '\n');
  console.log(`${fs.existsSync(jsonPath) ? '✏️' : '✨'}  ${row.slug}`);
}

console.log(`\n✅ Done! ${created} created, ${updated} updated\n`);

// Optionally fetch images
if (process.argv.includes('--fetch-images')) {
  console.log('🖼️  Fetching images...\n');
  const { execSync } = await import('node:child_process');
  execSync('node scripts/fetch-images.mjs', { stdio: 'inherit', cwd: path.join(__dirname, '..') });
}
