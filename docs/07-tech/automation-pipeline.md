# Chartedly — Automation Pipeline

## Pipeline Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                     AUTOMATED PIPELINE                          │
│                                                                 │
│  DAILY (06:00 JST)          WEEKLY (Mon 07:00 JST)             │
│  ┌──────────────────┐       ┌───────────────────────┐          │
│  │ fetch-rakuten.mjs│       │ ai-enrich.mjs         │          │
│  │ --all             │       │ --limit 20             │          │
│  │                  │       │                       │          │
│  │ Fetches rankings │       │ Enriches new products │          │
│  │ from 6 categories│       │ via Claude Haiku API  │          │
│  │                  │       │                       │          │
│  │ Output:          │       │ Output:               │          │
│  │ rakuten-         │──────>│ products.csv          │          │
│  │ discoveries.csv  │       │ (appends enriched)    │          │
│  └──────────────────┘       └───────────┬───────────┘          │
│                                         │                      │
│                                         v                      │
│                             ┌───────────────────────┐          │
│                             │ sync-products.mjs     │          │
│                             │                       │          │
│                             │ CSV -> JSON files     │          │
│                             │ Download images       │          │
│                             │                       │          │
│                             │ Output:               │          │
│                             │ src/content/products/ │          │
│                             │ public/images/products│          │
│                             └───────────┬───────────┘          │
│                                         │                      │
│                                         v                      │
│                             ┌───────────────────────┐          │
│                             │ astro build           │          │
│                             │ + pagefind            │          │
│                             │                       │          │
│                             │ Static HTML/CSS/JS    │          │
│                             │ Search index          │          │
│                             └───────────┬───────────┘          │
│                                         │                      │
│                                         v                      │
│                             ┌───────────────────────┐          │
│                             │ git commit + push     │          │
│                             │ -> Cloudflare deploy  │          │
│                             └───────────────────────┘          │
│                                                                 │
│  MONTHLY (1st, 06:00 JST)   ON-DEMAND (manual)                │
│  ┌──────────────────┐       ┌───────────────────────┐          │
│  │ validate-products│       │ sync-products.mjs     │          │
│  │ validate-affiliat│       │ (after manual CSV     │          │
│  │                  │       │  edits in Google Drive)│          │
│  │ Data integrity   │       │                       │          │
│  │ Link verification│       │ GitHub Actions:       │          │
│  │ Stale removal    │       │ workflow_dispatch     │          │
│  └──────────────────┘       └───────────────────────┘          │
└─────────────────────────────────────────────────────────────────┘
```

## Existing Scripts — How They Fit

### `scripts/fetch-rakuten.mjs`
**Role:** Product discovery. Fetches Rakuten Ichiba rankings for configured categories.

**Current behavior:**
- Hits Rakuten Ranking API and Search API
- Transforms items into Chartedly product format
- Appends new discoveries to `g:/マイドライブ/Chartedly/rakuten-discoveries.csv`
- Detects duplicates via slug matching against `products.csv`

**In the automated pipeline:**
- Runs daily via GitHub Actions cron
- Categories: sunscreen, skincare, haircare, cosmetics, electronics, kitchen (6 total)
- Rate limited: 1.2s between API calls
- New discoveries are staged, not immediately published

**Modifications needed for CI:**
- Remove hardcoded API keys (use `process.env` only)
- Add `--output-dir` flag for CI environments (not Google Drive path)
- Exit code 0 even if no new products found (prevent CI failure)

### `scripts/ai-enrich.mjs`
**Role:** Content generation. Takes raw Rakuten data and generates editorial content via Claude Haiku.

**Current behavior:**
- Reads `rakuten-discoveries.csv`
- Processes in batches of 5 products
- Generates: clean English names, scores, radar scores, pros/cons, descriptions, reviews
- Appends to `products.csv`
- Tracks progress in `enrich-progress.json` (resume on interrupt)

**In the automated pipeline:**
- Runs weekly on Mondays
- Limited to 20 products per run (~$0.10 API cost)
- Progress tracking ensures no double-processing

**Modifications needed for CI:**
- Add `--input` and `--output` flags for CI file paths
- Add bilingual output (EN + JA) — update the Claude prompt to generate both languages
- Add structured JSON output validation before writing to CSV

**Updated prompt additions for bilingual:**
```
For EACH product, additionally output:
- "name_ja": Japanese product name (original or transliterated)
- "description_ja": Japanese card description (max 120 chars)
- "pros_ja": Array of 3 pros in Japanese
- "cons_ja": Array of 2 cons in Japanese
- "review_ja": Japanese review (2-3 sentences)
```

### `scripts/sync-products.mjs`
**Role:** Data synchronization. Converts CSV to JSON and downloads images.

**Current behavior:**
- Reads `products.csv` from Google Drive
- Creates/updates product JSON files in `src/content/products/`
- Downloads product images from URLs in CSV
- Removes products deleted from CSV

**In the automated pipeline:**
- Runs after enrichment or on manual trigger
- Image downloads are idempotent (skips existing local images)

**Modifications needed for CI:**
- Add `--csv-path` flag for CI (default still Google Drive for local use)
- Add `--skip-images` flag for faster CI runs when only data changed

### `scripts/fetch-images.mjs`
**Role:** Image acquisition. Scrapes product pages for og:image.

**Current behavior:**
- Reads product JSON files
- Fetches Amazon/Rakuten pages for og:image
- Downloads and saves to `public/images/products/`

**In the automated pipeline:**
- Runs as part of weekly sync, not separately
- Fallback for products without direct image URLs

### `scripts/fetch-clean-images.mjs` / `scripts/upgrade-images.mjs`
**Role:** Image quality improvement.

**In the automated pipeline:**
- Run on-demand when image quality is insufficient
- Not part of automated schedule

## Schedule Detail

### Daily: Rakuten Ranking Fetch (06:00 JST)

```
Trigger: GitHub Actions cron (21:00 UTC)
Runtime: ~3-5 minutes
API calls: 6 categories x 1 page = 6 requests (well within rate limits)

