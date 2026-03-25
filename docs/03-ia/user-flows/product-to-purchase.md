# User Flow: Product Detail to Purchase

**Flow ID:** UF-03
**Primary personas:** All (this is the revenue-critical conversion flow)
**Entry point:** Product detail page (`/en/product/[product-slug]/`)
**Exit point:** External retailer (Amazon JP, Rakuten, physical store info)
**Research basis:** Phase 02 Need #6 (Price in JPY with context), Need #4 (English rankings), KPI #3 (Conversion rate), Synthesis Theme 4 (Time-to-Decision)

---

## Happy Path

```
┌─────────────────────────────────────────────┐
│  1. PRODUCT DETAIL PAGE                     │
│     Entry via: homepage card, category       │
│     drilldown, search result, shared link,  │
│     or direct Google landing                │
│                                             │
│     ABOVE FOLD (no scroll required):        │
│     ┌──────────────────────────────────┐    │
│     │  [Product Image]  │ Product Name │    │
│     │                   │ Chartedly    │    │
│     │                   │ Score: 9.2   │    │
│     │                   │ #1 Pick ⬡    │    │
│     │                   │              │    │
│     │                   │ "The best UV │    │
│     │                   │ protection   │    │
│     │                   │ for daily    │    │
│     │                   │ use in       │    │
│     │                   │ Japan's      │    │
│     │                   │ humidity."   │    │
│     │                   │              │    │
│     │                   │ ¥1,580       │    │
│     │                   │              │    │
│     │                   │ [Buy Amazon] │    │
│     │                   │ [Buy Rakuten]│    │
│     └──────────────────────────────────┘    │
└──────────────────────┬──────────────────────┘
                       │
          ┌────────────┼────────────┐
          │            │            │
    [Quick buyer] [Researcher] [Comparer]
          │            │            │
          ▼            ▼            ▼
     (Step 5)     (Step 2)    (Step 4)
```

### Quick Buyer Path (Aiko, returning Emma)

```
┌─────────────────────────────────────────────┐
│  1 → 5. CLICKS BUY IMMEDIATELY             │
│     Reads 3-line verdict, trusts the score, │
│     taps "Buy on Amazon JP — ¥1,580"        │
│     Time on page: <30 seconds               │
└─────────────────────────────────────────────┘
```

### Researcher Path (Emma, Yuki)

```
┌─────────────────────────────────────────────┐
│  2. SCROLLS TO DETAIL SECTIONS              │
│     a. Pros & Cons (bullet points)          │
│     b. Key Specs table                      │
│     c. Full Review (300-500 words)          │
│     d. "How We Scored This" methodology     │
│        expandable section                   │
└──────────────────────┬──────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────┐
│  3. PRICE COMPARISON SECTION                │
│     "Where to Buy" — all retailer options:  │
│                                             │
│     ┌────────────────────────────────────┐  │
│     │ Amazon JP         ¥1,580  [Buy →] │  │
│     │ Rakuten           ¥1,620  [Buy →] │  │
│     │ Yahoo Shopping    ¥1,550  [Buy →] │  │
│     │ ─────────────────────────────────  │  │
│     │ In-Store:                          │  │
│     │ Matsumoto Kiyoshi  ~¥1,600        │  │
│     │ Don Quijote        ~¥1,500        │  │
│     └────────────────────────────────────┘  │
│                                             │
│     Price note: "Prices checked 2026-03-24" │
│     Tax-free note (if tourist-relevant):    │
│     "Tax-free eligible at stores for        │
│      purchases over ¥5,000"                 │
└──────────────────────┬──────────────────────┘
                       │
              [Selects preferred retailer]
                       │
                       ▼
┌─────────────────────────────────────────────┐
│  5. AFFILIATE REDIRECT                      │
│     - Brief interstitial: "Taking you to    │
│       Amazon JP..." (0.5s, optional)        │
│     - Opens in new tab                      │
│     - Affiliate disclosure visible on       │
│       product page before click             │
│     - Deep link to exact product page       │
│       (not search results)                  │
└─────────────────────────────────────────────┘
```

### Comparer Path (Emma comparing options, Yuki deciding between 2)

```
┌─────────────────────────────────────────────┐
│  4. COMPARE ACTION                          │
│     User sees "Compare with similar" section│
│     showing 2-3 alternatives with scores:   │
│                                             │
│     "Compare with:"                         │
│     [Product B — 8.8] [Product C — 8.5]     │
│     [+ Add to comparison]                   │
│                                             │
│     Taps "Compare" → routes to              │
│     /en/compare/product-a+product-b/        │
│     (Continues in UF-05)                    │
└─────────────────────────────────────────────┘
```

---

## Step-by-Step Detail

