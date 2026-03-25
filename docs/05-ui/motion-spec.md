# Chartedly Motion Spec

Every animation with duration, easing, trigger, and reduced-motion fallback.

---

## Easing Functions

| Token       | Value                                      | Use Case            |
|-------------|--------------------------------------------|---------------------|
| `ease-out`  | `cubic-bezier(0.0, 0.0, 0.2, 1.0)`       | Entrances           |
| `ease-in`   | `cubic-bezier(0.4, 0.0, 1.0, 1.0)`       | Exits               |
| `ease`      | `cubic-bezier(0.4, 0.0, 0.2, 1.0)`       | Standard             |
| `carousel`  | `cubic-bezier(0.25, 0.46, 0.45, 0.94)`   | Carousel / smooth    |
| `spring`    | `cubic-bezier(0.34, 1.56, 0.64, 1.0)`    | Bouncy emphasis      |

---

## Duration Scale

| Token   | Duration | Use Case                              |
|---------|----------|---------------------------------------|
| `fast`  | 150ms    | Hover color changes, opacity toggles  |
| `base`  | 200ms    | Page transitions, fade-in             |
| `slow`  | 300ms    | Card hover lift, transforms           |
| `hero`  | 400ms    | Carousel slide transitions            |
| `score` | 800ms    | Score ring fill animation             |
| `shimmer`| 1500ms  | Skeleton loading shimmer              |

---

## Animation Catalog

### 1. Card Hover Lift

| Property   | Value                                  |
|------------|----------------------------------------|
| Trigger    | Mouse enter on `.product-card`         |
| Duration   | 300ms                                  |
| Easing     | ease                                   |
| Properties | transform, box-shadow, border-color    |
| From       | translateY(0), shadow-card, border-subtle |
| To         | translateY(-4px), shadow-card-hover, primary/30% border |
| Reduced    | No transform, only color change        |

```css
.product-card {
  transition: transform 300ms ease,
              box-shadow 300ms ease,
              border-color 300ms ease;
}

.product-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-card-hover);
  border-color: rgba(79, 125, 247, 0.3);
}

@media (prefers-reduced-motion: reduce) {
  .product-card {
    transition: box-shadow 150ms ease,
                border-color 150ms ease;
  }
  .product-card:hover {
    transform: none;
  }
}
```

### 2. Card Image Zoom

| Property   | Value                              |
|------------|------------------------------------|
| Trigger    | Mouse enter on `.product-card`     |
| Duration   | 300ms                              |
| Easing     | ease                               |
| Properties | transform (image scale)            |
| From       | scale(1)                           |
| To         | scale(1.05)                        |
| Reduced    | No scale                           |

```css
.product-card__image {
  transition: transform 300ms ease;
}

.product-card:hover .product-card__image {
  transform: scale(1.05);
}

@media (prefers-reduced-motion: reduce) {
  .product-card__image { transition: none; }
  .product-card:hover .product-card__image { transform: none; }
}
```

### 3. Hero Crossfade

| Property   | Value                                |
|------------|--------------------------------------|
| Trigger    | Auto-rotate timer (6s) or dot click  |
| Duration   | 400ms                                |
| Easing     | carousel                             |
| Properties | opacity                              |
| From       | opacity 0                            |
| To         | opacity 1                            |
| Reduced    | Instant switch (no transition)       |

```css
.hero__slide {
  transition: opacity 400ms cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

@media (prefers-reduced-motion: reduce) {
  .hero__slide { transition: none; }
}
```

### 4. Hero Parallax

| Property   | Value                              |
|------------|------------------------------------|
| Trigger    | Scroll event                       |
| Duration   | Per-frame (60fps)                  |
| Properties | transform translateY               |
| Factor     | scrollY * 0.15                     |
| Reduced    | Disabled entirely                  |

```css
@media (prefers-reduced-motion: reduce) {
  .hero__image {
    transform: none !important;
  }
}
```

### 5. Score Ring Fill

| Property   | Value                              |
|------------|------------------------------------|
| Trigger    | Element enters viewport            |
| Duration   | 800ms                              |
| Delay      | 200ms                              |
| Easing     | carousel                           |
| Properties | stroke-dashoffset                  |
| From       | 326.73 (fully hidden)              |
| To         | Computed based on score            |
| Reduced    | No animation, show final state     |

```css
.score-badge-lg__ring {
  stroke-dashoffset: 326.73;
  animation: score-fill 800ms cubic-bezier(0.25, 0.46, 0.45, 0.94) 200ms forwards;
}

@keyframes score-fill {
  to { stroke-dashoffset: var(--score-offset); }
}

@media (prefers-reduced-motion: reduce) {
  .score-badge-lg__ring {
    animation: none;
    stroke-dashoffset: var(--score-offset);
  }
}
```

### 6. Skeleton Shimmer

