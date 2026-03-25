# Chartedly Developer Handoff

Implementation reference for all design tokens, component hierarchy, and technical specs.

---

## Tech Stack Assumptions

- **Framework:** Next.js 14+ (App Router)
- **Styling:** Tailwind CSS 3.4+ with custom config
- **Fonts:** Google Fonts (Inter + Noto Sans JP)
- **Icons:** SVG inline (no icon library dependency)
- **Charts:** SVG-based (custom or lightweight library like Recharts)
- **Language:** TypeScript

---

## 1. Font Loading

Add to `app/layout.tsx` or `_document.tsx`:

```html
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Noto+Sans+JP:wght@400;500;600;700&display=swap" rel="stylesheet" />
```

Or use `next/font`:

```tsx
import { Inter } from 'next/font/google';
import { Noto_Sans_JP } from 'next/font/google';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const notoSansJP = Noto_Sans_JP({ subsets: ['latin'], variable: '--font-noto-jp' });
```

---

## 2. Tailwind Config

Full config is in `design-tokens.md`. Copy the `tailwind.config.js` export directly.

Key additions beyond defaults:
- Custom color palette (bg, surface, primary, secondary, score, text, border)
- Custom shadows (card, card-hover, elevated, overlay, focus-ring)
- Custom animations (shimmer, fade-in, slide-up, score-fill)
- Custom z-index scale

---

## 3. CSS Custom Properties

Add to `globals.css` (or `app/globals.css`). Full list in `design-tokens.md`. These provide fallbacks and are used in component CSS where Tailwind classes are insufficient.

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  /* Paste all CSS custom properties from design-tokens.md */
}

/* Global reduced-motion override */
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

---

## 4. Component Hierarchy

```
app/
├── layout.tsx                  # Root layout, fonts, nav, footer
├── page.tsx                    # Homepage
├── [locale]/                   # i18n (en/ja)
│   ├── page.tsx
│   ├── rankings/
│   │   └── [category]/page.tsx # Ranking page with podium
│   ├── products/
│   │   └── [slug]/page.tsx     # Product detail
│   ├── compare/page.tsx        # Comparison tool
│   └── search/page.tsx         # Full search results
│
components/
├── layout/
│   ├── Navigation.tsx          # → navigation.md
│   ├── Footer.tsx              # → footer.md
│   ├── MobileTabBar.tsx        # → navigation.md (bottom tab)
│   └── SearchOverlay.tsx       # → search.md
│
├── home/
│   ├── HeroSection.tsx         # → hero-section.md
│   └── CarouselRow.tsx         # → carousel.md
│
├── product/
│   ├── ProductCard.tsx         # → product-card.md
│   ├── ProductCardSkeleton.tsx # → product-card.md (loading state)
│   ├── ScoreBadge.tsx          # → score-badge.md (small + large)
│   ├── RadarChart.tsx          # → score-badge.md (radar section)
│   └── ProductGallery.tsx      # (detail page image gallery)
│
├── comparison/
│   ├── ComparisonTable.tsx     # → comparison-table.md
│   └── ComparisonSlot.tsx      # Add/remove product slot
│
├── search/
│   ├── SearchInput.tsx         # → search.md
│   ├── SearchDropdown.tsx      # → search.md
│   └── SearchResult.tsx        # → search.md (result item)
│
└── ui/
    ├── Button.tsx              # Primary, secondary, ghost variants
    ├── Badge.tsx               # Category pills, labels
    ├── Skeleton.tsx            # Reusable shimmer skeleton
    └── LanguageToggle.tsx      # EN/JP switch
```

---

## 5. Z-Index Scale

Strict layering. Never use arbitrary z-index values.

| Token         | Value | Usage                              |
|---------------|-------|------------------------------------|
| `z-base`      | 0     | Default content                    |
| `z-card`      | 1     | Card content, edge fade            |
| `z-card-hover`| 2     | Hovered card, carousel arrows      |
| `z-sticky`    | 10    | Sticky table headers               |
| `z-nav`       | 100   | Top nav, bottom tab bar            |
| `z-dropdown`  | 200   | Mega menu, autocomplete dropdown   |
| `z-overlay`   | 300   | Search overlay, modal backdrop     |
| `z-modal`     | 400   | Modal content                      |
| `z-toast`     | 500   | Toast notifications                |
| `z-tooltip`   | 600   | Tooltips                           |

Tailwind usage: `z-nav`, `z-dropdown`, `z-overlay`, etc. (defined in config).

---

## 6. Breakpoint System

