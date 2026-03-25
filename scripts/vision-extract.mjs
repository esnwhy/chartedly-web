/**
 * Claude Vision: Magazine Screenshot → Product Data
 *
 * Extracts product information from Japanese magazine screenshots
 * (LDK, MONOQLO, 家電批評, etc.)
 *
 * Usage:
 *   node scripts/vision-extract.mjs <image_path>
 *   node scripts/vision-extract.mjs "g:/マイドライブ/Chartedly/screenshots/ldk-sunscreen.png"
 *   node scripts/vision-extract.mjs screenshot.jpg --category Beauty --subcategory Skincare --type Sunscreen
 *
 * Output:
 *   - Prints extracted products as JSON
 *   - Appends to g:/マイドライブ/Chartedly/magazine-discoveries.csv
 *
 * Requirements:
 *   Set ANTHROPIC_API_KEY in environment or .env file
 *
 * IMPORTANT — Legal note:
 *   This script extracts PRODUCT NAMES and FACTUAL SPECS only.
 *   Magazine editorial scores, rankings, and review text are NOT published on Chartedly.
 *   All scores and reviews on Chartedly are original editorial content.
 *   Magazine data is used for product DISCOVERY only.
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const GDRIVE_DIR = 'g:/マイドライブ/Chartedly';
const DISCOVERIES_CSV = path.join(GDRIVE_DIR, 'magazine-discoveries.csv');

const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY || '';

// ── Parse Args ─────────────────────────────────────────
const args = process.argv.slice(2);
const imagePath = args.find((a) => !a.startsWith('--'));
const getArg = (flag) => {
  const idx = args.indexOf(flag);
  return idx >= 0 ? args[idx + 1] : null;
};

const categoryOverride = getArg('--category');
const subcategoryOverride = getArg('--subcategory');
const typeOverride = getArg('--type');

if (!imagePath) {
  console.log(`
╔══════════════════════════════════════════════════════════════╗
║  Magazine Screenshot → Product Discovery                     ║
║                                                              ║
║  Usage:                                                      ║
║    node scripts/vision-extract.mjs <image_path>              ║
║                                                              ║
║  Options:                                                    ║
║    --category Beauty          Category override              ║
║    --subcategory Skincare     Subcategory override            ║
║    --type Sunscreen           Type override                   ║
║                                                              ║
║  Examples:                                                   ║
║    node scripts/vision-extract.mjs screenshot.png            ║
║    node scripts/vision-extract.mjs ldk-page.jpg \\            ║
║      --category Beauty --subcategory Skincare                ║
║                                                              ║
║  Requires: ANTHROPIC_API_KEY environment variable            ║
╚══════════════════════════════════════════════════════════════╝
`);
  process.exit(1);
}

if (!ANTHROPIC_API_KEY) {
  console.log('❌ ANTHROPIC_API_KEY not set. Set it in your environment or .env file.');
  process.exit(1);
}

// ── Read Image ─────────────────────────────────────────
const absPath = path.resolve(imagePath);
if (!fs.existsSync(absPath)) {
  console.log(`❌ Image not found: ${absPath}`);
  process.exit(1);
}

const imageBuffer = fs.readFileSync(absPath);
const base64Image = imageBuffer.toString('base64');
const ext = path.extname(absPath).toLowerCase();
const mediaType = ext === '.png' ? 'image/png'
  : ext === '.webp' ? 'image/webp'
  : ext === '.gif' ? 'image/gif'
  : 'image/jpeg';

console.log(`\n📸 Processing: ${path.basename(absPath)}`);
console.log(`   Size: ${(imageBuffer.length / 1024).toFixed(0)} KB\n`);

// ── Claude Vision Extraction Prompt ────────────────────
const EXTRACTION_PROMPT = `You are extracting product information from a Japanese magazine page (LDK, MONOQLO, 家電批評, or similar).

Extract ALL products visible on this page. For each product, output:

- "name_ja": The product name in Japanese (exact as printed)
- "name_en": English translation/transliteration of the product name
- "brand": The brand/manufacturer name
- "model": Model number if visible (e.g., "NA-LX129AL")
- "price_approx": Approximate price if shown (in yen, e.g., "¥2,000")
- "category_guess": Your best guess for product category (e.g., "Beauty", "Electronics", "Kitchen")
- "subcategory_guess": Subcategory (e.g., "Skincare", "Home Appliances")
- "type_guess": Specific product type (e.g., "Sunscreen", "Rice Cooker", "Hair Dryer")
- "key_features": Array of 2-3 key features/specs mentioned (translated to English)
- "source_magazine": Which magazine this appears to be from (LDK, MONOQLO, 家電批評, etc.)

IMPORTANT RULES:
- Extract ONLY factual product identifiers (names, brands, model numbers, specs)
- Do NOT extract editorial scores, rankings, or review opinions from the magazine
- These are for product DISCOVERY only — Chartedly writes its own editorial content
- If text is unclear, mark with [unclear] rather than guessing
- Output valid JSON array only, no additional text

${categoryOverride ? `\nContext: This page is from the ${categoryOverride} > ${subcategoryOverride || ''} > ${typeOverride || ''} section.` : ''}

Output format:
[
  {
    "name_ja": "...",
    "name_en": "...",
    "brand": "...",
    "model": "...",
    "price_approx": "...",
    "category_guess": "...",
    "subcategory_guess": "...",
    "type_guess": "...",
    "key_features": ["...", "..."],
    "source_magazine": "..."
  }
]`;

// ── Call Claude API ────────────────────────────────────
console.log('🤖 Sending to Claude Vision...\n');

const response = await fetch('https://api.anthropic.com/v1/messages', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'x-api-key': ANTHROPIC_API_KEY,
    'anthropic-version': '2023-06-01',
  },
  body: JSON.stringify({
    model: 'claude-sonnet-4-5-20241022',
    max_tokens: 4096,
    messages: [{
      role: 'user',
      content: [
        {
          type: 'image',
          source: {
            type: 'base64',
            media_type: mediaType,
            data: base64Image,
          },
        },
        {
          type: 'text',
          text: EXTRACTION_PROMPT,
        },
      ],
    }],
  }),
});

if (!response.ok) {
  const err = await response.text();
  console.log(`❌ Claude API error ${response.status}: ${err}`);
  process.exit(1);
}

const result = await response.json();
const text = result.content?.[0]?.text || '';

// ── Parse JSON from response ───────────────────────────
let products;
try {
  // Extract JSON array from response (Claude sometimes wraps in markdown)
  const jsonMatch = text.match(/\[[\s\S]*\]/);
  if (!jsonMatch) throw new Error('No JSON array found in response');
  products = JSON.parse(jsonMatch[0]);
} catch (err) {
  console.log('❌ Failed to parse Claude response as JSON:');
  console.log(text);
  process.exit(1);
}

console.log(`✅ Extracted ${products.length} products:\n`);

// ── Display Results ────────────────────────────────────
for (let i = 0; i < products.length; i++) {
  const p = products[i];
  console.log(`  ${i + 1}. ${p.name_en || p.name_ja}`);
  console.log(`     Brand: ${p.brand} | Model: ${p.model || 'N/A'} | ${p.price_approx || 'Price N/A'}`);
  console.log(`     Category: ${p.category_guess} > ${p.subcategory_guess} > ${p.type_guess}`);
  if (p.key_features?.length) {
    console.log(`     Features: ${p.key_features.join(', ')}`);
  }
  console.log();
}

// ── Save to CSV ────────────────────────────────────────
function escapeCSV(val) {
  const str = String(val ?? '');
  if (str.includes(',') || str.includes('"') || str.includes('\n')) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

const CSV_HEADERS = [
  'name_ja', 'name_en', 'brand', 'model', 'price_approx',
  'category', 'subcategory', 'type', 'key_features',
  'source_magazine', 'source_image', 'date_extracted',
];

const isNewFile = !fs.existsSync(DISCOVERIES_CSV);
const lines = [];
if (isNewFile) {
  lines.push(CSV_HEADERS.join(','));
}

for (const p of products) {
  const row = [
    p.name_ja,
    p.name_en,
    p.brand,
    p.model || '',
    p.price_approx || '',
    categoryOverride || p.category_guess || '',
    subcategoryOverride || p.subcategory_guess || '',
    typeOverride || p.type_guess || '',
    (p.key_features || []).join('|'),
    p.source_magazine || '',
    path.basename(absPath),
    new Date().toISOString().split('T')[0],
  ];
  lines.push(row.map(escapeCSV).join(','));
}

fs.appendFileSync(DISCOVERIES_CSV, lines.join('\n') + '\n', 'utf-8');

console.log(`💾 Saved to: ${DISCOVERIES_CSV}`);
console.log(`
╔══════════════════════════════════════════════════╗
║  Next steps:                                     ║
║  1. Review magazine-discoveries.csv              ║
║  2. Search Amazon JP for each product            ║
║  3. Get ASIN and construct buy URL               ║
║  4. Add to products.csv with your own score,     ║
║     pros, cons, and review                       ║
║  5. Run: node scripts/sync-products.mjs          ║
╚══════════════════════════════════════════════════╝
`);
