# User Flow: Category Drilldown

**Flow ID:** UF-02
**Primary personas:** Aiko (quick answer), Emma (category exploration), Yuki (visual browse by interest)
**Entry point:** Category page (`/en/explore/[category]/`)
**Exit point:** Product detail page
**Research basis:** Phase 02 Need #5 (Cross-category coverage), Need #2 (Quick path to "the best"), Frustration #2 (Information-dense platforms)

---

## Happy Path

```
┌─────────────────────────────────────────────┐
│  1. USER CLICKS CATEGORY                    │
│     Source: homepage "Explore" row,          │
│     primary nav "Explore" dropdown,          │
│     or direct URL                            │
│     Example: /en/explore/beauty/             │
└──────────────────────┬──────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────┐
│  2. CATEGORY LANDING PAGE                   │
│     Sees immediately (above fold):          │
│     - Category hero + description           │
│     - "#1 Pick in Beauty" featured card     │
│     - Subcategory cards grid:               │
│       Skincare | Makeup | Hair Care | Body  │
│     Below fold:                             │
│     - "Top Rated in Beauty" product row     │
│     - "Most Popular" product row            │
│     - "New in Beauty" product row           │
└──────────────────────┬──────────────────────┘
                       │
              [Taps subcategory card]
                       │
                       ▼
┌─────────────────────────────────────────────┐
│  3. SUBCATEGORY PAGE                        │
│     Example: /en/explore/beauty/skincare/   │
│     Sees:                                   │
│     - #1 Pick banner (3-line verdict)       │
│     - Product grid (ranked order)           │
│     - Filter bar: price, skin type, SPF,    │
│       brand origin, availability            │
│     - Sort: Chartedly Score, price, newest  │
│     - Product cards: image, name, score,    │
│       price, key attribute, badges          │
└──────────────────────┬──────────────────────┘
                       │
              [Applies filter or sorts]
                       │
                       ▼
┌─────────────────────────────────────────────┐
│  4. FILTERED / SORTED RESULTS               │
│     Grid updates in-place (no page reload)  │
│     Active filters shown as removable chips │
│     Result count displayed: "12 products"   │
│     If #1 Pick is still in results,         │
│     it retains its badge                    │
└──────────────────────┬──────────────────────┘
                       │
              [Taps product card]
                       │
                       ▼
┌─────────────────────────────────────────────┐
│  5. PRODUCT DETAIL PAGE                     │
│     (Same as UF-01 Step 3-5)               │
│     Quick verdict, score, price,            │
│     buy links, full review                  │
└─────────────────────────────────────────────┘
```

---

## Step-by-Step Detail

| Step | Screen | User Action | Emotion | Key UI Elements |
|------|--------|-------------|---------|-----------------|
| 1 | Nav / Homepage | Clicks category name or card | Purposeful (Aiko), curious (Yuki) | "Explore" in primary nav opens mega-menu with all 10 categories |
| 2 | Category landing | Scans subcategories, may click #1 Pick directly | Oriented, choosing path | #1 Pick card has prominent "Buy" CTA — Aiko can exit here in <30s |
| 3 | Subcategory page | Browses product grid in ranked order | Evaluating options | Default sort: Chartedly Score (high to low). Filter bar sticky on mobile |
| 4 | Filtered results | Narrows results using filters | Focused, in control | Filter chips show active selections. "Clear All" resets to default |
| 5 | Product detail | Reads verdict, decides to buy or compare | Confident, approaching decision | Breadcrumb trail: Home > Beauty > Skincare > [Product] |

---

## Alternate Paths

### Alt 2a: User clicks #1 Pick directly from category page
From Step 2, Aiko sees the #1 Pick card and taps it immediately.
- Skips Steps 3-4 entirely
- Routes directly to Product Detail (Step 5)
- This is the "quick answer" path — designed specifically for Aiko's <3 min target

### Alt 2b: User browses curated rows instead of drilling into subcategory
From Step 2, user scrolls past subcategory cards to "Top Rated" or "Most Popular" rows.
- Horizontal scroll through product cards (same as homepage rows)
- Taps card → Product Detail (Step 5)
- This path suits Yuki's exploratory browsing style

### Alt 3a: User finds no products matching filters
From Step 4, aggressive filtering returns zero results.
- Empty state: "No products match these filters"
- Suggested actions: "Try removing [filter]" or "Browse all [subcategory]"
- Show 3-5 "closest matches" that meet most (but not all) filter criteria

### Alt 3b: User taps "Compare" checkbox on 2+ product cards
From Step 3/4, product cards have a compare checkbox.
- Compare bar appears at bottom: "Compare (2)" with product thumbnails
- Tapping "Compare Now" routes to `/en/compare/product-a+product-b/`
- Continues into UF-05 comparison flow

---

## Edge Cases & Error States

| Scenario | Behavior | UI Response |
|----------|----------|-------------|
| Category has no subcategories yet (new category) | Flat product grid instead of subcategory cards | Category page shows all products in a single ranked grid |
| Subcategory has only 1-2 products | Grid shown with "More reviews coming soon" notice | Reduced grid + "Suggest a product" feedback link |
| User navigates to non-existent subcategory URL | 404 page | "This subcategory doesn't exist yet. Browse [category] instead." with link |
| Filter combination is contradictory (e.g., "Under ¥500" + "Premium") | All filter chips shown, zero results | "No matches. We suggest removing [less relevant filter]" |
| Subcategory page loads with stale cache | Cache invalidation on publish | "Last updated [date]" timestamp visible; stale data auto-refreshes on next visit |
| User hits browser back from product detail | Subcategory page restores filter state and scroll position | URL query params preserve filter state: `?price=under-1000&sort=score` |
| JavaScript fails (filter/sort relies on JS) | Server-rendered default sort (by score) still works | Filters degrade gracefully; sort links work as full-page navigations |

---

## Filter Taxonomy (per subcategory)

Filters vary by subcategory but follow a consistent pattern:

| Filter Type | Examples | UI Pattern |
|-------------|----------|------------|
| Price range | Under ¥1,000 / ¥1,000-3,000 / ¥3,000-5,000 / Over ¥5,000 | Chip group (single select) |
| Attribute | SPF level, skin type, material, capacity | Chip group (multi-select) |
| Brand origin | Japanese / International | Toggle |
| Availability | Amazon JP / Rakuten / In-store | Checkbox group |
| Badge | #1 Pick / Best Value / Editor's Choice | Chip group |

---

## Persona-Specific Notes

- **Aiko (40):** This flow is optimized for her. She taps "Kitchen" from nav → sees "#1 Pick: [Rice Cooker]" with 3-line rationale and buy link → done in under 3 minutes. The #1 Pick banner at both category and subcategory levels means she never has to scroll past the fold unless she wants to.

- **Emma (28):** Uses subcategory pages as her primary research tool. Applies filters (sensitive skin, under ¥3,000) to narrow the ranked grid. The English-language filter labels and product descriptions eliminate her usual translation step.

- **Yuki (22):** Enters through "Beauty" category and browses visually. The product grid with large images satisfies her visual-first expectation. She may never use filters — ranked order by score is enough. She scrolls the grid like an Instagram feed.

---

## Success Metrics

| Metric | Target | Measurement |
|--------|--------|-------------|
| Category → subcategory CTR | >40% | Click tracking |
| #1 Pick direct click rate | >15% (Aiko path) | Click on #1 Pick card / category page views |
| Filter usage rate | >25% of subcategory visitors | Filter interaction events |
| Subcategory → product detail CTR | >20% | Click tracking |
| Time to first product detail click | <30s (Aiko), <90s (others) | Session analytics |