| Token  | Width    | Columns | Padding | Usage                         |
|--------|----------|---------|---------|-------------------------------|
| `sm`   | ≥640px   | 1-2     | 16px    | Large phones landscape        |
| `md`   | ≥768px   | 2       | 24px    | Tablets portrait              |
| `lg`   | ≥1024px  | 3-4     | 24px    | Tablets landscape, small desktop |
| `xl`   | ≥1280px  | 4-5     | 24px    | Desktop                       |
| `2xl`  | ≥1536px  | 5-6     | 24px    | Wide desktop                  |

Content max-width: `1440px` with `mx-auto`.

Mobile-first approach: base styles are mobile, layer up with `sm:`, `md:`, `lg:`, `xl:`.

---

## 7. Responsive Card Grids

```tsx
// Carousel context (horizontal scroll)
<div className="flex gap-4 overflow-x-auto snap-x snap-mandatory scrollbar-hide px-6">
  {products.map(p => (
    <ProductCard key={p.id} className="min-w-[280px] max-w-[280px] snap-start flex-shrink-0" />
  ))}
</div>

// Grid context (rankings, search results)
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-4 lg:gap-5 xl:gap-6">
  {products.map(p => <ProductCard key={p.id} />)}
</div>
```

---

## 8. Score Color Logic

```tsx
function getScoreColor(score: number) {
  if (score >= 80) return { color: '#22C55E', label: 'Excellent', class: 'score-excellent' };
  if (score >= 60) return { color: '#F59E0B', label: 'Good', class: 'score-good' };
  return { color: '#EF4444', label: 'Needs Work', class: 'score-poor' };
}

// Score ring offset calculation
function getScoreOffset(score: number) {
  const circumference = 2 * Math.PI * 52; // 326.73
  return circumference * (1 - score / 100);
}
```

---

## 9. Language Handling

Two-language support: English (en) and Japanese (ja).

Key differences:
- JP body text uses `line-height: 1.6` (vs 1.5 for EN)
- JP headings are typically 1 step smaller in the type scale
- JP body uses `letter-spacing: 0.02em`
- JP text allows `word-break: break-all`
- Font stack switches: `font-jp` class applies Noto Sans JP

```tsx
// Example bilingual component
<h2 className={locale === 'ja' ? 'font-jp text-xl leading-tight' : 'text-2xl leading-tight tracking-tight'}>
  {t('section.title')}
</h2>
```

---

## 10. Image Handling

| Context        | Aspect Ratio | Sizes                     | Format     |
|----------------|-------------|---------------------------|------------|
| Product card   | 16:10       | 280w, 360w, 560w          | WebP, AVIF |
| Hero           | Full cover  | 1440w, 1920w, 2560w       | WebP, AVIF |
| Product detail | 1:1         | 400w, 600w, 800w          | WebP, AVIF |
| Comparison     | 1:1         | 80w, 160w                 | WebP       |
| Search result  | 1:1         | 48w, 96w                  | WebP       |

Use Next.js `<Image>` with `sizes` prop and `priority` for above-the-fold hero images.

---

## 11. Key Implementation Notes

1. **Card as link:** Product cards are wrapped in a single `<a>` tag. The compare checkbox is a separate interactive element with `e.stopPropagation()`.

2. **Carousel scroll detection:** Use `IntersectionObserver` on first/last cards to toggle arrow visibility and edge fades.

3. **Search global shortcut:** Listen for `/` keypress on `document`, but ignore when an input/textarea is focused.

4. **Sticky nav blur:** `backdrop-filter: blur(16px)` requires `-webkit-` prefix for Safari.

5. **Safe area insets:** Bottom tab bar must account for `env(safe-area-inset-bottom)` on iOS.

6. **Score animations:** Use `IntersectionObserver` to trigger score ring fill only when visible in viewport.

7. **Skeleton loading:** Show 4-5 skeleton cards in carousel during data fetch. Match exact dimensions of real cards.

8. **Dark mode only:** This design is exclusively dark. No light mode toggle needed.

---

## 12. File Reference

| Spec Document                           | Component(s)                    |
|-----------------------------------------|---------------------------------|
| `design-tokens.md`                      | Global tokens, Tailwind config  |
| `color-system.md`                       | WCAG compliance reference       |
| `typography-system.md`                  | Type scale, font loading        |
| `component-specs/product-card.md`       | ProductCard, ProductCardSkeleton|
| `component-specs/hero-section.md`       | HeroSection                     |
| `component-specs/carousel.md`           | CarouselRow                     |
| `component-specs/score-badge.md`        | ScoreBadge, RadarChart          |
| `component-specs/navigation.md`         | Navigation, MobileTabBar        |
| `component-specs/comparison-table.md`   | ComparisonTable                 |
| `component-specs/search.md`             | SearchInput, SearchDropdown     |
| `component-specs/footer.md`             | Footer                          |
| `motion-spec.md`                        | All animation implementations   |
