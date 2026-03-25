# Search Results Page Wireframe — Chartedly

## URL Pattern
`/search?q={query}`
Example: `/search?q=sunscreen+spf50`

---

## Full Page Layout

```
┌──────────────────────────────────────────────────────────────────────┐
│  NAVBAR (search bar auto-focused with query)                         │
├──────────────────────────────────────────────────────────────────────┤
│  SEARCH HEADER + RESULT COUNT                                        │
├──────────────────────────────────────────────────────────────────────┤
│  FILTER CHIPS                                                        │
├──────────────────────────────────────────────────────────────────────┤
│  SEARCH RESULTS                                                      │
├──────────────────────────────────────────────────────────────────────┤
│  FOOTER                                                              │
└──────────────────────────────────────────────────────────────────────┘
```

---

## 1. Search Autocomplete (Overlay on Navbar)

When the user types in the search bar, before submitting:

```
┌──────────────────────────────────────────────────────────────────────┐
│  [sunscr________________________🔍]                                  │
├──────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  Products                                                            │
│                                                                      │
│  ┌────┐  Anessa Perfect UV Skincare Milk           9.2  ¥2,480      │
│  │img │  Shiseido • Sunscreen                                       │
│  └────┘                                                              │
│  ┌────┐  Biore UV Aqua Rich Watery Essence         8.8  ¥1,280      │
│  │img │  Kao • Sunscreen                                            │
│  └────┘                                                              │
│  ┌────┐  Skin Aqua Super Moisture Milk              8.5  ¥680       │
│  │img │  Rohto • Sunscreen                                          │
│  └────┘                                                              │
│                                                                      │
│  Categories                                                          │
│                                                                      │
│  🧴  Sunscreen (12 products)                                        │
│  🧴  Beauty (48 products)                                           │
│                                                                      │
│  Brands                                                              │
│                                                                      │
│  Shiseido (8 products)                                               │
│  Kanebo (5 products)                                                 │
│                                                                      │
│  ───────────────────────────────────────                             │
│  Press Enter to search all results for "sunscr"                      │
│                                                                      │
└──────────────────────────────────────────────────────────────────────┘
```

**Autocomplete Specifications:**
- Trigger: after 2 characters typed, debounced 200ms
- Overlay: full-width dropdown below search bar, white bg, shadow-xl, rounded-b-xl
- Max height: 480px, overflow-y auto
- Z-index: 1100 (above everything)
- Backdrop: semi-transparent black overlay on rest of page

**Sections:**
1. **Products** (max 5 results)
   - Image: 48px x 48px, rounded-md
   - Name: 15px, font-weight 600, matching text highlighted in bold/blue
   - Brand + Category: 13px, gray-500
   - Score: 14px, font-weight 700, right-aligned, colored by tier
   - Price: 14px, gray-600, right-aligned

2. **Categories** (max 3)
   - Category icon (20px) + name + product count
   - 14px, gray-700

3. **Brands** (max 3)
   - Brand name + product count
   - 14px, gray-700

**Footer hint:** "Press Enter to search all results" — 13px, gray-400
**Keyboard navigation:** Arrow keys to navigate, Enter to select, Escape to close
**Highlight:** currently focused item has gray-50 bg
**No results:** "No suggestions. Press Enter to search." — 14px, gray-400

---

## 2. Search Header

```
┌──────────────────────────────────────────────────────────────────────┐
│                                                                      │
│  Search results for "sunscreen spf50"                                │
│  「sunscreen spf50」の検索結果                                        │
│                                                                      │
│  24 results found                                                    │
│                                                                      │
└──────────────────────────────────────────────────────────────────────┘
```

**Specifications:**
- Padding: 32px 80px (desktop) / 24px 16px (mobile)
- Title: 24px, font-weight 700, gray-900. Query in quotes.
- JP: 14px, gray-400
- Count: 14px, gray-500

---

## 3. Filter Chips + Sort

```
┌──────────────────────────────────────────────────────────────────────┐
│                                                                      │
│  [All] [Beauty] [Tech] [Kitchen] [Health]                            │
│                                                                      │
│  Sort: [Relevance ▼] [Score] [Price ↕]           [▦ Grid] [≡ List] │
│                                                                      │
└──────────────────────────────────────────────────────────────────────┘
```

- Category filter chips: same as ranking page tabs, show only categories with results
- Count badge on each: "(12)" in gray-400
- Sort default: Relevance (search-engine scoring)
- Additional sort: Score, Price ascending/descending

---

## 4. Search Results

### Grid View (Default)

