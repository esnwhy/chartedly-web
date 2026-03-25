# Component Spec: Search

Search input with autocomplete dropdown. Supports product results, category suggestions, and keyboard navigation.

---

## Structure

### Search Input (Expanded)

```
┌──────────────────────────────────────────────────────┐
│  🔍  Search products, categories...           [ESC]  │
└──────────────────────────────────────────────────────┘
```

### Autocomplete Dropdown

```
┌──────────────────────────────────────────────────────┐
│  🔍  rice cooker                              [ESC]  │
├──────────────────────────────────────────────────────┤
│  PRODUCTS                                            │
│  ┌────┐                                              │
│  │img │  Zojirushi NW-JEC10  ·  Score 87  · ¥12,800│  ← Highlighted
│  └────┘                                              │
│  ┌────┐                                              │
│  │img │  Tiger JPC-G100  ·  Score 82  · ¥9,500     │
│  └────┘                                              │
│  ┌────┐                                              │
│  │img │  Panasonic SR-VSX101  ·  Score 79  · ¥18,200│
│  └────┘                                              │
├──────────────────────────────────────────────────────┤
│  CATEGORIES                                          │
│  Rice Cookers (47 products)                          │
│  Kitchen Appliances (234 products)                   │
├──────────────────────────────────────────────────────┤
│  Search for "rice cooker" →                          │
└──────────────────────────────────────────────────────┘
```

---

## Dimensions

| Property              | Desktop              | Mobile               |
|-----------------------|----------------------|----------------------|
| Input width           | 560px                | 100% - 32px          |
| Input height          | 48px                 | 48px                 |
| Dropdown max-height   | 480px                | 60vh                 |
| Dropdown width        | Same as input        | 100% - 32px          |
| Product thumbnail     | 48px x 48px          | 40px x 40px          |
| Max product results   | 5                    | 4                    |
| Max category results  | 3                    | 2                    |

---

## Search Overlay (Fullscreen on mobile, centered modal on desktop)

```css
.search-overlay {
  position: fixed;
  inset: 0;
  z-index: var(--z-overlay);
  background: rgba(10, 10, 15, 0.7);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding-top: 120px;
  opacity: 0;
  pointer-events: none;
  transition: opacity var(--transition-base);
}

.search-overlay--open {
  opacity: 1;
  pointer-events: auto;
}

@media (max-width: 639px) {
  .search-overlay {
    padding-top: 0;
    background: var(--color-bg-base);
  }
}
```

---

## Search Input

```css
.search-input {
  position: relative;
  width: 560px;
  max-width: calc(100vw - 32px);
}

.search-input__field {
  width: 100%;
  height: 48px;
  padding: 0 48px 0 48px;        /* Icon left, shortcut right */
  background: var(--color-surface-elevated);
  border: 1px solid var(--color-border-default);
  border-radius: var(--radius-lg);  /* 12px */
  color: var(--color-text-primary);
  font-family: var(--font-family-en);
  font-size: 1rem;
  font-weight: 400;
  outline: none;
  transition: border-color var(--transition-fast),
              box-shadow var(--transition-fast);
}

.search-input__field::placeholder {
  color: var(--color-text-tertiary);
}

.search-input__field:focus {
  border-color: var(--color-primary);
  box-shadow: var(--shadow-focus-ring);
}

/* Search icon (left) */
.search-input__icon {
  position: absolute;
  left: 16px;
  top: 50%;
  transform: translateY(-50%);
  width: 18px;
  height: 18px;
  color: var(--color-text-tertiary);
  pointer-events: none;
}

/* ESC badge or clear button (right) */
.search-input__shortcut {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 0.625rem;
  font-weight: 600;
  color: var(--color-text-tertiary);
  background: var(--color-surface-card);
  border: 1px solid var(--color-border-subtle);
  border-radius: var(--radius-sm);
  padding: 2px 6px;
  letter-spacing: 0.04em;
}

/* Clear button (when text present) */
.search-input__clear {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  width: 24px;
  height: 24px;
  border-radius: var(--radius-full);
  background: var(--color-surface-card);
  border: none;
  color: var(--color-text-tertiary);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all var(--transition-fast);
}

.search-input__clear:hover {
  background: var(--color-border-default);
  color: var(--color-text-primary);
}
```

---

## Autocomplete Dropdown

```css
.search-dropdown {
  position: absolute;
  top: calc(100% + 8px);
  left: 0;
  right: 0;
  max-height: 480px;
  overflow-y: auto;
  background: var(--color-surface-elevated);
  border: 1px solid var(--color-border-subtle);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-overlay);
  z-index: var(--z-dropdown);

  /* Appear animation */
  opacity: 0;
  transform: translateY(-4px);
  transition: opacity var(--transition-fast),
              transform var(--transition-fast);
}

.search-dropdown--visible {
  opacity: 1;
  transform: translateY(0);
}

@media (max-width: 639px) {
  .search-dropdown {
    position: fixed;
    top: 64px;                     /* Below mobile search bar */
    left: 16px;
    right: 16px;
    max-height: 60vh;
    border-radius: var(--radius-md);
  }
}
```

