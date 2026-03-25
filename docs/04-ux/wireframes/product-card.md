# Product Card Component Wireframe — Chartedly

## Overview

The product card is the atomic unit of Chartedly's UI. It appears in every carousel, grid, search result, and comparison context. It must communicate **what**, **how good**, and **how much** within 3 seconds.

---

## Card Dimensions

| Context | Width | Height | Image Ratio |
|---|---|---|---|
| Carousel (desktop) | 240px | 340px | 3:2 |
| Carousel (mobile) | 280px | 360px | 3:2 |
| Grid view | 280px | 370px | 3:2 |
| List view | 100% (row) | 120px | 1:1 thumbnail |

---

## State 1: Default

```
┌───────────────────────────┐
│                           │
│    [PRODUCT IMAGE]        │ ← 60% of card height
│                           │
│  ┌──┐               ┌──┐ │
│  │#2│               │9.2│ │ ← rank badge (top-left) + score badge (top-right)
│  └──┘               └──┘ │
│                           │
├───────────────────────────┤
│                           │
│  Product Name Goes Here   │ ← 2 lines max, ellipsis overflow
│  That Might Be Long       │
│                           │
│  Brand Name               │ ← 1 line, gray
│                           │
│  ¥2,480                   │ ← price, bold
│                           │
│  [🏆 Editor's Choice]     │ ← award badge (optional)
│                           │
└───────────────────────────┘
```

### Image Area (Top 60%)
- Aspect ratio: 3:2, `object-fit: cover`
- Background: gray-100 (visible while loading)
- Border radius: 12px top-left, 12px top-right, 0 bottom
- Hover zoom: `transform: scale(1.05)` with `overflow: hidden` on container

