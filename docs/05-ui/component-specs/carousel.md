# Component Spec: Carousel (Product Row)

Horizontal scrolling product row. The Netflix-style content browsing pattern.

---

## Structure

```
┌──────────────────────────────────────────────────────────────┐
│  Best Rice Cookers                              See All →    │  ← Section header
├──────────────────────────────────────────────────────────────┤
│  ◀  ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐ ┌───  ▶  │
│     │ Card │ │ Card │ │ Card │ │ Card │ │ Card │ │ Ca      │  ← Peek next card
│     │      │ │      │ │      │ │      │ │      │ │         │
│     └──────┘ └──────┘ └──────┘ └──────┘ └──────┘ └───      │
└──────────────────────────────────────────────────────────────┘
```

---

## Dimensions

| Property              | Value                           |
|-----------------------|---------------------------------|
| Section gap (vertical)| 48px between rows               |
| Header margin-bottom  | 16px                            |
| Card width            | 280px (fixed in carousel)       |
| Card gap              | 16px                            |
| Peek amount           | 40px of next card visible       |
| Arrow button size     | 40px diameter                   |
| Scroll amount per click| 3 cards (280 + 16) * 3 = 888px |
| Container padding     | 24px left/right (matches page)  |

---

## Section Header

```css
.carousel-section__header {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  margin-bottom: var(--space-4);    /* 16px */
  padding: 0 var(--space-6);       /* 24px */
  max-width: 1440px;
  margin-left: auto;
  margin-right: auto;
}

.carousel-section__title {
  font-family: var(--font-family-en);
  font-size: 1.5rem;               /* 24px */
  font-weight: 600;
  line-height: 1.2;
  letter-spacing: -0.01em;
  color: var(--color-text-primary);
}

.carousel-section__see-all {
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--color-primary);
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  gap: 4px;
  transition: color var(--transition-fast);
}

.carousel-section__see-all:hover {
  color: var(--color-primary-400);
}

.carousel-section__see-all svg {
  width: 14px;
  height: 14px;
  transition: transform var(--transition-fast);
}

.carousel-section__see-all:hover svg {
  transform: translateX(3px);
}
```

---

## Scroll Container

```css
.carousel__track {
  display: flex;
  gap: var(--space-4);             /* 16px */
  overflow-x: auto;
  overflow-y: hidden;
  scroll-snap-type: x mandatory;
  scroll-behavior: smooth;
  -webkit-overflow-scrolling: touch;
  scrollbar-width: none;           /* Firefox */
  padding: 0 var(--space-6);      /* 24px — matches page padding */
  padding-bottom: var(--space-2); /* 8px — prevents shadow clipping */

  /* Momentum scrolling */
  overscroll-behavior-x: contain;
}

.carousel__track::-webkit-scrollbar {
  display: none;                   /* Chrome/Safari */
}

.carousel__track > * {
  scroll-snap-align: start;
  flex-shrink: 0;
}
```

---

## Arrow Buttons

```css
.carousel__arrow {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  z-index: var(--z-card-hover);

  width: 40px;
  height: 40px;
  border-radius: var(--radius-full);
  background: rgba(22, 22, 42, 0.85);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  border: 1px solid var(--color-border-subtle);
  color: var(--color-text-primary);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background var(--transition-base),
              opacity var(--transition-base),
              transform var(--transition-base);
  opacity: 0;                     /* Hidden until section hover */
}

.carousel__arrow svg {
  width: 20px;
  height: 20px;
}

.carousel__arrow--left {
  left: 8px;
}

.carousel__arrow--right {
  right: 8px;
}

/* Show on section hover (desktop) */
.carousel-section:hover .carousel__arrow {
  opacity: 1;
}

.carousel__arrow:hover {
  background: rgba(30, 30, 56, 0.95);
  border-color: var(--color-border-default);
  transform: translateY(-50%) scale(1.05);
}

.carousel__arrow:active {
  transform: translateY(-50%) scale(0.95);
}

/* Hide arrow when at scroll boundary */
.carousel__arrow--hidden {
  opacity: 0 !important;
  pointer-events: none;
}

/* Hide arrows on mobile (touch scroll only) */
@media (max-width: 1023px) {
  .carousel__arrow {
    display: none;
  }
}
```

---

## Edge Fade Indicators

```css
/* Subtle gradient at edges to indicate more content */
.carousel__wrapper {
  position: relative;
}

.carousel__wrapper::before,
.carousel__wrapper::after {
  content: '';
  position: absolute;
  top: 0;
  bottom: 0;
  width: 48px;
  z-index: var(--z-card);
  pointer-events: none;
}

.carousel__wrapper::before {
  left: 0;
  background: linear-gradient(to right, var(--color-bg-base), transparent);
  opacity: 0;                    /* Hidden when scrolled to start */
}

.carousel__wrapper::after {
  right: 0;
  background: linear-gradient(to left, var(--color-bg-base), transparent);
}

.carousel__wrapper--at-start::before { opacity: 0; }
.carousel__wrapper--at-end::after { opacity: 0; }
.carousel__wrapper--scrolled::before { opacity: 1; }
```

---

## Keyboard Navigation

```
Tab         → Focus enters first card in row
Arrow Right → Focus next card (scroll into view)
Arrow Left  → Focus previous card
Home        → Focus first card
End         → Focus last card
Enter/Space → Activate focused card (navigate to product)
```

```js
// Implementation guidance
carousel.addEventListener('keydown', (e) => {
  const cards = [...carousel.querySelectorAll('.product-card')];
  const current = cards.indexOf(document.activeElement);

  switch (e.key) {
    case 'ArrowRight':
      e.preventDefault();
      cards[Math.min(current + 1, cards.length - 1)]?.focus();
      break;
    case 'ArrowLeft':
      e.preventDefault();
      cards[Math.max(current - 1, 0)]?.focus();
      break;
    case 'Home':
      e.preventDefault();
      cards[0]?.focus();
      break;
    case 'End':
      e.preventDefault();
      cards[cards.length - 1]?.focus();
      break;
  }
});
```

---

## Responsive Behavior

```css
/* Mobile: tighter padding, 2 cards visible with peek */
@media (max-width: 639px) {
  .carousel__track {
    padding: 0 var(--space-4);     /* 16px */
    gap: var(--space-3);           /* 12px */
  }

  .carousel-section__header {
    padding: 0 var(--space-4);
  }

  .carousel__track > * {
    min-width: calc(75vw);         /* ~75% viewport width */
    max-width: calc(75vw);
  }
}

/* Tablet: 3 cards visible */
@media (min-width: 640px) and (max-width: 1023px) {
  .carousel__track > * {
    min-width: 260px;
    max-width: 260px;
  }
}

/* Desktop: 4-5 cards visible with peek */
@media (min-width: 1024px) {
  .carousel__track > * {
    min-width: 280px;
    max-width: 280px;
  }
}
```

---

## Spacing Between Rows

```css
.carousel-section {
  padding-top: var(--space-12);    /* 48px */
}

.carousel-section:first-child {
  padding-top: var(--space-8);     /* 32px — closer to hero */
}
```

---

## Accessibility

- Container: `role="region"` with `aria-label="Best Rice Cookers"`
- Track: `role="list"`, each card: `role="listitem"`
- Arrow buttons: `aria-label="Scroll left"` / `"Scroll right"`
- Arrow buttons are `aria-hidden` on mobile (since they are display:none)
- Focus management: focused card scrolls into view via `scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'start' })`
