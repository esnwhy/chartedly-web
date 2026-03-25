# States Catalog — Chartedly

## Every Data Component's 3 States

Each data-driven component has exactly 3 states: **Loading (Skeleton)**, **Empty**, and **Error**. This catalog defines the visual treatment for each.

---

## 1. Product Card

### Loading (Skeleton)
```
┌───────────────────────────┐
│ ░░░░░░░░░░░░░░░░░░░░░░░░ │  Image placeholder
│ ░░░░░░░░░░░░░░░░░░░░░░░░ │  gray-200 with shimmer
│ ░░░░░░░░░░░░░░░░░░░░░░░░ │
│ ░░░░░░░░░░░░░░░░░░░░░░░░ │
├───────────────────────────┤
│ ░░░░░░░░░░░░░░░░░        │  Name line 1 (85% width)
│ ░░░░░░░░░░░░              │  Name line 2 (60% width)
│ ░░░░░░░░                  │  Brand (40% width)
│ ░░░░░░                    │  Price (30% width)
└───────────────────────────┘
```
- Shimmer: `linear-gradient(90deg, gray-200 25%, gray-100 50%, gray-200 75%)`, 1.5s loop
- Border radius matches real card (12px)
- `aria-hidden="true"`

### Empty
Not applicable — cards are only rendered when data exists. If a carousel row has no cards, the entire row is hidden (see Carousel Row empty state).

### Error (Image Failed)
```
┌───────────────────────────┐
│                           │
│         [📱]              │  Category icon, 48px, gray-300
│    Image unavailable      │  12px, gray-400
│                           │
├───────────────────────────┤
│  Product Name (real data) │
│  Brand Name (real data)   │
│  ¥X,XXX (real data)       │
│  [Score badge] (real)     │
└───────────────────────────┘
```
- Image area: gray-50 background
- Rest of card renders normally with actual data
- Retry: re-attempt image load on re-entering viewport

---

## 2. Carousel Row (Homepage Rows)

### Loading (Skeleton)
```
┌──────────────────────────────────────────────────────────────────────┐
│  ░░░░░░░░░░░░░░░░░░░░░░░░░░░░          ░░░░░░░░                    │
│  (title placeholder, 60%)               (See All placeholder, 15%) │
│                                                                      │
│  ┌─ skeleton ─┐ ┌─ skeleton ─┐ ┌─ skeleton ─┐ ┌─ skeleton ─┐      │
│  │ card       │ │ card       │ │ card       │ │ card       │      │
│  └────────────┘ └────────────┘ └────────────┘ └────────────┘      │
└──────────────────────────────────────────────────────────────────────┘
```
- Title: gray-200 rectangle, 240px wide, 24px tall
- "See All" placeholder: gray-200 rectangle, 80px wide, 16px tall
- 4-5 skeleton cards (matching viewport card count)
- Entire section has shimmer animation

### Empty (No Products in This Collection)
```
┌──────────────────────────────────────────────────────────────────────┐
│  Row title is still shown                                            │
│                                                                      │
│  (entire row is hidden from homepage — do not show empty carousels)  │
│                                                                      │
└──────────────────────────────────────────────────────────────────────┘
```
- **Decision: Hide the entire row.** Don't show "No products yet" on homepage.
- Homepage must never feel empty — only show rows with 3+ products.

### Error (Fetch Failed)
```
┌──────────────────────────────────────────────────────────────────────┐
│  Top Picks This Week                                                 │
│                                                                      │
│           ┌───────────────────────────────────┐                      │
│           │  Couldn't load products            │                      │
│           │  商品を読み込めませんでした          │                      │
│           │                                   │                      │
│           │  [Try Again]                      │                      │
│           └───────────────────────────────────┘                      │
│                                                                      │
└──────────────────────────────────────────────────────────────────────┘
```
- Row title still visible
- Centered error message, 14px, gray-500
- "Try Again" button: ghost style, brand-blue, 36px height
- On retry: show skeleton briefly, then load

---

## 3. Hero Carousel