| Step | Section | User Action | Emotion | Design Intent |
|------|---------|-------------|---------|---------------|
| 1 | Above fold | Reads product name, score, verdict, price | Evaluating first impression | Everything needed for a quick decision is visible without scrolling — serves Aiko's <3 min need |
| 2a | Pros/Cons | Scans bullet points | Weighing trade-offs | Max 4 pros, 3 cons. No paragraphs — bullets only |
| 2b | Specs | Checks specific attributes (SPF, ml, weight) | Confirming fit | Table format on desktop, stacked cards on mobile |
| 2c | Full review | Reads editorial assessment | Building confidence | 300-500 words. Leads with one-sentence verdict. Methodology link inline |
| 2d | Methodology | Expands "How We Scored This" | Seeking trust validation | Shows: data sources, scoring criteria, last update date. Addresses Trust Deficit theme |
| 3 | Where to Buy | Compares prices across retailers | Finding best deal | Lowest price highlighted. Physical store info for in-store shoppers (Marco) |
| 4 | Compare | Adds to comparison | Wants side-by-side validation | Low-friction: single tap adds to compare tray |
| 5 | Redirect | Clicks buy link | Decisive, committed | New tab so user can return to Chartedly. Affiliate tag in URL |

---

## Edge Cases & Error States

| Scenario | Behavior | UI Response |
|----------|----------|-------------|
| Product has only 1 retailer link | Single buy button, no price comparison table | "Buy on Amazon JP — ¥1,580" as sole CTA. No "Where to Buy" section |
| Product is out of stock at all online retailers | All buy links disabled | "Currently unavailable online" banner. Show in-store options if available. "Notify me when available" email capture |
| Product price has changed since last check | Prices marked with "last checked" date | "Price was ¥1,580 on [date]. Tap to see current price on Amazon JP." Link still works |
| Affiliate program for this retailer expired | Link removed | Retailer row hidden. If all affiliate links expired, show direct search links (non-affiliate) |
| User clicks buy link but has an ad blocker that blocks redirects | Some ad blockers intercept affiliate redirects | Fallback: plain URL displayed as text. "If the link didn't work, search for [product name] on Amazon JP" |
| Product page accessed in wrong language | Content available in both languages | Language toggle prominently visible. No redirect — user chooses |
| User shares product page URL | Shared URL includes language prefix | OG meta tags set for correct language. Preview card shows product image, name, score |
| Product has no image | Placeholder shown | Category-colored gradient card with product name. "Image coming soon" |
| Tourist clicks "In-Store" location | Store name shown with area (e.g., "Shibuya, Tokyo") | No interactive map in MVP. Store chain name + general area. Future: map integration |

---

## Affiliate Disclosure Handling

Per Phase 01 research and Japanese legal requirements (景品表示法, Amazon Associates TOS):

1. **Persistent mini-disclosure** on every product page: "Chartedly earns from qualifying purchases. This does not affect our rankings." — visible near the buy buttons
2. **Full disclosure link** in footer and on `/en/legal/affiliate-disclosure/`
3. **No buy link appears without disclosure visible** on the same screen
4. **Methodology section** explicitly states: "Affiliate relationships do not influence product scores or rankings"

---

## Persona-Specific Notes

- **Aiko (40):** Arrives at product detail with a specific need. Reads the 3-line verdict, checks the score, taps "Buy on Amazon JP." Done in 30 seconds. The above-fold layout is designed for this exact behavior.

- **Emma (28):** Reads the full review and checks methodology. The transparency section ("How We Scored This") directly addresses her distrust of affiliate-driven recommendations she encountered on other platforms. She compares prices across retailers.

- **Marco (35):** Focuses on "Where to Buy" section, specifically in-store availability and tax-free notes. He is shopping in physical stores during his trip, so "Matsumoto Kiyoshi, ~¥1,600" is more actionable than an Amazon link. Tax-free threshold reminder helps him plan purchases.

- **Yuki (22):** Arrived from browsing. Checks the score badge visually, scrolls through the product image gallery, and reads the pros/cons bullets. If she is deciding between this and another product, she taps "Compare." Price is a key factor — she looks at the lowest price option.

---

## Success Metrics

| Metric | Target | Measurement |
|--------|--------|-------------|
| Affiliate click-through rate (overall) | >5% | Affiliate clicks / product page views |
| Quick buyer conversion (<30s on page → click buy) | >15% of Aiko-type sessions | Time-on-page + click event |
| "Where to Buy" section visibility | >60% of visitors scroll to it | Scroll depth tracking |
| Methodology section expansion rate | >10% | Click event on expandable |
| Compare action rate | >8% | "Compare" click / product page views |
| Bounce rate from product detail | <35% | Analytics |
