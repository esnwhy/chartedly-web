# Chartedly — Full Sitemap

**Document version:** 1.0
**Date:** 2026-03-24
**Author:** SAGE (Information Architecture)
**Derived from:** Phase 01 market research, Phase 02 personas & user needs, project brief

---

## Design Rationale

The sitemap is organized around the Netflix/Apple TV+ browsing paradigm identified in Phase 02 as the primary navigation expectation for ages 10-40. The structure supports three entry patterns observed across all four personas:

1. **Browse-first** (Yuki, Emma) — Homepage carousels into category exploration
2. **Answer-first** (Aiko) — Category page with immediate #1 Pick visibility
3. **Search-first** (Marco pre-trip, Emma with specific need) — Search into filtered results

URL structure uses `/category/subcategory/product-slug` nesting to support SEO topic clustering as the site scales beyond MVP. Phase 02 synthesis confirms cross-category coverage is a structural differentiator — the sitemap must accommodate 10+ categories from the start.

Bilingual URLs use path prefixes (`/en/`, `/ja/`) per Phase 02 finding that EN/JP must be co-equal content systems, not a translation layer.

---

## Sitemap Tree

```
chartedly.com/
│
├── /[lang]/                                          [HOMEPAGE]
│   │   Hero carousel: seasonal/trending picks
│   │   Curated rows: "Top Picks This Week," "Best for Tourists,"
│   │   "Under ¥1,000," "New Reviews," category highlights
│   │   Persona entry points: Tourist Mode CTA, Quick Search
│   │
│   ├── /[lang]/explore/                              [CATEGORY BROWSE]
│   │   │   All-categories visual grid (10 category cards)
│   │   │   Trending across categories strip
│   │   │
│   │   ├── /[lang]/explore/beauty/                   [CATEGORY: Beauty]
│   │   │   │   Category hero, #1 Pick banner, subcategory cards
│   │   │   │
│   │   │   ├── /[lang]/explore/beauty/skincare/           [Subcategory]
│   │   │   ├── /[lang]/explore/beauty/makeup/             [Subcategory]
│   │   │   ├── /[lang]/explore/beauty/hair-care/          [Subcategory]
│   │   │   └── /[lang]/explore/beauty/body-care/          [Subcategory]
│   │   │
│   │   ├── /[lang]/explore/electronics/              [CATEGORY: Electronics]
│   │   │   ├── /[lang]/explore/electronics/audio/
│   │   │   ├── /[lang]/explore/electronics/cameras/
│   │   │   ├── /[lang]/explore/electronics/gadgets/
│   │   │   └── /[lang]/explore/electronics/appliances/
│   │   │
│   │   ├── /[lang]/explore/kitchen/                  [CATEGORY: Kitchen]
│   │   │   ├── /[lang]/explore/kitchen/knives/
│   │   │   ├── /[lang]/explore/kitchen/cookware/
│   │   │   ├── /[lang]/explore/kitchen/tableware/
│   │   │   └── /[lang]/explore/kitchen/tools/
│   │   │
│   │   ├── /[lang]/explore/home/                     [CATEGORY: Home]
│   │   │   ├── /[lang]/explore/home/cleaning/
│   │   │   ├── /[lang]/explore/home/storage/
│   │   │   ├── /[lang]/explore/home/air-quality/
│   │   │   └── /[lang]/explore/home/bedding/
│   │   │
│   │   ├── /[lang]/explore/fashion/                  [CATEGORY: Fashion]
│   │   │   ├── /[lang]/explore/fashion/basics/
│   │   │   ├── /[lang]/explore/fashion/outerwear/
│   │   │   └── /[lang]/explore/fashion/accessories/
│   │   │
│   │   ├── /[lang]/explore/food-drink/               [CATEGORY: Food & Drink]
│   │   │   ├── /[lang]/explore/food-drink/snacks/
│   │   │   ├── /[lang]/explore/food-drink/beverages/
│   │   │   ├── /[lang]/explore/food-drink/instant/
│   │   │   └── /[lang]/explore/food-drink/specialty/
│   │   │
│   │   ├── /[lang]/explore/health/                   [CATEGORY: Health]
│   │   │   ├── /[lang]/explore/health/supplements/
│   │   │   ├── /[lang]/explore/health/eye-care/
│   │   │   ├── /[lang]/explore/health/oral-care/
│   │   │   └── /[lang]/explore/health/first-aid/
│   │   │
│   │   ├── /[lang]/explore/travel-essentials/        [CATEGORY: Travel Essentials]
│   │   │   ├── /[lang]/explore/travel-essentials/bags/
│   │   │   ├── /[lang]/explore/travel-essentials/toiletries/
│   │   │   └── /[lang]/explore/travel-essentials/accessories/
│   │   │
│   │   ├── /[lang]/explore/stationery/               [CATEGORY: Stationery]
│   │   │   ├── /[lang]/explore/stationery/pens/
│   │   │   ├── /[lang]/explore/stationery/notebooks/
│   │   │   └── /[lang]/explore/stationery/desk-accessories/
│   │   │
│   │   └── /[lang]/explore/baby-kids/                [CATEGORY: Baby & Kids]
│   │       ├── /[lang]/explore/baby-kids/feeding/
│   │       ├── /[lang]/explore/baby-kids/care/
│   │       └── /[lang]/explore/baby-kids/toys/
│   │
│   ├── /[lang]/product/[product-slug]/               [PRODUCT DETAIL PAGE]
│   │   │   Product hero image, Chartedly Score, #1 Pick badge (if applicable)
│   │   │   Quick verdict (3-line rationale)
│   │   │   Specs table, pros/cons, methodology disclosure
│   │   │   Price comparison across retailers
│   │   │   "Where to Buy" with affiliate links
│   │   │   Related products carousel
│   │   │   "Compare with..." quick-add to comparison
│   │   │
│   │   └── (no child pages — flat product namespace)
│   │
│   ├── /[lang]/rankings/                             [RANKINGS HUB]
│   │   │   Overall top-rated across all categories
│   │   │   "Most Loved" (highest community scores)
│   │   │
│   │   ├── /[lang]/rankings/[category-slug]/         [Rankings by Category]
│   │   │   e.g., /en/rankings/beauty/
│   │   │
│   │   └── /[lang]/rankings/[use-case-slug]/         [Rankings by Use Case]
│   │       e.g., /en/rankings/best-for-sensitive-skin/
│   │       e.g., /en/rankings/best-under-1000-yen/
│   │
│   ├── /[lang]/compare/                              [COMPARISON PAGE]
│   │   │   Empty state: prompt to add products
│   │   │   Active state: side-by-side spec/price/score comparison
│   │   │   Supports 2-4 products simultaneously
│   │   │   Shareable comparison URL
│   │   │
│   │   └── /[lang]/compare/[product-ids]/            [Specific Comparison]
│   │       e.g., /en/compare/biore-uv-aqua-rich+anessa-perfect-uv/
│   │
│   ├── /[lang]/collections/                          [CURATED COLLECTIONS HUB]
│   │   │   "Best For" editorial collections
│   │   │
│   │   ├── /[lang]/collections/best-for-tourists/
│   │   ├── /[lang]/collections/best-under-1000-yen/
│   │   ├── /[lang]/collections/best-gifts-from-japan/
│   │   ├── /[lang]/collections/best-for-sensitive-skin/
│   │   ├── /[lang]/collections/summer-essentials/
│   │   └── /[lang]/collections/[collection-slug]/    [Dynamic collections]
│   │
│   ├── /[lang]/new/                                  [WHAT'S NEW]
│   │   │   Recently reviewed products (reverse chronological)
│   │   │   "Just Updated" — refreshed rankings
│   │   │   Filterable by category
│   │   │
│   │   └── (no child pages — single paginated feed)
│   │
│   ├── /[lang]/search/                               [SEARCH RESULTS]
│   │   │   Query-driven results page
│   │   │   Filters: category, price range, score, availability
│   │   │   Sort: relevance, score (high-low), price (low-high/high-low), newest
│   │   │
│   │   └── /[lang]/search/?q=[query]&cat=[cat]&...   [Filtered Search]
│   │
│   ├── /[lang]/blog/                                 [BLOG / GUIDES HUB]
│   │   │   Shopping guides, how-tos, seasonal roundups
│   │   │
│   │   └── /[lang]/blog/[article-slug]/              [Individual Article]
│   │       e.g., /en/blog/guide-to-japanese-sunscreen-ingredients/
│   │       e.g., /en/blog/how-to-shop-tax-free-in-japan/
│   │
│   ├── /[lang]/about/                                [ABOUT]
│   │   │   Mission, team, methodology overview
│   │   │
│   │   └── /[lang]/about/methodology/                [METHODOLOGY DETAIL]
│   │       How products are scored, data sources, update frequency
│   │       Transparency page — directly addresses Trust Deficit (Theme 1)
│   │
│   ├── /[lang]/legal/                                [LEGAL PAGES]
│   │   ├── /[lang]/legal/affiliate-disclosure/       [Affiliate Disclosure]
│   │   ├── /[lang]/legal/privacy/                    [Privacy Policy]
│   │   └── /[lang]/legal/tokushoho/                  [特定商取引法 / Commercial Transactions]
│   │
│   └── /[lang]/404/                                  [404 ERROR PAGE]
│       Friendly message, search bar, popular categories, homepage link
```

