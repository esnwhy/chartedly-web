/**
 * Smart Deduplication Filter for Chartedly Products
 *
 * Identifies and removes duplicate/variation products:
 *   - Refills, bulk packs, trial/sample/mini sizes
 *   - Sets (unless it's the only version)
 *   - Large quantity packs (2個, 3pack, etc.)
 *   - Replacement cartridges, large-size variants
 *
 * For fuzzy-matched duplicates (same brand + similar name),
 * keeps the one with the highest score, most reviews, or shortest name.
 *
 * Usage:
 *   node scripts/dedup-products.mjs --dry-run     # Preview removals
 *   node scripts/dedup-products.mjs --force        # Actually delete
 *   node scripts/dedup-products.mjs --dry-run --verbose  # Extra detail
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PRODUCTS_DIR = path.join(__dirname, '..', 'src', 'content', 'products');
const GDRIVE_DIR_WIN = 'g:/マイドライブ/Chartedly';
const LOCAL_DATA_DIR = path.join(__dirname, '..', 'data');
const GDRIVE_DIR = fs.existsSync(GDRIVE_DIR_WIN) ? GDRIVE_DIR_WIN : LOCAL_DATA_DIR;
if (!fs.existsSync(GDRIVE_DIR)) fs.mkdirSync(GDRIVE_DIR, { recursive: true });
const PRODUCTS_CSV = path.join(GDRIVE_DIR, 'products.csv');
const DISCOVERIES_CSV = path.join(GDRIVE_DIR, 'rakuten-discoveries.csv');
const YAHOO_DISCOVERIES_CSV = path.join(GDRIVE_DIR, 'yahoo-discoveries.csv');
const BACKUP_FILE = path.join(GDRIVE_DIR, 'dedup-removed.json');

// ── Export filter functions (for use by other scripts) ─
/**
 * Check if a product name should be filtered out.
 * Returns the reason string if it should be filtered, or null if it should be kept.
 */
export function shouldFilter(name, slug) {
  return getFilterReason(name, slug || '');
}

/**
 * Check if two products are fuzzy duplicates (same brand + similar name).
 * Returns true if they appear to be duplicates.
 */
export function isFuzzyDuplicate(nameA, nameB) {
  const na = normalizeName(nameA);
  const nb = normalizeName(nameB);
  const dist = levenshtein(na, nb);
  return dist < 5 || na.includes(nb) || nb.includes(na);
}

// ── Guard: only run main logic when invoked directly ──
const isMainScript = process.argv[1] && (
  process.argv[1].endsWith('dedup-products.mjs') ||
  process.argv[1].includes('dedup-products')
);

if (!isMainScript) {
  // Imported as a module — skip main execution
} else {

// ── Args ───────────────────────────────────────────────
const args = process.argv.slice(2);
const dryRun = args.includes('--dry-run');
const force = args.includes('--force');
const verbose = args.includes('--verbose');

if (!dryRun && !force) {
  console.log(`
Usage:
  node scripts/dedup-products.mjs --dry-run     Preview what would be removed
  node scripts/dedup-products.mjs --force        Actually remove duplicates
  node scripts/dedup-products.mjs --dry-run --verbose  Extra detail
`);
  process.exit(0);
}

// ── Variation/Junk Patterns ───────────────────────────
const FILTER_PATTERNS = [
  // Refills
  /詰め替え/i, /詰替/i, /リフィル/i, /レフィル/i, /refill/i,
  // Sets and gift sets (flagged, but only removed if non-unique)
  /ギフトセット/i, /gift\s*set/i,
  // Bulk / case buying
  /ケース/i, /箱買い/i, /まとめ買い/i, /bulk/i, /\bcase\b/i,
  // Quantity patterns: 2個, 3本, 6pack, etc.
  /[2-9]\d*個/i, /[2-9]\d*本/i, /[2-9]\d*枚/i, /[2-9]\d*袋/i, /[2-9]\d*箱/i,
  /\d+\s*pack/i, /\d+-pack/i,
  // Trial / sample / mini
  /お試し/i, /トライアル/i, /trial/i, /sample/i, /ミニ/i, /\bmini\b/i,
  // Large size
  /大容量/i,
  // Replacement / cartridge
  /交換用/i, /替え刃/i, /replacement/i,
];

// Set patterns — only filter if there's a non-set version
const SET_PATTERNS = [
  /セット/i, /\bset\b/i,
];

// Cartridge / filter patterns — separate because some are the main product
const CARTRIDGE_PATTERNS = [
  /カートリッジ/i, /cartridge/i, /フィルター交換/i,
];

// ── Levenshtein Distance ──────────────────────────────
function levenshtein(a, b) {
  const m = a.length, n = b.length;
  if (m === 0) return n;
  if (n === 0) return m;

  const dp = Array.from({ length: m + 1 }, () => new Array(n + 1));
  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      dp[i][j] = a[i - 1] === b[j - 1]
        ? dp[i - 1][j - 1]
        : 1 + Math.min(dp[i - 1][j - 1], dp[i - 1][j], dp[i][j - 1]);
    }
  }
  return dp[m][n];
}

