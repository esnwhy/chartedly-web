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
  src: z.string(),
  alt_en: z.string().optional().default(''),
  alt_ja: z.string().optional().default(''),
  isPrimary: z.boolean().default(false),
});

const retailerUrlSchema = z.object({
  amazon: z.string().url().optional(),
  rakuten: z.string().url().optional(),
  yahoo: z.string().url().optional(),
  official: z.string().url().optional(),
});

const sourceMetaSchema = z.object({
  rakuten_item_code: z.string().optional(),
  rakuten_shop_name: z.string().optional(),
  rakuten_review_avg: z.number().optional(),
  rakuten_review_count: z.number().optional(),
  last_scraped: z.string().optional(),
  last_enriched: z.string().optional(),
  enrichment_model: z.string().optional(),
});

// ── Products Collection ─────────────────────────────

const products = defineCollection({
  loader: glob({ pattern: '**/*.json', base: './src/content/products' }),
  schema: z.object({
    // ── Identity (backward-compatible: accept both legacy "name" and new "name_en") ──
    name: z.string().optional(),                     // Legacy field
    name_en: z.string().optional(),                  // New bilingual field
    name_ja: z.string().optional(),                  // Japanese name
    brand: z.string(),
    slug: z.string().optional(),

    // ── Taxonomy ──
    category: z.string(),
    subcategory: z.string(),
    type: z.string(),

    // ── Pricing ──
    price: z.string(),
    price_value: z.number().optional(),
    currency: z.enum(['JPY']).default('JPY'),

    // ── Scoring ──
    score: z.number().min(0).max(100),
    rank: z.number().optional(),
    badge: z.enum(['top-pick', 'budget-pick']).optional(),
    radar: radarSchema.optional(),

    // ── Editorial Content (Legacy — kept for backward compat) ──
    shortDescription: z.string().optional(),
    pros: z.array(z.string()).default([]),
    cons: z.array(z.string()).default([]),
    review: z.string().optional(),

    // ── Editorial Content (EN — new bilingual) ──
    description_en: z.string().optional(),
    pros_en: z.array(z.string()).default([]),
    cons_en: z.array(z.string()).default([]),
    review_en: z.string().optional(),

    // ── Editorial Content (JA — new bilingual) ──
    description_ja: z.string().optional(),
    pros_ja: z.array(z.string()).default([]),
    cons_ja: z.array(z.string()).default([]),
    review_ja: z.string().optional(),

    // ── Specifications ──
    specs: z.record(z.string(), z.string()).default({}),

    // ── Images ──
    image: z.string().optional(),
    images: z.array(imageSchema).default([]),

    // ── Retailer URLs ──
    buyUrl: z.string().optional(),                   // Legacy single URL
    retailers: retailerUrlSchema.optional(),

    // ── Comparison Link ──
    comparisonSlug: z.string().optional(),

    // ── Source Metadata ──
    source: sourceMetaSchema.optional(),

    // ── Dates ──
    dateAdded: z.string().transform((s) => new Date(s)),
    dateUpdated: z.string().transform((s) => new Date(s)).optional(),

    // ── Flags ──
    featured: z.boolean().default(false),
    draft: z.boolean().default(false),
    discontinued: z.boolean().default(false),
  }),
});

// ── Comparisons Collection ──────────────────────────

const comparisons = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: './src/content/comparisons' }),
  schema: z.object({
    // Legacy fields (backward compat)
    title: z.string().optional(),
    description: z.string().optional(),
    methodology_summary: z.string().optional(),

    // New bilingual fields
    title_en: z.string().optional(),
    title_ja: z.string().optional(),
    description_en: z.string().optional(),
    description_ja: z.string().optional(),
    methodology_summary_en: z.string().optional(),
    methodology_summary_ja: z.string().optional(),

    category: z.string(),
    date: z.coerce.date(),
    updated: z.coerce.date().optional(),
    image: z.string().optional(),
    productsCompared: z.number(),
    topPick: z.string(),
    budgetPick: z.string(),
    relatedArticles: z.array(z.string()).default([]),
    draft: z.boolean().default(false),
  }),
});

export const collections = { products, comparisons };
