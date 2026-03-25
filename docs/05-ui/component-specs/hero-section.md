# Component Spec: Hero Section

Full-width cinematic hero carousel at the top of the homepage.

---

## Dimensions

| Property             | Value                                |
|----------------------|--------------------------------------|
| Width                | 100vw (full viewport)                |
| Height desktop       | 560px                                |
| Height tablet        | 440px                                |
| Height mobile        | 400px                                |
| Image aspect ratio   | No fixed ratio — image covers area   |
| Max content width    | 1440px (centered within full-width)  |

---

## Structure

```
┌──────────────────────────────────────────────────────────┐
│                                                          │
│  [Background Image — full bleed, object-fit: cover]      │
│                                                          │
│  ┌─────────────────────────────────┐                     │
│  │  OVERLINE · Featured Pick       │                     │
│  │                                 │                     │
│  │  Best Rice Cookers              │  ← display-xl       │
│  │  for 2026                       │                     │
│  │                                 │                     │
│  │  Short subtitle text here       │  ← body-lg          │
│  │                                 │                     │
│  │  [Explore Ranking →]            │  ← CTA button       │
│  └─────────────────────────────────┘                     │
│                                                          │
│                          ● ○ ○ ○ ○                       │  ← Progress dots
│                                                          │
└──────────────────────────────────────────────────────────┘
```

---

## CSS Implementation

### Container

```css
.hero {
  position: relative;
  width: 100%;
  height: 560px;
  overflow: hidden;
}

@media (max-width: 1023px) {
  .hero { height: 440px; }
}

@media (max-width: 639px) {
  .hero { height: 400px; }
}
```

### Background Image

```css
.hero__image {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center 30%;   /* Bias toward top-center for product images */
  z-index: 0;
}

/* Parallax — subtle on scroll (desktop only) */
@media (min-width: 1024px) and (prefers-reduced-motion: no-preference) {
  .hero__image {
    transform: translateY(var(--scroll-y, 0));
    will-change: transform;
  }
}

/* JS for parallax:
   window.addEventListener('scroll', () => {
     const scrolled = window.scrollY;
     document.querySelector('.hero__image')
       .style.setProperty('--scroll-y', `${scrolled * 0.15}px`);
   });
*/
```

### Gradient Overlay

```css
.hero__overlay {
  position: absolute;
  inset: 0;
  z-index: 1;
  background:
    /* Bottom fade — ensures text readability and smooth transition to content */
    linear-gradient(
      to top,
      #0A0A0F 0%,
      rgba(10, 10, 15, 0.85) 15%,
      rgba(10, 10, 15, 0.4) 50%,
      rgba(10, 10, 15, 0.2) 100%
    ),
    /* Left side text protection */
    linear-gradient(
      to right,
      rgba(10, 10, 15, 0.7) 0%,
      rgba(10, 10, 15, 0.3) 40%,
      transparent 70%
    );
}
```

### Text Content

```css
.hero__content {
  position: absolute;
  bottom: 80px;
  left: 0;
  right: 0;
  z-index: 2;
  max-width: 1440px;
  margin: 0 auto;
  padding: 0 var(--space-6);   /* 24px */
  display: flex;
  flex-direction: column;
  gap: var(--space-4);         /* 16px */
  max-width: 600px;            /* Constrain text block */
  margin-left: max(24px, calc((100vw - 1440px) / 2 + 24px));
}

@media (max-width: 639px) {
  .hero__content {
    bottom: 64px;
    padding: 0 var(--space-4);
    margin-left: 16px;
    max-width: calc(100vw - 32px);
  }
}
```

### Text Styles

