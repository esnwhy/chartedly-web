# Product Detail Page Wireframe — Chartedly

## URL Pattern
`/products/{category-slug}/{product-slug}`
Example: `/products/beauty/anessa-perfect-uv-skincare-milk`

---

## Full Page Layout

```
┌──────────────────────────────────────────────────────────────────────┐
│  NAVBAR (sticky)                                                     │
├──────────────────────────────────────────────────────────────────────┤
│  BREADCRUMBS                                                         │
├──────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  ┌─────────────────────┐  ┌──────────────────────────────────┐      │
│  │                     │  │  TITLE + BRAND + BADGES           │      │
│  │   HERO IMAGE        │  │                                   │      │
│  │   GALLERY           │  │  SCORE VISUALIZATION              │      │
│  │                     │  │  (large + radar chart)             │      │
│  │                     │  │                                   │      │
│  │                     │  │  PRICE + PURCHASE CTAs            │      │
│  │                     │  │                                   │      │
│  │   [thumb][thumb]    │  │  QUICK VERDICT BOX                │      │
│  │   [thumb][thumb]    │  │                                   │      │
│  └─────────────────────┘  └──────────────────────────────────┘      │
│                                                                      │
├──────────────────────────────────────────────────────────────────────┤
│  PROS / CONS                                                         │
├──────────────────────────────────────────────────────────────────────┤
│  SPECS TABLE                                                         │
├──────────────────────────────────────────────────────────────────────┤
│  FULL REVIEW                                                         │
├──────────────────────────────────────────────────────────────────────┤
│  "HOW WE TEST" ACCORDION                                            │
├──────────────────────────────────────────────────────────────────────┤
│  RELATED PRODUCTS CAROUSEL                                           │
├──────────────────────────────────────────────────────────────────────┤
│  FOOTER                                                              │
└──────────────────────────────────────────────────────────────────────┘
```

---

## 1. Breadcrumbs

```
Home  >  Beauty  >  Sunscreen  >  Anessa Perfect UV Skincare Milk
```

**Specifications:**
- Position: below navbar, padding 16px 80px (desktop) / 16px (mobile)
- Font: 13px, gray-500
- Separator: ">" or chevron-right SVG, 12px, gray-300
- Links: gray-500, hover: brand-blue, underline on hover
- Current page (last item): gray-700, font-weight 500, not a link
- Mobile: horizontal scroll if overflow, hide middle items with "..." if > 3 levels
- Schema markup: `BreadcrumbList` structured data

---

## 2. Hero Image Gallery

### Desktop Layout (Left Column, 55% width)

```
┌───────────────────────────────────┐
│                                   │
│                                   │
│     [MAIN PRODUCT IMAGE]         │
│                                   │
│         600 x 400                │
│                                   │
│                                   │
│                                   │
│    ◀                        ▶    │ ← navigation arrows
│                                   │
├───────┬───────┬───────┬──────────┤
│[thumb]│[thumb]│[thumb]│ [thumb]  │ ← thumbnail strip
│ 80x80 │ 80x80 │ 80x80 │  80x80  │
└───────┴───────┴───────┴──────────┘
```

**Specifications:**
- Main image: max-width 600px, aspect ratio 3:2, object-fit contain, background gray-50
- Rounded: 12px
- Click to open lightbox (full-screen overlay with zoom)
- Navigation arrows: 40px circles, gray-100 bg, gray-600 icon, show on hover
- Thumbnail strip: below main image, 80px x 80px each, 8px gap
  - Active thumbnail: 2px blue-600 border
  - Inactive: 1px gray-200 border, opacity 0.7
  - Hover: opacity 1.0
- Image count indicator: "1/6" pill in bottom-right of main image, 12px, gray-700 on white/80%

### Mobile Layout (Full Width)

```
┌─────────────────────────────────────┐
│                                     │
│       [SWIPEABLE IMAGE]            │
│                                     │
│          ● ○ ○ ○ ○ ○               │ ← dot indicators
│                                     │
└─────────────────────────────────────┘
```

- Full-width, aspect ratio 4:3
- Swipe-enabled (touch gesture), `scroll-snap-type: x mandatory`
- Dot indicators: centered, 8px dots
- No thumbnail strip on mobile
- Pinch-to-zoom enabled

---

## 3. Title + Brand + Badges (Right Column, 45% width)

