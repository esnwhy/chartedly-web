# Prototype Flow — Chartedly

## Screen-by-Screen Transition Logic

This document maps every screen-to-screen transition in the Chartedly application, defining trigger actions, transition animations, and data that carries between screens.

---

## Screen Inventory

| ID | Screen | URL |
|---|---|---|
| S01 | Homepage | `/` |
| S02 | Category Page | `/categories/{slug}` |
| S03 | Ranking Page | `/rankings/{category}/{subcategory}` |
| S04 | Product Detail | `/products/{category}/{product}` |
| S05 | Comparison Page | `/compare?ids=a,b,c` |
| S06 | Search Results | `/search?q={query}` |
| S07 | What's New | `/whats-new` |
| S08 | Search Autocomplete | Overlay (no URL change) |
| S09 | Filter Bottom Sheet | Overlay (mobile, no URL change) |
| S10 | Product Image Lightbox | Overlay (no URL change) |
| S11 | Compare Product Picker | Modal (no URL change) |
| S12 | Newsletter Success | Inline state change (no URL change) |

---

## Flow Diagram

```
                           ┌──────────┐
                     ┌─────│ S01 HOME │─────┐
                     │     └────┬─────┘     │
                     │          │            │
              ┌──────▼──┐  ┌───▼────┐  ┌───▼─────┐
              │S02 CATEG │  │S08 SRCH│  │S07 NEW  │
              │  PAGE    │  │AUTOCOMP│  │         │
              └──┬───┬───┘  └───┬────┘  └────┬────┘
                 │   │          │             │
           ┌─────▼┐  │    ┌────▼─────┐       │
           │S03   │  │    │S06 SEARCH│       │
           │RANK  │  │    │ RESULTS  │       │
           └──┬───┘  │    └────┬─────┘       │
              │      │         │             │
              ▼      ▼         ▼             ▼
           ┌────────────────────────────────────┐
           │          S04 PRODUCT DETAIL         │
           └──────────────┬─────────────────────┘
                          │
                    ┌─────▼─────┐
                    │S05 COMPARE│
                    └───────────┘
```

---

## Transition Details

### T01: Homepage -> Category Page
- **Trigger:** Tap category icon in quick-nav strip OR footer category link
- **Animation:** Page slide from right (mobile), instant with fade (desktop)
- **Data passed:** category slug
- **Back behavior:** Browser back returns to homepage, scroll position preserved

### T02: Homepage -> Product Detail
- **Trigger:** Tap any product card in any carousel row
- **Animation:** Card zooms to fill screen (shared element transition on image), content fades in
- **Data passed:** product slug, source context ("homepage / Top Picks This Week")
- **Back behavior:** Returns to homepage, carousel scroll position preserved
- **Analytics:** Track source row (which carousel)

### T03: Homepage -> Search Autocomplete
- **Trigger:** Tap search bar (mobile) or focus search input (desktop)
- **Animation:**
  - Desktop: Dropdown slides down from search bar, 0.2s ease, backdrop fades in
  - Mobile: Full-screen overlay slides up from bottom, search bar at top
- **Data passed:** None initially. Recent searches loaded from localStorage.
- **Dismiss:** Tap backdrop, press Escape, or tap X button

### T04: Homepage -> What's New
- **Trigger:** Tap "New Reviews" section "See All" link
- **Animation:** Standard page navigation
- **Data passed:** None

### T05: Homepage -> Newsletter Success
- **Trigger:** Submit valid email in newsletter CTA
- **Animation:** Form section crossfades to success message (0.3s)
- **State change (inline):**
  ```
  BEFORE:  [email input] [Subscribe]
  AFTER:   ✓ You're in! Check your inbox for confirmation.
           登録完了！確認メールをご確認ください。
  ```
- **Persist:** Set `newsletter_subscribed=true` in localStorage, hide CTA on return visits

### T06: Search Autocomplete -> Search Results
- **Trigger:** Press Enter in search bar OR tap "Search all results" footer link
- **Animation:**
  - Desktop: Autocomplete dropdown fades out, page navigates to search results
  - Mobile: Overlay slides down, search results page loads
- **Data passed:** Search query string
- **URL update:** `/search?q={encoded_query}`

### T07: Search Autocomplete -> Product Detail
- **Trigger:** Tap a product result in autocomplete dropdown
- **Animation:** Autocomplete closes, navigates to product detail
- **Data passed:** Product slug
- **Analytics:** Track "search > autocomplete > product" funnel

### T08: Search Autocomplete -> Category Page
- **Trigger:** Tap a category result in autocomplete
- **Animation:** Standard navigation
- **Data passed:** Category slug

### T09: Category Page -> Ranking Page
- **Trigger:** Tap subcategory card OR "View Rankings" link in featured section
- **Animation:** Standard page navigation
- **Data passed:** Category slug + subcategory slug

### T10: Category Page -> Product Detail
- **Trigger:** Tap product card in "Top Rated" carousel
- **Animation:** Card expand transition (same as T02)
- **Data passed:** Product slug

### T11: Ranking Page -> Product Detail
- **Trigger:** Tap any product card in grid/list OR "View" button on podium card
- **Animation:** Card expand transition
- **Data passed:** Product slug, rank number
- **Analytics:** Track rank position clicked

