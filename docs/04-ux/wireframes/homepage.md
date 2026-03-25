# Homepage Wireframe — Chartedly

## Viewport: Desktop (1440px) | Tablet (768px) | Mobile (375px)

---

## Layout Structure (Top to Bottom)

```
┌──────────────────────────────────────────────────────────────────────┐
│  NAVBAR                                                              │
├──────────────────────────────────────────────────────────────────────┤
│  HERO — IMMERSIVE PRODUCT SPOTLIGHT                                  │
├──────────────────────────────────────────────────────────────────────┤
│  CATEGORY QUICK-NAV STRIP                                            │
├──────────────────────────────────────────────────────────────────────┤
│  ROW: "Top Picks This Week"                                          │
├──────────────────────────────────────────────────────────────────────┤
│  ROW: "Trending in Beauty"                                           │
├──────────────────────────────────────────────────────────────────────┤
│  ROW: "Best Under ¥1000"                                             │
├──────────────────────────────────────────────────────────────────────┤
│  ROW: "New Reviews"                                                  │
├──────────────────────────────────────────────────────────────────────┤
│  NEWSLETTER / COMMUNITY CTA                                          │
├──────────────────────────────────────────────────────────────────────┤
│  RICH FOOTER                                                         │
└──────────────────────────────────────────────────────────────────────┘
```

---

## 1. Navbar (Sticky, 64px height)

```
┌──────────────────────────────────────────────────────────────────────┐
│  [Logo]   Search [________________________🔍]   [EN/JP]  [☰ Menu]  │
└──────────────────────────────────────────────────────────────────────┘
```

### Desktop (1440px)
```
┌──────────────────────────────────────────────────────────────────────────┐
│ ◆ Chartedly    │ Search [_______________________________🔍]  │ EN|JP │ ☰│
│                │                                              │       │  │
│  Beauty  Tech  │  Electronics  Kitchen  Health  Outdoor       │       │  │
│  Living  Baby  │                                              │       │  │
└──────────────────────────────────────────────────────────────────────────┘
```

**Specifications:**
- Logo: Left-aligned, 32px height, links to homepage
- Search bar: Centered, 400px max-width, 40px height, rounded-full (pill shape)
  - Placeholder: "Search products, categories, brands..." / "商品・カテゴリ・ブランドを検索..."
  - On focus: expands to 500px, shows recent searches dropdown
- Language toggle: "EN" / "JP" pill switcher, 32px height
- Hamburger menu (mobile/tablet): reveals slide-out navigation
- Background: white, `box-shadow: 0 1px 0 rgba(0,0,0,0.08)` when scrolled
- Z-index: 1000 (always on top)

### Mobile (375px)
```
┌─────────────────────────────────────┐
│ ◆ Chartedly       [🔍] [EN] [☰]   │
└─────────────────────────────────────┘
```
- Search icon expands to full-width overlay on tap
- Language shows current language only, tap to toggle

---

## 2. Hero — Immersive Product Spotlight

```
┌──────────────────────────────────────────────────────────────────────┐
│                                                                      │
│         [CINEMATIC PRODUCT IMAGE — FULL WIDTH]                       │
│                                                                      │
│    ┌─────────────────────────────────────┐                           │
│    │  ★ #1 Best Sunscreen 2026           │                           │
│    │                                     │                           │
│    │  Anessa Perfect UV                  │                           │
│    │  Skincare Milk SPF50+               │                           │
│    │                                     │                           │
│    │  Score: ████████░░ 9.2              │                           │
│    │  ¥2,480                             │                           │
│    │                                     │                           │
│    │  [See Full Review →]                │                           │
│    └─────────────────────────────────────┘                           │
│                                                                      │
│              ● ○ ○ ○ ○          ← dot indicators (5 items)          │
│                                                                      │
│  ◀                                                          ▶       │
│                                                                      │
└──────────────────────────────────────────────────────────────────────┘
```

