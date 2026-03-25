# Chartedly — Content Schema (Bilingual)

## Overview

This is the target schema for Phase 07 implementation. It extends the current `content.config.ts` schema with bilingual fields, multi-retailer URLs, source metadata, and multi-image support.

## Current Schema (as-is in content.config.ts)

```typescript
z.object({
  name: z.string(),
  brand: z.string(),
  image: z.string().optional(),
  category: z.string(),
  subcategory: z.string(),
  type: z.string(),
  price: z.string(),
  score: z.number().min(0).max(100),
  rank: z.number().optional(),
  badge: z.enum(['top-pick', 'budget-pick']).optional(),
  buyUrl: z.string(),
  pros: z.array(z.string()).default([]),
  cons: z.array(z.string()).default([]),
  specs: z.record(z.string(), z.string()).default({}),
  shortDescription: z.string(),
  review: z.string().optional(),
  comparisonSlug: z.string().optional(),
  radar: z.object({
    quality: z.number().min(0).max(100),
    value: z.number().min(0).max(100),
    popularity: z.number().min(0).max(100),
    ease: z.number().min(0).max(100),
    innovation: z.number().min(0).max(100),
  }).optional(),
  dateAdded: z.string().transform((s) => new Date(s)),
  featured: z.boolean().default(false),
})
```

## Target Schema (bilingual)

```typescript
// src/content.config.ts
import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

// ── Shared Sub-Schemas ──────────────────────────────

const radarSchema = z.object({
  quality: z.number().min(0).max(100),
  value: z.number().min(0).max(100),
  popularity: z.number().min(0).max(100),
  ease: z.number().min(0).max(100),
  innovation: z.number().min(0).max(100),
});

const imageSchema = z.object({
  src: z.string(),              // "/images/products/anessa-uv-1.webp"
  alt_en: z.string(),           // "ANESSA Perfect UV front view"
  alt_ja: z.string(),           // "アネッサ パーフェクトUV 正面"
  isPrimary: z.boolean().default(false),
});

const retailerUrlSchema = z.object({
  amazon: z.string().url().optional(),    // Amazon Japan affiliate URL
  rakuten: z.string().url().optional(),   // Rakuten affiliate URL
  yahoo: z.string().url().optional(),     // Yahoo Shopping URL (free, no key)
  official: z.string().url().optional(),  // Brand's official store
});

const sourceMetaSchema = z.object({
  rakuten_item_code: z.string().optional(),
  rakuten_shop_name: z.string().optional(),
  rakuten_review_avg: z.number().optional(),
  rakuten_review_count: z.number().optional(),
  last_scraped: z.string().optional(),       // ISO date: "2026-03-24"
  last_enriched: z.string().optional(),      // ISO date: "2026-03-24"
  enrichment_model: z.string().optional(),   // "claude-haiku-4-5-20251001"
});

// ── Products Collection ─────────────────────────────

const products = defineCollection({
  loader: glob({ pattern: '**/*.json', base: './src/content/products' }),
  schema: z.object({
    // ── Identity ──
    name_en: z.string(),                     // "ANESSA Perfect UV Sunscreen Milk"
    name_ja: z.string(),                     // "アネッサ パーフェクトUV スキンケアミルク"
    brand: z.string(),                       // "ANESSA"
    slug: z.string().optional(),             // Auto-derived from filename if omitted

    // ── Taxonomy ──
    category: z.string(),                    // "Beauty"
    subcategory: z.string(),                 // "Skincare"
    type: z.string(),                        // "Sunscreen"

    // ── Pricing ──
    price: z.string(),                       // "¥3,300" (display string)
    price_value: z.number().optional(),      // 3300 (numeric for sorting/filtering)
    currency: z.enum(['JPY']).default('JPY'),

    // ── Scoring ──
    score: z.number().min(0).max(100),       // Overall editorial score
    rank: z.number().optional(),             // Rank within category
    badge: z.enum(['top-pick', 'budget-pick']).optional(),
    radar: radarSchema.optional(),

    // ── Editorial Content (EN) ──
    description_en: z.string(),              // 1-2 sentence card description
    pros_en: z.array(z.string()).default([]),
    cons_en: z.array(z.string()).default([]),
    review_en: z.string().optional(),        // 2-3 paragraph detailed review

    // ── Editorial Content (JA) ──
    description_ja: z.string(),
    pros_ja: z.array(z.string()).default([]),
    cons_ja: z.array(z.string()).default([]),
    review_ja: z.string().optional(),

    // ── Specifications ──
    specs: z.record(z.string(), z.string()).default({}),
    // Specs are language-neutral (SPF: 50+, Volume: 60ml)
    // Display labels are handled by i18n strings

    // ── Images ──
    image: z.string().optional(),            // Primary image path (backward compat)
    images: z.array(imageSchema).default([]),// Multi-image gallery

    // ── Retailer URLs ──
    buyUrl: z.string().optional(),           // Legacy single URL (backward compat)
    retailers: retailerUrlSchema.optional(), // Multi-retailer

    // ── Comparison Link ──
    comparisonSlug: z.string().optional(),

    // ── Source Metadata ──
    source: sourceMetaSchema.optional(),

    // ── Dates ──
    dateAdded: z.string().transform((s) => new Date(s)),
    dateUpdated: z.string().transform((s) => new Date(s)).optional(),

    // ── Flags ──
    featured: z.boolean().default(false),
    draft: z.boolean().default(false),       // Exclude from build
    discontinued: z.boolean().default(false),// Mark as no longer available
  }),
});

// ── Comparisons Collection ──────────────────────────

const comparisons = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: './src/content/comparisons' }),
  schema: z.object({
    title_en: z.string(),
    title_ja: z.string(),
    description_en: z.string(),
    description_ja: z.string(),
    category: z.string(),
    date: z.coerce.date(),
    updated: z.coerce.date().optional(),
    image: z.string().optional(),
    productsCompared: z.number(),
    topPick: z.string(),                     // product slug
    budgetPick: z.string(),                  // product slug
    relatedArticles: z.array(z.string()).default([]),
    draft: z.boolean().default(false),
    methodology_summary_en: z.string().optional(),
    methodology_summary_ja: z.string().optional(),
  }),
});

export const collections = { products, comparisons };
```