### Loading (Skeleton)
```
┌──────────────────────────────────────────────────────────────────────┐
│                                                                      │
│  ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░  │
│  ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░  │
│  ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░  │
│                                                                      │
│    ┌──────────────────────────┐                                      │
│    │ ░░░░░░░░░░░░░░░          │  Title (60% width)                  │
│    │ ░░░░░░░░░░░░░░░░░░░░░░░ │  Subtitle (80% width)              │
│    │ ░░░░░░░░░                │  Score bar (40% width)              │
│    │ ░░░░░                    │  Price (25% width)                  │
│    │ ░░░░░░░░░░               │  Button (45% width)                │
│    └──────────────────────────┘                                      │
│                                                                      │
│              ░ ░ ░ ░ ░                 Dot indicators                │
│                                                                      │
└──────────────────────────────────────────────────────────────────────┘
```
- Full hero area: gray-100 background with shimmer
- Text overlay placeholders: gray-300 rectangles
- Matches hero dimensions exactly

### Empty
- Not applicable — hero always has content. If no featured products, fall back to a static branded hero with tagline and search CTA.

### Error
```
┌──────────────────────────────────────────────────────────────────────┐
│                                                                      │
│         [Chartedly branded illustration]                             │
│                                                                      │
│         Discover the best products                                   │
│         for life in Japan                                            │
│                                                                      │
│         [Search Products]                                            │
│                                                                      │
└──────────────────────────────────────────────────────────────────────┘
```
- Graceful fallback: branded hero with tagline + search CTA
- No error message visible to user — feels intentional
- Background: brand gradient or static lifestyle image (bundled, not fetched)

---

## 4. Product Detail — Score Visualization

### Loading
```
┌──────────────────────────────────────┐
│  ┌──────────┐                        │
│  │  ░░░░    │    ░░░░░░░░░░░░░░     │  Score circle: gray-200 ring
│  │  ░░░░    │    ░░░░░░░░░░░        │  Breakdown bars: gray-200 rectangles
│  └──────────┘    ░░░░░░░░░░░░       │
│                  ░░░░░░░░░          │
│                  ░░░░░░░░░░░        │
└──────────────────────────────────────┘
```
- Score circle: gray-200 stroke, no fill, shimmer
- Each bar: gray-200, full width, shimmer staggered 100ms per bar

### Empty (No Score Data)
```
┌──────────────────────────────────────┐
│  ┌──────────┐                        │
│  │   N/A    │    Scoring in progress │
│  │          │    評価中               │
│  └──────────┘                        │
└──────────────────────────────────────┘
```
- Circle: gray-200 stroke, "N/A" in gray-400, 20px
- Message: "Scoring in progress" / "評価中", 14px, gray-400

### Error
```
┌──────────────────────────────────────┐
│  Couldn't load score data            │
│  [Retry]                             │
└──────────────────────────────────────┘
```
- Compact error, same area, gray-500 text, retry button

---

## 5. Product Detail — Image Gallery

### Loading
```
┌───────────────────────────────────┐
│                                   │
│  ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░  │  Main image: gray-100, shimmer
│  ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░  │
│  ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░  │
│                                   │
├───────┬───────┬───────┬──────────┤
│  ░░░  │  ░░░  │  ░░░  │   ░░░   │  Thumbnails: gray-200 squares
└───────┴───────┴───────┴──────────┘
```

### Empty (No Images)
```
┌───────────────────────────────────┐
│                                   │
│           [📦]                   │  Package icon, 64px, gray-300
│                                   │
│     No images available           │
│     画像がありません               │
│                                   │
└───────────────────────────────────┘
```

### Error (All Images Failed)
Same as empty state visual — category-appropriate icon with fallback text.

---

## 6. Product Detail — Purchase CTAs

### Loading
```
┌────────────────────────────────┐
│ ░░░░░░  ← price placeholder   │
│ ░░░░░░░░░░░░░░░░░░░░░░░░░░░  │  3 button placeholders
│ ░░░░░░░░░░░░░░░░░░░░░░░░░░░  │
│ ░░░░░░░░░░░░░░░░░░░░░░░░░░░  │
└────────────────────────────────┘
```

