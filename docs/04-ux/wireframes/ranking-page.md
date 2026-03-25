# Ranking Page Wireframe — Chartedly

## URL Pattern
`/rankings/{category-slug}`
Example: `/rankings/beauty/sunscreen`

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
│  CATEGORY TABS / FILTER STRIP                                        │
├──────────────────────────────────────────────────────────────────────┤
│  SORT BAR + VIEW TOGGLE                                              │
├──────────────────────────────────────────────────────────────────────┤
│  PODIUM — TOP 3                                                      │
├──────────────────────────────────────────────────────────────────────┤
│  PRODUCT LIST/GRID (#4+)                                             │
│  ... infinite scroll ...                                             │
├──────────────────────────────────────────────────────────────────────┤
│  FLOATING COMPARE BUTTON                                             │
├──────────────────────────────────────────────────────────────────────┤
│  FOOTER                                                              │
└──────────────────────────────────────────────────────────────────────┘
```

---

## 1. Page Header

```
┌──────────────────────────────────────────────────────────────────────┐
│                                                                      │
│  Best Sunscreen in Japan 2026                                        │
│  日本のベスト日焼け止め 2026                                          │
│                                                                      │
│  Tested and ranked by our team. Updated March 2026.                  │
│  12 products ranked                                                  │
│                                                                      │
└──────────────────────────────────────────────────────────────────────┘
```

**Specifications:**
- Padding: 40px 80px (desktop) / 24px 16px (mobile)
- Title: 32px (desktop) / 24px (mobile), font-weight 800, gray-900
- JP subtitle: 18px, gray-400, margin-top 4px
- Description: 15px, gray-500, margin-top 12px
- Product count: 14px, gray-400, font-weight 500

---

## 2. Category Tabs / Filter Strip

```
┌──────────────────────────────────────────────────────────────────────┐
│                                                                      │
│  [All] [Sunscreen] [Moisturizer] [Cleanser] [Serum] [Toner] [Mask] │
│                                                                      │
│  Filter: [Price ▼] [Skin Type ▼] [SPF ▼] [Brand ▼]  [✕ Clear all] │
│                                                                      │
└──────────────────────────────────────────────────────────────────────┘
```

### Category Tabs
- Horizontal scroll on mobile
- Each tab: pill shape, 36px height, padding 0 20px
- Default: gray-100 bg, gray-700 text, 14px, font-weight 500
- Active: brand-blue bg, white text
- Hover: gray-200 bg
- Gap: 8px
- "All" always first

### Filter Dropdowns
- Row below tabs, 12px gap
- Each: 36px height, white bg, gray-200 border, rounded-lg, 14px
- Chevron-down icon right-aligned
- Active filter: brand-blue border, blue-50 bg, count badge
- Dropdown panel: white, rounded-lg, shadow-lg, max-height 320px, scrollable
- Checkbox list inside dropdown
- "Clear all" link: red-500, 13px, appears when any filter is active
- Mobile: filter icon button opens bottom sheet with all filters

### Mobile Filter Bottom Sheet
```
┌─────────────────────────────────────┐
│  ── (drag handle)                    │
│                                     │
│  Filters フィルター                  │
│                                     │
│  Price Range                         │
│  [○ Any] [○ Under ¥1000]           │
│  [○ ¥1000-3000] [○ Over ¥3000]     │
│                                     │
│  Skin Type                           │
│  [☐ All] [☐ Dry] [☐ Oily]         │
│  [☐ Combination] [☐ Sensitive]      │
│                                     │
│  ... more filters ...                │
│                                     │
│  [Apply Filters]  [Clear All]       │
│                                     │
└─────────────────────────────────────┘
```

---

## 3. Sort Bar + View Toggle

```
┌──────────────────────────────────────────────────────────────────────┐
│                                                                      │
│  Sort by: [Score ▼] [Price ↕] [Newest]          [▦ Grid] [≡ List]  │
│                                                                      │
│  Showing 12 of 12 products                                           │
│                                                                      │
└──────────────────────────────────────────────────────────────────────┘
```

**Specifications:**
- Flex row, space-between alignment
- Sort options: pill buttons, 32px height
  - Active sort: font-weight 600, underline (2px brand-blue)
  - Score: default sort, descending
  - Price: toggles ascending/descending (arrow indicator)
  - Newest: by review publication date
- View toggle: 2 icon buttons, 36px each, grouped with shared border
  - Active: brand-blue bg, white icon
  - Inactive: white bg, gray-400 icon
  - Grid icon: 4-square grid
  - List icon: 3 horizontal lines
- Result count: 13px, gray-400, right-aligned (desktop) / below sort (mobile)
- Mobile: sort becomes dropdown select, view toggle stays

---

## 4. Podium — Top 3

```
┌──────────────────────────────────────────────────────────────────────┐
│                                                                      │
│           ┌─────────────────┐                                        │
│           │ 🥇 #1           │                                        │
│           │                 │                                        │
│           │  [IMAGE]        │                                        │
│           │                 │                                        │
│           │  Product Name   │                                        │
│           │  Brand          │                                        │
│           │  Score: 9.2     │                                        │
│           │  ¥2,480         │                                        │
│           │  [View →]       │                                        │
│           │                 │                                        │
│  ┌────────┴─────────────────┴────────┐                               │
│  │                                    │                               │
│  │ ┌──────────────┐ ┌──────────────┐ │                               │
│  │ │ 🥈 #2        │ │ 🥉 #3        │ │                               │
│  │ │              │ │              │ │                               │
│  │ │  [IMAGE]     │ │  [IMAGE]     │ │                               │
│  │ │  Product     │ │  Product     │ │                               │
│  │ │  Brand       │ │  Brand       │ │                               │
│  │ │  Score: 9.0  │ │  Score: 8.8  │ │                               │
│  │ │  ¥1,980      │ │  ¥3,200      │ │                               │
│  │ │  [View →]    │ │  [View →]    │ │                               │
│  │ └──────────────┘ └──────────────┘ │                               │
│  │                                    │                               │
│  └────────────────────────────────────┘                               │
│                                                                      │
└──────────────────────────────────────────────────────────────────────┘
```

**Specifications:**
- Background: gradient from brand-blue/5% to transparent
- #1 card: larger (320px wide), elevated, gold top-border (4px), centered
- #2 and #3 cards: 260px wide, side-by-side below #1
- Each podium card:
  - White bg, rounded-xl, shadow-md
  - Padding: 24px
  - Rank number: 24px, font-weight 800
  - Medal icon: gold/silver/bronze colored SVG, 28px
  - Image: 200px (#1) / 160px (#2, #3), aspect 1:1, rounded-lg, centered
  - Product name: 18px (#1) / 16px, font-weight 700
  - Brand: 14px, gray-500
  - Score: 20px (#1) / 16px, font-weight 800, color by tier
  - Price: 16px, font-weight 600
  - "View" button: ghost style, brand-blue border, 32px height
- Mobile: stack all 3 vertically, #1 still larger (full-width), #2/#3 side-by-side smaller
- Compare checkboxes visible on podium cards too

---

## 5. Product List/Grid (#4 onwards)

### Grid View (Default)

```
┌──────────────────────────────────────────────────────────────────────┐
│                                                                      │
│  ☐ ┌─────────┐  ☐ ┌─────────┐  ☐ ┌─────────┐  ☐ ┌─────────┐      │
│    │ #4      │    │ #5      │    │ #6      │    │ #7      │      │
│    │[Image]  │    │[Image]  │    │[Image]  │    │[Image]  │      │
│    │Product  │    │Product  │    │Product  │    │Product  │      │
│    │Brand    │    │Brand    │    │Brand    │    │Brand    │      │
│    │¥X,XXX   │    │¥X,XXX   │    │¥X,XXX   │    │¥X,XXX   │      │
│    │[8.5]    │    │[8.3]    │    │[8.1]    │    │[7.9]    │      │
│    └─────────┘    └─────────┘    └─────────┘    └─────────┘      │
│                                                                      │
│  ☐ ┌─────────┐  ☐ ┌─────────┐  ☐ ┌─────────┐  ☐ ┌─────────┐      │
│    │ #8      │    │ #9      │    │ #10     │    │ #11     │      │
│    │ ...     │    │ ...     │    │ ...     │    │ ...     │      │
│    └─────────┘    └─────────┘    └─────────┘    └─────────┘      │
│                                                                      │
│              ◌ loading more...                                       │
│                                                                      │
└──────────────────────────────────────────────────────────────────────┘
```

- Grid: 4 columns (desktop) / 3 (tablet) / 2 (mobile)
- Gap: 20px (desktop) / 12px (mobile)
- Cards: standard product card component (see product-card.md)
- Rank number: prominently visible on each card
- Compare checkbox: top-left of each card, outside card border
  - 24px, rounded, gray-300 border
  - Checked: brand-blue fill, white checkmark, subtle scale bounce

### List View

```
┌──────────────────────────────────────────────────────────────────────┐
│                                                                      │
│  ☐ ┌────┐  #4  Product Name Here             ¥2,480    ████ 8.5    │
│    │img │       Brand • Category                        [View →]    │
│    └────┘       ✓ Pro 1  ✓ Pro 2  ✓ Pro 3                          │
│  ──────────────────────────────────────────────────────────────────  │
│  ☐ ┌────┐  #5  Product Name Here             ¥1,980    ████ 8.3    │
│    │img │       Brand • Category                        [View →]    │
│    └────┘       ✓ Pro 1  ✓ Pro 2  ✓ Pro 3                          │
│  ──────────────────────────────────────────────────────────────────  │
│  ☐ ┌────┐  #6  Product Name Here             ¥3,200    ████ 8.1    │
│    │img │       Brand • Category                        [View →]    │
│    └────┘       ✓ Pro 1  ✓ Pro 2  ✓ Pro 3                          │
│                                                                      │
└──────────────────────────────────────────────────────────────────────┘
```

- Uses list variant of product card (see product-card.md)
- Compare checkbox left of each row
- Divider: 1px gray-100 between rows

---

## 6. Floating Compare Button

```
                    ┌─────────────────────────┐
                    │  Compare (3)    [→]     │
                    └─────────────────────────┘
                    ↑ floating, bottom 24px, centered
```

**Specifications:**
- Fixed position: bottom 24px, centered horizontally
- Appears when 2+ products are checked (animated slide-up)
- Hidden when 0-1 products checked (slide-down)
- Background: brand-blue, rounded-full (pill)
- Padding: 12px 32px
- Text: white, 16px, font-weight 600
- Count: badge inside, "(N)" or separate circle badge
- Click: navigates to `/compare?ids=xxx,yyy,zzz`
- Max compare: 4 products. If user tries 5th, tooltip "Maximum 4 products"
- Shadow: `0 4px 16px rgba(37, 99, 235, 0.3)`
- Z-index: 800
- Mobile: full-width bar at bottom (above mobile buy bar if on detail page)

```
Mobile compare bar:
┌─────────────────────────────────────┐
│  [thumb][thumb][thumb]  Compare (3) │
└─────────────────────────────────────┘
```
- Shows mini thumbnails (32px circles) of selected products
- Tap "x" on each thumbnail to deselect

---

## 7. Infinite Scroll + Lazy Loading

**Specifications:**
- Initial load: Top 3 podium + first 8 grid items (11 total)
- Scroll trigger: IntersectionObserver at 200px before end
- Load batch size: 8 products per batch
- Loading indicator: 3-dot pulse animation, centered, 48px area
- End state: "You've seen all [N] products in this category" — 14px, gray-400, centered
- URL updates: `?page=2` appended for deep-linking (but no full page reload)
- Back button: restores scroll position via `history.scrollRestoration`
- Skeleton: shows 4 skeleton cards while loading next batch

---

## Responsive Behavior

| Element | Desktop (1440) | Tablet (768) | Mobile (375) |
|---|---|---|---|
| Header | Left-aligned | Left-aligned | Centered |
| Category tabs | Inline row | Scroll | Scroll |
| Filters | Inline dropdowns | 2 visible + "More" | Filter icon + bottom sheet |
| Sort + view | Inline row | Inline row | Sort dropdown only |
| Podium | #1 center, #2/#3 flanking | #1 top, #2/#3 side-by-side | #1 full-width, #2/#3 half |
| Grid | 4 columns | 3 columns | 2 columns |
| Compare button | Floating pill | Floating pill | Full-width bottom bar |

---

## Empty States

### No Results (After Filtering)
```
┌──────────────────────────────────────┐
│                                      │
│         [🔍 illustration]           │
│                                      │
│   No products match your filters     │
│   フィルターに一致する商品がありません │
│                                      │
│   Try adjusting your filters or      │
│   [clear all filters]               │
│                                      │
└──────────────────────────────────────┘
```

### Category Has No Products Yet
```
┌──────────────────────────────────────┐
│                                      │
│         [📝 illustration]           │
│                                      │
│   We're working on this category!    │
│   このカテゴリは準備中です            │
│                                      │
│   [Notify me when ready]            │
│                                      │
└──────────────────────────────────────┘
```