// ── CSV Helpers ───────────────────────────────────────
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

function escapeCSV(val) {
  const str = String(val ?? '');
  if (str.includes(',') || str.includes('"') || str.includes('\n') || str.includes('|')) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

// ── Load Products ─────────────────────────────────────
function loadProductJSONs() {
  const products = [];
  const files = fs.readdirSync(PRODUCTS_DIR).filter((f) => f.endsWith('.json') && !f.startsWith('_'));

  for (const file of files) {
    try {
      const slug = file.replace('.json', '');
      const data = JSON.parse(fs.readFileSync(path.join(PRODUCTS_DIR, file), 'utf-8'));
      products.push({ slug, ...data });
    } catch { /* skip malformed */ }
  }
  return products;
}

// ── Pattern Matching ──────────────────────────────────
function matchesPatterns(name, patterns) {
  return patterns.some((p) => p.test(name));
}

function getFilterReason(name, slug) {
  // Check direct filter patterns
  if (/詰め替え|詰替|リフィル|レフィル|refill/i.test(name)) return 'refill';
  if (/ケース|箱買い|まとめ買い|bulk|\bcase\b/i.test(name)) return 'bulk';
  if (/[2-9]\d*個|[2-9]\d*本|[2-9]\d*枚|[2-9]\d*袋|[2-9]\d*箱|\d+\s*pack|\d+-pack/i.test(name) || /\d+pack/i.test(slug)) return 'quantity-pack';
  if (/お試し|トライアル|trial|sample/i.test(name)) return 'trial/sample';
  if (/ミニ|\bmini\b/i.test(name)) return 'mini';
  if (/大容量/i.test(name)) return 'large-size';
  if (/交換用|替え刃|replacement/i.test(name)) return 'replacement';
  if (/ギフトセット|gift\s*set/i.test(name)) return 'gift-set';
  return null;
}

// ── Normalize for comparison ──────────────────────────
function normalizeName(name) {
  return name
    .toLowerCase()
    .replace(/[（）\(\)\[\]【】「」『』]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

// ── Main ──────────────────────────────────────────────
console.log('\n🔍 Chartedly Product Deduplication Filter\n');
console.log(dryRun ? '   Mode: DRY RUN (preview only)\n' : '   Mode: FORCE (will delete files)\n');

const products = loadProductJSONs();
console.log(`📋 Loaded ${products.length} products from ${PRODUCTS_DIR}\n`);

const toRemove = new Map(); // slug → reason

// ── Step 1: Pattern-based filtering ───────────────────
console.log('── Step 1: Pattern-based filtering ──\n');

for (const p of products) {
  const reason = getFilterReason(p.name, p.slug);
  if (reason) {
    toRemove.set(p.slug, { reason: `pattern: ${reason}`, name: p.name, brand: p.brand, score: p.score });
  }
}

// Check set patterns — only remove if there's a non-set version from same brand
const setProducts = products.filter((p) => matchesPatterns(p.name, SET_PATTERNS) && !toRemove.has(p.slug));
for (const sp of setProducts) {
  const hasNonSet = products.some((p) =>
    p.slug !== sp.slug &&
    p.brand === sp.brand &&
    !matchesPatterns(p.name, SET_PATTERNS) &&
    !toRemove.has(p.slug)
  );
  if (hasNonSet) {
    toRemove.set(sp.slug, { reason: 'pattern: set (non-set version exists)', name: sp.name, brand: sp.brand, score: sp.score });
  }
}

// Check cartridge patterns — only remove if there's a non-cartridge version from same brand
const cartridgeProducts = products.filter((p) => matchesPatterns(p.name, CARTRIDGE_PATTERNS) && !toRemove.has(p.slug));
for (const cp of cartridgeProducts) {
  const hasNonCartridge = products.some((p) =>
    p.slug !== cp.slug &&
    p.brand === cp.brand &&
    !matchesPatterns(p.name, CARTRIDGE_PATTERNS) &&
    !toRemove.has(p.slug)
  );
  if (hasNonCartridge) {
    toRemove.set(cp.slug, { reason: 'pattern: cartridge (main product exists)', name: cp.name, brand: cp.brand, score: cp.score });
  }
}

// Print Step 1 results
const patternRemovals = [...toRemove.entries()];
if (patternRemovals.length > 0) {
  console.log(`   Found ${patternRemovals.length} products matching filter patterns:\n`);
  for (const [slug, info] of patternRemovals) {
    console.log(`   ✂️  ${slug}`);
    console.log(`       "${info.name}" (${info.brand}) — ${info.reason}`);
  }
} else {
  console.log('   No pattern matches found.');
}

// ── Step 2: Fuzzy duplicate detection ─────────────────
console.log('\n── Step 2: Fuzzy duplicate detection ──\n');

const remaining = products.filter((p) => !toRemove.has(p.slug));
const brandGroups = new Map();
for (const p of remaining) {
  const brandKey = (p.brand || 'unknown').toLowerCase().trim();
  if (!brandGroups.has(brandKey)) brandGroups.set(brandKey, []);
  brandGroups.get(brandKey).push(p);
}

let fuzzyCount = 0;
for (const [brand, group] of brandGroups) {
  if (group.length < 2) continue;

  // Compare all pairs
  for (let i = 0; i < group.length; i++) {
    for (let j = i + 1; j < group.length; j++) {
      const a = group[i];
      const b = group[j];
      if (toRemove.has(a.slug) || toRemove.has(b.slug)) continue;

      const na = normalizeName(a.name);
      const nb = normalizeName(b.name);

      const dist = levenshtein(na, nb);
      const oneContainsOther = na.includes(nb) || nb.includes(na);

      if (dist < 5 || oneContainsOther) {
        // Pick the better one to keep
        const scoreA = a.score || 0;
        const scoreB = b.score || 0;
        const reviewsA = a.reviewCount || 0;
        const reviewsB = b.reviewCount || 0;

        let loser;
        if (scoreA !== scoreB) {
          loser = scoreA > scoreB ? b : a;
        } else if (reviewsA !== reviewsB) {
          loser = reviewsA > reviewsB ? b : a;
        } else {
          // Keep shortest name (likely the main product)
          loser = a.name.length <= b.name.length ? b : a;
        }

        const winner = loser === a ? b : a;
        toRemove.set(loser.slug, {
          reason: `fuzzy duplicate of "${winner.slug}" (dist=${dist}, contains=${oneContainsOther})`,
          name: loser.name,
          brand: loser.brand,
          score: loser.score,
        });
        fuzzyCount++;

        if (verbose) {
          console.log(`   🔀 "${a.name}" vs "${b.name}"`);
          console.log(`       Distance: ${dist}, Contains: ${oneContainsOther}`);
          console.log(`       Keep: ${winner.slug} (score=${winner.score}) | Remove: ${loser.slug} (score=${loser.score})`);
        }
      }
    }
  }
}

if (fuzzyCount > 0) {
  console.log(`   Found ${fuzzyCount} fuzzy duplicates\n`);
  const fuzzyRemovals = [...toRemove.entries()].filter(([, info]) => info.reason.startsWith('fuzzy'));
  for (const [slug, info] of fuzzyRemovals) {
    console.log(`   ✂️  ${slug}`);
    console.log(`       "${info.name}" — ${info.reason}`);
  }
} else {
  console.log('   No fuzzy duplicates found.');
}

// ── Summary ───────────────────────────────────────────
console.log(`
╔══════════════════════════════════════════════════╗
║  Dedup Summary                                   ║
║  Total products:    ${String(products.length).padStart(4)}                         ║
║  To remove:         ${String(toRemove.size).padStart(4)}                         ║
║  Remaining:         ${String(products.length - toRemove.size).padStart(4)}                         ║
╚══════════════════════════════════════════════════╝
`);

if (toRemove.size === 0) {
  console.log('✅ No duplicates found. Products are clean!');
  process.exit(0);
}

// ── Execute removals ──────────────────────────────────
if (dryRun) {
  console.log('🏁 Dry run complete. Use --force to actually remove.\n');

  // Still save backup list for reference
  const backupData = {
    timestamp: new Date().toISOString(),
    mode: 'dry-run',
    removals: Object.fromEntries(toRemove),
  };
  fs.writeFileSync(BACKUP_FILE, JSON.stringify(backupData, null, 2), 'utf-8');
  console.log(`📋 Removal list saved to: ${BACKUP_FILE}`);
} else {
  // Save backup before deleting
  const backupData = {
    timestamp: new Date().toISOString(),
    mode: 'force',
    removals: Object.fromEntries(toRemove),
  };
  fs.writeFileSync(BACKUP_FILE, JSON.stringify(backupData, null, 2), 'utf-8');
  console.log(`📋 Backup saved to: ${BACKUP_FILE}`);

  // Delete product JSON files
  let deletedFiles = 0;
  for (const slug of toRemove.keys()) {
    const jsonPath = path.join(PRODUCTS_DIR, `${slug}.json`);
    if (fs.existsSync(jsonPath)) {
      fs.unlinkSync(jsonPath);
      deletedFiles++;
      console.log(`   🗑️  Deleted ${slug}.json`);
    }
  }

  // Update products.csv — remove rows with matching slugs
  if (fs.existsSync(PRODUCTS_CSV)) {
    const csvText = fs.readFileSync(PRODUCTS_CSV, 'utf-8');
    const rows = parseCSV(csvText);
    if (rows.length > 0) {
      const headers = rows[0];
      const slugIdx = headers.findIndex((h) => h.trim() === 'slug');
      if (slugIdx >= 0) {
        const filtered = [headers, ...rows.slice(1).filter((cols) => {
          const slug = (cols[slugIdx] || '').trim().replace(/"/g, '');
          return !toRemove.has(slug);
        })];
        const csvOut = filtered.map((cols) => cols.map(escapeCSV).join(',')).join('\n') + '\n';
        fs.writeFileSync(PRODUCTS_CSV, csvOut, 'utf-8');
        console.log(`\n   ✏️  Updated products.csv (removed ${toRemove.size} rows)`);
      }
    }
  }

  // Update rakuten-discoveries.csv
  if (fs.existsSync(DISCOVERIES_CSV)) {
    const csvText = fs.readFileSync(DISCOVERIES_CSV, 'utf-8');
    const rows = parseCSV(csvText);
    if (rows.length > 0) {
      const headers = rows[0];
      const slugIdx = headers.findIndex((h) => h.trim() === 'slug');
      if (slugIdx >= 0) {
        const before = rows.length - 1;
        const filtered = [headers, ...rows.slice(1).filter((cols) => {
          const slug = (cols[slugIdx] || '').trim().replace(/"/g, '');
          return !toRemove.has(slug);
        })];
        const after = filtered.length - 1;
        const csvOut = filtered.map((cols) => cols.map(escapeCSV).join(',')).join('\n') + '\n';
        fs.writeFileSync(DISCOVERIES_CSV, csvOut, 'utf-8');
        console.log(`   ✏️  Updated rakuten-discoveries.csv (${before} → ${after} rows)`);
      }
    }
  }

  // Update yahoo-discoveries.csv if it exists
  if (fs.existsSync(YAHOO_DISCOVERIES_CSV)) {
    const csvText = fs.readFileSync(YAHOO_DISCOVERIES_CSV, 'utf-8');
    const rows = parseCSV(csvText);
    if (rows.length > 0) {
      const headers = rows[0];
      const slugIdx = headers.findIndex((h) => h.trim() === 'slug');
      if (slugIdx >= 0) {
        const filtered = [headers, ...rows.slice(1).filter((cols) => {
          const slug = (cols[slugIdx] || '').trim().replace(/"/g, '');
          return !toRemove.has(slug);
        })];
        const csvOut = filtered.map((cols) => cols.map(escapeCSV).join(',')).join('\n') + '\n';
        fs.writeFileSync(YAHOO_DISCOVERIES_CSV, csvOut, 'utf-8');
        console.log(`   ✏️  Updated yahoo-discoveries.csv`);
      }
    }
  }

  console.log(`\n✅ Removed ${deletedFiles} product files and updated CSV files.`);
}

} // end isMainScript