```
┌──────────────────────────────────────────────────────────────────────┐
│                                                                      │
│  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐                   │
│  │ [Image] │ │ [Image] │ │ [Image] │ │ [Image] │                   │
│  │         │ │         │ │         │ │         │                   │
│  │ Anessa  │ │ Biore   │ │ Skin    │ │ Canmake │                   │
│  │ Perfect │ │ UV Aqua │ │ Aqua    │ │ Mermaid │                   │
│  │Shiseido │ │ Kao     │ │ Rohto   │ │ Canmake │                   │
│  │ ¥2,480  │ │ ¥1,280  │ │ ¥680    │ │ ¥770    │                   │
│  │ [9.2]   │ │ [8.8]   │ │ [8.5]   │ │ [8.3]   │                   │
│  └─────────┘ └─────────┘ └─────────┘ └─────────┘                   │
│                                                                      │
│  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐                   │
│  │ ...     │ │ ...     │ │ ...     │ │ ...     │                   │
│  └─────────┘ └─────────┘ └─────────┘ └─────────┘                   │
│                                                                      │
│              ◌ loading more...                                       │
│                                                                      │
└──────────────────────────────────────────────────────────────────────┘
```

- Standard product cards, 4 columns (desktop) / 3 (tablet) / 2 (mobile)
- Rank badges NOT shown on search results (ranks are category-specific)
- Category tag shown below brand: pill, 11px, gray-100 bg, gray-500 text

### List View

- Standard list card variant
- Category tag visible inline
- Search query terms highlighted (bold) in product name if matched

---

## 5. No Results State

```
┌──────────────────────────────────────────────────────────────────────┐
│                                                                      │
│  Search results for "xyzabc123"                                      │
│                                                                      │
│  0 results found                                                     │
│                                                                      │
│         ┌──────────────────────────────────┐                         │
│         │                                  │                         │
│         │       [🔍 illustration]         │                         │
│         │                                  │                         │
│         │  No products found               │                         │
│         │  検索結果がありません              │                         │
│         │                                  │                         │
│         │  Try different keywords or       │                         │
│         │  browse our categories:          │                         │
│         │                                  │                         │
│         │  [Beauty] [Tech] [Kitchen]       │                         │
│         │  [Health] [Outdoor] [Living]     │                         │
│         │                                  │                         │
│         │  Popular searches:               │                         │
│         │  sunscreen • moisturizer •       │                         │
│         │  headphones • rice cooker        │                         │
│         │                                  │                         │
│         └──────────────────────────────────┘                         │
│                                                                      │
└──────────────────────────────────────────────────────────────────────┘
```

**Specifications:**
- Illustration: branded SVG, 120px, gray-300
- Title: 20px, font-weight 600, gray-900
- JP: 14px, gray-400
- Suggestions: category pills (same style as nav strip), popular search links (brand-blue, 14px)
- Centered, max-width 480px

---

## 6. Spelling Correction

```
┌──────────────────────────────────────────────────────────────────────┐
│                                                                      │
│  Showing results for "sunscreen"                                     │
│  Search instead for "sunscren" ← original misspelling linked        │
│                                                                      │
└──────────────────────────────────────────────────────────────────────┘
```

- Auto-correct: "sunscren" -> "sunscreen"
- "Showing results for" in gray-500
- Corrected term: font-weight 600, gray-900
- "Search instead for" + original term: 13px, brand-blue, underlined, clickable

---

## 7. Recent Searches (On Empty Search Focus)

```
┌──────────────────────────────────────────────────────────────────────┐
│  [_________________________________🔍]                               │
├──────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  Recent Searches 最近の検索                          [Clear all]     │
│                                                                      │
│  🕐  sunscreen spf50                                                │
│  🕐  moisturizer for dry skin                                       │
│  🕐  rice cooker                                                    │
│                                                                      │
│  Trending 人気の検索ワード                                           │
│                                                                      │
│  🔥  best sunscreen 2026                                            │
│  🔥  wireless earbuds                                               │
│  🔥  japanese kitchen knife                                         │
│                                                                      │
└──────────────────────────────────────────────────────────────────────┘
```

**Specifications:**
- Shown when search bar is focused with no input
- Recent: from localStorage, max 5, LIFO
- Clock icon: 16px, gray-300
- Each item: 14px, gray-700, full-width tap target (44px height)
- "Clear all": 13px, red-500
- Trending: from server, updated daily
- Fire icon: 16px, orange-400
- Keyboard: arrow keys navigate, Enter selects

---

## Performance

- Autocomplete: debounced 200ms, cancel previous request on new keystroke
- Results: first 12 loaded, then infinite scroll batches of 12
- Image lazy loading on result cards
- Search index: pre-built, served from edge/CDN for sub-100ms autocomplete
