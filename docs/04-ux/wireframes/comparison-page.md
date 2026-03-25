# Comparison Page Wireframe — Chartedly

## URL Pattern
`/compare?ids=product-a,product-b,product-c`
Example: `/compare?ids=anessa-perfect-uv,biore-uv-aqua,skin-aqua-super-moisture`

---

## Full Page Layout

```
┌──────────────────────────────────────────────────────────────────────┐
│  NAVBAR (sticky)                                                     │
├──────────────────────────────────────────────────────────────────────┤
│  BREADCRUMBS                                                         │
├──────────────────────────────────────────────────────────────────────┤
│  PAGE HEADER                                                         │
├──────────────────────────────────────────────────────────────────────┤
│  STICKY PRODUCT HEADER ROW                                           │
├──────────────────────────────────────────────────────────────────────┤
│  COMPARISON TABLE                                                    │
│    — Scores section                                                  │
│    — Price section                                                   │
│    — Pros/Cons section                                               │
│    — Specs section                                                   │
│    — Purchase CTAs                                                   │
├──────────────────────────────────────────────────────────────────────┤
│  VERDICT SUMMARY                                                     │
├──────────────────────────────────────────────────────────────────────┤
│  FOOTER                                                              │
└──────────────────────────────────────────────────────────────────────┘
```

---

## 1. Page Header

```
┌──────────────────────────────────────────────────────────────────────┐
│                                                                      │
│  Compare Products 製品比較                                           │
│                                                                      │
│  Comparing 3 products in Sunscreen                                   │
│                                                                      │
│  [+ Add Product]                                                     │
│                                                                      │
└──────────────────────────────────────────────────────────────────────┘
```

**Specifications:**
- Title: 28px, font-weight 700
- JP: 16px, gray-400
- Subtitle: 15px, gray-500
- "Add Product" button: ghost style, brand-blue border, 36px height
  - Opens product search modal (max 4 products)
  - Disabled + "Max 4" tooltip if already 4 products

---

## 2. Sticky Product Header Row

```
┌──────────────────────────────────────────────────────────────────────┐
│              │  Product A         │  Product B         │  Product C  │
│              │                    │                    │             │
│              │  [IMAGE]           │  [IMAGE]           │  [IMAGE]    │
│              │  120x120           │  120x120           │  120x120    │
│              │                    │                    │             │
│              │  Anessa Perfect    │  Biore UV Aqua     │  Skin Aqua  │
│              │  UV Skincare Milk  │  Rich Watery       │  Super      │
│              │                    │  Essence           │  Moisture   │
│              │  Shiseido          │  Kao               │  Rohto      │
│              │                    │                    │             │
│  (empty      │  Score: 9.2       │  Score: 8.8        │  Score: 8.5 │
│   label      │  ¥2,480           │  ¥1,280            │  ¥680       │
│   column)    │                    │                    │             │
│              │  🏆 Best Overall  │                    │  💰 Best    │
│              │                    │                    │  Value      │
│              │  [✕ Remove]       │  [✕ Remove]       │  [✕ Remove]│
│              │                    │                    │             │
└──────────────────────────────────────────────────────────────────────┘
```

**Specifications:**
- Sticky: becomes fixed at top when user scrolls past it (top 64px, below navbar)
- Background: white, shadow-sm when stuck
- Label column (first): 180px (desktop) / 0 on mobile (frozen)
- Product columns: equal width, divide remaining space
- Image: 120px x 120px (desktop) / 80px x 80px (sticky collapsed), rounded-lg, centered
- Product name: 16px, font-weight 600, centered, 2-line max
- Brand: 13px, gray-500
- Score: 20px, font-weight 800, color by tier
- Price: 16px, font-weight 600
- Winner indicator: category-specific badge on the highest-scoring product
- Remove button: "x" icon + "Remove", 12px, gray-400, hover: red-500
- Sticky collapsed state: image shrinks to 48px, name becomes 1-line, score + price only

### Sticky Collapsed State
```
┌──────────────────────────────────────────────────────────────────────┐
│         │ [img] Anessa   9.2 │ [img] Biore   8.8 │ [img] Skin  8.5│
│         │       ¥2,480       │       ¥1,280       │  Aqua  ¥680    │
└──────────────────────────────────────────────────────────────────────┘
```

---

## 3. Comparison Table

### Scores Section