## Example Product JSON (bilingual)

```json
{
  "name_en": "ANESSA Perfect UV Sunscreen Milk SPF50+",
  "name_ja": "アネッサ パーフェクトUV スキンケアミルク SPF50+",
  "brand": "ANESSA",
  "category": "Beauty",
  "subcategory": "Skincare",
  "type": "Sunscreen",
  "price": "¥3,300",
  "price_value": 3300,
  "score": 92,
  "rank": 1,
  "badge": "top-pick",
  "radar": {
    "quality": 95,
    "value": 72,
    "popularity": 98,
    "ease": 88,
    "innovation": 90
  },
  "description_en": "Japan's #1 selling sunscreen with patented Auto Booster Technology that strengthens UV protection with heat and water.",
  "description_ja": "オートブースター技術搭載。汗・水に触れると紫外線防御力が高まる日本売上No.1の日焼け止め。",
  "pros_en": [
    "Gets stronger with sweat and water — perfect for Japan's humid summers",
    "Lightweight milk texture absorbs quickly without white cast",
    "Available in every drugstore, convenience store, and supermarket in Japan"
  ],
  "pros_ja": [
    "汗・水で紫外線防御力アップ — 日本の湿度の高い夏に最適",
    "軽いミルクテクスチャーで白浮きしない",
    "ドラッグストア、コンビニ、スーパーどこでも購入可能"
  ],
  "cons_en": [
    "Premium price at ¥3,300 — cheaper alternatives exist for daily office use",
    "Contains alcohol — may irritate very sensitive or eczema-prone skin"
  ],
  "cons_ja": [
    "¥3,300は高め — 通勤用なら安い代替品あり",
    "アルコール配合 — 極度の敏感肌やアトピー肌には刺激になる場合も"
  ],
  "review_en": "ANESSA Perfect UV is the gold standard for sunscreen in Japan, and for good reason. The Auto Booster Technology genuinely works — this is one of the few sunscreens where sweating actually improves protection rather than washing it off. For expats dealing with Japan's brutal summer humidity, this matters.\n\nThe milk texture is impressively light for SPF50+/PA++++ protection. No white cast, no greasy feeling, works well under makeup. You can find it literally everywhere — convenience stores stock it year-round.\n\nThe downside is price. At ¥3,300 for 60ml, daily commute use gets expensive. If you're just going to the office, Biore UV Aqua Rich at ¥800 is more practical. Save the ANESSA for outdoor days, beach trips, and summer festivals.",
  "review_ja": "アネッサ パーフェクトUVは日本の日焼け止めのゴールドスタンダードです...",
  "specs": {
    "SPF": "50+",
    "PA": "++++",
    "Volume": "60ml",
    "Type": "Milk",
    "Water Resistant": "Yes (Super Waterproof)"
  },
  "image": "/images/products/anessa-perfect-uv-milk.webp",
  "images": [
    {
      "src": "/images/products/anessa-perfect-uv-milk.webp",
      "alt_en": "ANESSA Perfect UV Sunscreen Milk bottle front view",
      "alt_ja": "アネッサ パーフェクトUV ボトル正面",
      "isPrimary": true
    },
    {
      "src": "/images/products/anessa-perfect-uv-milk-texture.webp",
      "alt_en": "ANESSA UV milk texture on skin",
      "alt_ja": "アネッサ テクスチャー",
      "isPrimary": false
    }
  ],
  "retailers": {
    "amazon": "https://www.amazon.co.jp/dp/B0CXY12345?tag=chartedly-22",
    "rakuten": "https://hb.afl.rakuten.co.jp/hgc/...",
    "yahoo": "https://shopping.yahoo.co.jp/product/...",
    "official": "https://www.shiseido.co.jp/anessa/"
  },
  "source": {
    "rakuten_item_code": "shiseido-japan:anessa-uv-milk",
    "rakuten_shop_name": "Shiseido Official",
    "rakuten_review_avg": 4.65,
    "rakuten_review_count": 3842,
    "last_scraped": "2026-03-24",
    "last_enriched": "2026-03-24",
    "enrichment_model": "claude-haiku-4-5-20251001"
  },
  "comparisonSlug": "best-sunscreen-japan-2026",
  "dateAdded": "2026-03-15",
  "dateUpdated": "2026-03-24",
  "featured": true,
  "draft": false,
  "discontinued": false
}
```

