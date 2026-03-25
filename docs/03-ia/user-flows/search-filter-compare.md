# User Flow: Search, Filter, and Compare

**Flow ID:** UF-04
**Primary personas:** Emma (specific product research), Marco (pre-trip product hunting), Aiko (known need)
**Entry point:** Search bar (available on all pages)
**Exit point:** Comparison page or product detail page
**Research basis:** Phase 02 Need #3 (Quick comparison), Need #7 (Category discovery), Frustration #6 (Decision paralysis from too many options)

---

## Happy Path

```
┌─────────────────────────────────────────────┐
│  1. USER INITIATES SEARCH                   │
│     Taps search icon in primary nav (mobile)│
│     or clicks search bar (desktop)          │
│     Search bar expands with:                │
│     - Text input with placeholder:          │
│       "Search products, categories..."      │
│     - Recent searches (if any)              │
│     - Popular searches: "sunscreen,"        │
│       "rice cooker," "lip tint"             │
└──────────────────────┬──────────────────────┘
                       │
              [Types query: "sunscreen"]
                       │
                       ▼
┌─────────────────────────────────────────────┐
│  2. AUTOCOMPLETE / SUGGESTIONS              │
│     As user types, dropdown shows:          │
│     - Product matches: "Biore UV Aqua Rich" │
│     - Category matches: "Beauty > Skincare" │
│     - Collection matches: "Summer Essentials"│
│     User can select a suggestion or press   │
│     Enter for full search                   │
└──────────────────────┬──────────────────────┘
                       │
              [Presses Enter for full search]
                       │
                       ▼
┌─────────────────────────────────────────────┐
│  3. SEARCH RESULTS PAGE                     │
│     /en/search/?q=sunscreen                 │
│                                             │
│     Header: "24 results for 'sunscreen'"    │
│                                             │
│     Filter bar (horizontal, scrollable):    │
│     [Category ▾] [Price ▾] [Score ▾]        │
│     [Availability ▾]                        │
│                                             │
│     Sort: Relevance | Score | Price ↕ | New │
│                                             │
│     Results grid: product cards             │
│     Each card has a compare checkbox [ ]    │
└──────────────────────┬──────────────────────┘
                       │
              [Applies filters]
                       │
                       ▼
┌─────────────────────────────────────────────┐
│  4. FILTERED RESULTS                        │
│     Grid updates in-place (no page reload)  │
│     Active filters as removable chips       │
│     Result count updates: "8 results"       │
│     Compare checkboxes persist              │
└──────────────────────┬──────────────────────┘
                       │
              [Checks 2 product cards for comparison]
                       │
                       ▼
┌─────────────────────────────────────────────┐
│  5. COMPARE TRAY APPEARS                    │
│     Sticky bottom bar:                      │
│     ┌────────────────────────────────────┐  │
│     │ [thumb1] [thumb2]  Compare (2)  [→]│  │
│     └────────────────────────────────────┘  │
│     User can:                               │
│     - Add more products (up to 4)           │
│     - Remove a product (tap X on thumbnail) │
│     - Tap "Compare" to open comparison      │
└──────────────────────┬──────────────────────┘
                       │
              [Taps "Compare"]
                       │
                       ▼
┌─────────────────────────────────────────────┐
│  6. COMPARISON PAGE                         │
│     /en/compare/biore-uv+anessa-uv/        │
│                                             │
│     Side-by-side layout:                    │
│     ┌─────────────┬─────────────┐           │
│     │  Product A   │  Product B   │          │
│     │  [Image]     │  [Image]     │          │
│     │  Score: 9.2  │  Score: 8.8  │          │
│     │  ¥1,580      │  ¥2,480      │          │
│     ├─────────────┼─────────────┤           │
│     │  SPF 50+     │  SPF 50+     │          │
│     │  50ml        │  60ml        │          │
│     │  Water-based │  Milk-based  │          │
│     │  #1 Pick     │              │          │
│     ├─────────────┼─────────────┤           │
│     │  [Buy →]     │  [Buy →]     │          │
│     └─────────────┴─────────────┘           │
│                                             │
│     Winner highlight: differences are       │
│     color-coded (green = better value)      │
│     "Chartedly recommends: Product A"       │
└──────────────────────┬──────────────────────┘
                       │
              [Clicks "Buy" on preferred product]
                       │
                       ▼
┌─────────────────────────────────────────────┐
│  7. AFFILIATE REDIRECT                      │
│     (Same as UF-03 Step 5)                 │
│     Opens retailer in new tab               │
└─────────────────────────────────────────────┘
```

---

## Step-by-Step Detail