**Specifications:**
- Height: 70vh desktop, 50vh tablet, 40vh mobile (min 320px, max 600px)
- Full-width, no side margins
- Product image: object-fit cover, centered
- Gradient overlay: `linear-gradient(to right, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.2) 50%, transparent 100%)`
- Text overlay: left-aligned, max-width 480px, padding-left 80px (desktop), 24px (mobile)
- Auto-rotate: 6-second interval, pauses on hover/touch
- Dot indicators: centered below image, 10px dots, 8px gap
- Arrow navigation: 48px circular buttons, `rgba(255,255,255,0.3)` background, visible on hover (desktop)
- Mobile: swipe-enabled, no arrow buttons, dots visible
- Content in overlay:
  - Rank badge: "#1 Best [Category] 2026" — gold background, uppercase, 12px, letter-spacing 1px
  - Product name: 32px (desktop) / 24px (mobile), font-weight 700, white
  - Score bar: 200px wide, 8px tall, gradient green-to-blue fill
  - Price: 20px, font-weight 600, white
  - CTA button: ghost style (white border, transparent bg), 16px, padding 12px 24px
- Transitions: 0.6s ease-in-out crossfade between slides
- Data source: Top 5 products across all categories, curated weekly

---

## 3. Category Quick-Nav Strip

```
┌──────────────────────────────────────────────────────────────────────┐
│                                                                      │
│  [🧴]    [📱]    [🍳]    [💊]    [🏕]    [🧹]    [👶]    [📚]     │
│  Beauty  Tech    Kitchen  Health  Outdoor  Living  Baby    Books    │
│                                                                      │
│                        ← horizontal scroll →                         │
└──────────────────────────────────────────────────────────────────────┘
```

**Specifications:**
- Container: full-width, padding 24px 0, background white
- Horizontal scroll: `overflow-x: auto`, `-webkit-overflow-scrolling: touch`
- Hide scrollbar: `::-webkit-scrollbar { display: none }`
- Each item: 80px wide (desktop) / 64px (mobile), flex-shrink 0
- Icon: 40px (desktop) / 32px (mobile), SVG, single color (gray-600)
- Label: 12px, font-weight 500, gray-700, centered below icon
- Gap between items: 16px (desktop) / 12px (mobile)
- Hover: icon color transitions to brand blue, label darkens
- Active state: blue underline (2px), icon fills blue
- Desktop: centered if fewer than container width, scroll arrows at edges if overflow
- Fade indicators: `linear-gradient(to right, white 0%, transparent 8%, transparent 92%, white 100%)` overlay on sides when scrollable
- Categories (8 default): Beauty, Tech, Kitchen, Health, Outdoor, Living, Baby, Books
- Tap target: entire 80x80 area (meets 44px minimum)

---

## 4. Carousel Row — "Top Picks This Week"

```
┌──────────────────────────────────────────────────────────────────────┐
│                                                                      │
│  Top Picks This Week 今週のおすすめ           [See All →]            │
│                                                                      │
│  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐      │
│  │ [Image] │ │ [Image] │ │ [Image] │ │ [Image] │ │ [Image] │      │
│  │         │ │         │ │         │ │         │ │         │      │
│  │ Product │ │ Product │ │ Product │ │ Product │ │ Product │      │
│  │ Name    │ │ Name    │ │ Name    │ │ Name    │ │ Name    │      │
│  │ Brand   │ │ Brand   │ │ Brand   │ │ Brand   │ │ Brand   │      │
│  │ ¥X,XXX  │ │ ¥X,XXX  │ │ ¥X,XXX  │ │ ¥X,XXX  │ │ ¥X,XXX  │      │
│  │ [9.2]   │ │ [8.8]   │ │ [8.5]   │ │ [8.3]   │ │ [8.1]   │      │
│  └─────────┘ └─────────┘ └─────────┘ └─────────┘ └─────────┘      │
│                                                                      │
│ ◀                                                          ▶        │
│                                                                      │
└──────────────────────────────────────────────────────────────────────┘
```

