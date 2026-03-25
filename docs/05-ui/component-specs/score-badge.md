# Component Spec: Score Badge

Score visualization system. Two sizes: large (product detail) and small (product card). Plus radar chart.

---

## Score Color Thresholds

| Range   | Color                  | Hex       | Label      |
|---------|------------------------|-----------|------------|
| 80-100  | Emerald (Excellent)    | #22C55E   | Excellent  |
| 60-79   | Amber (Good)           | #F59E0B   | Good       |
| 0-59    | Rose (Poor)            | #EF4444   | Needs Work |

---

## Small Badge (Product Card)

Used on product cards, overlapping the image bottom-right corner.

### Dimensions

| Property      | Value                 |
|---------------|-----------------------|
| Size          | 44px x 44px           |
| Border radius | 9999px (circle)       |
| Font size     | 14px                  |
| Font weight   | 700                   |
| Border        | 2px solid card bg     |

### CSS

```css
.score-badge-sm {
  width: 44px;
  height: 44px;
  border-radius: var(--radius-full);
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: var(--font-family-en);
  font-size: 0.875rem;
  font-weight: 700;
  font-variant-numeric: tabular-nums;
  color: var(--color-text-primary);
  border: 2px solid var(--color-surface-card);
}

.score-badge-sm--excellent { background: var(--color-score-excellent); }
.score-badge-sm--good      { background: var(--color-score-good); }
.score-badge-sm--poor       { background: var(--color-score-poor); }
```

---

## Large Badge (Product Detail Page)

Circular ring with animated fill. Displayed prominently on the product detail page.

### Dimensions

| Property            | Value                      |
|---------------------|----------------------------|
| Outer diameter      | 120px                      |
| Ring stroke width   | 8px                        |
| Inner diameter      | 104px (120 - 8*2)          |
| Score font size     | 36px                       |
| Label font size     | 12px                       |
| Score font weight   | 700                        |

### Structure

```
  ┌──────────────────┐
  │     ╭──────╮     │
  │   ╭─┤ Ring ├─╮   │
  │   │ ╰──────╯ │   │
  │   │    87     │   │  ← Score number, 36px bold
  │   │ Excellent │   │  ← Label, 12px
  │   ╰───────────╯   │
  └──────────────────┘
```

### SVG Implementation

```html
<div class="score-badge-lg" data-score="87">
  <svg viewBox="0 0 120 120" width="120" height="120">
    <!-- Background ring -->
    <circle
      cx="60" cy="60" r="52"
      fill="none"
      stroke="#2D2D4A"
      stroke-width="8"
    />
    <!-- Score ring (animated fill) -->
    <circle
      class="score-badge-lg__ring"
      cx="60" cy="60" r="52"
      fill="none"
      stroke="#22C55E"
      stroke-width="8"
      stroke-linecap="round"
      stroke-dasharray="326.73"
      stroke-dashoffset="42.47"
      transform="rotate(-90 60 60)"
    />
  </svg>
  <div class="score-badge-lg__text">
    <span class="score-badge-lg__number">87</span>
    <span class="score-badge-lg__label">Excellent</span>
  </div>
</div>
```

### CSS

```css
.score-badge-lg {
  position: relative;
  width: 120px;
  height: 120px;
}

.score-badge-lg svg {
  display: block;
}

.score-badge-lg__text {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 2px;
}

.score-badge-lg__number {
  font-family: var(--font-family-en);
  font-size: 2.25rem;           /* 36px */
  font-weight: 700;
  line-height: 1;
  letter-spacing: -0.02em;
  font-variant-numeric: tabular-nums;
}

.score-badge-lg__label {
  font-size: 0.75rem;
  font-weight: 500;
  letter-spacing: 0.04em;
}

/* Color variants */
.score-badge-lg--excellent .score-badge-lg__number,
.score-badge-lg--excellent .score-badge-lg__label { color: var(--color-score-excellent); }

.score-badge-lg--good .score-badge-lg__number,
.score-badge-lg--good .score-badge-lg__label { color: var(--color-score-good); }

.score-badge-lg--poor .score-badge-lg__number,
.score-badge-lg--poor .score-badge-lg__label { color: var(--color-score-poor); }
```

### Animated Fill

```css
/*
  Circumference = 2 * PI * 52 = 326.73
  Offset formula: 326.73 * (1 - score/100)
  Example: score 87 → 326.73 * 0.13 = 42.47
*/

.score-badge-lg__ring {
  stroke-dasharray: 326.73;
  stroke-dashoffset: 326.73;    /* Start fully hidden */
  animation: score-fill 800ms cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
  animation-delay: 200ms;       /* Wait for page to settle */
}

@keyframes score-fill {
  to {
    stroke-dashoffset: var(--score-offset);
  }
}

/* Set via JS or inline style:
   style="--score-offset: 42.47"

   Or compute: element.style.setProperty('--score-offset', 326.73 * (1 - score/100));
*/

@media (prefers-reduced-motion: reduce) {
  .score-badge-lg__ring {
    animation: none;
    stroke-dashoffset: var(--score-offset);
  }
}
```