### Rank Badge (Overlaid, Top-Left of Image)
- Position: top 12px, left 12px
- Size: 32px x 32px circle
- Ranks 1-3: gold (#FFD700) bg, dark text, font-weight 800
- Ranks 4-10: gray-700 bg, white text
- Ranks 11+: no badge shown
- Font: 14px, centered
- Box shadow: `0 2px 8px rgba(0,0,0,0.2)`

```
Rank badge variants:
  ┌───┐   ┌───┐   ┌───┐   ┌───┐
  │ 1 │   │ 2 │   │ 3 │   │ 7 │
  └───┘   └───┘   └───┘   └───┘
  gold    gold    gold    gray
  + ring  + ring  + ring
```

### Score Badge (Overlaid, Top-Right of Image)
- Position: top 12px, right 12px
- Size: auto width (min 40px), 28px height, rounded-full (pill)
- Background by score:
  - 9.0-10.0: green-600 (#16A34A)
  - 7.0-8.9: blue-600 (#2563EB)
  - 5.0-6.9: yellow-600 (#CA8A04)
  - Below 5.0: red-600 (#DC2626)
- Text: white, 13px, font-weight 700
- Format: "9.2" (one decimal place always)
- Box shadow: `0 2px 8px rgba(0,0,0,0.2)`

### Product Name
- Font: 15px, font-weight 600, gray-900
- Max lines: 2
- Overflow: `display: -webkit-box; -webkit-line-clamp: 2; overflow: hidden`
- Line height: 1.4
- Margin top: 12px

### Brand Name
- Font: 13px, font-weight 400, gray-500
- Max lines: 1, ellipsis overflow
- Margin top: 4px

### Price
- Font: 17px, font-weight 700, gray-900
- Format: "¥X,XXX" (with comma separator)
- Margin top: 8px
- If price unavailable: show "Check Price" in brand-blue, 14px

### Award Badge (Optional)
- Shown only if product has an editorial award
- Pill shape: 24px height, padding 0 10px
- Background: amber-50 (#FFFBEB), border 1px amber-200
- Text: 11px, font-weight 600, amber-800
- Icon: small trophy/star SVG, 14px, inline before text
- Variants: "Editor's Choice", "Best Value", "Best Premium", "Best for Beginners"
- Margin top: 8px

### Card Container
- Background: white
- Border radius: 12px
- Border: 1px solid gray-100
- Padding: 0 (image area) + 16px horizontal, 12px bottom (text area)
- Box shadow: `0 1px 3px rgba(0,0,0,0.06)`
- Cursor: pointer
- Entire card is clickable (wrapped in `<a>`)

---

## State 2: Hover (Desktop Only)

```
┌───────────────────────────┐  ↑
│                           │  │ card lifts 4px
│    [PRODUCT IMAGE]        │  (translateY(-4px))
│      (zoomed 1.05x)       │
│                           │
│  ┌──┐               ┌──┐ │
│  │#2│               │9.2│ │
│  └──┘               └──┘ │
│                           │
├───────────────────────────┤
│                           │
│  Product Name Goes Here   │
│  That Might Be Long       │
│                           │
│  Brand Name               │
│                           │
│  ¥2,480                   │
│                           │
│  ┌───────────────────────┐│
│  │ ✓ Excellent UV block  ││ ← quick-view overlay
│  │ ✓ Lightweight texture ││
│  │ ✓ Waterproof          ││
│  │                       ││
│  │   [View Details →]    ││
│  └───────────────────────┘│
│                           │
└───────────────────────────┘
   ^^^^^^^^^^^^^^^^^^^^^^^^
   Blue glow ring around card
```

### Hover Transformations
- Card: `transform: translateY(-4px)`, transition 0.2s ease
- Box shadow: `0 8px 24px rgba(37, 99, 235, 0.15)` (blue glow)
- Border: 1px solid blue-200
- Image: `transform: scale(1.05)`, transition 0.3s ease

### Quick-View Overlay
- Appears with 0.2s fade-in, slides up 8px
- Background: white
- Padding: 12px 16px
- Top border: 1px solid gray-100
- Pro points: 3 max, 13px, gray-700, checkmark icon (green-500) inline
  - Text: truncate at 1 line each
- CTA: "View Details" / "詳細を見る", 13px, brand-blue, font-weight 600, right-aligned
  - Arrow icon inline, animates right 4px on hover

### Hover Timing
- Hover in: 150ms delay before overlay appears (prevents flicker on mouse pass-through)
- Hover out: 100ms fade out, no delay

---

## State 3: Loading (Skeleton)

```
┌───────────────────────────┐
│                           │
│  ░░░░░░░░░░░░░░░░░░░░░░░ │ ← shimmer animation
│  ░░░░░░░░░░░░░░░░░░░░░░░ │
│  ░░░░░░░░░░░░░░░░░░░░░░░ │
│  ░░░░░░░░░░░░░░░░░░░░░░░ │
│                           │
├───────────────────────────┤
│                           │
│  ░░░░░░░░░░░░░░░░░       │ ← text line 1
│  ░░░░░░░░░░░░             │ ← text line 2 (shorter)
│                           │
│  ░░░░░░░░                 │ ← brand
│                           │
│  ░░░░░░                   │ ← price
│                           │
└───────────────────────────┘
```

### Skeleton Specifications
- All placeholder shapes: rounded-md (6px radius)
- Color: gray-200 base
- Shimmer animation: `linear-gradient(90deg, gray-200 25%, gray-100 50%, gray-200 75%)`
  - Animation: `background-position` slides left-to-right, 1.5s, infinite, ease-in-out
- Image placeholder: full width, 60% height, rounded-t-xl
- Text line 1: 85% width, 16px height
- Text line 2: 60% width, 16px height, margin-top 8px
- Brand placeholder: 40% width, 14px height, margin-top 8px
- Price placeholder: 30% width, 18px height, margin-top 8px
- No badges shown during loading
- Accessibility: `aria-hidden="true"`, `role="presentation"`

---

## State 4: Error / Image Failed

```
┌───────────────────────────┐
│                           │
│         ┌─────┐           │
│         │ [📱]│           │ ← category icon (SVG)
│         └─────┘           │
│                           │
│    Image unavailable      │
│                           │
├───────────────────────────┤
│                           │
│  Product Name Goes Here   │ ← real data still shown
│  That Might Be Long       │
│                           │
│  Brand Name               │
│                           │
│  ¥2,480                   │
│                           │
└───────────────────────────┘
```

### Error Image Specifications
- Background: gray-50
- Category icon: 48px, gray-300, centered vertically and horizontally
  - Icons per category: smartphone (Tech), lipstick (Beauty), pot (Kitchen), pill (Health), tent (Outdoor), sofa (Living), rattle (Baby), book (Books)
- Fallback text: "Image unavailable" / "画像なし", 12px, gray-400, centered below icon
- Product metadata (name, brand, price, score) still renders normally from data
- Score and rank badges still appear (positioned absolute in text area instead of image)
- Retry: on scroll back into view, attempt image reload once

---

## State 5: Pressed / Active (Mobile)

```
┌───────────────────────────┐
│                           │
│    [PRODUCT IMAGE]        │  ← scale(0.97)
│                           │
│                           │
├───────────────────────────┤
│                           │
│  Product Name             │
│  Brand Name               │
│  ¥2,480                   │
│                           │
└───────────────────────────┘
```

- On touch start: `transform: scale(0.97)`, transition 0.1s
- Background: gray-50 tint
- On touch end: return to default, navigate to product detail
- Haptic feedback: none (web)

---

## State 6: In Comparison Mode

```
┌───────────────────────────┐
│ ☑                         │ ← checkbox, top-left, blue fill when checked
│    [PRODUCT IMAGE]        │
│                           │
│  ┌──┐               ┌──┐ │
│  │#2│               │9.2│ │
│  └──┘               └──┘ │
│                           │
├───────────────────────────┤
│                           │
│  Product Name Goes Here   │
│  Brand Name               │
│  ¥2,480                   │
│                           │
└───────────────────────────┘
   ^^^^^^^^^^^^^^^^^^^^^^^^
   Blue border (2px) when selected
```

- Checkbox: 24px, rounded-md, positioned top 12px left 12px (over image)
  - Unchecked: white bg, gray-300 border
  - Checked: blue-600 bg, white checkmark, scale bounce animation
- Selected card: 2px blue-600 border, blue-50 background tint on text area
- Transition: 0.15s ease for border and background

---

## List View Variant

```
┌──────────────────────────────────────────────────────────────────────┐
│ ┌────────┐                                                           │
│ │[Image] │  #2  Product Name Goes Here            ¥2,480    [9.2]   │
│ │ 1:1    │       Brand Name                                          │
│ │ 80x80  │       ✓ Pro 1  ✓ Pro 2  ✓ Pro 3       [View →]          │
│ └────────┘                                                           │
└──────────────────────────────────────────────────────────────────────┘
```

### List View Specifications
- Row height: 120px (desktop) / 100px (mobile)
- Image: 80px x 80px (desktop) / 64px x 64px (mobile), rounded-lg, object-fit cover
- Rank: 24px, font-weight 800, gray-400 (or gold for 1-3), to right of image
- Product name: 15px, font-weight 600, 1 line, ellipsis
- Brand: 13px, gray-500
- Pros: 12px, gray-600, inline, hidden on mobile
- Price: 17px, font-weight 700, right-aligned
- Score badge: same as card view, right-aligned below price
- Hover: background gray-50, no lift effect
- Divider: 1px gray-100 between rows

---

## Accessibility

- Card wrapper: `<a>` tag with `aria-label="[Product Name], rated [Score], ¥[Price]"`
- Score badge: `aria-label="Score: [X] out of 10"`
- Rank badge: `aria-label="Ranked number [X]"`
- Image: `alt="[Product Name] by [Brand]"`
- Skeleton: `aria-hidden="true"`
- Focus visible: 2px blue-600 outline, 2px offset
- Color contrast: all text meets WCAG AA (4.5:1 minimum)
- Touch targets: minimum 44px x 44px on mobile