### Empty (No Retailers)
```
┌────────────────────────────────┐
│  Price not available            │
│  価格情報なし                    │
│                                 │
│  [Search on Amazon →]          │
│  [Search on Rakuten →]         │
└────────────────────────────────┘
```
- Fallback: generic search links to retailer sites with product name as query
- Gray-500 text, ghost buttons

### Error (Price Fetch Failed)
```
┌────────────────────────────────┐
│  Couldn't load prices           │
│  価格を読み込めませんでした       │
│  [Retry]                        │
└────────────────────────────────┘
```

---

## 7. Product Detail — Specs Table

### Loading
```
┌───────────────────┬──────────────────────────────────────┐
│  ░░░░░░░░         │  ░░░░░░░░░░░░░░                     │
├───────────────────┼──────────────────────────────────────┤
│  ░░░░░░░          │  ░░░░░░░░░░░░░░░░░                  │
├───────────────────┼──────────────────────────────────────┤
│  ░░░░░░░░░░       │  ░░░░░░░░░░░░                       │
└───────────────────┴──────────────────────────────────────┘
```
- 5 rows of skeleton pairs, shimmer animation

### Empty (No Specs Data)
```
┌──────────────────────────────────────────────────────────┐
│  Specifications coming soon                               │
│  仕様情報は近日公開                                        │
└──────────────────────────────────────────────────────────┘
```
- Gray-50 background, 14px gray-400 text, centered

### Error
Same pattern as other error states: message + retry button.

---

## 8. Ranking Page — Product Grid

### Loading (Initial)
```
┌──────────────────────────────────────────────────────────────────────┐
│  ┌─ skeleton ─┐ ┌─ skeleton ─┐ ┌─ skeleton ─┐ ┌─ skeleton ─┐      │
│  │ podium     │ │ podium     │ │ podium     │ │            │      │
│  └────────────┘ └────────────┘ └────────────┘ │            │      │
│                                                └────────────┘      │
│  ┌─ skeleton ─┐ ┌─ skeleton ─┐ ┌─ skeleton ─┐ ┌─ skeleton ─┐      │
│  │ card       │ │ card       │ │ card       │ │ card       │      │
│  └────────────┘ └────────────┘ └────────────┘ └────────────┘      │
└──────────────────────────────────────────────────────────────────────┘
```
- 3 podium skeletons (larger) + 4-8 card skeletons

### Loading (Infinite Scroll — More Items)
```
│  ┌─ skeleton ─┐ ┌─ skeleton ─┐ ┌─ skeleton ─┐ ┌─ skeleton ─┐      │
│  │ card       │ │ card       │ │ card       │ │ card       │      │
│  └────────────┘ └────────────┘ └────────────┘ └────────────┘      │
│                          ◌ ◌ ◌                                      │
```
- 4 skeleton cards + 3-dot pulse loader below
- Pulse: 3 dots, 8px each, gray-300, opacity pulsing 0.3-1.0, staggered 0.2s

### Empty (No Products — After Filters)
```
┌──────────────────────────────────────┐
│                                      │
│         [🔍]                        │
│                                      │
│   No products match your filters     │
│   フィルターに一致する商品がありません │
│                                      │
│   [Clear all filters]               │
│                                      │
└──────────────────────────────────────┘
```
- Illustration: search/magnifier SVG, 80px, gray-300
- Text: 18px, font-weight 500, gray-600
- JP: 14px, gray-400
- CTA: brand-blue text link, 14px

### Empty (Category — No Products Yet)
```
┌──────────────────────────────────────┐
│                                      │
│         [📝]                        │
│                                      │
│   We're working on this category!    │
│   このカテゴリは準備中です            │
│                                      │
│   [Notify me when ready]            │
│   [Browse other categories →]       │
│                                      │
└──────────────────────────────────────┘
```

### Error (Fetch Failed)
```
┌──────────────────────────────────────┐
│                                      │
│         [⚠]                        │
│                                      │
│   Something went wrong               │
│   エラーが発生しました                │
│                                      │
│   We couldn't load the products.     │
│   [Try Again]                        │
│                                      │
└──────────────────────────────────────┘
```
- Warning icon: 64px, gray-300
- Text: 18px, gray-600
- Retry button: brand-blue, 40px height