**Specifications:**
- Section padding: 40px 80px (desktop) / 24px 16px (mobile)
- Section title: 24px (desktop) / 20px (mobile), font-weight 700, gray-900
- Bilingual title: EN primary (bold) + JP secondary (14px, gray-500, below or inline)
- "See All" link: 14px, brand blue, font-weight 500, right-aligned
- Card container: horizontal scroll with snap points `scroll-snap-type: x mandatory`
- Each card: `scroll-snap-align: start`
- Cards per view: 5 (desktop 1440) / 3 (tablet 768) / 1.2 (mobile 375 — peek next card)
- Card gap: 16px
- Arrow buttons: 40px circles, positioned at row edges, vertically centered on cards
  - Left arrow: hidden when at start
  - Right arrow: hidden when at end
  - Desktop only (hidden on touch devices)
- Mobile: free horizontal scroll with momentum, peek next card by 20% to signal scrollability
- Card component: See `product-card.md` for full spec
- Lazy loading: cards load images when within 200px of viewport

---

## 5. Carousel Row — "Trending in Beauty"

Same layout as Section 4 with these differences:
- Title: "Trending in Beauty" / "ビューティートレンド"
- Filter chips below title (optional): "Skincare" | "Makeup" | "Hair" | "Body"
- Cards show category-specific badges (e.g., "SPF50+", "Organic")
- Pink/rose accent on section divider line (2px, 40px wide, left-aligned above title)

```
┌──────────────────────────────────────────────────────────────────────┐
│  ── (rose accent line)                                               │
│  Trending in Beauty ビューティートレンド       [See All →]           │
│                                                                      │
│  [Skincare] [Makeup] [Hair] [Body]  ← filter chips                  │
│                                                                      │
│  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐      │
│  │  ...     │ │  ...     │ │  ...     │ │  ...     │ │  ...     │      │
│  └─────────┘ └─────────┘ └─────────┘ └─────────┘ └─────────┘      │
│                                                                      │
└──────────────────────────────────────────────────────────────────────┘
```

**Filter chip specs:**
- Pill shape, 32px height, padding 0 16px
- Default: gray-100 bg, gray-700 text
- Active: brand-blue bg, white text
- Font: 13px, font-weight 500
- Gap: 8px
- Horizontal scroll on mobile

---

## 6. Carousel Row — "Best Under ¥1000"

Same layout as Section 4 with these differences:
- Title: "Best Under ¥1000" / "¥1,000以下のベスト"
- Price badge is prominent (green background pill on card)
- Green accent line above title
- Cards sorted by score descending, all items ¥1,000 or under

```
┌──────────────────────────────────────────────────────────────────────┐
│  ── (green accent line)                                              │
│  Best Under ¥1000 ¥1,000以下のベスト           [See All →]          │
│                                                                      │
│  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐      │
│  │ [💚¥890]│ │ [💚¥750]│ │ [💚¥999]│ │ [💚¥480]│ │ [💚¥680]│      │
│  │  ...     │ │  ...     │ │  ...     │ │  ...     │ │  ...     │      │
│  └─────────┘ └─────────┘ └─────────┘ └─────────┘ └─────────┘      │
│                                                                      │
└──────────────────────────────────────────────────────────────────────┘
```

---

## 7. Carousel Row — "New Reviews"

Same layout as Section 4 with these differences:
- Title: "New Reviews" / "新着レビュー"
- Blue accent line above title
- Cards show "NEW" badge (red pill, 10px, uppercase) in top-right of image
- Subtitle under title: "Published this week" / "今週公開" — 14px, gray-400
- Cards sorted by publication date descending

---

## 8. Newsletter / Community CTA

```
┌──────────────────────────────────────────────────────────────────────┐
│                                                                      │
│           ┌──────────────────────────────────────────┐               │
│           │                                          │               │
│           │   Stay in the Loop                       │               │
│           │   最新情報をお届け                        │               │
│           │                                          │               │
│           │   Weekly product picks, new reviews,     │               │
│           │   and Japan living tips. No spam.        │               │
│           │                                          │               │
│           │   [email@example.com     ] [Subscribe]   │               │
│           │                                          │               │
│           │   1,200+ readers  •  Weekly  •  Free     │               │
│           │                                          │               │
│           └──────────────────────────────────────────┘               │
│                                                                      │
└──────────────────────────────────────────────────────────────────────┘
```

