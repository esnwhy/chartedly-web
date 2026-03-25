# Heuristic Evaluation — Chartedly

## Framework: Nielsen's 10 Usability Heuristics

Applied to every major screen. Each heuristic is scored:
- PASS: Fully addressed
- PARTIAL: Addressed with noted gaps
- FAIL: Needs redesign

---

## H1: Visibility of System Status

> The system should always keep users informed about what is going on, through appropriate feedback within reasonable time.

| Screen | Element | Status | Notes |
|---|---|---|---|
| Homepage | Carousel auto-rotation | PASS | Dot indicators show current slide, pauses on interaction |
| Homepage | Carousel lazy loading | PASS | Skeleton cards shown during load |
| Ranking Page | Infinite scroll loading | PASS | 3-dot pulse indicator visible while loading next batch |
| Ranking Page | Filter application | PASS | Active filter tags shown, result count updates immediately |
| Ranking Page | Sort change | PASS | Active sort option underlined, grid reloads with fade |
| Search | Autocomplete loading | PARTIAL | Need spinner icon in search bar while fetching. FIX: Add 16px spinner replacing search icon during fetch. |
| Search | No results | PASS | Clear "0 results found" message with suggestions |
| Product Detail | Image gallery position | PASS | "1/6" counter + dot indicators (mobile) + active thumbnail (desktop) |
| Product Detail | External link (Buy) | PARTIAL | Button should show brief loading state before opening new tab. FIX: Add 0.5s spinner on button press. |
| Comparison | Product adding | PASS | Column slides in with animation when product added |
| What's New | Timeline loading | PASS | Skeleton cards during infinite scroll load |
| All Pages | Language switch | PASS | Text crossfades, no full reload |
| All Pages | Page navigation | PARTIAL | Need page transition indicator for slower connections. FIX: Add thin progress bar at top of page (NProgress-style). |

**Overall H1: PARTIAL — 3 minor fixes needed (search spinner, buy button feedback, page transition bar)**

---

## H2: Match Between System and Real World

> The system should speak the users' language, with words, concepts, and conventions familiar to the user.

| Screen | Element | Status | Notes |
|---|---|---|---|
| All Pages | Bilingual support | PASS | EN/JP throughout, natural language in both |
| Homepage | Carousel row titles | PASS | "Top Picks This Week" / "今週のおすすめ" — natural phrasing |
| Product Detail | Score visualization | PASS | X/10 scale is universally understood, color coding intuitive |
| Product Detail | Pros/Cons | PASS | Universal format, checkmark/x-mark icons clear |
| Product Detail | Price format | PASS | ¥ symbol + comma separators match Japanese convention |
| Ranking Page | Podium metaphor | PASS | Gold/silver/bronze = #1/#2/#3 is universally understood |
| Comparison | Winner highlighting | PASS | Green background + trophy icon = winner, clear across cultures |
| Search | Placeholder text | PASS | "Search products, categories, brands..." describes available actions |
| Category Page | Category icons | PARTIAL | Icons must be unambiguous. "Health" (pill icon) could be confused with pharmacy. FIX: Use cross/heart icon for Health. Test with users. |
| Product Detail | "How We Test" | PASS | Transparent methodology language builds trust |

**Overall H2: PASS — 1 minor icon clarity issue**

---

## H3: User Control and Freedom

> Users often choose system functions by mistake and need a clearly marked "emergency exit."

| Screen | Element | Status | Notes |
|---|---|---|---|
| Search | Autocomplete dismissal | PASS | Escape key, backdrop tap, X button — 3 exit methods |
| Search | Clear search input | PASS | X icon in search bar clears text |
| Ranking Page | Filter clear | PASS | "Clear all" link + individual filter tag removal |
| Ranking Page | Compare deselect | PASS | Tap checkbox again, or tap X on compare bar thumbnails (mobile) |
| Comparison | Remove product | PASS | "Remove" button under each product header |
| Product Detail | Lightbox close | PASS | X button, swipe down, Escape, backdrop tap |
| Product Detail | Back navigation | PASS | Browser back preserves scroll position on previous page |
| Mobile | Bottom sheet dismiss | PASS | Drag down, backdrop tap, X button |
| Mobile | Navigation menu dismiss | PASS | Swipe right, backdrop tap, X button |
| Homepage | Newsletter | PARTIAL | After subscribing, no undo. FIX: Add "Unsubscribe anytime" text near subscribe button. Show unsubscribe link in success message. |
| All Pages | Language switch | PASS | Instant toggle, no confirmation needed, easily reversible |
| All Pages | Scroll to top | PASS | Floating button after 2 viewport heights of scroll |

**Overall H3: PASS — 1 minor enhancement (newsletter undo messaging)**

---

## H4: Consistency and Standards

> Users should not have to wonder whether different words, situations, or actions mean the same thing.