---

## 9. Comparison Page — Table

### Loading
```
┌──────────────────────────────────────────────────────────────────────┐
│              │  ░░░ skeleton ░░░  │  ░░░ skeleton ░░░  │            │
│              │  ░░░ card    ░░░  │  ░░░ card    ░░░  │            │
├──────────────┼───────────────────┼───────────────────┤            │
│  ░░░░░░      │  ░░░░░░░░░░░     │  ░░░░░░░░░░░     │            │
│  ░░░░░░░     │  ░░░░░░░░        │  ░░░░░░░░        │            │
│  ░░░░░       │  ░░░░░░░░░░      │  ░░░░░░░░░░      │            │
└──────────────┴───────────────────┴───────────────────┘
```
- Header: skeleton product cards (image + text placeholders)
- Table body: skeleton rectangles in each cell

### Empty (Only 1 Product)
```
┌──────────────────────────────────────────────────────────────────────┐
│              │  Product A         │  ┌─────────────────────┐        │
│              │  [IMAGE]           │  │                     │        │
│              │  Real data         │  │  [+] Add a product  │        │
│              │                    │  │  to compare          │        │
│              │                    │  │                     │        │
│              │                    │  │  [Browse Rankings]  │        │
│              │                    │  │                     │        │
│              │                    │  └─────────────────────┘        │
└──────────────────────────────────────────────────────────────────────┘
```
- Empty column: dashed border (gray-200, 2px), rounded-xl
- "+" icon: 48px, gray-300
- Text: 16px, gray-500
- CTA: brand-blue link

### Error (Product Not Found)
```
│              │  ┌──────────────┐   │  Product B         │
│              │  │ Product no   │   │  [IMAGE]           │
│              │  │ longer       │   │  Real data         │
│              │  │ available    │   │                    │
│              │  │              │   │                    │
│              │  │ [Remove]     │   │                    │
│              │  └──────────────┘   │                    │
```
- Grayed-out column: gray-100 bg, dashed border
- Text: 14px, gray-400
- Remove button: red-500 text, 13px

---

## 10. Search Results

### Loading
```
┌──────────────────────────────────────────────────────────────────────┐
│  Search results for "sunscreen"                                      │
│  ░░░░░░░░░░░░ ← result count placeholder                           │
│                                                                      │
│  ┌─ skeleton ─┐ ┌─ skeleton ─┐ ┌─ skeleton ─┐ ┌─ skeleton ─┐      │
│  └────────────┘ └────────────┘ └────────────┘ └────────────┘      │
│  ┌─ skeleton ─┐ ┌─ skeleton ─┐ ┌─ skeleton ─┐ ┌─ skeleton ─┐      │
│  └────────────┘ └────────────┘ └────────────┘ └────────────┘      │
└──────────────────────────────────────────────────────────────────────┘
```
- Title shows immediately (from URL query)
- Result count placeholder
- 8 skeleton cards in grid

### Empty (No Results)
```
┌──────────────────────────────────────┐
│                                      │
│         [🔍]                        │
│                                      │
│   No products found for "xyzabc"     │
│   検索結果がありません                │
│                                      │
│   Suggestions:                       │
│   • Check your spelling              │
│   • Try different keywords           │
│   • Browse categories below          │
│                                      │
│   [Beauty] [Tech] [Kitchen]         │
│                                      │
│   Popular: sunscreen, headphones,    │
│   rice cooker, moisturizer           │
│                                      │
└──────────────────────────────────────┘
```

### Error (Search Failed)
```
┌──────────────────────────────────────┐
│                                      │
│   Search is temporarily unavailable  │
│   検索が一時的に利用できません        │
│                                      │
│   [Try Again]                        │
│   Or [browse categories]             │
│                                      │
└──────────────────────────────────────┘
```

---

## 11. Search Autocomplete