| Property   | Value                              |
|------------|------------------------------------|
| Trigger    | Loading state active               |
| Duration   | 1500ms                             |
| Easing     | ease-in-out                        |
| Iteration  | Infinite                           |
| Properties | background-position                |
| Reduced    | Static gray background, no shimmer |

```css
.skeleton {
  background: linear-gradient(
    90deg,
    #16162A 0%,
    #1E1E38 50%,
    #16162A 100%
  );
  background-size: 200% 100%;
  animation: shimmer 1.5s ease-in-out infinite;
}

@keyframes shimmer {
  0%   { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}

@media (prefers-reduced-motion: reduce) {
  .skeleton {
    animation: none;
    background: #1E1E38;
  }
}
```

### 7. Fade In (Page Elements)

| Property   | Value                              |
|------------|------------------------------------|
| Trigger    | Element mounts / enters viewport   |
| Duration   | 200ms                              |
| Easing     | ease-out                           |
| Properties | opacity                            |
| Reduced    | Instant (no transition)            |

```css
.fade-in {
  animation: fade-in 200ms ease-out forwards;
}

@keyframes fade-in {
  from { opacity: 0; }
  to   { opacity: 1; }
}

@media (prefers-reduced-motion: reduce) {
  .fade-in { animation: none; opacity: 1; }
}
```

### 8. Slide Up (Staggered Content)

| Property   | Value                              |
|------------|------------------------------------|
| Trigger    | Element enters viewport            |
| Duration   | 300ms                              |
| Easing     | ease-out                           |
| Stagger    | 50ms between siblings              |
| Properties | opacity, transform                 |
| Reduced    | Fade only, no transform            |

```css
.slide-up {
  animation: slide-up 300ms ease-out forwards;
}

@keyframes slide-up {
  from {
    opacity: 0;
    transform: translateY(8px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Stagger via inline style or nth-child */
.slide-up:nth-child(1) { animation-delay: 0ms; }
.slide-up:nth-child(2) { animation-delay: 50ms; }
.slide-up:nth-child(3) { animation-delay: 100ms; }
.slide-up:nth-child(4) { animation-delay: 150ms; }
.slide-up:nth-child(5) { animation-delay: 200ms; }

@media (prefers-reduced-motion: reduce) {
  .slide-up {
    animation: fade-in 150ms ease-out forwards;
  }
}
```

### 9. Dropdown / Menu Appear

| Property   | Value                              |
|------------|------------------------------------|
| Trigger    | Menu opens                         |
| Duration   | 200ms                              |
| Easing     | ease-out                           |
| Properties | opacity, transform                 |
| From       | opacity 0, translateY(-8px)        |
| To         | opacity 1, translateY(0)           |
| Reduced    | Instant                            |

```css
.dropdown-enter {
  opacity: 0;
  transform: translateY(-8px);
  transition: opacity 200ms ease-out, transform 200ms ease-out;
}

.dropdown-enter--active {
  opacity: 1;
  transform: translateY(0);
}

@media (prefers-reduced-motion: reduce) {
  .dropdown-enter { transition: none; }
}
```

### 10. Button Press

| Property   | Value                              |
|------------|------------------------------------|
| Trigger    | Click / active state               |
| Duration   | 100ms                              |
| Easing     | ease                               |
| Properties | transform scale                    |
| From       | scale(1)                           |
| To         | scale(0.97)                        |
| Reduced    | No scale                           |

```css
button, .btn {
  transition: transform 100ms ease, background 150ms ease;
}

button:active, .btn:active {
  transform: scale(0.97);
}

@media (prefers-reduced-motion: reduce) {
  button:active, .btn:active { transform: none; }
}
```

### 11. Carousel Arrow Appear

| Property   | Value                              |
|------------|------------------------------------|
| Trigger    | Section hover (desktop)            |
| Duration   | 200ms                              |
| Easing     | ease                               |
| Properties | opacity                            |
| Reduced    | Always visible (no transition)     |

### 12. Radar Chart Data Reveal

| Property   | Value                              |
|------------|------------------------------------|
| Trigger    | Element enters viewport            |
| Duration   | 400ms                              |
| Delay      | 400ms (after score ring fill)      |
| Easing     | ease-out                           |
| Properties | opacity                            |
| Reduced    | Instant                            |

---

## Global Reduced Motion Override

```css
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

---

## Performance Guidelines

1. Only animate `transform` and `opacity` — these are GPU-composited and avoid layout/paint.
2. Use `will-change: transform` only on elements that are actively animating (not as a permanent style).
3. Parallax uses `requestAnimationFrame` with throttling, not raw scroll listener.
4. Intersection Observer triggers viewport-based animations (score fill, slide-up) — no scroll listeners needed.
5. Carousel uses CSS `scroll-snap` for native momentum, JS only for arrow buttons.