```
┌──────────────────────────────────────────────────────────────────────┐
│  Scores                                                              │
│  スコア                                                              │
├──────────────┬───────────────┬───────────────┬──────────────────────┤
│              │  Product A    │  Product B    │  Product C           │
├──────────────┼───────────────┼───────────────┼──────────────────────┤
│              │               │               │                      │
│  Overall     │  ██████████ ░ │  ████████░░░  │  ████████░░░         │
│              │  🏆 9.2      │     8.8       │     8.5              │
│              │               │               │                      │
├──────────────┼───────────────┼───────────────┼──────────────────────┤
│              │               │               │                      │
│  Effectivnss │  █████████░░  │  ████████░░░  │  🏆 █████████░░     │
│              │     9.0       │     8.5       │  🏆 9.0              │
│              │               │               │                      │
├──────────────┼───────────────┼───────────────┼──────────────────────┤
│              │               │               │                      │
│  Value       │  ███████░░░░  │  🏆 █████████ │  🏆 █████████░      │
│              │     7.5       │  🏆 9.0       │  🏆 9.2              │
│              │               │               │                      │
├──────────────┼───────────────┼───────────────┼──────────────────────┤
│              │               │               │                      │
│  Ease of Use │  ████████████ │  ██████████░  │  ██████████░         │
│              │  🏆 9.5      │     9.0       │     8.8              │
│              │               │               │                      │
└──────────────┴───────────────┴───────────────┴──────────────────────┘
```

**Winner Highlighting:**
- Cell with highest score per row: green-50 bg, green-600 left border (3px)
- Trophy icon (small, 14px) before winning score
- If tied: both cells highlighted
- Score bar: 100px wide, 6px height, color by tier
- Score value: 14px, font-weight 700, right of bar

### Price Section

```
┌──────────────────────────────────────────────────────────────────────┐
│  Price                                                               │
│  価格                                                                │
├──────────────┬───────────────┬───────────────┬──────────────────────┤
│  Price       │  ¥2,480       │  ¥1,280       │  💰 ¥680            │
├──────────────┼───────────────┼───────────────┼──────────────────────┤
│  Price/ml    │  ¥41.3/ml     │  💰 ¥25.6/ml  │  ¥27.2/ml          │
├──────────────┼───────────────┼───────────────┼──────────────────────┤
│  Amazon      │  [Buy ¥2,480] │  [Buy ¥1,280] │  [Buy ¥680]        │
├──────────────┼───────────────┼───────────────┼──────────────────────┤
│  Rakuten     │  [Buy ¥2,380] │  [Buy ¥1,300] │  [Buy ¥698]        │
└──────────────┴───────────────┴───────────────┴──────────────────────┘
```

- Lowest price per row: green-50 bg, bold text, money-bag icon
- Buy buttons: compact, 32px height, full cell width
  - Amazon: orange-50 bg, orange-700 text
  - Rakuten: red-50 bg, red-700 text

### Pros / Cons Section

```
┌──────────────────────────────────────────────────────────────────────┐
│  Pros & Cons                                                         │
├──────────────┬───────────────┬───────────────┬──────────────────────┤
│  Pros        │ ✓ SPF50+     │ ✓ Affordable  │ ✓ Best value        │
│              │ ✓ Lightweight │ ✓ Light feel  │ ✓ Big bottle        │
│              │ ✓ Primer use  │ ✓ Available   │ ✓ No white cast     │
├──────────────┼───────────────┼───────────────┼──────────────────────┤
│  Cons        │ ✗ Expensive   │ ✗ White cast  │ ✗ Less elegant      │
│              │               │ ✗ Fragrance   │ ✗ Runny texture     │
└──────────────┴───────────────┴───────────────┴──────────────────────┘
```

- Pros: green-600 checkmark, 13px text
- Cons: red-500 x-mark, 13px text
- Max 4 pros, 3 cons shown per product

### Specs Section

```
┌──────────────────────────────────────────────────────────────────────┐
│  Specifications                                                      │
├──────────────┬───────────────┬───────────────┬──────────────────────┤
│  SPF Rating  │  SPF50+ PA++++│  SPF50+ PA++++│  SPF50+ PA++++      │
├──────────────┼───────────────┼───────────────┼──────────────────────┤
│  Volume      │  60ml         │  50ml         │  💰 110ml           │
├──────────────┼───────────────┼───────────────┼──────────────────────┤
│  Skin Type   │  All          │  All          │  All                │
├──────────────┼───────────────┼───────────────┼──────────────────────┤
│  Water Resist│  Yes (80min)  │  No           │  Yes (40min)        │
├──────────────┼───────────────┼───────────────┼──────────────────────┤
│  Fragrance   │  None         │  Light floral │  None               │
├──────────────┼───────────────┼───────────────┼──────────────────────┤
│  Made In     │  Japan        │  Japan        │  Japan              │
└──────────────┴───────────────┴───────────────┴──────────────────────┘
```

- Matching values: gray-400 (deemphasized when identical across all products)
- Different values: gray-900, font-weight 500
- Best-in-class value (where applicable): green-50 bg, bold

---

## 4. Table Styling

**Specifications:**
- Full-width, border 1px gray-200, rounded-xl, overflow hidden
- Section headers: gray-50 bg, 14px uppercase, font-weight 600, letter-spacing 1px, padding 12px 16px
  - Bilingual: EN + JP smaller
  - Full-width row spanning all columns
