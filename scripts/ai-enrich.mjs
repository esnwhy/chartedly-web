/**
 * AI Product Enrichment Pipeline
 *
 * Takes rakuten-discoveries.csv and generates complete Chartedly product data:
 *   - Clean English product names
 *   - Original editorial scores (0-100)
 *   - Radar chart scores (quality, value, popularity, ease, innovation)
 *   - Pros and cons (3 each)
 *   - Short description
 *   - Review text
 *   - Clean slug
 *
 * Usage:
 *   node scripts/ai-enrich.mjs                    # Process all unprocessed products
 *   node scripts/ai-enrich.mjs --limit 10         # Process 10 products
 *   node scripts/ai-enrich.mjs --category Beauty  # Only Beauty category
 *   node scripts/ai-enrich.mjs --dry-run          # Preview without writing
 *
 * Output:
 *   Writes enriched products directly to products.csv (appends)
 *   Then run: node scripts/sync-products.mjs
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const GDRIVE_DIR_WIN = 'g:/マイドライブ/Chartedly';
const LOCAL_DATA_DIR = path.join(__dirname, '..', 'data');
const GDRIVE_DIR = fs.existsSync(GDRIVE_DIR_WIN) ? GDRIVE_DIR_WIN : LOCAL_DATA_DIR;
if (!fs.existsSync(GDRIVE_DIR)) fs.mkdirSync(GDRIVE_DIR, { recursive: true });
const DISCOVERIES_CSV = path.join(GDRIVE_DIR, 'rakuten-discoveries.csv');
const YAHOO_DISCOVERIES_CSV = path.join(GDRIVE_DIR, 'yahoo-discoveries.csv');
const PRODUCTS_CSV = path.join(GDRIVE_DIR, 'products.csv');
const PROGRESS_FILE = path.join(GDRIVE_DIR, 'enrich-progress.json');

const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY || '';

if (!ANTHROPIC_API_KEY) {
  console.log('❌ Set ANTHROPIC_API_KEY environment variable');
  process.exit(1);
}

// ── Args ───────────────────────────────────────────────
const args = process.argv.slice(2);
const getArg = (flag) => { const i = args.indexOf(flag); return i >= 0 ? args[i + 1] : null; };
const limitArg = getArg('--limit');
const categoryArg = getArg('--category');
const dryRun = args.includes('--dry-run');
const rescoreAll = args.includes('--rescore');  // Re-score ALL existing products
const maxProducts = limitArg ? parseInt(limitArg, 10) : 999;

// ── CSV Parser ─────────────────────────────────────────
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

// ── Load Existing Slugs ────────────────────────────────
function loadExistingSlugs() {
  const slugs = new Set();
  if (!fs.existsSync(PRODUCTS_CSV)) return slugs;
  const rows = csvToRows(fs.readFileSync(PRODUCTS_CSV, 'utf-8'));
  for (const r of rows) { if (r.slug) slugs.add(r.slug); }
  return slugs;
}

// ── Load Progress ──────────────────────────────────────
function loadProgress() {
  if (fs.existsSync(PROGRESS_FILE)) {
    return JSON.parse(fs.readFileSync(PROGRESS_FILE, 'utf-8'));
  }
  return { processed: [] };
}

function saveProgress(progress) {
  fs.writeFileSync(PROGRESS_FILE, JSON.stringify(progress, null, 2));
}

// ── Claude API Call ────────────────────────────────────
async function callClaude(prompt) {
  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': ANTHROPIC_API_KEY,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 1500,
      messages: [{ role: 'user', content: prompt }],
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Claude API error ${res.status}: ${err}`);
  }

  const data = await res.json();
  return data.content?.[0]?.text || '';
}

// ── Batch Enrichment Prompt ────────────────────────────
function buildEnrichPrompt(products) {
  const productList = products.map((p, i) =>
    `${i + 1}. "${p.name}" by ${p.brand} — ${p.category} > ${p.subcategory} > ${p.type} — ${p.price} — Rakuten reviews: ${p.reviewAverage}★ (${p.reviewCount} reviews)`
  ).join('\n');

  return `You are the editorial AI for Chartedly.com — a product comparison site for English-speaking foreigners living in Japan (expats, tourists, newcomers).

For each product below, generate ORIGINAL editorial content. Your scores should be your own assessment based on the product's reputation, reviews, price-performance, and market position in Japan.

Products to process:
${productList}

For EACH product, output a JSON object with these fields:
- "index": (the number from the list above)
- "name_en": Clean English product name (max 60 chars, remove marketing keywords, keep brand + product name + key variant)
- "slug": URL-friendly slug (lowercase, hyphens, max 40 chars, e.g., "anessa-perfect-uv-milk")
- "brand_clean": Clean brand name in English
- "score": Overall score 0-100 (your editorial assessment)
- "radar": { "quality": 0-100, "value": 0-100, "popularity": 0-100, "ease": 0-100, "innovation": 0-100 }
  - quality: build quality, ingredients, effectiveness
  - value: price-to-performance ratio (high = great value)
  - popularity: how well-known and loved in Japan
  - ease: ease of use, accessibility for foreigners
  - innovation: unique features, standout technology
- "badge": "top-pick" if genuinely the best in its type, "budget-pick" if best value, or null
- "pros": Array of exactly 3 pros (short, specific, English)
- "cons": Array of exactly 2 cons (honest, specific, English)
- "shortDescription": One sentence (max 120 chars) for card display
- "review": 2-3 sentence review for foreigners in Japan. Mention what makes it stand out. Be honest and practical.
- "type_refined": Specific product type in English (e.g., "Sunscreen", "Moisturizer", "Rice Cooker", "Hair Dryer")

RULES:
- Scores must be YOUR original editorial assessment, not copied from any source
- Be honest — not everything is 90+. Average products get 65-75.
- Radar scores should vary — a cheap product has high "value" but maybe lower "quality"
- For foreigners: mention if instructions are Japanese-only, if it's easy to find in stores, etc.
- Pros/cons must be specific and useful, not generic
- Product names in English. If it's a Japanese-only name, transliterate it.
- If you don't know a product well enough, score it conservatively (70-75 range)

Output a valid JSON array ONLY. No additional text.
[{ "index": 1, ... }, { "index": 2, ... }, ...]`;
}

// ── CSV Helpers ────────────────────────────────────────
function escapeCSV(val) {
  const str = String(val ?? '');
  if (str.includes(',') || str.includes('"') || str.includes('\n') || str.includes('|')) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

const PRODUCT_CSV_HEADERS = [
  'slug', 'name', 'brand', 'imageUrl', 'category', 'subcategory', 'type',
  'price', 'score', 'rank', 'badge', 'buyUrl', 'pros', 'cons', 'specs',
  'shortDescription', 'review', 'dateAdded', 'featured',
  'radar_quality', 'radar_value', 'radar_popularity', 'radar_ease', 'radar_innovation',
];

function enrichedToCSVRow(enriched, original) {
  return [
    enriched.slug,
    enriched.name_en,
    enriched.brand_clean,
    original.imageUrl || '',
    original.category,
    original.subcategory,
    enriched.type_refined || original.type,
    original.price,
    enriched.score,
    '', // rank — will be assigned later
    enriched.badge || '',
    original.buyUrl,
    (enriched.pros || []).join('|'),
    (enriched.cons || []).join('|'),
    '', // specs
    enriched.shortDescription,
    enriched.review,
    new Date().toISOString().split('T')[0],
    'false',
    enriched.radar?.quality || 70,
    enriched.radar?.value || 70,
    enriched.radar?.popularity || 70,
    enriched.radar?.ease || 70,
    enriched.radar?.innovation || 70,
  ].map(escapeCSV).join(',');
}

// ── Main ───────────────────────────────────────────────
console.log('\n🤖 AI Product Enrichment Pipeline\n');

// Load discoveries from Rakuten + Yahoo
let discoveries = [];

if (fs.existsSync(DISCOVERIES_CSV)) {
  const rakutenRows = csvToRows(fs.readFileSync(DISCOVERIES_CSV, 'utf-8'));
  discoveries.push(...rakutenRows);
  console.log(`📋 ${rakutenRows.length} products in rakuten-discoveries.csv`);
}

if (fs.existsSync(YAHOO_DISCOVERIES_CSV)) {
  const yahooRows = csvToRows(fs.readFileSync(YAHOO_DISCOVERIES_CSV, 'utf-8'));
  discoveries.push(...yahooRows);
  console.log(`📋 ${yahooRows.length} products in yahoo-discoveries.csv`);
}

if (discoveries.length === 0) {
  console.log('❌ No discoveries found. Run fetch-rakuten.mjs or fetch-yahoo.mjs first.');
  process.exit(1);
}

console.log(`📋 ${discoveries.length} total products to consider`);

// Filter already processed
const existingSlugs = loadExistingSlugs();
const progress = loadProgress();
const processedCodes = new Set(progress.processed);

let toProcess;
if (rescoreAll) {
  // Re-score mode: process ALL products in discoveries (even already enriched)
  console.log('🔄 RESCORE MODE: Re-evaluating ALL products with latest data\n');
  // Clear progress so all get re-processed
  progress.processed = [];
  toProcess = discoveries.filter((d) => d.rakutenItemCode || d.slug);
} else {
  // Normal mode: only new products
  toProcess = discoveries.filter((d) => {
    const itemKey = d.rakutenItemCode || d.slug || '';
    if (!itemKey) return false;
    if (processedCodes.has(itemKey)) return false;
    return true;
  });
}

if (categoryArg) {
  toProcess = toProcess.filter((d) => d.category === categoryArg);
}

toProcess = toProcess.slice(0, maxProducts);

console.log(`🎯 ${toProcess.length} products to enrich (${existingSlugs.size} already in products.csv)\n`);

if (toProcess.length === 0) {
  console.log('✅ All products already processed!');
  process.exit(0);
}

// Process in batches of 5 (to keep Claude responses manageable)
const BATCH_SIZE = 5;
const allEnriched = [];
let batchNum = 0;

for (let i = 0; i < toProcess.length; i += BATCH_SIZE) {
  const batch = toProcess.slice(i, i + BATCH_SIZE);
  batchNum++;

  console.log(`\n📦 Batch ${batchNum} (${batch.length} products)`);
  batch.forEach((p, j) => console.log(`   ${i + j + 1}. ${p.name.substring(0, 60)}`));

  if (dryRun) {
    console.log('   [dry-run: skipping API call]');
    continue;
  }

  try {
    const prompt = buildEnrichPrompt(batch);
    console.log('   🤖 Calling Claude...');

    const response = await callClaude(prompt);

    // Parse JSON from response — with cleanup for common LLM issues
    let jsonText = response;
    const jsonMatch = response.match(/\[[\s\S]*\]/);
    if (!jsonMatch) {
      console.log('   ❌ No JSON in response, skipping batch');
      continue;
    }
    jsonText = jsonMatch[0];

    // Fix common JSON issues from LLMs
    jsonText = jsonText
      .replace(/,\s*}/g, '}')         // trailing commas in objects
      .replace(/,\s*\]/g, ']')        // trailing commas in arrays
      .replace(/[\x00-\x1f]/g, ' ')   // control chars
      .replace(/\t/g, ' ');           // tabs

    let enrichedBatch;
    try {
      enrichedBatch = JSON.parse(jsonText);
    } catch (parseErr) {
      // Try to extract individual objects if full array fails
      console.log(`   ⚠️  JSON parse error, attempting recovery...`);
      const objMatches = [...jsonText.matchAll(/\{[^{}]*(?:\{[^{}]*\}[^{}]*)*\}/g)];
      if (objMatches.length > 0) {
        enrichedBatch = [];
        for (const m of objMatches) {
          try {
            const obj = JSON.parse(m[0].replace(/,\s*}/g, '}'));
            if (obj.index) enrichedBatch.push(obj);
          } catch { /* skip malformed object */ }
        }
        console.log(`   🔧 Recovered ${enrichedBatch.length}/${batch.length} products`);
      } else {
        console.log(`   ❌ Could not parse response, skipping batch`);
        continue;
      }
    }

    for (const enriched of enrichedBatch) {
      const idx = enriched.index - 1;
      if (idx < 0 || idx >= batch.length) continue;

      const original = batch[idx];

      // Check for slug collision
      if (existingSlugs.has(enriched.slug)) {
        enriched.slug = enriched.slug + '-2';
      }
      existingSlugs.add(enriched.slug);

      allEnriched.push({ enriched, original });

      // Track progress
      progress.processed.push(original.rakutenItemCode || original.slug);

      console.log(`   ✅ ${enriched.name_en} — Score: ${enriched.score} | Radar: Q${enriched.radar?.quality} V${enriched.radar?.value} P${enriched.radar?.popularity}`);
    }

    // Save progress after each batch
    saveProgress(progress);

    // Rate limit: wait between batches
    if (i + BATCH_SIZE < toProcess.length) {
      console.log('   ⏳ Waiting 2s (rate limit)...');
      await new Promise((r) => setTimeout(r, 2000));
    }
  } catch (err) {
    console.log(`   ❌ Batch error: ${err.message}`);
    // Save progress so we can resume
    saveProgress(progress);
  }
}