---

## Radar Chart (Product Detail Page)

5-axis radar chart showing category breakdown.

### Axes

| Axis        | Description                           |
|-------------|---------------------------------------|
| Quality     | Build quality, materials, durability  |
| Value       | Price-to-performance ratio            |
| Popularity  | User reviews, market presence         |
| Ease        | Ease of use, setup, maintenance       |
| Innovation  | Unique features, design innovation    |

### Dimensions

| Property         | Value                    |
|------------------|--------------------------|
| Chart width      | 280px                    |
| Chart height     | 280px                    |
| Viewbox          | 0 0 280 280              |
| Center point     | 140, 140                 |
| Max radius       | 110px                    |
| Grid rings       | 5 (at 20%, 40%, 60%, 80%, 100%) |
| Grid ring color  | #2D2D4A                  |
| Data fill        | primary at 20% opacity   |
| Data stroke      | primary at 100%          |
| Data stroke width| 2px                      |
| Dot size         | 6px diameter             |
| Label font       | 12px, 500 weight         |
| Label color      | text-secondary (#9CA3AF) |

### SVG Structure

```html
<svg viewBox="0 0 280 280" width="280" height="280" class="radar-chart">
  <!-- Grid rings (5 concentric pentagons) -->
  <polygon class="radar-chart__grid" points="..." />  <!-- 20% -->
  <polygon class="radar-chart__grid" points="..." />  <!-- 40% -->
  <polygon class="radar-chart__grid" points="..." />  <!-- 60% -->
  <polygon class="radar-chart__grid" points="..." />  <!-- 80% -->
  <polygon class="radar-chart__grid" points="..." />  <!-- 100% -->

  <!-- Axis lines from center to vertices -->
  <line class="radar-chart__axis" x1="140" y1="140" x2="140" y2="30" />
  <!-- ... 4 more axes at 72-degree intervals -->

  <!-- Data polygon -->
  <polygon class="radar-chart__data" points="..." />

  <!-- Data points (dots at vertices) -->
  <circle class="radar-chart__dot" cx="..." cy="..." r="3" />
  <!-- ... 4 more dots -->

  <!-- Axis labels (text elements) -->
  <text class="radar-chart__label" x="140" y="18">Quality</text>
  <!-- ... 4 more labels positioned around chart -->
</svg>
```

### CSS

```css
.radar-chart__grid {
  fill: none;
  stroke: var(--color-border-subtle);
  stroke-width: 1;
}

.radar-chart__axis {
  stroke: var(--color-border-subtle);
  stroke-width: 1;
  stroke-dasharray: 4 4;
}

.radar-chart__data {
  fill: rgba(79, 125, 247, 0.15);
  stroke: var(--color-primary);
  stroke-width: 2;
  stroke-linejoin: round;
  transition: d var(--transition-slow);
}

.radar-chart__dot {
  fill: var(--color-primary);
  r: 3;
}

.radar-chart__label {
  font-family: var(--font-family-en);
  font-size: 12px;
  font-weight: 500;
  fill: var(--color-text-secondary);
  text-anchor: middle;
}

/* Animate data polygon on appear */
.radar-chart__data {
  opacity: 0;
  animation: fade-in 400ms ease-out 400ms forwards;
}

@media (prefers-reduced-motion: reduce) {
  .radar-chart__data {
    animation: none;
    opacity: 1;
  }
}
```

### Axis Point Calculation (JS reference)

```js
// Pentagon vertices at 72-degree intervals, starting from top (270 degrees)
function getPoint(center, radius, index, total = 5) {
  const angle = (Math.PI * 2 * index) / total - Math.PI / 2;
  return {
    x: center + radius * Math.cos(angle),
    y: center + radius * Math.sin(angle),
  };
}

// For score [85, 72, 90, 68, 78] (Quality, Value, Popularity, Ease, Innovation):
// Each score maps to: maxRadius * (score / 100)
```

---

## Accessibility

- Large badge: `role="img"` with `aria-label="Score 87 out of 100, Excellent"`
- Small badge: `aria-label="Score 87"`
- Radar chart: `role="img"` with `aria-label` listing all axis values: "Quality 85, Value 72, Popularity 90, Ease 68, Innovation 78"
- Score ring animation respects `prefers-reduced-motion`