### Loading (Fetching Results)
```
┌──────────────────────────────────────────────────────────────────────┐
│  [sunscr________________________🔄]  ← spinner replaces search icon │
├──────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  ░░░░░░░░░░░░░░░░░░░░░░░                                           │
│  ░░░░░░░░░░░░░░░░░░░░                                              │
│  ░░░░░░░░░░░░░░░░░░░░░░                                            │
│                                                                      │
└──────────────────────────────────────────────────────────────────────┘
```
- 3 skeleton result rows

### Empty (No Autocomplete Matches)
```
┌──────────────────────────────────────────────────────────────────────┐
│  No suggestions                                                      │
│  Press Enter to search for "xyzabc"                                  │
└──────────────────────────────────────────────────────────────────────┘
```

### Error (Autocomplete API Failed)
```
┌──────────────────────────────────────────────────────────────────────┐
│  Press Enter to search                                               │
└──────────────────────────────────────────────────────────────────────┘
```
- Silent degradation: just show "Press Enter to search" — don't expose API error
- User can still perform full search

---

## 12. What's New Timeline

### Loading
```
┌──────────────────────────────────────────────────────────────────────┐
│  ░░░░░░░░░░░░░░░░░░ ← date header placeholder                     │
│                                                                      │
│  ┌─ skeleton card ────────┐                                          │
│  │ ░░░░░░░░░░░░░░░░░░░░  │                                          │
│  │ ░░░░░░░░░░░░░░░░░░    │                                          │
│  │ ░░░░░░░░░░░            │                                          │
│  └────────────────────────┘                                          │
│                                                                      │
│        ┌─ skeleton card ────────┐                                    │
│        │ ░░░░░░░░░░░░░░░░░░░░  │                                    │
│        │ ░░░░░░░░░░░░░░░░░░    │                                    │
│        └────────────────────────┘                                    │
└──────────────────────────────────────────────────────────────────────┘
```

### Empty (No Reviews Yet)
```
┌──────────────────────────────────────┐
│                                      │
│         [📝]                        │
│                                      │
│   No reviews published yet           │
│   まだレビューがありません            │
│                                      │
│   Check back soon!                   │
│   [Browse categories →]             │
│                                      │
└──────────────────────────────────────┘
```

### Error
Standard fetch error pattern (message + retry button).

---

## 13. Newsletter CTA

### Loading
Not applicable — static content, no data fetch.

### Empty
Not applicable — always shows.

### Error (Submission Failed)
```
┌──────────────────────────────────────┐
│  [email@example.com] [Subscribe]     │
│                                      │
│  ⚠ Couldn't subscribe. Please try   │
│  again later.                        │
│  登録できませんでした。後ほど再度        │
│  お試しください。                      │
└──────────────────────────────────────┘
```
- Error text: red-500, 13px, below input
- Input retains entered email (not cleared)
- Button re-enables for retry

### Success
```
┌──────────────────────────────────────┐
│                                      │
│  ✓ You're in!                       │
│  登録完了！                           │
│                                      │
│  Check your inbox for a              │
│  confirmation email.                 │
│                                      │
│  [Unsubscribe]                      │
│                                      │
└──────────────────────────────────────┘
```
- Crossfade transition from form to success (0.3s)
- Green-500 checkmark, 48px
- Text: 18px, font-weight 600

---

## Shimmer Animation Specification (Global)

```css
@keyframes shimmer {
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}

.skeleton {
  background: linear-gradient(
    90deg,
    var(--gray-200) 25%,
    var(--gray-100) 37%,
    var(--gray-200) 63%
  );
  background-size: 200% 100%;
  animation: shimmer 1.5s ease-in-out infinite;
  border-radius: 6px;
}

@media (prefers-reduced-motion: reduce) {
  .skeleton {
    animation: none;
    background: var(--gray-200);
  }
}
```

---

## Error Retry Pattern (Global)

All retry buttons follow this behavior:
1. On tap: button shows loading spinner (replace text)
2. Re-fetch data
3. On success: replace error state with real content (fade transition)
4. On failure again: show error with "Still having trouble. Try refreshing the page." and a refresh link
5. Max auto-retries: 1 (on initial load failure, retry once silently before showing error)