---

## Page Count Summary

| Section | Pages | Notes |
|---------|-------|-------|
| Homepage | 1 | Per language |
| Category browse | 1 hub + 10 categories + ~35 subcategories | ~46 pages |
| Product detail | Dynamic | 1 per product, scales with content |
| Rankings | 1 hub + category + use-case pages | ~15-20 pages |
| Comparison | 1 tool page | Dynamic URLs for specific comparisons |
| Collections | 1 hub + ~6 launch collections | ~7 pages |
| What's New | 1 | Paginated feed |
| Search | 1 | Query-driven |
| Blog / Guides | 1 hub + articles | Scales with content |
| About + Methodology | 2 | |
| Legal | 3 | |
| 404 | 1 | |
| **Total (templates)** | **~12 unique templates** | Product and blog pages are dynamic |

---

## URL Pattern Rules

| Rule | Example |
|------|---------|
| Language prefix always first | `/en/explore/beauty/` |
| Lowercase, hyphenated slugs | `/en/product/biore-uv-aqua-rich/` |
| No dates in URLs | `/en/blog/tax-free-shopping-guide/` (not `/2026/03/...`) |
| No trailing slashes enforced | Redirect `/en/explore/beauty` to `/en/explore/beauty/` |
| Default language (`/en/`) can omit prefix | `/explore/beauty/` = `/en/explore/beauty/` |
| Japanese uses `/ja/` prefix | `/ja/explore/beauty/` |
| Comparison URLs use `+` separator | `/en/compare/product-a+product-b/` |
| Search uses query parameters | `/en/search/?q=sunscreen&cat=beauty` |

---

## Bilingual Route Mapping

Every page exists at both `/en/` and `/ja/` with `hreflang` alternates. The content model stores EN and JP content as co-equal fields, not as primary + translation. This directly implements Phase 02's finding that bilingual architecture must be built in from day one.

| English Route | Japanese Route | hreflang |
|---------------|---------------|----------|
| `/en/explore/beauty/` | `/ja/explore/beauty/` | `en` / `ja` |
| `/en/product/biore-uv-aqua-rich/` | `/ja/product/biore-uv-aqua-rich/` | `en` / `ja` |
| `/en/collections/best-for-tourists/` | `/ja/collections/best-for-tourists/` | `en` / `ja` |
