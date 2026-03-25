# What's New Page Wireframe — Chartedly

## URL Pattern
`/whats-new`

---

## Full Page Layout

```
┌──────────────────────────────────────────────────────────────────────┐
│  NAVBAR (sticky)                                                     │
├──────────────────────────────────────────────────────────────────────┤
│  PAGE HEADER                                                         │
├──────────────────────────────────────────────────────────────────────┤
│  FILTER BAR (Category, Time Range)                                   │
├──────────────────────────────────────────────────────────────────────┤
│  TIMELINE — GROUPED BY DATE                                          │
│    Today                                                             │
│    This Week                                                         │
│    Last Week                                                         │
│    Earlier This Month                                                │
│    ...                                                               │
├──────────────────────────────────────────────────────────────────────┤
│  FOOTER                                                              │
└──────────────────────────────────────────────────────────────────────┘
```

---

## 1. Page Header

```
┌──────────────────────────────────────────────────────────────────────┐
│                                                                      │
│  What's New 新着レビュー                                             │
│                                                                      │
│  The latest product reviews and updates from our team.               │
│  最新のレビューとアップデート                                         │
│                                                                      │
└──────────────────────────────────────────────────────────────────────┘
```

**Specifications:**
- Title: 32px, font-weight 800, gray-900
- JP: 18px, gray-400
- Description: 16px, gray-500
- Padding: 40px 80px (desktop) / 24px 16px (mobile)

---

## 2. Filter Bar

```
┌──────────────────────────────────────────────────────────────────────┐
│                                                                      │
│  [All] [Beauty] [Tech] [Kitchen] [Health] [Outdoor] [Living]        │
│                                                                      │
│  Time: [All Time ▼]                                                  │
│                                                                      │
└──────────────────────────────────────────────────────────────────────┘
```

- Category filter: pill chips, horizontal scroll on mobile
- Time dropdown: "All Time", "This Week", "This Month", "Last 3 Months"
- Sticky below navbar when scrolling

---

## 3. Timeline Layout

### Desktop (2-column timeline with center line)

```
┌──────────────────────────────────────────────────────────────────────┐
│                                                                      │
│  TODAY ─────────────────────────────────────── March 24, 2026       │
│                                                                      │
│     ┌──────────────────────────┐                                     │
│     │                          │     ●                               │
│     │  [PRODUCT IMAGE]        │     │                               │
│     │                          │     │                               │
│     │  NEW  Anessa Perfect UV │     │                               │
│     │  Score: 9.2  ¥2,480     │     │                               │
│     │  Beauty • Sunscreen      │     │                               │
│     │                          │     │                               │
│     │  "The gold standard in   │     │                               │
│     │  Japanese sunscreen..."  │     │                               │
│     │                          │     │                               │
│     │  [Read Review →]        │     │                               │
│     └──────────────────────────┘     │                               │
│                                      │                               │
│                      ┌───────────────┴──────────────────────┐       │
│                      │                          ●            │       │
│                      │  [PRODUCT IMAGE]                      │       │
│                      │                                       │       │
│                      │  UPDATED  Biore UV Aqua Rich         │       │
│                      │  Score: 8.8  ¥1,280                  │       │
│                      │  Beauty • Sunscreen                   │       │
│                      │                                       │       │
│                      │  "Updated review with new 2026..."   │       │
│                      │                                       │       │
│                      │  [Read Review →]                     │       │
│                      └───────────────────────────────────────┘       │
│                                      │                               │
│  THIS WEEK ─────────────────────────────────── March 18-23, 2026   │
│                                      │                               │
│     ┌──────────────────────────┐     │                               │
│     │  ...next card...         │     ●                               │
│     └──────────────────────────┘     │                               │
│                                      │                               │
└──────────────────────────────────────────────────────────────────────┘
```

### Timeline Specifications

**Center Line:**
- Width: 2px, gray-200
- Centered horizontally (desktop only)
- Dot markers: 12px circles, brand-blue fill, centered on line at each card

**Date Group Headers:**
- Full-width, 14px, uppercase, font-weight 600, letter-spacing 2px, gray-400
- Date range: right-aligned, 13px, gray-300
- Horizontal rule: 1px gray-200, extends to edges
- Margin: 40px top, 24px bottom

**Timeline Cards:**
- Width: 45% of container (desktop), alternating left/right of center line
- Background: white, rounded-xl, border 1px gray-100, shadow-sm
- Padding: 24px
- Hover: shadow-md, translateY(-2px)

**Card Content:**
- Image: full card width, 200px height, rounded-t-lg, object-fit cover
- Type badge: "NEW" (green-500 bg) or "UPDATED" (blue-500 bg), 11px, uppercase, white text, rounded-full, positioned top-right of image
- Product name: 18px, font-weight 600, gray-900
- Score + Price: inline, 14px
  - Score: colored by tier, font-weight 700
  - Price: gray-600
- Category path: 12px, gray-400, "Beauty > Sunscreen"
- Excerpt: 14px, gray-600, italic, 2 lines max, from review first paragraph
- CTA: "Read Review" / "レビューを読む", 14px, brand-blue, font-weight 500

### Mobile Layout (Single Column, No Center Line)

```
┌─────────────────────────────────────┐
│                                     │
│  TODAY ──────── March 24, 2026     │
│                                     │
│  ┌─────────────────────────────┐   │
│  │  [PRODUCT IMAGE]            │   │
│  │  NEW  Anessa Perfect UV     │   │
│  │  9.2  ¥2,480               │   │
│  │  Beauty • Sunscreen         │   │
│  │  "The gold standard..."     │   │
│  │  [Read Review →]           │   │
│  └─────────────────────────────┘   │
│                                     │
│  ┌─────────────────────────────┐   │
│  │  [PRODUCT IMAGE]            │   │
│  │  UPDATED  Biore UV Aqua     │   │
│  │  8.8  ¥1,280               │   │
│  │  Beauty • Sunscreen         │   │
│  │  "Updated review with..."   │   │
│  │  [Read Review →]           │   │
│  └─────────────────────────────┘   │
│                                     │
│  THIS WEEK ──── March 18-23       │
│                                     │
│  ┌─────────────────────────────┐   │
│  │  ...                        │   │
│  └─────────────────────────────┘   │
│                                     │
└─────────────────────────────────────┘
```

- Cards: full-width, stacked
- Left border accent: 3px brand-blue (instead of center line dots)
- Cards left-margin: 16px (to show border accent)

---

## 4. Infinite Scroll

- Initial load: last 2 weeks of reviews
- Scroll trigger: IntersectionObserver at 300px
- Batch: next 2 weeks per load
- End state: "You've seen all reviews!" — 14px, gray-400
- Loading: 2 skeleton cards pulse animation

---

## 5. Empty State

```
┌──────────────────────────────────────┐
│                                      │
│       [📝 illustration]             │
│                                      │
│  No reviews in this category yet     │
│  このカテゴリにはまだレビューがありません│
│                                      │
│  [Browse all categories →]          │
│                                      │
└──────────────────────────────────────┘
```

---

## 6. RSS Feed

- RSS icon in page header: links to `/whats-new/feed.xml`
- Feed contains: title, excerpt, score, category, publication date, product URL
- Enables users and aggregators to follow new reviews