```
┌──────────────────────────────────────┐
│                                      │
│  #1 in Sunscreen                     │ ← rank line
│                                      │
│  Anessa Perfect UV                   │ ← product name
│  Skincare Milk SPF50+ PA++++        │
│                                      │
│  by Shiseido                         │ ← brand (linked)
│                                      │
│  [🏆 Editor's Choice] [🆕 New 2026] │ ← badge row
│                                      │
└──────────────────────────────────────┘
```

**Specifications:**
- Rank line: 14px, font-weight 600, brand-blue
  - Format: "#1 in [Subcategory]" — links to ranking page
- Product name: 28px (desktop) / 22px (mobile), font-weight 700, gray-900, line-height 1.3
- Brand: 16px, gray-500, "by [Brand]" — brand name is a link (underline on hover)
- Badge row: flex-wrap, gap 8px, margin-top 12px
  - Each badge: pill, 26px height, 12px text, font-weight 600
  - Editor's Choice: amber-50 bg, amber-700 text, trophy icon
  - New: blue-50 bg, blue-700 text
  - Best Value: green-50 bg, green-700 text
- Mobile: stacks below image gallery, full-width

---

## 4. Score Visualization

```
┌──────────────────────────────────────┐
│                                      │
│  ┌──────────┐                        │
│  │          │    Overall Score       │
│  │   9.2    │    ████████████░░ 9.2  │
│  │  /10     │                        │
│  │          │    Effectiveness       │
│  └──────────┘    █████████░░░░ 9.0   │
│   large circle                       │
│                  Value               │
│                  ██████████░░░ 8.5   │
│                                      │
│                  Ease of Use         │
│                  ████████████░ 9.5   │
│                                      │
│                  Packaging           │
│                  ████████░░░░░ 8.0   │
│                                      │
│                  Ingredients         │
│                  ██████████░░░ 9.0   │
│                                      │
│  ┌──────────────────────────┐        │
│  │    [RADAR CHART]         │        │
│  │                          │        │
│  │      Effectiveness       │        │
│  │        ╱    ╲            │        │
│  │  Ingr /      \ Value    │        │
│  │      ╲  ████  ╱         │        │
│  │  Pack  ╲    ╱  Ease     │        │
│  │                          │        │
│  └──────────────────────────┘        │
│                                      │
└──────────────────────────────────────┘
```

**Specifications:**

### Large Score Circle
- Size: 96px diameter
- Border: 4px, color matches score tier (green/blue/yellow/red)
- Score text: 36px, font-weight 800, centered
- "/10" text: 14px, gray-400, below score
- Background: white
- Box shadow: `0 2px 12px rgba(0,0,0,0.08)`

### Score Breakdown Bars
- Each bar: label (14px, gray-600) above bar
- Bar: 100% width (of container), 8px height, rounded-full
- Fill: gradient matching score tier color
- Score value: 14px, font-weight 600, right of bar
- Gap between bars: 16px
- Categories vary by product type (editable by content team)

### Radar Chart
- Size: 240px x 240px
- 5-axis (matching breakdown categories)
- Fill: brand-blue at 20% opacity
- Stroke: brand-blue, 2px
- Grid lines: gray-200, 3 concentric levels
- Axis labels: 12px, gray-500
- Interactive: hover on axis shows exact score tooltip
- Library: lightweight SVG (no heavy charting lib) or canvas
- Mobile: hidden by default, "Show Chart" toggle to expand

---

## 5. Price + Purchase CTAs

```
┌──────────────────────────────────────┐
│                                      │
│  ¥2,480                             │ ← main price
│  Tax included • Updated Mar 2026    │
│                                      │
│  ┌────────────────────────────────┐  │
│  │ 🛒  Buy on Amazon     ¥2,480  │  │ ← primary CTA
│  └────────────────────────────────┘  │
│  ┌────────────────────────────────┐  │
│  │ 🛒  Buy on Rakuten    ¥2,380  │  │ ← secondary CTA
│  └────────────────────────────────┘  │
│  ┌────────────────────────────────┐  │
│  │ 🛒  Yahoo Shopping    ¥2,500  │  │ ← secondary CTA
│  └────────────────────────────────┘  │
│                                      │
│  ⓘ Affiliate disclosure             │ ← small text link
│                                      │
└──────────────────────────────────────┘
```

