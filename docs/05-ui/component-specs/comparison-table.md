# Component Spec: Comparison Table

Side-by-side product comparison. Supports 2-4 products simultaneously.

---

## Structure

```
┌─────────────┬───────────┬───────────┬───────────┐
│             │ Product A │ Product B │ Product C │  ← Sticky header row
│             │ [Image]   │ [Image]   │ [Image]   │
│             │ Name      │ Name      │ Name      │
│             │ Score: 87 │ Score: 72 │ Score: 91 │
│             │ [View]    │ [View]    │ [View]    │
├─────────────┼───────────┼───────────┼───────────┤
│ PRICE       │ ¥12,800   │ ¥9,500    │ ¥18,200   │
├─────────────┼───────────┼───────────┼───────────┤
│ QUALITY     │ 85 ██████ │ 70 █████  │ 92 ██████ │  ← Winner highlighted
├─────────────┼───────────┼───────────┼───────────┤
│ VALUE       │ 78 █████  │ 88 ██████ │ 65 ████   │
├─────────────┼───────────┼───────────┼───────────┤
│ EASE OF USE │ ✓ Yes     │ ✓ Yes     │ ─ Limited │
├─────────────┼───────────┼───────────┼───────────┤
│ WARRANTY    │ 2 years   │ 1 year    │ 3 years   │
└─────────────┴───────────┴───────────┴───────────┘
```

---

## Dimensions