if (dryRun) {
  console.log('\n🏁 Dry run complete. No files written.');
  process.exit(0);
}

// Write to products.csv
if (allEnriched.length > 0) {
  // Check if products.csv exists and has the radar columns
  let existingCSV = '';
  if (fs.existsSync(PRODUCTS_CSV)) {
    existingCSV = fs.readFileSync(PRODUCTS_CSV, 'utf-8');
  }

  // If CSV doesn't have radar columns, we need to handle that
  const hasRadarColumns = existingCSV.includes('radar_quality');

  if (!existingCSV || existingCSV.trim().length === 0) {
    // New file — write headers + data
    const lines = [PRODUCT_CSV_HEADERS.join(',')];
    for (const { enriched, original } of allEnriched) {
      lines.push(enrichedToCSVRow(enriched, original));
    }
    fs.writeFileSync(PRODUCTS_CSV, lines.join('\n') + '\n', 'utf-8');
  } else {
    // Append to existing CSV
    // If existing CSV doesn't have radar columns, add to first line
    if (!hasRadarColumns) {
      const lines = existingCSV.split('\n');
      lines[0] = lines[0].trimEnd() + ',radar_quality,radar_value,radar_popularity,radar_ease,radar_innovation';
      // Add empty radar values to existing rows
      for (let j = 1; j < lines.length; j++) {
        if (lines[j].trim()) {
          lines[j] = lines[j].trimEnd() + ',,,,,';
        }
      }
      existingCSV = lines.join('\n');
      fs.writeFileSync(PRODUCTS_CSV, existingCSV, 'utf-8');
    }

    // Now append new products
    const newLines = [];
    for (const { enriched, original } of allEnriched) {
      newLines.push(enrichedToCSVRow(enriched, original));
    }
    fs.appendFileSync(PRODUCTS_CSV, newLines.join('\n') + '\n', 'utf-8');
  }

  console.log(`\n✅ ${allEnriched.length} products enriched and added to products.csv!`);
} else {
  console.log('\n⚠️  No products were enriched.');
}

console.log(`
╔══════════════════════════════════════════════════╗
║  Done! Next step:                                ║
║    node scripts/sync-products.mjs                ║
║                                                  ║
║  To resume if interrupted:                       ║
║    node scripts/ai-enrich.mjs                    ║
║    (progress saved automatically)                ║
╚══════════════════════════════════════════════════╝
`);