| Step | Screen | User Action | Emotion | Key UI Elements |
|------|--------|-------------|---------|-----------------|
| 1 | Any page (nav) | Taps search icon / clicks search bar | Purposeful, has a need | Search bar: full-width on mobile overlay, inline on desktop |
| 2 | Search overlay | Types query, scans suggestions | Expectant, wants quick match | Autocomplete grouped by type: Products, Categories, Collections |
| 3 | Search results | Scans grid, evaluates options | Evaluating, may feel overwhelmed | Result count + filters reduce decision paralysis |
| 4 | Filtered results | Activates 1-2 filters to narrow | Focused, in control | In-place updates (no page reload). Filter chips are removable |
| 5 | Compare tray | Selects 2-4 products to compare | Analytical, wants data | Sticky bottom bar. Maximum 4 products to prevent information overload |
| 6 | Comparison page | Scans side-by-side specs, price, scores | Deciding, nearly committed | Differences highlighted. Winner recommendation shown |
| 7 | Retailer | Clicks buy on winner | Decisive | New tab with affiliate link |

---

## Alternate Paths

### Alt 2a: User selects autocomplete suggestion (product)
From Step 2, user taps a specific product suggestion (e.g., "Biore UV Aqua Rich").
- Routes directly to product detail page: `/en/product/biore-uv-aqua-rich/`
- Skips search results entirely
- Continues into UF-03 (Product to Purchase)

### Alt 2b: User selects autocomplete suggestion (category)
From Step 2, user taps a category suggestion (e.g., "Beauty > Skincare").
- Routes to subcategory page: `/en/explore/beauty/skincare/`
- Continues into UF-02 (Category Drilldown)

### Alt 3a: User clicks a product directly from search results (no compare)
From Step 3, user taps a product card without using the compare checkbox.
- Routes to product detail: `/en/product/[slug]/`
- Continues into UF-03 (Product to Purchase)

### Alt 6a: User adds/removes products from comparison page
From Step 6, user taps "Add another product" on comparison page.
- Search overlay opens within comparison page
- User searches and selects a third product
- Comparison table expands to 3 columns
- Maximum 4 products to maintain readability on mobile

### Alt 6b: User shares comparison URL
From Step 6, user taps "Share this comparison."
- Shareable URL generated: `/en/compare/product-a+product-b/`
- Copy to clipboard, LINE share, or general share sheet
- Marco uses this to share pre-trip research with travel companions

---

## Edge Cases & Error States

| Scenario | Behavior | UI Response |
|----------|----------|-------------|
| Search query returns zero results | Empty state page | "No products found for '[query].' Try: [suggested similar terms]. Or browse [popular categories]." |
| Search query is misspelled | Fuzzy matching + "Did you mean?" | "Showing results for 'sunscreen.' Search instead for 'sunscren'?" |
| Search query is in Japanese on English site | Cross-language search works | Results shown in current language regardless of query language. Query "日焼け止め" on `/en/` returns English sunscreen results |
| User selects only 1 product for comparison | Compare button disabled | Compare tray shows: "[Product A] + select 1 more to compare" |
| User tries to compare products from different categories | Allowed but flagged | Comparison page shows: "These products are from different categories. Some specs may not be directly comparable." |
| Compare tray has 4 products, user tries to add 5th | Addition blocked | Toast: "Maximum 4 products. Remove one to add another." |
| Comparison page loaded via shared URL but product was removed from site | Missing product placeholder | "[Product name] is no longer available. [Remove from comparison]" with remaining products still shown |
| Search index is stale (new product not yet indexed) | Indexing runs on publish | New products appear in search within 5 minutes of publishing |
| User on mobile tries to compare 4 products | Horizontal scroll comparison | On mobile (<768px), comparison table scrolls horizontally with first column (attribute names) sticky |
| Search query contains special characters | Sanitized input | Special characters stripped. No XSS vulnerability. Clean query passed to search |

---

## Mobile Comparison Layout

On screens <768px, the side-by-side comparison adapts:

- 2 products: two columns visible, no scroll needed
- 3-4 products: horizontal scroll with sticky attribute column on left
- Swipe indicator: dots showing which products are in view
- "Winner" badge floats above the recommended product column

---

## Persona-Specific Notes

- **Emma (28):** This is her primary research flow. She searches "moisturizer for dry skin," filters by price and skin type, selects 3 options, and uses the comparison page to make a data-driven decision. The comparison page's methodology-transparent scoring gives her the trust signal she needs.

- **Marco (35):** Searches "kitchen knife" before his trip. Filters by "Available in-store." Compares 2 knives side by side, focusing on price, material, and store availability. Shares the comparison URL with his partner via WhatsApp for a joint decision.

- **Aiko (40):** Searches "air purifier" with a specific need. She is less likely to use comparison — she trusts the #1 Pick. But if she is comparing a budget option against the top pick, the comparison page makes the trade-offs immediately visible.

- **Yuki (22):** Least likely to start from search — she prefers browsing. But when a friend sends her a comparison link via LINE, she opens the comparison page and can quickly add her own candidate product to the comparison.

---

## Success Metrics

| Metric | Target | Measurement |
|--------|--------|-------------|
| Search usage rate | >15% of sessions include a search | Search events / total sessions |
| Autocomplete selection rate | >30% of searches | Autocomplete clicks / total searches |
| Search → product detail CTR | >25% | Product clicks / search result views |
| Compare feature usage | >5% of sessions | Compare events / total sessions |
| Comparison → affiliate click | >12% | Buy clicks / comparison page views |
| Zero-result rate | <5% | Zero-result searches / total searches |
