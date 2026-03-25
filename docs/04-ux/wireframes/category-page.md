# Category Page Wireframe — Chartedly

## URL Pattern
`/categories/{category-slug}`
Example: `/categories/beauty`

---

## Full Page Layout

```
┌──────────────────────────────────────────────────────────────────────┐
│  NAVBAR (sticky)                                                     │
├──────────────────────────────────────────────────────────────────────┤
│  BREADCRUMBS                                                         │
├──────────────────────────────────────────────────────────────────────┤
│  CATEGORY HERO HEADER                                                │
├──────────────────────────────────────────────────────────────────────┤
│  SUBCATEGORY CARDS GRID                                              │
├──────────────────────────────────────────────────────────────────────┤
│  FEATURED PRODUCTS — "Top Rated in Beauty"                           │
├──────────────────────────────────────────────────────────────────────┤
│  SIDEBAR FILTERS + PRODUCT GRID                                      │
├──────────────────────────────────────────────────────────────────────┤
│  FOOTER                                                              │
└──────────────────────────────────────────────────────────────────────┘
```

---

## 1. Category Hero Header

```
┌──────────────────────────────────────────────────────────────────────┐
│                                                                      │
│  ┌──────────────────────────────────────────────────────────────┐    │
│  │                                                              │    │
│  │  [Background: soft gradient or lifestyle image]              │    │
│  │                                                              │    │
│  │  🧴                                                          │    │
│  │  Beauty ビューティー                                         │    │
│  │                                                              │    │
│  │  Discover the best beauty products available in Japan.       │    │
│  │  From sunscreen to skincare essentials.                      │    │
│  │                                                              │    │
│  │  48 products • 8 subcategories                               │    │
│  │                                                              │    │
│  └──────────────────────────────────────────────────────────────┘    │
│                                                                      │
└──────────────────────────────────────────────────────────────────────┘
```

**Specifications:**
- Full-width, height 240px (desktop) / 180px (mobile)
- Background: category-specific soft gradient or lifestyle image with overlay
  - Beauty: rose gradient (rose-50 to rose-100)
  - Tech: blue gradient (blue-50 to slate-100)
  - Kitchen: amber gradient (amber-50 to orange-100)
  - Health: green gradient (emerald-50 to green-100)
  - Outdoor: teal gradient
  - Living: warm gray gradient
  - Baby: lavender gradient
  - Books: indigo gradient
- Category icon: 48px SVG, category accent color
- Title: 36px (desktop) / 28px (mobile), font-weight 800, gray-900
- JP name: 18px, gray-500, inline or below
- Description: 16px, gray-600, max-width 600px, line-height 1.5
- Stats: 14px, gray-400, font-weight 500
- Rounded: 0 (full bleed) or 16px if contained

---

## 2. Subcategory Cards Grid

```
┌──────────────────────────────────────────────────────────────────────┐
│                                                                      │
│  Browse Subcategories サブカテゴリ                                    │
│                                                                      │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐               │
│  │          │ │          │ │          │ │          │               │
│  │ [Image]  │ │ [Image]  │ │ [Image]  │ │ [Image]  │               │
│  │          │ │          │ │          │ │          │               │
│  │Sunscreen │ │Moisturizr│ │ Cleanser │ │  Serum   │               │
│  │日焼け止め │ │保湿クリーム│ │洗顔料    │ │美容液    │               │
│  │12 items  │ │ 8 items  │ │10 items  │ │ 6 items  │               │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘               │
│                                                                      │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐               │
│  │ [Image]  │ │ [Image]  │ │ [Image]  │ │ [Image]  │               │
│  │  Toner   │ │   Mask   │ │  Makeup  │ │Hair Care │               │
│  │化粧水    │ │マスク     │ │メイクアップ│ │ヘアケア  │               │
│  │ 4 items  │ │ 3 items  │ │ 5 items  │ │ 7 items  │               │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘               │
│                                                                      │
└──────────────────────────────────────────────────────────────────────┘
```

**Specifications:**
- Grid: 4 columns (desktop) / 3 (tablet) / 2 (mobile)
- Gap: 16px
- Each card:
  - Width: fill column, aspect ratio 4:3 image area
  - Image: representative product photo or lifestyle shot, object-fit cover, rounded-t-lg
  - Hover: image scale 1.05, shadow-md
  - Name (EN): 16px, font-weight 600, gray-900
  - Name (JP): 13px, gray-400
  - Count: 12px, gray-400
  - Padding: 12px bottom area
  - Background: white, rounded-lg, border 1px gray-100
  - Entire card: clickable, links to `/rankings/{category}/{subcategory}`

---

## 3. Featured Products — "Top Rated in [Category]"

```
┌──────────────────────────────────────────────────────────────────────┐
│                                                                      │
│  Top Rated in Beauty ビューティートップ評価       [View Rankings →]  │
│                                                                      │
│  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐      │
│  │ #1      │ │ #2      │ │ #3      │ │ #4      │ │ #5      │      │
│  │[Image]  │ │[Image]  │ │[Image]  │ │[Image]  │ │[Image]  │      │
│  │Product  │ │Product  │ │Product  │ │Product  │ │Product  │      │
│  │Brand    │ │Brand    │ │Brand    │ │Brand    │ │Brand    │      │
│  │¥X,XXX   │ │¥X,XXX   │ │¥X,XXX   │ │¥X,XXX   │ │¥X,XXX   │      │
│  │[9.2]    │ │[9.0]    │ │[8.8]    │ │[8.5]    │ │[8.3]    │      │
│  └─────────┘ └─────────┘ └─────────┘ └─────────┘ └─────────┘      │
│                                                                      │
└──────────────────────────────────────────────────────────────────────┘
```