Steps:
1. fetch-rakuten.mjs --all
2. Commit rakuten-discoveries.csv changes
3. Push to main (triggers Cloudflare rebuild only if product JSON changed)

Expected output:
- 0-30 new product discoveries per day
- Discoveries are staged, NOT published automatically
```

### Weekly: AI Enrichment + Sync (Monday 07:00 JST)

```
Trigger: GitHub Actions cron (22:00 UTC Sunday)
Runtime: ~5-10 minutes
API calls: Up to 4 Claude Haiku batches (20 products / 5 per batch)
Cost: ~$0.10 per run

Steps:
1. ai-enrich.mjs --limit 20
2. sync-products.mjs
3. optimize-images.mjs (if new images)
4. astro build (verify no errors)
5. Commit all changes
6. Push to main -> Cloudflare deploys

Expected output:
- 0-20 new enriched products added to site
- Updated product JSON + images
- Fresh build deployed
```

### Monthly: Full Validation (1st of month, 06:00 JST)

```
Trigger: GitHub Actions cron (21:00 UTC last day of previous month)
Runtime: ~5-10 minutes

Steps:
1. validate-products.mjs
   - Check all product JSON files parse correctly
   - Verify required fields are non-empty
   - Check scores are in range (0-100)
   - Flag products with missing images
   - Flag products older than 90 days without updates

2. validate-affiliates.mjs
   - HEAD request to all affiliate URLs
   - Verify affiliate IDs are present in URLs
   - Flag 404s and redirects to unexpected domains
   - Report broken links

3. Stale product detection
   - Products not in recent Rakuten rankings for 3+ months
   - Products with discontinued=true
   - Generate report

Expected output:
- Validation report in GitHub Actions logs
- Failed validation creates a GitHub Issue automatically
```

### On-Demand: Manual CSV Sync

```
Trigger: GitHub Actions workflow_dispatch (manual button in GitHub UI)

Use case: Founder edits products.csv in Google Sheets, then triggers sync.

Steps:
1. sync-products.mjs (reads from configured CSV path)
2. astro build
3. Commit + push

Note: In CI, the CSV must be committed to the repo or accessible via a
configured path. The Google Drive path only works on the founder's local machine.
```

## New Scripts Needed

### `scripts/validate-products.mjs`

```javascript
/**
 * Validate all product JSON files for data integrity.
 *
 * Checks:
 * - JSON parse success
 * - Required fields present and non-empty
 * - Score in range 0-100
 * - Radar scores in range 0-100
 * - Image file exists locally
 * - Date format is valid
 * - No duplicate slugs
 * - Badge is valid enum value
 *
 * Exit code 1 if any errors found.
 */
```

### `scripts/validate-affiliates.mjs`

```javascript
/**
 * Validate affiliate URLs in all product JSON files.
 *
 * Checks:
 * - URL format is valid
 * - Expected affiliate ID is present (Rakuten, Amazon)
 * - HEAD request returns 200 or 301 (not 404, 500)
 * - Redirect destination is expected domain
 *
 * Rate limited: 500ms between requests.
 * Exit code 1 if broken links found.
 */
```

### `scripts/optimize-images.mjs`

```javascript
/**
 * Pre-process product images:
 * - Convert JPG/PNG to WebP
 * - Resize to max 800px width
 * - Strip EXIF metadata
 * - Skip already-optimized .webp files
 *
 * Requires: sharp (add as devDependency)
 */
```

## Data Flow: Complete Product Lifecycle

```
1. DISCOVERY
   Rakuten API -> rakuten-discoveries.csv
   (Automated: daily cron)

2. STAGING
   Founder reviews discoveries in CSV
   Moves selected products to products.csv
   (Manual: Google Sheets)

3. ENRICHMENT
   ai-enrich.mjs reads new products from products.csv
   Claude Haiku generates editorial content (EN + JA)
   Writes enriched data back to products.csv
   (Automated: weekly cron OR manual trigger)

4. SYNCHRONIZATION
   sync-products.mjs reads products.csv
   Creates/updates JSON in src/content/products/
   Downloads product images
   (Automated: follows enrichment)

5. OPTIMIZATION
   optimize-images.mjs converts to WebP, resizes
   (Automated: follows sync)

6. BUILD
   astro build compiles to static HTML
   pagefind indexes all pages
   (Automated: CI pipeline)

7. DEPLOYMENT
   Cloudflare Pages serves from CDN
   (Automated: on push to main)

8. VALIDATION
   Monthly integrity checks
   Affiliate link verification
   Stale product detection
   (Automated: monthly cron)
```

## Error Handling

| Failure | Impact | Recovery |
|---|---|---|
| Rakuten API down | No new discoveries | Cron retries next day. Existing products unaffected. |
| Claude API error | Enrichment fails for batch | Progress file tracks completed items. Re-run continues from where it stopped. |
| Image download fails | Product shows placeholder | sync-products.mjs assigns picsum.photos fallback. Retry on next sync. |
| Build fails | No deployment | Cloudflare Pages keeps serving last successful build. GitHub Actions reports failure. |
| Affiliate link broken | Lost revenue on that product | Monthly validation catches it. Manual fix required. |