**Specifications:**

### Price Display
- Price: 28px, font-weight 800, gray-900
- Subtext: 13px, gray-400 ("Tax included" / "税込み" + last updated date)
- If multiple prices: show lowest with "from" prefix

### Purchase Buttons
- Stack vertically, full-width within column, 8px gap
- Primary (Amazon): 48px height, orange-500 bg (#F59E0B), dark text, font-weight 600
  - Amazon logo icon (16px SVG) left-aligned
  - Price right-aligned
  - Rounded-lg
- Secondary (Rakuten, Yahoo): 48px height, white bg, gray-200 border
  - Respective retailer icon left-aligned
  - Price right-aligned
  - Hover: gray-50 bg
- All buttons: `target="_blank"`, `rel="noopener noreferrer sponsored"`
- Affiliate disclosure: 12px, gray-400, "i" icon, links to /affiliate-disclosure page
- Mobile: buttons become fixed bottom bar (see mobile section)

### Mobile Fixed Purchase Bar
```
┌─────────────────────────────────────┐
│  ¥2,480   [Buy on Amazon →]        │ ← sticky bottom, 64px
└─────────────────────────────────────┘
```
- Fixed to bottom, full-width, white bg, top border 1px gray-200
- Price: left-aligned, 18px, font-weight 700
- Button: right-aligned, orange-500, rounded-lg, "Buy on Amazon" (best price retailer)
- Shadow: `0 -4px 12px rgba(0,0,0,0.08)`
- Disappears when purchase CTA section is in viewport
- Z-index: 900

---

## 6. Quick Verdict Box

```
┌──────────────────────────────────────┐
│                                      │
│  💡 Quick Verdict                    │
│                                      │
│  "The gold standard in Japanese      │
│  sunscreen. Lightweight, powerful    │
│  UV protection that works under      │
│  makeup."                            │
│                                      │
└──────────────────────────────────────┘
```

**Specifications:**
- Background: blue-50
- Border-left: 4px solid brand-blue
- Padding: 20px 24px
- Rounded: 8px (right corners only, left is flat due to border)
- Label: "Quick Verdict" / "クイック評価", 13px, font-weight 600, brand-blue, uppercase
- Text: 16px, gray-800, font-style italic, line-height 1.6
- Max: 2-3 sentences
- Margin: 24px 0

---

## 7. Pros / Cons

```
┌──────────────────────────────────────────────────────────────────────┐
│                                                                      │
│  ┌──────────────────────┐    ┌──────────────────────┐               │
│  │ ✅ Pros              │    │ ❌ Cons              │               │
│  │                      │    │                      │               │
│  │ ✓ SPF50+ PA++++     │    │ ✗ Higher price point │               │
│  │   strongest rating   │    │   vs drugstore       │               │
│  │                      │    │                      │               │
│  │ ✓ Lightweight milk   │    │ ✗ Can feel drying   │               │
│  │   texture            │    │   on very dry skin   │               │
│  │                      │    │                      │               │
│  │ ✓ Works as makeup   │    │ ✗ Limited shade     │               │
│  │   primer             │    │   range              │               │
│  │                      │    │                      │               │
│  │ ✓ Water resistant   │    │                      │               │
│  │                      │    │                      │               │
│  │ ✓ No white cast     │    │                      │               │
│  │                      │    │                      │               │
│  └──────────────────────┘    └──────────────────────┘               │
│                                                                      │
└──────────────────────────────────────────────────────────────────────┘
```

**Specifications:**
- 2-column layout desktop, stacked mobile
- Pros card: green-50 bg, green-600 left-border (4px), rounded-lg
- Cons card: red-50 bg, red-600 left-border (4px), rounded-lg
- Header: 18px, font-weight 700, respective color
- Each point: 14px, gray-700, line-height 1.6
  - Icon: checkmark (green-500) for pros, x-mark (red-500) for cons, 16px
  - Bold first phrase, normal explanation
- Padding: 24px
- Gap between cards: 24px
- Max 6 pros, 4 cons visible. More hidden behind "Show more" toggle

---

## 8. Specs Table

```
┌──────────────────────────────────────────────────────────────────────┐
│                                                                      │
│  Specifications 仕様                                                 │
│                                                                      │
│  ┌───────────────────┬──────────────────────────────────────┐       │
│  │ SPF Rating        │ SPF50+ PA++++                        │       │
│  ├───────────────────┼──────────────────────────────────────┤       │
│  │ Volume            │ 60ml                                 │       │
│  ├───────────────────┼──────────────────────────────────────┤       │
│  │ Skin Type         │ All skin types                       │       │
│  ├───────────────────┼──────────────────────────────────────┤       │
│  │ Water Resistant   │ Yes (80 minutes)                     │       │
│  ├───────────────────┼──────────────────────────────────────┤       │
│  │ Fragrance         │ Fragrance-free                       │       │
│  ├───────────────────┼──────────────────────────────────────┤       │
│  │ Key Ingredients   │ Zinc Oxide, Titanium Dioxide         │       │
│  ├───────────────────┼──────────────────────────────────────┤       │
│  │ Made In           │ Japan                                │       │
│  └───────────────────┴──────────────────────────────────────┘       │
│                                                                      │
│  [▼ Show all 12 specs]                                               │
│                                                                      │
└──────────────────────────────────────────────────────────────────────┘
```

**Specifications:**
- Section title: 22px, font-weight 700, gray-900 + JP subtitle 14px gray-400
- Table: full-width, rounded-lg, border 1px gray-200
- Label column: 35% width, gray-50 bg, 14px, font-weight 500, gray-600
- Value column: 65% width, 14px, gray-900
- Row height: 48px, vertical-align middle
- Alternating row bg: white / gray-50 (subtle)
- Dividers: 1px gray-100
- Mobile: show first 5 rows, collapse rest behind "Show all [N] specs" button
  - Toggle: 14px, brand-blue, chevron icon, full-width tap target
  - Animate expand: `max-height` transition 0.3s
- Desktop: show first 8, expand for more

---

## 9. Full Review

```
┌──────────────────────────────────────────────────────────────────────┐
│                                                                      │
│  Our Review レビュー                                                 │
│                                                                      │
│  ── (brand-blue accent, 40px)                                        │
│                                                                      │
│  [Rich text content — multiple paragraphs]                           │
│                                                                      │
│  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do     │
│  eiusmod tempor incididunt ut labore et dolore magna aliqua...       │
│                                                                      │
│  [INLINE IMAGE — test photo, full-width, rounded-lg]                │
│  Caption: "Applied texture test on forearm"                          │
│                                                                      │
│  Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris  │
│  nisi ut aliquip ex ea commodo consequat...                          │
│                                                                      │
│  [H3 subheading within review]                                       │
│                                                                      │
│  More content...                                                     │
│                                                                      │
│  Reviewed by [Author Name] • Published March 15, 2026              │
│  Last updated: March 20, 2026                                        │
│                                                                      │
└──────────────────────────────────────────────────────────────────────┘
```

**Specifications:**
- Max-width: 720px, centered
- Body text: 16px, gray-700, line-height 1.8
- Headings (h3): 20px, font-weight 600, gray-900, margin-top 32px
- Images: full content-width, rounded-lg, margin 24px 0
- Image captions: 13px, gray-400, centered, italic
- Author attribution: 14px, gray-500, border-top 1px gray-100, padding-top 16px
- Author name: font-weight 600, linked to author page
- Dates: gray-400

---

## 10. "How We Test" Accordion

```
┌──────────────────────────────────────────────────────────────────────┐
│                                                                      │
│  ┌────────────────────────────────────────────────────────────────┐  │
│  │  How We Test Sunscreen 日焼け止めのテスト方法              [▼] │  │
│  └────────────────────────────────────────────────────────────────┘  │
│                                                                      │
│  (expanded):                                                         │
│  ┌────────────────────────────────────────────────────────────────┐  │
│  │  How We Test Sunscreen 日焼け止めのテスト方法              [▲] │  │
│  ├────────────────────────────────────────────────────────────────┤  │
│  │                                                                │  │
│  │  Our sunscreen testing methodology involves:                   │  │
│  │                                                                │  │
│  │  1. UV Protection Testing                                     │  │
│  │     We measure actual SPF performance using...                │  │
│  │                                                                │  │
│  │  2. Texture & Application                                     │  │
│  │     Panel of 10 testers rates spreadability...                │  │
│  │                                                                │  │
│  │  3. Longevity Testing                                         │  │
│  │     4-hour wear test under controlled conditions...           │  │
│  │                                                                │  │
│  │  4. Ingredient Analysis                                       │  │
│  │     Board-certified dermatologist reviews...                  │  │
│  │                                                                │  │
│  │  5. Value Assessment                                          │  │
│  │     Price per ml compared to category average...              │  │
│  │                                                                │  │
│  │  [Read our full methodology →]                                │  │
│  │                                                                │  │
│  └────────────────────────────────────────────────────────────────┘  │
│                                                                      │
└──────────────────────────────────────────────────────────────────────┘
```

**Specifications:**
- Background: gray-50
- Border: 1px gray-200, rounded-xl
- Header: 48px height, padding 0 24px, flex between title and chevron
- Title: 16px, font-weight 600, gray-800 + JP 14px gray-400
- Chevron: 20px, gray-400, rotates 180deg on open
- Content padding: 24px
- Text: 14px, gray-600, line-height 1.7
- Numbered list: 16px numbers, font-weight 700, brand-blue
- "Full methodology" link: 14px, brand-blue, font-weight 500
- Default state: collapsed
- Animation: `max-height` + opacity transition 0.3s ease
- Schema: FAQPage structured data

---

## 11. Related Products Carousel

```
┌──────────────────────────────────────────────────────────────────────┐
│                                                                      │
│  You Might Also Like こちらもおすすめ         [See All →]            │
│                                                                      │
│  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐      │
│  │ Related │ │ Related │ │ Related │ │ Related │ │ Related │      │
│  │ Product │ │ Product │ │ Product │ │ Product │ │ Product │      │
│  │ Card    │ │ Card    │ │ Card    │ │ Card    │ │ Card    │      │
│  └─────────┘ └─────────┘ └─────────┘ └─────────┘ └─────────┘      │
│                                                                      │
└──────────────────────────────────────────────────────────────────────┘
```

- Identical to homepage carousel row component
- Products: same category, sorted by score, excluding current product
- Fallback: if fewer than 5 in subcategory, fill from parent category

---

## Mobile-Specific Layout

On mobile (< 768px), the two-column hero layout collapses to single column:

```
┌─────────────────────────────────────┐
│  NAVBAR                             │
├─────────────────────────────────────┤
│  Breadcrumbs (scrollable)           │
├─────────────────────────────────────┤
│  [SWIPEABLE IMAGE GALLERY]         │
│         ● ○ ○ ○ ○                  │
├─────────────────────────────────────┤
│  #1 in Sunscreen                    │
│  Product Name Here                  │
│  by Brand                           │
│  [badges]                           │
├─────────────────────────────────────┤
│  ┌─────────┐  Overall: 9.2         │
│  │  9.2    │  ████████████░░       │
│  │  /10    │                        │
│  └─────────┘  [Show breakdown ▼]   │
├─────────────────────────────────────┤
│  💡 Quick Verdict                   │
│  "Gold standard in sunscreen..."    │
├─────────────────────────────────────┤
│  ┌─ Pros ──────────────────────┐   │
│  │ ✓ SPF50+ PA++++             │   │
│  │ ✓ Lightweight               │   │
│  └─────────────────────────────┘   │
│  ┌─ Cons ──────────────────────┐   │
│  │ ✗ Higher price point        │   │
│  └─────────────────────────────┘   │
├─────────────────────────────────────┤
│  Specs (5 shown) [Show all ▼]     │
├─────────────────────────────────────┤
│  Our Review                         │
│  [full text]                        │
├─────────────────────────────────────┤
│  [How We Test ▼]                   │
├─────────────────────────────────────┤
│  Related Products [→ scroll]       │
├─────────────────────────────────────┤
│  Footer                             │
├─────────────────────────────────────┤
│  [¥2,480   Buy on Amazon →]       │ ← sticky bottom bar
└─────────────────────────────────────┘
```

---

## Structured Data (SEO)

- Product schema (name, image, brand, price, rating)
- BreadcrumbList
- Review schema (author, datePublished, ratingValue)
- FAQPage for "How We Test" section
- Aggregate rating if multiple reviews exist

---

## Performance Notes

- Hero images: preload first image, lazy-load rest
- Radar chart: render after above-fold content (`requestIdleCallback`)
- Review content: if > 2000 words, truncate at 800 with "Read full review" expand
- Related products: load on scroll (IntersectionObserver)
- Total above-fold LCP target: < 2.5s