### T12: Ranking Page -> Filter Bottom Sheet (Mobile)
- **Trigger:** Tap filter icon button
- **Animation:** Bottom sheet slides up, backdrop fades in, drag handle at top
- **Dismiss:** Drag down, tap backdrop, tap "Apply Filters"
- **Data passed:** Current active filters
- **On apply:** Sheet slides down, grid reloads with filtered results (fade transition on grid)

### T13: Ranking Page -> Comparison Page
- **Trigger:** Tap floating "Compare (N)" button (after selecting 2+ products)
- **Animation:** Button pulses briefly, page navigates to comparison
- **Data passed:** Array of product IDs via query params
- **URL update:** `/compare?ids=product-a,product-b,product-c`

### T14: Product Detail -> Image Lightbox
- **Trigger:** Tap main product image
- **Animation:** Image zooms to fullscreen, backdrop fades to black, 0.3s
- **Controls:** Swipe/arrows to navigate, pinch to zoom, X to close
- **Dismiss:** Tap X, swipe down, press Escape
- **Back behavior:** Lightbox closes, does NOT add to browser history

### T15: Product Detail -> Related Product Detail
- **Trigger:** Tap related product card in carousel
- **Animation:** Crossfade page transition (same page type, different data)
- **Data passed:** Product slug
- **Back behavior:** Returns to previous product detail, scroll at top
- **Scroll:** Auto-scroll to top on navigation

### T16: Product Detail -> Purchase (External)
- **Trigger:** Tap "Buy on Amazon/Rakuten/Yahoo" button
- **Animation:** Button shows brief loading state (0.5s), then opens new tab
- **Behavior:** `window.open()` with `noopener noreferrer`
- **Analytics:** Track retailer, product, price clicked
- **Affiliate:** Redirect through tracking URL

### T17: Comparison Page -> Product Detail
- **Trigger:** Tap product name/image in comparison header
- **Animation:** Standard navigation
- **Data passed:** Product slug
- **Back behavior:** Returns to comparison with same products selected

### T18: Comparison Page -> Product Picker Modal
- **Trigger:** Tap "+ Add Product" button
- **Animation:** Modal fades in from center (desktop), bottom sheet slides up (mobile)
- **Dismiss:** Tap backdrop, press Escape, tap X
- **On add:** Modal closes, comparison table adds new column with slide-in animation

### T19: What's New -> Product Detail
- **Trigger:** Tap "Read Review" on any timeline card
- **Animation:** Standard navigation
- **Data passed:** Product slug

### T20: Search Results -> Product Detail
- **Trigger:** Tap any product card in results
- **Animation:** Standard navigation
- **Data passed:** Product slug, search query (for "back to results" link)

---

## Global Transitions

### Language Switch (Any Screen)
- **Trigger:** Tap EN/JP toggle in navbar or footer
- **Animation:** No page reload. Text content crossfades (0.2s).
- **Behavior:** All visible text updates. URL stays same. Preference saved to localStorage + cookie.
- **Scope:** UI labels, product names (if translated), category names. Review content may only be in one language.

### Scroll-to-Top (Any Long Page)
- **Trigger:** Scroll past 2 viewport heights
- **Animation:** "Back to top" button fades in (bottom-right, 48px circle, gray-100 bg, arrow-up icon)
- **Behavior:** Smooth scroll to top (800ms ease-out)
- **Dismiss:** Fades out when near top

### Mobile Navigation Menu
- **Trigger:** Tap hamburger icon
- **Animation:** Slide-in from right, 0.3s, backdrop fades in
- **Content:** Category links, What's New, About, Language toggle, Search
- **Dismiss:** Tap backdrop, swipe right, tap X

### Error Navigation (404)
- **Trigger:** Any invalid URL
- **Screen:** Custom 404 page with search bar, category links, and "Go Home" button
- **Animation:** Standard page load

---

## Transition Animation Specs

| Transition Type | Duration | Easing | CSS |
|---|---|---|---|
| Page navigation | 0.3s | ease-out | `opacity: 0→1` on entering page |
| Card expand | 0.4s | cubic-bezier(0.4, 0, 0.2, 1) | Shared element (image position/size morph) |
| Modal/sheet open | 0.3s | ease-out | `translateY(100%)→0` (sheet), `scale(0.95)→1 + opacity` (modal) |
| Modal/sheet close | 0.2s | ease-in | Reverse of open |
| Dropdown open | 0.2s | ease-out | `opacity + translateY(-8px→0)` |
| Crossfade | 0.2s | ease | `opacity: 0→1` |
| Backdrop | 0.3s | ease | `opacity: 0→0.5` (black) |

---

## State Preservation Rules

| Scenario | Behavior |
|---|---|
| Back from product detail to carousel page | Restore scroll position, carousel position |
| Back from search results to homepage | Restore scroll position |
| Back from comparison to ranking | Restore checked products, scroll position |
| Refresh on any page | Load from URL params, scroll to top |
| Language switch | Preserve current scroll position, update text in-place |
| Filter change on ranking/category | Scroll to top of grid, preserve sidebar state |

---

## Deep Linking

Every screen state is encoded in the URL:
- Search: `/search?q=sunscreen&category=beauty&sort=score`
- Rankings: `/rankings/beauty/sunscreen?sort=price-asc&score=8`
- Comparison: `/compare?ids=a,b,c`
- What's New: `/whats-new?category=tech&time=month`

Sharing any URL reproduces the exact view (minus localStorage-dependent states like recent searches).
