# User Flow: Homepage Browse to Product Detail

**Flow ID:** UF-01
**Primary personas:** Yuki (visual browse), Emma (discovery), Marco (pre-trip exploration)
**Entry point:** Homepage (`/en/` or `/ja/`)
**Exit point:** Product detail page → "Buy" affiliate click
**Research basis:** Phase 02 Need #3 (Visual browsable discovery), Need #2 (Quick path to "the best"), Theme 3 (Visual Browsing Expectation)

---

## Happy Path

```
┌─────────────────────────────────────────────┐
│  1. USER LANDS ON HOMEPAGE                  │
│     Source: direct / bookmark / social link  │
│     Sees: Hero carousel (3-5 featured picks)│
│     Language: auto-detected or last saved    │
└──────────────────────┬──────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────┐
│  2. BROWSES CURATED ROWS                    │
│     Scrolls vertically through rows:        │
│     - "Top Picks This Week"                 │
│     - "Best for Tourists" (if lang=en)      │
│     - "Under ¥1,000"                        │
│     - "Trending in Beauty"                  │
│     - "New Reviews"                         │
│     Each row: horizontal scroll of cards    │
│     Each card: product image, name, score,  │
│     price, category badge                   │
└──────────────────────┬──────────────────────┘
                       │
              [Taps a product card]
                       │
                       ▼
┌─────────────────────────────────────────────┐
│  3. PRODUCT DETAIL PAGE LOADS               │
│     Sees immediately (no scroll):           │
│     - Product hero image                    │
│     - Chartedly Score (e.g., 9.2/10)        │
│     - #1 Pick badge (if applicable)         │
│     - Quick verdict: 3-line rationale       │
│     - Price: ¥1,580                         │
│     - "Buy on Amazon JP" primary CTA        │
└──────────────────────┬──────────────────────┘
                       │
              [Scrolls for more detail]
                       │
                       ▼
┌─────────────────────────────────────────────┐
│  4. REVIEWS DETAIL SECTION                  │
│     - Pros / Cons bullets                   │
│     - Specs comparison table                │
│     - Methodology disclosure badge          │
│     - "Where to Buy" section with:          │
│       Amazon JP, Rakuten, physical stores   │
│     - Related products carousel             │
└──────────────────────┬──────────────────────┘
                       │
              [Clicks "Buy on Amazon JP"]
                       │
                       ▼
┌─────────────────────────────────────────────┐
│  5. EXTERNAL PURCHASE                       │
│     Redirected to Amazon JP / Rakuten       │
│     Chartedly affiliate tag in URL          │
│     User completes purchase externally      │
└─────────────────────────────────────────────┘
```

---

## Step-by-Step Detail

| Step | Screen | User Action | Emotion | Key UI Elements |
|------|--------|-------------|---------|-----------------|
| 1 | Homepage | Page loads, eyes drawn to hero carousel | Curious, browsing | Auto-playing hero with 3-5s intervals, pause on hover/touch |
| 2 | Homepage rows | Swipes horizontally through product cards in each row | Engaged, discovering | Product cards: image (4:3), name, score badge, price, category tag |
| 3 | Product detail | Reads quick verdict, checks score and price | Evaluating, interested | Score prominently displayed, #1 Pick badge if earned, price in JPY |
| 4 | Product detail (scrolled) | Reads pros/cons, checks methodology | Building confidence | Methodology disclosure: "How we scored this" expandable section |
| 5 | External retailer | Clicks buy link, leaves Chartedly | Decisive, ready to purchase | Clear button with retailer logo + price. Opens in new tab |

---

## Alternate Paths

### Alt 2a: User clicks "See All" on a curated row
From Step 2, instead of clicking a product card, user taps "See All" on a row header (e.g., "Top Picks This Week — See All").
- Routes to: `/en/rankings/` or `/en/collections/[collection-slug]/`
- User sees a full-page grid of the collection
- Can filter and sort within the collection
- Resumes at Step 3 when they tap a product

### Alt 2b: User clicks a category card in "Explore Categories" row
From Step 2, homepage includes an "Explore Categories" row showing 10 category cards.
- Routes to: `/en/explore/[category]/`
- Continues into the Category Drilldown flow (UF-02)

### Alt 3a: User taps "Compare" from product detail
From Step 3, instead of buying, user taps "Compare with similar."
- Routes to: `/en/compare/` with product pre-loaded
- Continues into Search-Filter-Compare flow (UF-05)

### Alt 3b: User scrolls to "Related Products" carousel
From Step 4, user browses the related products carousel at the bottom of the product detail page.
- Taps another product card → loops back to Step 3 with new product
- This loop supports Yuki's browse-for-entertainment behavior

---

## Edge Cases & Error States

| Scenario | Behavior | UI Response |
|----------|----------|-------------|
| Homepage fails to load | CDN fallback serves cached version | Static fallback page with search bar and category links |
| Product card image fails to load | Placeholder shown | Category-colored gradient with product name text overlay |
| Product no longer available | Detail page shows "Currently Unavailable" | Price section replaced with "Check back soon" + related alternatives carousel |
| Hero carousel has < 3 items | Carousel degrades to static hero | Single featured product card, no auto-advance |
| User is on very slow connection (2G) | Lazy-loaded images below fold; skeleton screens | Skeleton cards pulse in carousel slots until images load |
| Affiliate link destination is broken | Link check runs nightly | "This link may be outdated — search [product] on Amazon JP" with fallback search URL |
| User returns to homepage via back button | Scroll position preserved | Browser restores exact scroll and carousel positions |
| No products in a curated row (empty state) | Row hidden from homepage | Row does not render; no empty "coming soon" slots |

---

## Persona-Specific Notes

- **Yuki (22):** This is her primary flow. She opens Chartedly like Netflix — to browse, not to search. The horizontal scroll carousels and visual cards map directly to her Gen Z expectation of swipeable discovery. The hero carousel provides "what's trending" social currency.

- **Emma (28):** Uses this flow when she has no specific need but wants to stay current on Japan products. The "New Reviews" row serves her need to see what has been recently evaluated. The English-language cards eliminate her usual translation friction.

- **Marco (35):** Pre-trip, he lands on the homepage and gravitates to "Best for Tourists" row. This is his gateway into building a shopping list. The row itself acts as a Tourist Mode soft-entry.

- **Aiko (40):** Least likely to use this flow — she arrives with a specific need and goes straight to search or category. If she does land on the homepage (e.g., from a LINE share), the clear category cards in "Explore Categories" get her to her answer fastest.

---

## Success Metrics

| Metric | Target | Measurement |
|--------|--------|-------------|
| Homepage scroll depth | >60% reach Row 3 | Analytics scroll tracking |
| Product card CTR from homepage | >8% | Clicks / card impressions |
| Time on homepage | 45-90 seconds | Session analytics |
| Bounce rate from homepage | <40% | Analytics |
| Affiliate click from product detail (via homepage entry) | >5% | Click tracking per entry source |