- Label column: 180px, gray-50 bg, 14px, font-weight 500, gray-600
- Data cells: 14px, gray-800, padding 16px, text-align center
- Row dividers: 1px gray-100
- Column dividers: 1px gray-100
- Alternating row tint: every other row white / gray-50 (very subtle)

---

## 5. Mobile Layout — Horizontal Scroll with Frozen First Column

```
Mobile: Frozen label column + horizontal scroll
┌─────────────┬──────────────────────────────────────┐
│             │  ← scroll horizontally →             │
│  LABELS     │                                      │
│  (frozen)   │  Product A  │  Product B  │  Prod C  │
│             │             │             │          │
├─────────────┼─────────────┼─────────────┼──────────┤
│  Overall    │  9.2 🏆     │  8.8        │  8.5     │
├─────────────┼─────────────┼─────────────┼──────────┤
│  Value      │  7.5        │  9.0 🏆     │  9.2 🏆  │
├─────────────┼─────────────┼─────────────┼──────────┤
│  Price      │  ¥2,480     │  ¥1,280     │  ¥680 💰 │
├─────────────┼─────────────┼─────────────┼──────────┤
│  ...        │  ...        │  ...        │  ...     │
└─────────────┴─────────────┴─────────────┴──────────┘
```

**Mobile Specifications:**
- Label column: 120px, frozen (position sticky, left 0, z-index 10)
- Label column background: white (with shadow-right: `4px 0 8px rgba(0,0,0,0.06)`)
- Product columns: 200px min-width each, horizontal scroll
- Scroll indicator: subtle gradient fade on right edge to signal more content
- Sticky product headers: top 64px (below navbar), z-index 20
- Product images in header: 60px x 60px
- Touch: momentum horizontal scroll
- Snap: `scroll-snap-type: x proximity` on product columns

---

## 6. Verdict Summary

```
┌──────────────────────────────────────────────────────────────────────┐
│                                                                      │
│  Our Verdict 比較結果                                                │
│                                                                      │
│  ┌──────────────────────────────────────────────────────────────┐    │
│  │                                                              │    │
│  │  🏆 Best Overall: Anessa Perfect UV Skincare Milk           │    │
│  │  The highest score across all criteria with excellent        │    │
│  │  UV protection and elegant texture.                          │    │
│  │                                                              │    │
│  │  💰 Best Value: Skin Aqua Super Moisture Milk               │    │
│  │  Unbeatable price-to-performance ratio with solid            │    │
│  │  protection in a generous bottle.                            │    │
│  │                                                              │    │
│  └──────────────────────────────────────────────────────────────┘    │
│                                                                      │
└──────────────────────────────────────────────────────────────────────┘
```

**Specifications:**
- Background: blue-50
- Border: 1px blue-200, rounded-xl
- Padding: 32px
- Title: 22px, font-weight 700
- Each verdict: product name linked (16px, font-weight 600), explanation (14px, gray-600)
- Auto-generated from data: highest overall score = "Best Overall", best score/price ratio = "Best Value"

---

## 7. Empty & Edge States

### Only 1 Product Selected
```
┌──────────────────────────────────────────────────────────────────────┐
│              │  Product A         │  [+ Add Product]                 │
│              │  [IMAGE]           │                                  │
│              │  ...               │  Select a product to compare     │
│              │                    │  比較する商品を選んでください      │
│              │                    │                                  │
│              │                    │  [Browse Rankings]               │
└──────────────────────────────────────────────────────────────────────┘
```

### Product Search Modal (Add Product)
```
┌──────────────────────────────────────┐
│  Add Product to Comparison           │
│                                      │
│  [Search products...____________]    │
│                                      │
│  Suggested from same category:       │
│                                      │
│  ┌────┐ Product Name      [Add]     │
│  │img │ Brand • Score 8.8           │
│  └────┘                              │
│  ┌────┐ Product Name      [Add]     │
│  │img │ Brand • Score 8.5           │
│  └────┘                              │
│  ┌────┐ Product Name      [Add]     │
│  │img │ Brand • Score 8.3           │
│  └────┘                              │
│                                      │
└──────────────────────────────────────┘
```

- Modal: centered, 480px wide, rounded-xl, shadow-2xl
- Search: auto-focus, search-as-you-type (debounced 300ms)
- Suggestions: same category as existing products, sorted by score
- Each result: 64px height, image 48x48, name + brand + score, "Add" button
- "Add" button: brand-blue, 32px height, 14px
- Mobile: bottom sheet instead of centered modal

---

## Sharing & Export

- Share URL: updates live as products are added/removed (query params)
- Share button: copies URL to clipboard, toast confirmation
- Print-friendly: `@media print` styles hide nav, CTA buttons, show all data