## Migration Strategy

The schema upgrade is backward-compatible. Migration happens in two phases:

### Phase A: Add bilingual fields alongside existing fields

1. Keep `name`, `shortDescription`, `pros`, `cons`, `review` as-is.
2. Add `name_en`, `name_ja`, `description_en`, `description_ja`, etc.
3. Update `ai-enrich.mjs` prompt to generate both EN and JA content.
4. Run enrichment on all 116 products to populate bilingual fields.
5. Templates read bilingual fields if available, fall back to legacy fields.

### Phase B: Remove legacy fields

1. Once all 116 products have bilingual content, remove `name`, `shortDescription`, `pros`, `cons`, `review` from schema.
2. Update all templates to use `name_en`/`name_ja` pattern exclusively.
3. Update `sync-products.mjs` to write bilingual JSON format.

### Template Usage Pattern

```astro
---
// Helper to get localized field
function localized(product: any, field: string, lang: string): string {
  return product[`${field}_${lang}`] ?? product[`${field}_en`] ?? product[field] ?? '';
}

const name = localized(product.data, 'name', lang);
const description = localized(product.data, 'description', lang);
const pros = product.data[`pros_${lang}`] ?? product.data.pros ?? [];
const cons = product.data[`cons_${lang}`] ?? product.data.cons ?? [];
---
```

## Field Reference

| Field | Type | Required | Description |
|---|---|---|---|
| `name_en` | string | Yes | English product name (max 80 chars) |
| `name_ja` | string | Yes | Japanese product name |
| `brand` | string | Yes | Brand name (English) |
| `category` | string | Yes | Top-level: Beauty, Electronics, Kitchen, etc. |
| `subcategory` | string | Yes | Mid-level: Skincare, Haircare, etc. |
| `type` | string | Yes | Specific: Sunscreen, Moisturizer, etc. |
| `price` | string | Yes | Display price with currency symbol |
| `price_value` | number | No | Numeric price for sorting |
| `score` | number | Yes | Editorial score 0-100 |
| `rank` | number | No | Position within category |
| `badge` | enum | No | "top-pick" or "budget-pick" |
| `radar` | object | No | 5-axis scores (quality, value, popularity, ease, innovation) |
| `description_en` | string | Yes | Card-level description (max 120 chars) |
| `description_ja` | string | Yes | Japanese card description |
| `pros_en` | string[] | Yes | 3 English pros |
| `pros_ja` | string[] | Yes | 3 Japanese pros |
| `cons_en` | string[] | Yes | 2 English cons |
| `cons_ja` | string[] | Yes | 2 Japanese cons |
| `review_en` | string | No | Multi-paragraph English review |
| `review_ja` | string | No | Multi-paragraph Japanese review |
| `specs` | Record | No | Key-value specifications |
| `image` | string | No | Primary image path |
| `images` | array | No | Multi-image gallery |
| `retailers` | object | No | Multi-retailer affiliate URLs |
| `source` | object | No | Scraping/enrichment metadata |
| `dateAdded` | string | Yes | ISO date |
| `dateUpdated` | string | No | ISO date |
| `featured` | boolean | No | Show in hero/featured sections |
| `draft` | boolean | No | Exclude from production build |
| `discontinued` | boolean | No | Product no longer available |