```css
.hero__overline {
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--color-primary);
}

.hero__title {
  font-family: var(--font-family-en);
  font-size: 3.75rem;           /* 60px */
  font-weight: 700;
  line-height: 1.2;
  letter-spacing: -0.02em;
  color: var(--color-text-primary);
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.5);
}

.hero__subtitle {
  font-size: 1.125rem;          /* 18px */
  font-weight: 400;
  line-height: 1.5;
  color: var(--color-text-secondary);
  max-width: 480px;
}

@media (max-width: 639px) {
  .hero__title { font-size: 2.25rem; }     /* 36px */
  .hero__subtitle { font-size: 1rem; }
}
```

### CTA Button

```css
.hero__cta {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 14px 28px;
  background: var(--color-primary);
  color: var(--color-text-primary);
  font-size: 1rem;
  font-weight: 600;
  letter-spacing: 0.02em;
  border-radius: var(--radius-full);      /* Pill shape */
  border: none;
  cursor: pointer;
  transition: background var(--transition-base),
              transform var(--transition-base);
  width: fit-content;
}

.hero__cta:hover {
  background: var(--color-primary-400);   /* #6890F9 */
  transform: translateY(-1px);
}

.hero__cta:active {
  transform: translateY(0);
  background: var(--color-primary-600);   /* #3D65D4 */
}

.hero__cta svg {
  width: 16px;
  height: 16px;
  transition: transform var(--transition-base);
}

.hero__cta:hover svg {
  transform: translateX(3px);
}
```

---

## Auto-Rotate Carousel

### Timing

| Property             | Value                           |
|----------------------|---------------------------------|
| Slide duration       | 6 seconds per slide             |
| Transition duration  | 400ms                           |
| Easing               | cubic-bezier(0.25, 0.46, 0.45, 0.94) |
| Pause on hover       | Yes                             |
| Pause on focus       | Yes                             |
| Max slides           | 5                               |

### Slide Transition

```css
.hero__slides {
  display: flex;
  transition: transform var(--transition-carousel);
}

.hero__slide {
  min-width: 100%;
  opacity: 0;
  transition: opacity 400ms ease;
}

.hero__slide--active {
  opacity: 1;
}

/* Crossfade approach (preferred over sliding for hero) */
.hero__slides--crossfade .hero__slide {
  position: absolute;
  inset: 0;
}
```

### Progress Dots

```css
.hero__dots {
  position: absolute;
  bottom: 24px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 3;
  display: flex;
  gap: 8px;
}

.hero__dot {
  width: 8px;
  height: 8px;
  border-radius: var(--radius-full);
  background: rgba(255, 255, 255, 0.3);
  border: none;
  cursor: pointer;
  transition: background var(--transition-base),
              width var(--transition-slow);
  padding: 0;
}

.hero__dot--active {
  width: 24px;
  background: var(--color-text-primary);
}

.hero__dot:hover {
  background: rgba(255, 255, 255, 0.6);
}

/* Progress fill animation within active dot */
.hero__dot--active {
  background: linear-gradient(
    to right,
    var(--color-text-primary) var(--progress, 0%),
    rgba(255, 255, 255, 0.3) var(--progress, 0%)
  );
}
```

---

## Mobile Stacking

```css
@media (max-width: 639px) {
  .hero__content {
    bottom: 56px;
    gap: 12px;
  }

  .hero__dots {
    bottom: 16px;
  }

  /* On mobile, hero can optionally stack: image top, content bottom */
  .hero--stacked {
    height: auto;
    display: flex;
    flex-direction: column;
  }

  .hero--stacked .hero__image {
    position: relative;
    height: 240px;
  }

  .hero--stacked .hero__content {
    position: relative;
    bottom: auto;
    padding: 24px 16px;
  }
}
```

---

## Accessibility

- `role="region"` with `aria-roledescription="carousel"` and `aria-label="Featured products"`
- Each slide: `role="group"` with `aria-roledescription="slide"` and `aria-label="1 of 5"`
- Auto-rotate pauses when any child receives focus or on hover
- Dots are `<button>` elements with `aria-label="Go to slide N"`
- `prefers-reduced-motion: reduce` disables parallax and crossfade transitions (instant switch)
- Image has descriptive `alt` text