**Specifications:**
- Section: full-width, background gray-50, padding 64px 0
- Card: centered, max-width 640px, background white, rounded-2xl, padding 48px
- Box shadow: `0 4px 24px rgba(0,0,0,0.06)`
- Heading: 28px, font-weight 700, gray-900
- JP subtitle: 16px, gray-500
- Description: 16px, gray-600, line-height 1.6
- Email input + button: inline flex, 48px height
  - Input: flex-grow, rounded-l-lg, border gray-200, padding 0 16px
  - Button: "Subscribe" / "登録", brand-blue bg, white text, rounded-r-lg, padding 0 24px, font-weight 600
- Social proof: 14px, gray-400, centered, margin-top 16px
- Mobile: input and button stack vertically, full-width

---

## 9. Rich Footer

```
┌──────────────────────────────────────────────────────────────────────┐
│                                                                      │
│  ◆ Chartedly                                                         │
│  Japan's product guide for                                           │
│  everyone. 日本のプロダクトガイド                                      │
│                                                                      │
│  Categories        Company          Resources        Follow Us       │
│  ──────────        ───────          ─────────        ─────────       │
│  Beauty            About            How We Test      Twitter/X       │
│  Tech              Contact          Methodology      Instagram       │
│  Kitchen           Careers          Affiliate Info   YouTube         │
│  Health            Press            Privacy Policy   LINE            │
│  Outdoor           Partners         Terms of Use                     │
│  Living                             Cookie Policy                    │
│  Baby                                                                │
│  Books                                                               │
│                                                                      │
│  ──────────────────────────────────────────────────────────────────  │
│  © 2026 Chartedly. All rights reserved.         [EN] [JP]           │
│  Chartedly is a LAIRIA Holdings property.                            │
│                                                                      │
└──────────────────────────────────────────────────────────────────────┘
```

**Specifications:**
- Background: gray-900, text white/gray-400
- Padding: 64px 80px (desktop) / 40px 16px (mobile)
- Logo + tagline: left column, 20px logo text, 14px tagline
- 4-column grid (desktop) / 2-column (tablet) / stacked accordion (mobile)
- Column headers: 14px, uppercase, letter-spacing 1px, gray-400, font-weight 600
- Links: 14px, gray-300, hover: white, line-height 2.0
- Social icons: 24px SVG, gray-400, hover: white
- Bottom bar: border-top 1px gray-800, padding-top 24px, margin-top 40px
- Copyright: 13px, gray-500
- Language toggle: duplicated in footer for accessibility
- Mobile accordion: column headers are tappable, content hidden by default, chevron indicator

---

## Responsive Behavior Summary

| Element | Desktop (1440) | Tablet (768) | Mobile (375) |
|---|---|---|---|
| Navbar | Full with inline search + categories | Search icon, hamburger | Search icon, hamburger |
| Hero | 70vh, side text overlay | 50vh, bottom text overlay | 40vh, bottom text overlay |
| Category strip | Centered row | Horizontal scroll | Horizontal scroll |
| Carousel rows | 5 cards visible | 3 cards visible | 1.2 cards (peek) |
| Newsletter | Inline input + button | Inline input + button | Stacked vertically |
| Footer | 4 columns | 2 columns | Accordion |

---

## Scroll & Performance

- Lazy load all images below the fold (`loading="lazy"`)
- Hero images preloaded (first 2 slides)
- Carousel rows use `IntersectionObserver` to load when 200px from viewport
- Skeleton loading for each row (see `states-catalog.md`)
- Smooth scroll behavior: `scroll-behavior: smooth` on carousel containers
- Total page weight target: < 1.5MB initial load (above fold)