- Standard carousel row (same as homepage)
- Shows top 10 products across all subcategories within this category
- "View Rankings" links to `/rankings/{category}`

---

## 4. Filter Sidebar + Product Grid

### Desktop: Sidebar Left, Grid Right

```
┌──────────────────────────────────────────────────────────────────────┐
│                                                                      │
│  All Beauty Products すべてのビューティー製品                         │
│                                                                      │
│  ┌──────────────┐  ┌──────────────────────────────────────────┐     │
│  │              │  │                                          │     │
│  │  FILTERS     │  │  Sort: [Score ▼] [Price ↕] [Newest]     │     │
│  │              │  │  [▦ Grid] [≡ List]     12 of 48 shown   │     │
│  │  Subcategory │  │                                          │     │
│  │  ☐ All (48)  │  │  ┌───────┐ ┌───────┐ ┌───────┐        │     │
│  │  ☐ Sunscreen │  │  │Card   │ │Card   │ │Card   │        │     │
│  │  ☐ Moisturzr │  │  │       │ │       │ │       │        │     │
│  │  ☐ Cleanser  │  │  └───────┘ └───────┘ └───────┘        │     │
│  │  ☐ Serum     │  │                                          │     │
│  │  ☐ More...   │  │  ┌───────┐ ┌───────┐ ┌───────┐        │     │
│  │              │  │  │Card   │ │Card   │ │Card   │        │     │
│  │  Price Range │  │  │       │ │       │ │       │        │     │
│  │  ¥0 ────── ¥ │  │  └───────┘ └───────┘ └───────┘        │     │
│  │  [min] [max] │  │                                          │     │
│  │              │  │  ┌───────┐ ┌───────┐ ┌───────┐        │     │
│  │  Score       │  │  │Card   │ │Card   │ │Card   │        │     │
│  │  ☐ 9+ (3)   │  │  │       │ │       │ │       │        │     │
│  │  ☐ 8+ (12)  │  │  └───────┘ └───────┘ └───────┘        │     │
│  │  ☐ 7+ (28)  │  │                                          │     │
│  │              │  │  ... infinite scroll ...                 │     │
│  │  Brand       │  │                                          │     │
│  │  ☐ Shiseido  │  │                                          │     │
│  │  ☐ Kanebo    │  │                                          │     │
│  │  ☐ SK-II     │  │                                          │     │
│  │  ☐ More...   │  │                                          │     │
│  │              │  │                                          │     │
│  │  [Clear All] │  │                                          │     │
│  │              │  │                                          │     │
│  └──────────────┘  └──────────────────────────────────────────┘     │
│                                                                      │
└──────────────────────────────────────────────────────────────────────┘
```

### Filter Sidebar Specifications
- Width: 260px fixed, sticky (top 80px — below navbar)
- Max-height: calc(100vh - 80px), overflow-y auto
- Background: white
- Border-right: 1px gray-100

**Filter Groups:**

1. **Subcategory** — checkbox list
   - Each: checkbox (20px) + label (14px, gray-700) + count (13px, gray-400)
   - "More..." expands to show all, collapsed shows top 5

2. **Price Range** — dual range slider
   - Track: gray-200, 4px height
   - Handles: brand-blue, 20px circles
   - Min/Max input fields: 80px, below slider
   - Quick presets: "Under ¥1000", "¥1000-3000", "Over ¥3000"

3. **Score** — checkbox with visual bars
   - "9+ Excellent", "8+ Great", "7+ Good"
   - Mini bar visualization next to each

4. **Brand** — checkbox list with search
   - Search input at top of brand list (if > 8 brands)
   - Alphabetically sorted

5. **Clear All** — text button, red-500, 14px, bottom of sidebar

### Mobile: No sidebar, use filter icon + bottom sheet (same as ranking page)

### Grid Area
- Grid: 3 columns with sidebar (desktop) / 3 without sidebar (tablet) / 2 (mobile)
- Standard product cards
- Sort bar at top of grid
- Infinite scroll

---

## 5. Active Filter Tags

When filters are applied, show tag pills above the grid:

```
┌──────────────────────────────────────────────────────────────────────┐
│  Active: [Sunscreen ✕] [Score 8+ ✕] [Under ¥3000 ✕]  Clear all   │
└──────────────────────────────────────────────────────────────────────┘
```

- Pill: gray-100 bg, 28px height, 13px text, "x" icon to remove
- "Clear all": 13px, red-500, text button
- Sticky below sort bar while scrolling

---

## Responsive Summary

| Element | Desktop (1440) | Tablet (768) | Mobile (375) |
|---|---|---|---|
| Hero | 240px height | 200px height | 180px height |
| Subcategory cards | 4 columns | 3 columns | 2 columns |
| Featured carousel | 5 visible | 3 visible | 1.2 (peek) |
| Filter sidebar | 260px sticky left | Hidden (bottom sheet) | Hidden (bottom sheet) |
| Product grid | 3 columns | 3 columns | 2 columns |

---

## SEO & Structured Data

- `<h1>`: Category name
- Meta description: dynamic, includes category name + product count
- CollectionPage schema
- Internal linking: each subcategory card links to ranking page
- Canonical URL: `/categories/{slug}`
