# ADR-002: Tailwind CSS 4 with Custom Design Tokens

## Status
**Accepted** — 2026-03-24

## Context
Chartedly has a defined design system from Phase 05: dark theme (#0A0A0F to #1A1A2E), Inter + Noto Sans JP typography, electric blue accent (#4F7DF7), 6 card states, animation specs, and responsive breakpoints. A styling solution must implement these tokens faithfully while keeping the codebase maintainable by a solo founder.

## Decision
Keep Tailwind CSS 4, configured via the Vite plugin (`@tailwindcss/vite`). Extend with custom theme tokens from Phase 05.

## Alternatives Considered

### Vanilla CSS / CSS Modules
- **Pros:** No dependency, full control, native cascade layers.
- **Cons:** Verbose for utility patterns. Maintaining consistent spacing, colors, and responsive behavior across 16+ components without a utility system leads to drift. Solo founder cannot afford the maintenance overhead.
- **Verdict:** Rejected. Too much manual coordination.

### Styled Components / CSS-in-JS
- **Pros:** Co-located styles, dynamic theming.
- **Cons:** Runtime overhead (JS-in-CSS), SSG unfriendly, tight coupling to React. Astro components use `.astro` files, not React.
- **Verdict:** Rejected. Wrong paradigm for Astro.

### UnoCSS
- **Pros:** Faster build, compatible API, Astro integration.
- **Cons:** Smaller community, Tailwind CSS 4 closed the performance gap via Vite plugin. Migration from existing Tailwind classes for zero visible benefit.
- **Verdict:** Rejected. Marginal gains, real migration cost.

## Implementation

### Theme Configuration (src/styles/global.css)

```css
@import "tailwindcss";

@theme {
  /* ── Colors — Background (Phase 05 design-tokens.md) ── */
  --color-bg-base: #0A0A0F;
  --color-bg-deep: #0D0D18;
  --color-bg-charcoal: #1A1A2E;

  /* ── Colors — Surface ── */
  --color-surface-card: #16162A;
  --color-surface-elevated: #1E1E38;
  --color-surface-hover: #1C1C36;
  --color-surface-pressed: #141428;
  --color-surface-input: #12122A;

  /* ── Colors — Primary Accent (Electric Blue) ── */
  --color-primary: #4F7DF7;
  --color-primary-600: #3D65D4;
  --color-primary-700: #2D4EB1;

  /* ── Colors — Secondary Accent (Warm Amber) ── */
  --color-secondary: #F7A94F;
  --color-secondary-600: #D48E3D;

  /* ── Colors — Score System ── */
  --color-score-excellent: #22C55E;
  --color-score-good: #F59E0B;
  --color-score-poor: #EF4444;

  /* ── Colors — Text ── */
  --color-text-primary: #FFFFFF;
  --color-text-secondary: #9CA3AF;
  --color-text-muted: #6B7280;
  --color-text-inverse: #0A0A0F;

  /* ── Colors — Border ── */
  --color-border-subtle: #2D2D4A;
  --color-border-default: #3D3D5C;
  --color-border-strong: #4D4D6A;

  /* ── Typography ── */
  --font-sans: 'Inter', 'Noto Sans JP', system-ui, sans-serif;
  --font-mono: 'JetBrains Mono', monospace;

  /* ── Spacing (4px grid) ── */
  --spacing-1: 0.25rem;
  --spacing-2: 0.5rem;
  --spacing-3: 0.75rem;
  --spacing-4: 1rem;
  --spacing-5: 1.25rem;
  --spacing-6: 1.5rem;
  --spacing-8: 2rem;
  --spacing-10: 2.5rem;
  --spacing-12: 3rem;
  --spacing-16: 4rem;
  --spacing-20: 5rem;
  --spacing-24: 6rem;
  --spacing-32: 8rem;

  /* ── Border Radius ── */
  --radius-sm: 4px;
  --radius-md: 8px;
  --radius-lg: 12px;
  --radius-xl: 16px;
  --radius-full: 9999px;

  /* ── Shadows ── */
  --shadow-card: 0 1px 3px rgba(0, 0, 0, 0.3);
  --shadow-card-hover: 0 8px 32px rgba(79, 125, 247, 0.15);
  --shadow-elevated: 0 16px 48px rgba(0, 0, 0, 0.5);

  /* ── Breakpoints ── */
  --breakpoint-sm: 640px;
  --breakpoint-md: 768px;
  --breakpoint-lg: 1024px;
  --breakpoint-xl: 1280px;
  --breakpoint-2xl: 1440px;
}
```

### Usage in Components

```astro
<!-- ProductCard.astro -->
<div class="bg-bg-card hover:bg-bg-card-hover rounded-lg border border-border
            hover:border-border-hover shadow-card hover:shadow-elevated
            transition-all duration-200">
  <h3 class="text-text-primary font-sans text-lg">...</h3>
  <p class="text-text-secondary text-sm">...</p>
  <span class="text-accent">...</span>
</div>
```

## Consequences
- All Phase 05 design tokens are available as Tailwind utilities (`bg-bg-primary`, `text-accent`, etc.).
- No separate CSS files needed for theme colors — everything is utility-first.
- Dark theme is the default and only theme. No light/dark toggle complexity.
- Font loading handled separately (see performance-budget.md) — Inter via Google Fonts with `font-display: swap`, Noto Sans JP subset for JP pages.