| Screen | Element | Status | Notes |
|---|---|---|---|
| All Pages | Product card component | PASS | Same card used everywhere: homepage, rankings, search, related products |
| All Pages | Score badge color system | PASS | Consistent: green (9+), blue (7-8.9), yellow (5-6.9), red (<5) |
| All Pages | Navigation patterns | PASS | Consistent navbar, breadcrumbs, footer across all pages |
| All Pages | Button styles | PASS | Primary (filled), secondary (outlined), ghost (text+arrow) consistently used |
| All Pages | Typography scale | PASS | Consistent heading hierarchy across all pages |
| Ranking + Category | Filter UI | PASS | Same chip/dropdown pattern on both pages |
| Carousel rows | Layout pattern | PASS | Same row structure (title + JP subtitle + "See All" + card row) everywhere |
| Product Detail | Purchase CTAs | PASS | Amazon always first (primary), others secondary, consistent across products |
| Comparison | Winner indicators | PASS | Same green highlight + trophy used for all winning cells |
| All Pages | Link behavior | PASS | Internal links: same tab. External (buy links): new tab with icon indicator. |

**Overall H4: PASS — Strong consistency achieved through component reuse**

---

## H5: Error Prevention

> Even better than good error messages is a careful design which prevents a problem from occurring in the first place.

| Screen | Element | Status | Notes |
|---|---|---|---|
| Search | Spelling correction | PASS | Auto-corrects misspellings, shows "search instead for" option |
| Search | Empty search prevention | PASS | Search button disabled when input is empty |
| Comparison | Max product limit | PASS | 5th product blocked with "Maximum 4" tooltip |
| Comparison | Minimum products | PASS | "Add Product" prompt when only 1 product selected |
| Newsletter | Email validation | PASS | Client-side validation before submit, inline error message |
| Ranking | Filter combinations | PARTIAL | Possible to filter to 0 results. FIX: Show result count preview in filter panel before applying. Disable filter options that would yield 0 results (gray out + "(0)"). |
| Product Detail | External link warning | PASS | Buy buttons clearly show retailer name + "opens in new tab" icon |
| Mobile | Accidental taps | PASS | All tap targets minimum 44px, adequate spacing between interactive elements |
| All Pages | Form preservation | PASS | Search text preserved on back navigation |

**Overall H5: PARTIAL — 1 improvement needed (filter result count preview)**

---

## H6: Recognition Rather Than Recall

> Minimize the user's memory load by making objects, actions, and options visible.

| Screen | Element | Status | Notes |
|---|---|---|---|
| Homepage | Category icons + labels | PASS | Icons paired with text labels, no icon-only navigation |
| Search | Recent searches | PASS | Shows last 5 searches on focus, no need to remember |
| Search | Autocomplete | PASS | Shows matching products with images — visual recognition |
| Ranking Page | Active filters shown | PASS | Tag pills above grid show all active filters |
| Ranking Page | Sort state visible | PASS | Active sort option underlined |
| Comparison | Sticky headers | PASS | Product names/images stay visible while scrolling table |
| Product Detail | Breadcrumbs | PASS | Shows full navigation path: Home > Category > Subcategory > Product |
| Product Detail | Score breakdown | PASS | Visual bars eliminate need to remember scoring criteria |
| All Pages | Consistent navigation | PASS | Same navbar on every page, always accessible |
| What's New | Date grouping | PASS | Timeline groups by relative dates ("Today", "This Week") |

**Overall H6: PASS — Consistent use of visual cues and persistent state indicators**

---

## H7: Flexibility and Efficiency of Use

> Accelerators — unseen by the novice user — may often speed up the interaction for the expert user.

| Screen | Element | Status | Notes |
|---|---|---|---|
| Search | Keyboard navigation | PASS | Arrow keys in autocomplete, Enter to select/submit |
| Search | Direct URL search | PASS | `/search?q=term` works for bookmarking/sharing |
| Ranking Page | View toggle | PASS | Grid (visual browsers) vs List (scanners) — user preference |
| Ranking Page | Sort options | PASS | Quick sort without opening menus |
| Homepage | Category strip | PASS | Power users jump directly to category, bypassing hero |
| Comparison | URL sharing | PASS | Compare URLs contain product IDs, shareable |
| Product Detail | Anchor links | PARTIAL | No jump-to-section navigation. FIX: Add floating mini-TOC on desktop (sticky right rail) for long product pages with: Score, Pros/Cons, Specs, Review, How We Test. |
| All Pages | Keyboard shortcuts | PARTIAL | No keyboard shortcuts beyond search focus. FIX: Add "/" to focus search (standard web convention). Consider "g h" for home, "g n" for new. Low priority. |
| Mobile | Swipe gestures | PASS | Horizontal swipe on carousels, vertical scroll natural |

**Overall H7: PARTIAL — 2 enhancements (mini-TOC, keyboard shortcuts)**

---

## H8: Aesthetic and Minimalist Design

> Dialogues should not contain information which is irrelevant or rarely needed.