### Section Headers

```css
.search-dropdown__section-title {
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--color-text-tertiary);
  padding: 12px 16px 8px;
}
```

### Product Result Item

```css
.search-result {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  padding: 8px 16px;
  cursor: pointer;
  transition: background var(--transition-fast);
  text-decoration: none;
}

.search-result:hover,
.search-result--highlighted {
  background: var(--color-surface-hover);
}

.search-result__image {
  width: 48px;
  height: 48px;
  border-radius: var(--radius-sm);
  object-fit: cover;
  background: var(--color-bg-deep);
  flex-shrink: 0;
}

.search-result__info {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.search-result__name {
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--color-text-primary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* Highlight matching text */
.search-result__name mark {
  background: transparent;
  color: var(--color-primary);
  font-weight: 600;
}

.search-result__meta {
  font-size: 0.75rem;
  color: var(--color-text-tertiary);
  display: flex;
  align-items: center;
  gap: 8px;
}

.search-result__score {
  font-weight: 600;
  font-variant-numeric: tabular-nums;
}

.search-result__score--excellent { color: var(--color-score-excellent); }
.search-result__score--good      { color: var(--color-score-good); }
.search-result__score--poor      { color: var(--color-score-poor); }
```

### Category Suggestion

```css
.search-category {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 16px;
  cursor: pointer;
  transition: background var(--transition-fast);
}

.search-category:hover,
.search-category--highlighted {
  background: var(--color-surface-hover);
}

.search-category__name {
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--color-text-primary);
}

.search-category__count {
  font-size: 0.75rem;
  color: var(--color-text-tertiary);
}
```

### Full Search Link (Bottom)

```css
.search-dropdown__full-search {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  padding: 12px 16px;
  border-top: 1px solid var(--color-border-subtle);
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--color-primary);
  cursor: pointer;
  transition: background var(--transition-fast);
}

.search-dropdown__full-search:hover {
  background: var(--color-surface-hover);
}

.search-dropdown__full-search svg {
  width: 14px;
  height: 14px;
}
```

---

## Keyboard Navigation

```
/           → Open search (global shortcut)
ESC         → Close search / clear input
↑ / ↓       → Navigate results
Enter       → Go to highlighted result
Tab         → Move to full search link
```

```css
/* Active keyboard-highlighted item */
.search-result--highlighted,
.search-category--highlighted {
  background: var(--color-surface-hover);
  outline: 2px solid var(--color-primary);
  outline-offset: -2px;
}
```

---

## Loading State

```css
.search-dropdown__loading {
  padding: 24px 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.search-dropdown__loading-item {
  display: flex;
  align-items: center;
  gap: 12px;
}

.search-dropdown__loading-thumb {
  width: 48px;
  height: 48px;
  border-radius: var(--radius-sm);
  background: linear-gradient(90deg, var(--color-surface-card) 0%, var(--color-surface-elevated) 50%, var(--color-surface-card) 100%);
  background-size: 200% 100%;
  animation: shimmer 1.5s ease-in-out infinite;
}

.search-dropdown__loading-text {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.search-dropdown__loading-line {
  height: 12px;
  border-radius: 6px;
  background: linear-gradient(90deg, var(--color-surface-card) 0%, var(--color-surface-elevated) 50%, var(--color-surface-card) 100%);
  background-size: 200% 100%;
  animation: shimmer 1.5s ease-in-out infinite;
}

.search-dropdown__loading-line:first-child { width: 70%; }
.search-dropdown__loading-line:last-child  { width: 45%; }
```

---

## Empty State

```css
.search-dropdown__empty {
  padding: 32px 16px;
  text-align: center;
}

.search-dropdown__empty-text {
  font-size: 0.875rem;
  color: var(--color-text-tertiary);
  margin-bottom: 4px;
}

.search-dropdown__empty-hint {
  font-size: 0.75rem;
  color: var(--color-text-disabled);
}
```

---

## Accessibility

- Input: `role="combobox"`, `aria-expanded`, `aria-controls`, `aria-autocomplete="list"`
- Dropdown: `role="listbox"`, `id` matching `aria-controls`
- Each result: `role="option"`, `aria-selected` on highlighted item
- Section titles: `role="presentation"` (decorative grouping)
- Live region: `aria-live="polite"` for result count announcement ("5 products found")
- Keyboard shortcut `/` respects focus — only triggers when no input is focused