| Property              | Value                          |
|-----------------------|--------------------------------|
| Max products          | 4                              |
| Label column width    | 180px (desktop), frozen mobile |
| Product column min    | 200px                          |
| Header image height   | 120px                          |
| Row height            | Auto, min 48px                 |
| Cell padding          | 16px                           |
| Background            | surface-card (#16162A)         |
| Border                | 1px solid border-subtle        |
| Border radius         | 12px (outer container)         |

---

## CSS — Container

```css
.comparison-table {
  border-radius: var(--radius-lg);
  border: 1px solid var(--color-border-subtle);
  background: var(--color-surface-card);
  overflow: hidden;
  width: 100%;
}

.comparison-table__wrapper {
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
  scrollbar-width: thin;
  scrollbar-color: var(--color-border-default) transparent;
}

.comparison-table table {
  width: 100%;
  border-collapse: collapse;
  table-layout: fixed;
  min-width: 600px;
}
```

---

## Sticky Header Row

```css
.comparison-table thead {
  position: sticky;
  top: 64px;                       /* Below nav height */
  z-index: var(--z-sticky);
  background: var(--color-surface-elevated);
}

@media (max-width: 767px) {
  .comparison-table thead {
    top: 56px;                     /* Mobile nav height */
  }
}

.comparison-table th {
  padding: var(--space-4);
  text-align: center;
  vertical-align: bottom;
  border-bottom: 1px solid var(--color-border-subtle);
}

.comparison-table th:first-child {
  text-align: left;
  width: 180px;
}

/* Product header cell */
.comparison-table__product-header {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-2);
}

.comparison-table__product-image {
  width: 80px;
  height: 80px;
  object-fit: contain;
  border-radius: var(--radius-md);
  background: var(--color-bg-deep);
}

.comparison-table__product-name {
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--color-text-primary);
  text-align: center;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.comparison-table__product-score {
  font-size: 1.25rem;
  font-weight: 700;
  font-variant-numeric: tabular-nums;
}

.comparison-table__product-link {
  font-size: 0.75rem;
  font-weight: 500;
  color: var(--color-primary);
  text-decoration: none;
  padding: 4px 12px;
  border-radius: var(--radius-full);
  border: 1px solid var(--color-primary);
  transition: all var(--transition-fast);
}

.comparison-table__product-link:hover {
  background: var(--color-primary);
  color: var(--color-text-primary);
}

/* Remove product button */
.comparison-table__remove {
  position: absolute;
  top: 8px;
  right: 8px;
  width: 24px;
  height: 24px;
  border-radius: var(--radius-full);
  background: rgba(10, 10, 15, 0.6);
  border: none;
  color: var(--color-text-tertiary);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all var(--transition-fast);
}

.comparison-table__remove:hover {
  background: var(--color-error);
  color: var(--color-text-primary);
}
```

---

## Body Rows

```css
.comparison-table td {
  padding: var(--space-4);
  border-bottom: 1px solid var(--color-border-subtle);
  font-size: 0.875rem;
  color: var(--color-text-secondary);
  text-align: center;
  vertical-align: middle;
}

.comparison-table td:first-child {
  text-align: left;
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--color-text-tertiary);
  white-space: nowrap;
}

/* Alternating row shading */
.comparison-table tbody tr:nth-child(even) td {
  background: rgba(30, 30, 56, 0.3);
}
```

---

## Winner Highlighting

```css
/* Winner cell — best value in the row */
.comparison-table__winner {
  color: var(--color-score-excellent);
  font-weight: 600;
  position: relative;
}

.comparison-table__winner::before {
  content: '';
  position: absolute;
  inset: 0;
  background: rgba(34, 197, 94, 0.06);
  pointer-events: none;
}

/* Overall winner column highlight */
.comparison-table__best-overall th,
.comparison-table__best-overall td {
  background: rgba(79, 125, 247, 0.04);
}

.comparison-table__best-overall th {
  border-top: 3px solid var(--color-primary);
}
```

---

## Score Bar (Inline in cells)

```css
.comparison-table__score-bar {
  display: flex;
  align-items: center;
  gap: 8px;
  justify-content: center;
}

.comparison-table__score-bar-value {
  font-size: 0.875rem;
  font-weight: 600;
  font-variant-numeric: tabular-nums;
  min-width: 28px;
}

.comparison-table__score-bar-track {
  width: 80px;
  height: 6px;
  background: var(--color-border-subtle);
  border-radius: 3px;
  overflow: hidden;
}

.comparison-table__score-bar-fill {
  height: 100%;
  border-radius: 3px;
  transition: width var(--transition-slow);
}

/* Width set via inline style: style="width: 85%" */
```

---

## Boolean Values

```css
/* Checkmark for supported */
.comparison-table__yes {
  color: var(--color-score-excellent);
  display: inline-flex;
  align-items: center;
  gap: 4px;
}

.comparison-table__yes::before {
  content: '';
  width: 16px;
  height: 16px;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 16 16' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M6.5 11.5L3 8l1-1 2.5 2.5L12 4l1 1-6.5 6.5z' fill='%2322C55E'/%3E%3C/svg%3E");
}

/* Dash for not supported */
.comparison-table__no {
  color: var(--color-text-tertiary);
}

.comparison-table__no::before {
  content: '—';
  margin-right: 4px;
}
```

---

## Mobile Responsive

```css
@media (max-width: 767px) {
  /* Frozen first column */
  .comparison-table td:first-child,
  .comparison-table th:first-child {
    position: sticky;
    left: 0;
    z-index: var(--z-card);
    background: var(--color-surface-card);
    min-width: 120px;
    max-width: 120px;
    border-right: 1px solid var(--color-border-subtle);
  }

  .comparison-table thead th:first-child {
    background: var(--color-surface-elevated);
  }

  .comparison-table tbody tr:nth-child(even) td:first-child {
    background: rgba(22, 22, 42, 0.98);
  }

  /* Narrow product columns */
  .comparison-table th:not(:first-child),
  .comparison-table td:not(:first-child) {
    min-width: 160px;
  }

  .comparison-table__product-image {
    width: 56px;
    height: 56px;
  }

  .comparison-table__product-name {
    font-size: 0.75rem;
  }

  .comparison-table__score-bar-track {
    width: 48px;
  }

  .comparison-table td {
    padding: var(--space-3);
    font-size: 0.75rem;
  }
}
```

---

## Empty State (Add Product Slot)

```css
.comparison-table__add-slot {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: var(--space-2);
  padding: var(--space-8);
  border: 2px dashed var(--color-border-subtle);
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: all var(--transition-fast);
  color: var(--color-text-tertiary);
}

.comparison-table__add-slot:hover {
  border-color: var(--color-primary);
  color: var(--color-primary);
  background: rgba(79, 125, 247, 0.04);
}

.comparison-table__add-slot svg {
  width: 32px;
  height: 32px;
}

.comparison-table__add-slot span {
  font-size: 0.875rem;
  font-weight: 500;
}
```

---

## Accessibility

- Table uses proper `<thead>`, `<tbody>`, `<th scope="col">`, `<th scope="row">`
- `aria-label="Product comparison"` on table
- Winner cells: `aria-label` includes "Best in category" annotation
- Remove button: `aria-label="Remove [Product Name] from comparison"`
- Scroll indicator on mobile: `aria-describedby` pointing to hint text "Scroll horizontally to see all products"
- Score bars: `role="meter"` with `aria-valuenow`, `aria-valuemin="0"`, `aria-valuemax="100"`