| Screen | Element | Status | Notes |
|---|---|---|---|
| Homepage | Information density | PASS | Each carousel row has single clear purpose, no clutter |
| Product Card | 3-second clarity | PASS | Name, score, price — the 3 essential data points visible immediately |
| Product Detail | Content hierarchy | PASS | Most important info (score, verdict, pros/cons) above fold, details below |
| Product Detail | Specs table | PASS | Collapsed on mobile (show 5, expand for more) reduces overwhelm |
| Product Detail | Review length | PASS | Long reviews truncated at 800 words with "Read full review" |
| Ranking Page | Podium + grid | PASS | Top 3 get special treatment, rest in clean grid — clear hierarchy |
| Comparison | Data density | PARTIAL | Full comparison table can feel overwhelming. FIX: Add "Key Differences" summary section at top showing only rows where products differ. Identical specs collapsed by default. |
| Search | Autocomplete sections | PASS | Clear separation: Products / Categories / Brands |
| All Pages | Whitespace | PASS | Generous padding (80px desktop sections), breathing room between elements |
| All Pages | Color restraint | PASS | Mostly gray palette, color used meaningfully (score tiers, pro/con, CTAs) |

**Overall H8: PASS — 1 enhancement (comparison key differences summary)**

---

## H9: Help Users Recognize, Diagnose, and Recover from Errors

> Error messages should be expressed in plain language, precisely indicate the problem, and constructively suggest a solution.

| Screen | Element | Status | Notes |
|---|---|---|---|
| Search | No results | PASS | Clear message + suggestions (categories, popular searches) |
| Search | Spelling correction | PASS | Shows corrected results + link to original query |
| Product Card | Image load failure | PASS | Category icon placeholder + "Image unavailable" text, data still renders |
| Ranking Page | Empty filter results | PASS | "No products match your filters" + "Clear all filters" link |
| Category Page | Empty category | PASS | "We're working on this category!" + notification signup |
| Newsletter | Invalid email | PASS | Inline validation: "Please enter a valid email address" below input field |
| All Pages | 404 page | PASS | Custom page with search bar, category links, "Go Home" button |
| All Pages | Network error | PARTIAL | Need offline/error state for data fetch failures. FIX: Show "Something went wrong. Tap to retry" with retry button. Cache previously loaded content. |
| Product Detail | Price unavailable | PASS | Shows "Check Price" link instead of ¥0 or blank |
| Comparison | Product not found | PARTIAL | If a compared product is removed from database. FIX: Show grayed-out column with "This product is no longer available" and "Remove" button. |

**Overall H9: PARTIAL — 2 edge cases need handling (network error, removed product)**

---

## H10: Help and Documentation

> Even though it is better if the system can be used without documentation, it may be necessary to provide help.

| Screen | Element | Status | Notes |
|---|---|---|---|
| Product Detail | "How We Test" | PASS | Accordion explains methodology in context |
| Product Detail | "How is this scored?" | PASS | Link near score visualization (added from usability test) |
| Product Detail | Affiliate disclosure | PASS | "i" icon + link to disclosure page near buy buttons |
| Comparison | Feature explanation | PARTIAL | Winner highlighting is self-explanatory, but no legend. FIX: Add small "🏆 = Best in category" legend below table header on first visit. |
| Homepage | First-time user guidance | PARTIAL | No onboarding. FIX: For first-time visitors, show subtle tooltip on category strip: "Browse by category" and on first carousel: "Swipe to see more". Dismiss on interaction, don't show again. |
| All Pages | About/Methodology link | PASS | In footer: "How We Test", "Methodology", "About" pages |
| All Pages | Contact | PASS | Contact link in footer for support |
| Search | Search guidance | PASS | Placeholder text, recent searches, trending searches guide user |

**Overall H10: PARTIAL — 2 enhancements (comparison legend, first-visit tooltips)**

---

## Overall Heuristic Scorecard

| Heuristic | Score | Critical Fixes |
|---|---|---|
| H1: Visibility of System Status | PARTIAL | Search spinner, buy button feedback, page transition bar |
| H2: Match System & Real World | PASS | Minor icon clarity |
| H3: User Control & Freedom | PASS | Newsletter undo messaging |
| H4: Consistency & Standards | PASS | — |
| H5: Error Prevention | PARTIAL | Filter result count preview |
| H6: Recognition vs Recall | PASS | — |
| H7: Flexibility & Efficiency | PARTIAL | Mini-TOC, keyboard shortcuts |
| H8: Aesthetic & Minimalist | PASS | Comparison key differences |
| H9: Error Recovery | PARTIAL | Network error state, removed product handling |
| H10: Help & Documentation | PARTIAL | Comparison legend, first-visit tooltips |

**Total: 5 PASS, 5 PARTIAL (no FAIL)**

All PARTIAL items are minor enhancements, not structural issues. The core design is heuristically sound.

---

## Priority Fixes (Ordered by Impact)

1. **Network error state** (H9) — Critical for mobile users with spotty connections
2. **Page transition indicator** (H1) — Prevents perceived lag
3. **Filter result count preview** (H5) — Prevents empty-result dead ends
4. **Search loading spinner** (H1) — Small but noticeable gap
5. **Comparison "Key Differences" section** (H8) — Reduces cognitive load significantly
6. **Mini-TOC on product detail** (H7) — Improves efficiency for long pages
7. **First-visit tooltips** (H10) — Aids discoverability
8. **Buy button loading state** (H1) — Prevents double-taps
9. **Comparison legend** (H10) — Minor clarity improvement
10. **Keyboard shortcuts** (H7) — Power user feature, low priority
