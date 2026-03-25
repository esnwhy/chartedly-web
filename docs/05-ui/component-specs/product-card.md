# Component Spec: Product Card

The primary content unit across Chartedly. Appears in carousels, grids, and search results.

---

## Dimensions

| Property          | Value                          |
|-------------------|--------------------------------|
| Min width         | 280px (carousel)               |
| Max width         | 360px (grid)                   |
| Aspect ratio      | Auto height (content-driven)   |
| Image area        | 16:10 aspect ratio             |
| Image height      | ~175px at 280px width          |
| Total card height | ~340px (varies with content)   |

---

## Structure

```
┌─────────────────────────────┐
│  [Image 16:10]              │
│                   [Score]   │  ← Badge overlaps bottom-right of image
├─────────────────────────────┤
│  CATEGORY · OVERLINE        │  ← 12px overline, text-tertiary
│  Product Title Here         │  ← 16px semibold, 2-line clamp
│  Short description text     │  ← 14px regular, text-secondary, 2-line clamp
│                             │
│  ¥12,800  ★★★★☆ (234)      │  ← Price + rating row
└─────────────────────────────┘
```

---

## Spacing (Internal)

```css
.product-card {
  border-radius: var(--radius-md);         /* 8px */
  overflow: hidden;
  background: var(--color-surface-card);   /* #16162A */
  border: 1px solid var(--color-border-subtle); /* #2D2D4A */
  box-shadow: var(--shadow-card);
  transition: transform var(--transition-slow),
              box-shadow var(--transition-slow),
              border-color var(--transition-slow);
  cursor: pointer;
  position: relative;
}

.product-card__image-wrapper {
  position: relative;
  aspect-ratio: 16 / 10;
  overflow: hidden;
  background: var(--color-bg-deep);
}

.product-card__image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform var(--transition-slow);
}

.product-card__body {
  padding: 16px;               /* var(--space-4) */
  display: flex;
  flex-direction: column;
  gap: 8px;                    /* var(--space-2) */
}

.product-card__category {
  /* overline style */
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--color-text-tertiary);
}

.product-card__title {
  font-size: 1rem;
  font-weight: 600;
  line-height: 1.2;
  color: var(--color-text-primary);
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.product-card__description {
  font-size: 0.875rem;
  font-weight: 400;
  line-height: 1.5;
  color: var(--color-text-secondary);
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.product-card__footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 4px;             /* var(--space-1) */
}

.product-card__price {
  font-size: 1rem;
  font-weight: 600;
  color: var(--color-text-primary);
  font-variant-numeric: tabular-nums;
}

.product-card__rating {
  font-size: 0.875rem;
  color: var(--color-text-secondary);
}
```

---

## Score Badge Placement

```css
.product-card__score {
  position: absolute;
  bottom: -14px;               /* Overlaps card body area */
  right: 16px;
  width: 44px;
  height: 44px;
  border-radius: var(--radius-full);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.875rem;
  font-weight: 700;
  color: var(--color-text-primary);
  z-index: var(--z-card);
  border: 2px solid var(--color-surface-card);

  /* Dynamic background based on score */
  /* 80+ */ background: var(--color-score-excellent);
  /* 60-79 */ background: var(--color-score-good);
  /* <60 */ background: var(--color-score-poor);
}
```

---

## 6 States

### 1. Default

```css
.product-card {
  transform: translateY(0);
  box-shadow: var(--shadow-card);
  border-color: var(--color-border-subtle);
}
```

### 2. Hover

```css
.product-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-card-hover);
  border-color: rgba(79, 125, 247, 0.3);
}

.product-card:hover .product-card__image {
  transform: scale(1.05);
}
```

### 3. Pressed / Active

```css
.product-card:active {
  transform: translateY(-2px);
  box-shadow: var(--shadow-card);
  background: var(--color-surface-pressed);
}
```

### 4. Focus (Keyboard)

```css
.product-card:focus-visible {
  outline: none;
  box-shadow: var(--shadow-focus-ring);
  border-color: var(--color-border-focus);
}
```

### 5. Loading (Skeleton)

```css
.product-card--skeleton .product-card__image-wrapper,
.product-card--skeleton .product-card__title,
.product-card--skeleton .product-card__description,
.product-card--skeleton .product-card__footer {
  background: linear-gradient(
    90deg,
    var(--color-surface-card) 0%,
    var(--color-surface-elevated) 50%,
    var(--color-surface-card) 100%
  );
  background-size: 200% 100%;
  animation: shimmer 1.5s ease-in-out infinite;
  border-radius: var(--radius-sm);
  color: transparent;
}

.product-card--skeleton .product-card__image-wrapper {
  border-radius: 0;
}

.product-card--skeleton .product-card__title {
  height: 20px;
  width: 80%;
}

.product-card--skeleton .product-card__description {
  height: 16px;
  width: 60%;
}

@keyframes shimmer {
  0%   { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}
```

### 6. Compare (Selected for comparison)

```css
.product-card--compare {
  border-color: var(--color-primary);
  box-shadow: 0 0 0 2px rgba(79, 125, 247, 0.3);
}

.product-card--compare::after {
  content: '';
  position: absolute;
  top: 12px;
  left: 12px;
  width: 24px;
  height: 24px;
  border-radius: var(--radius-full);
  background: var(--color-primary);
  /* Checkmark via SVG background-image */
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z' fill='white'/%3E%3C/svg%3E");
  background-size: 16px;
  background-position: center;
  background-repeat: no-repeat;
  z-index: var(--z-card-hover);
}
```

---

## Error State

```css
.product-card--error .product-card__image-wrapper {
  background: var(--color-surface-card);
  display: flex;
  align-items: center;
  justify-content: center;
}

.product-card--error .product-card__image-wrapper::after {
  content: 'Image unavailable';
  font-size: 0.75rem;
  color: var(--color-text-tertiary);
}
```

---

## Responsive Behavior

```css
/* Carousel context: fixed width, horizontal scroll */
.carousel .product-card {
  min-width: 280px;
  max-width: 280px;
  flex-shrink: 0;
}

/* Grid context */
.product-grid .product-card {
  width: 100%;
}

/* Mobile: full-width cards */
@media (max-width: 639px) {
  .product-card {
    min-width: 100%;
    max-width: 100%;
  }

  .product-card__body {
    padding: 12px;
  }
}

/* Tablet: 2 columns */
@media (min-width: 640px) and (max-width: 1023px) {
  .product-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 16px;
  }
}

/* Desktop: 4 columns */
@media (min-width: 1024px) {
  .product-grid {
    grid-template-columns: repeat(4, 1fr);
    gap: 20px;
  }
}

/* Wide: 5 columns */
@media (min-width: 1280px) {
  .product-grid {
    grid-template-columns: repeat(5, 1fr);
    gap: 24px;
  }
}
```

---

## Accessibility

- Card is a single `<a>` link wrapping all content
- `aria-label` includes: product name, score, price (e.g., "Zojirushi Rice Cooker, Score 87, ¥12,800")
- Compare checkbox is a separate focusable element inside the card (stops propagation)
- Skeleton state: `aria-busy="true"`, `aria-label="Loading product"`
- Minimum touch target: 48x48px on mobile
