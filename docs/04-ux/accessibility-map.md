# Accessibility Map — Chartedly

## Standard: WCAG 2.1 AA Compliance

Every interactive element mapped with specific requirements.

---

## Global Requirements

### Color Contrast
- **Body text** (gray-700 on white): 4.5:1 minimum ratio — REQUIRED
- **Large text** (24px+ or 18.66px+ bold): 3:1 minimum — REQUIRED
- **UI components** (borders, icons, form controls): 3:1 against background — REQUIRED
- **Score badge text** (white on colored bg): verified per tier:
  - Green-600 (#16A34A) on white text: 4.5:1 — PASS
  - Blue-600 (#2563EB) on white text: 4.6:1 — PASS
  - Yellow-600 (#CA8A04) on white text: 3.1:1 — BORDERLINE, use yellow-700 (#A16207) for 4.5:1
  - Red-600 (#DC2626) on white text: 4.6:1 — PASS

### Focus Management
- All interactive elements: visible focus indicator (2px blue-600 outline, 2px offset)
- Focus order: follows visual reading order (left-to-right, top-to-bottom)
- Focus trap: modals, lightbox, bottom sheets trap focus within
- Focus restore: on modal/overlay close, focus returns to trigger element
- Skip link: "Skip to main content" link visible on first Tab press (hidden by default)

### Motion & Animation
- `prefers-reduced-motion: reduce`: disable all transitions, auto-rotation, parallax
- Carousel auto-rotation: pauses on hover, focus, and `prefers-reduced-motion`
- No content depends solely on animation to convey meaning

### Text & Zoom
- All text: uses relative units (rem/em), not px for font-size
- Page remains functional at 200% browser zoom
- No horizontal scroll at 320px viewport width (reflow)
- Minimum text size: 12px (0.75rem) for smallest labels

### Language
- `<html lang="en">` or `<html lang="ja">` based on selection
- Language switch updates `lang` attribute on `<html>`
- Bilingual content: wrap JP text in `<span lang="ja">` within EN pages

---

## Component-Level Accessibility

### 1. Navbar

| Element | Requirement | Implementation |
|---|---|---|
| Logo | Link to home | `<a href="/" aria-label="Chartedly home">` |
| Search input | Labeled | `<input type="search" aria-label="Search products" role="searchbox">` |
| Search button | Labeled | `<button aria-label="Submit search">` |
| Language toggle | State announced | `<button aria-pressed="true" aria-label="Language: English. Switch to Japanese.">` |
| Hamburger menu | Expanded state | `<button aria-expanded="false" aria-controls="mobile-nav" aria-label="Open menu">` |
| Mobile nav panel | Dialog role | `<nav role="dialog" aria-modal="true" aria-label="Navigation menu">` |

### 2. Hero Carousel

| Element | Requirement | Implementation |
|---|---|---|
| Carousel container | Region labeled | `<section aria-roledescription="carousel" aria-label="Featured products">` |
| Each slide | Role + label | `<div role="group" aria-roledescription="slide" aria-label="1 of 5">` |
| Auto-rotation | Pause control | `<button aria-label="Pause auto-rotation">` visible (or play/pause toggle) |
| Previous/Next | Labeled | `<button aria-label="Previous slide">`, `<button aria-label="Next slide">` |
| Dot indicators | Current state | `<button aria-label="Go to slide 3" aria-current="true">` for active dot |
| Slide content | Heading structure | Product name as `<h2>` within slide |

### 3. Category Quick-Nav Strip

| Element | Requirement | Implementation |
|---|---|---|
| Strip container | Navigation landmark | `<nav aria-label="Product categories">` |
| Each category link | Descriptive | `<a href="/categories/beauty" aria-label="Beauty category">` |
| Category icon | Decorative | `<svg aria-hidden="true">` (label on the link is sufficient) |
| Horizontal scroll | Keyboard accessible | Arrow keys navigate between items, Tab moves to next landmark |
| Active category | State indicated | `aria-current="page"` on active category |

### 4. Product Card

| Element | Requirement | Implementation |
|---|---|---|
| Card wrapper | Full card clickable | `<a href="/products/..." aria-label="Anessa Perfect UV, rated 9.2 out of 10, ¥2,480">` |
| Product image | Alt text | `<img alt="Anessa Perfect UV Skincare Milk by Shiseido">` |
| Score badge | Described | `<span aria-label="Score: 9.2 out of 10">9.2</span>` |
| Rank badge | Described | `<span aria-label="Ranked number 2">#2</span>` |
| Award badge | Text is sufficient | Visible text "Editor's Choice" is self-describing |
| Hover overlay (pros) | Not essential | Pros in overlay are supplementary; main content accessible without hover |
| Compare checkbox | Labeled | `<input type="checkbox" aria-label="Add Anessa Perfect UV to comparison">` |
| Loading skeleton | Hidden | `<div aria-hidden="true" role="presentation">` with `aria-busy="true"` on parent |
| Error state | Alt text updated | `<img alt="Image unavailable for Anessa Perfect UV">` |

### 5. Product Detail Page

| Element | Requirement | Implementation |
|---|---|---|
| Breadcrumbs | Navigation landmark | `<nav aria-label="Breadcrumb"><ol>...</ol></nav>` with schema |
| Image gallery | Carousel pattern | Same as hero carousel, `aria-roledescription="carousel"` |
| Lightbox | Dialog | `<div role="dialog" aria-modal="true" aria-label="Product image gallery">` |
| Score circle | Described | `<div role="img" aria-label="Overall score: 9.2 out of 10">` |
| Breakdown bars | Each described | `<div role="meter" aria-label="Effectiveness" aria-valuenow="9.0" aria-valuemin="0" aria-valuemax="10">` |
| Radar chart | Alternative text | `<svg role="img" aria-label="Score breakdown: Effectiveness 9.0, Value 7.5, Ease of Use 9.5, Packaging 8.0, Ingredients 9.0">` |
| Pros list | Structured | `<ul aria-label="Pros"><li>...</li></ul>` |
| Cons list | Structured | `<ul aria-label="Cons"><li>...</li></ul>` |
| Specs table | Proper table markup | `<table><caption>Product specifications</caption><th scope="row">...</th>` |
| Specs expand toggle | State announced | `<button aria-expanded="false" aria-controls="specs-full">Show all 12 specs</button>` |
| "How We Test" accordion | Expandable | `<button aria-expanded="false" aria-controls="how-we-test-content">` |
| Purchase buttons | External link indicated | `<a href="..." target="_blank" rel="noopener" aria-label="Buy on Amazon for ¥2,480 (opens in new tab)">` |
| Affiliate disclosure | Linked | `<a href="/affiliate-disclosure" aria-label="About our affiliate partnerships">` |
| Mobile sticky buy bar | Landmark | `<aside aria-label="Purchase options">` |

### 6. Ranking Page

| Element | Requirement | Implementation |
|---|---|---|
| Page heading | H1 | `<h1>Best Sunscreen in Japan 2026</h1>` |
| Category tabs | Tab pattern | `<div role="tablist"><button role="tab" aria-selected="true" aria-controls="panel-sunscreen">Sunscreen</button>` |
| Filter dropdowns | Listbox pattern | `<button aria-haspopup="listbox" aria-expanded="false">Price</button>` |
| Active filter tags | Described | `<span role="status">Showing 12 of 48 products</span>` + each tag: `<button aria-label="Remove filter: Sunscreen">Sunscreen ✕</button>` |
| Sort controls | Current state | `<button aria-pressed="true" aria-label="Sort by score, descending">Score</button>` |
| View toggle | Current state | `<button aria-pressed="true" aria-label="Grid view">` |
| Podium cards | Heading hierarchy | Each product name as `<h3>`, rank as `aria-label` |
| Compare checkbox | See Product Card section | Same pattern |
| Compare floating button | Live region | `<div role="status" aria-live="polite">Compare 3 products</div>` |
| Infinite scroll | Announce new content | `<div aria-live="polite" aria-atomic="false">` announces "Loaded 8 more products" |

### 7. Comparison Page

| Element | Requirement | Implementation |
|---|---|---|
| Comparison table | Proper table | `<table aria-label="Product comparison">` with `<th scope="col">` for products, `<th scope="row">` for attributes |
| Winner cells | Visually + programmatically | `<td aria-label="Anessa: 9.2 — Winner">` or add `<span class="sr-only">Winner</span>` |
| Remove product | Labeled | `<button aria-label="Remove Anessa from comparison">` |
| Add product modal | Dialog | `<div role="dialog" aria-modal="true" aria-label="Add product to comparison">` |
| Mobile horizontal scroll | Instructions | `<p class="sr-only">Scroll right to see more products</p>` |
| Frozen first column | Not a trap | Keyboard Tab navigates through all cells in reading order, not trapped in frozen column |

### 8. Search

| Element | Requirement | Implementation |
|---|---|---|
| Search input | Autocomplete role | `<input role="combobox" aria-autocomplete="list" aria-expanded="true" aria-controls="search-results" aria-activedescendant="result-3">` |
| Autocomplete list | Listbox | `<ul role="listbox" id="search-results">` |
| Each result | Option | `<li role="option" id="result-3" aria-selected="false">` |
| Result count | Live region | `<div aria-live="polite">24 results found</div>` |
| Spelling correction | Announced | `<div aria-live="polite">Showing results for "sunscreen"</div>` |
| No results | Announced | `<div role="status">No products found</div>` |

### 9. What's New (Timeline)

| Element | Requirement | Implementation |
|---|---|---|
| Date group headers | Heading | `<h2>Today — March 24, 2026</h2>` |
| Timeline cards | Article | `<article aria-label="New review: Anessa Perfect UV">` |
| Type badges (NEW/UPDATED) | Described | `<span aria-label="New review">NEW</span>` |
| Infinite scroll | Announce loads | Same as ranking page pattern |

### 10. Newsletter CTA

| Element | Requirement | Implementation |
|---|---|---|
| Email input | Labeled | `<label for="newsletter-email">Email address</label>` (visually hidden if placeholder used, but label must exist) |
| Submit button | Labeled | `<button type="submit">Subscribe</button>` |
| Validation error | Linked to input | `<input aria-describedby="email-error" aria-invalid="true">` + `<span id="email-error" role="alert">Please enter a valid email</span>` |
| Success message | Announced | `<div role="status" aria-live="polite">Successfully subscribed!</div>` |

### 11. Footer

| Element | Requirement | Implementation |
|---|---|---|
| Footer | Landmark | `<footer role="contentinfo">` |
| Column sections | Headed | `<h3>Categories</h3>` (visually styled as small labels) |
| Social links | Labeled | `<a href="..." aria-label="Follow us on Twitter">` |
| Mobile accordion | Expandable | `<button aria-expanded="false" aria-controls="footer-categories">Categories</button>` |

---

## Screen Reader Announcement Patterns

### Page Load Announcements
```html
<!-- Each page title updates document.title -->
<title>Best Sunscreen in Japan 2026 — Chartedly</title>

<!-- Main content landmark -->
<main id="main-content" aria-label="Best Sunscreen Rankings">
```

### Dynamic Content Updates
```html
<!-- Filter applied -->
<div aria-live="polite" class="sr-only">
  Showing 8 products matching your filters
</div>

<!-- Infinite scroll loaded -->
<div aria-live="polite" class="sr-only">
  Loaded 8 more products. 16 of 48 now showing.
</div>

<!-- Compare selection -->
<div aria-live="polite" class="sr-only">
  Added Anessa Perfect UV to comparison. 2 products selected.
</div>

<!-- Language changed -->
<div aria-live="polite" class="sr-only">
  Language changed to Japanese
</div>
```

---

## Keyboard Navigation Map

### Tab Order (Homepage)
1. Skip link ("Skip to main content")
2. Logo (home link)
3. Search input
4. Language toggle
5. Menu button (mobile) / Category links (desktop)
6. Hero: Previous / Play-Pause / Next buttons, slide CTA
7. Category quick-nav strip items
8. Each carousel row: "See All" link, then card links
9. Newsletter: email input, subscribe button
10. Footer links

### Keyboard Shortcuts
| Key | Action | Context |
|---|---|---|
| `/` | Focus search bar | Any page |
| `Escape` | Close overlay/modal/lightbox | When overlay is open |
| `Arrow Left/Right` | Navigate carousel slides | When carousel is focused |
| `Arrow Up/Down` | Navigate autocomplete results | When search is focused |
| `Enter` | Select/activate focused element | Standard |
| `Space` | Toggle checkbox, activate button | Standard |
| `Tab` | Move to next interactive element | Standard |
| `Shift+Tab` | Move to previous interactive element | Standard |

---

## Touch Accessibility (Mobile)

| Requirement | Specification |
|---|---|
| Minimum tap target | 44px x 44px (WCAG 2.5.5 AA) |
| Spacing between targets | 8px minimum between adjacent tap targets |
| Gesture alternatives | All swipe actions have button alternatives (carousel arrows) |
| Touch target visibility | All interactive elements have visible boundaries or states |
| Drag actions | Bottom sheet drag-to-dismiss has X button alternative |

---

## Testing Checklist

- [ ] VoiceOver (iOS Safari) — full task completion test
- [ ] TalkBack (Android Chrome) — full task completion test
- [ ] NVDA (Windows Chrome) — full task completion test
- [ ] Keyboard-only navigation (no mouse) — all tasks completable
- [ ] 200% zoom — no content loss, no horizontal scroll
- [ ] High contrast mode (Windows) — all elements visible
- [ ] Color blind simulation (deuteranopia, protanopia) — score tiers distinguishable by shape/text, not just color
- [ ] axe DevTools audit — 0 critical/serious issues
- [ ] Lighthouse accessibility score — 95+
