# Component Spec: Navigation

Top navigation bar (desktop) and bottom tab bar (mobile).

---

## Desktop Navigation

### Structure

```
┌──────────────────────────────────────────────────────────────────┐
│  [Logo]     Rankings  Explore▼  Compare     [🔍]  [EN|JP]       │
└──────────────────────────────────────────────────────────────────┘
         ↑                                      ↑       ↑
    Left group              Center links     Search   Language
```

### Dimensions

| Property            | Value                            |
|---------------------|----------------------------------|
| Height              | 64px                             |
| Max content width   | 1440px                           |
| Horizontal padding  | 24px                             |
| Background          | bg-base at 80% + blur            |
| Border bottom       | 1px solid border-subtle          |
| Logo height         | 28px                             |
| Nav link font       | 14px, 500 weight                 |
| Link gap            | 32px                             |

### CSS

```css
.nav {
  position: sticky;
  top: 0;
  z-index: var(--z-nav);
  width: 100%;
  height: 64px;
  background: rgba(10, 10, 15, 0.8);
  backdrop-filter: blur(16px) saturate(180%);
  -webkit-backdrop-filter: blur(16px) saturate(180%);
  border-bottom: 1px solid var(--color-border-subtle);
  transition: background var(--transition-base);
}

.nav__inner {
  max-width: 1440px;
  margin: 0 auto;
  height: 100%;
  padding: 0 var(--space-6);
  display: flex;
  align-items: center;
  justify-content: space-between;
}

/* Left: Logo */
.nav__logo {
  flex-shrink: 0;
  height: 28px;
  display: flex;
  align-items: center;
}

.nav__logo img,
.nav__logo svg {
  height: 28px;
  width: auto;
}

/* Center: Links */
.nav__links {
  display: flex;
  align-items: center;
  gap: var(--space-8);            /* 32px */
  list-style: none;
  margin: 0;
  padding: 0;
}

.nav__link {
  font-family: var(--font-family-en);
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--color-text-secondary);
  text-decoration: none;
  transition: color var(--transition-fast);
  position: relative;
  padding: 4px 0;
}

.nav__link:hover {
  color: var(--color-text-primary);
}

.nav__link--active {
  color: var(--color-text-primary);
}

.nav__link--active::after {
  content: '';
  position: absolute;
  bottom: -20px;                  /* Aligns with nav bottom border */
  left: 0;
  right: 0;
  height: 2px;
  background: var(--color-primary);
  border-radius: 1px;
}

/* Right: Actions */
.nav__actions {
  display: flex;
  align-items: center;
  gap: var(--space-4);            /* 16px */
}
```

### Search Button (Desktop)

```css
.nav__search-btn {
  width: 36px;
  height: 36px;
  border-radius: var(--radius-full);
  background: transparent;
  border: 1px solid var(--color-border-subtle);
  color: var(--color-text-secondary);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all var(--transition-fast);
}

.nav__search-btn:hover {
  background: var(--color-surface-card);
  color: var(--color-text-primary);
  border-color: var(--color-border-default);
}

.nav__search-btn svg {
  width: 18px;
  height: 18px;
}
```

### Language Toggle

```css
.nav__lang-toggle {
  display: flex;
  align-items: center;
  background: var(--color-surface-card);
  border-radius: var(--radius-full);
  border: 1px solid var(--color-border-subtle);
  padding: 2px;
  height: 32px;
}

.nav__lang-option {
  padding: 4px 12px;
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.04em;
  border-radius: var(--radius-full);
  border: none;
  background: transparent;
  color: var(--color-text-tertiary);
  cursor: pointer;
  transition: all var(--transition-fast);
}

.nav__lang-option--active {
  background: var(--color-primary);
  color: var(--color-text-primary);
}

.nav__lang-option:hover:not(.nav__lang-option--active) {
  color: var(--color-text-secondary);
}
```

---

## Explore Mega Menu

Triggered by hovering/clicking "Explore" in nav.

### Structure

```
┌──────────────────────────────────────────────────────────────┐
│  Kitchen          │  Home & Living    │  Tech & Gadgets      │
│  ─────            │  ─────            │  ─────               │
│  Rice Cookers     │  Futons           │  Smartphones         │
│  Knife Sets       │  Air Purifiers    │  Laptops             │
│  Blenders         │  Robot Vacuums    │  Cameras             │
│  Toasters         │  Dehumidifiers    │  Headphones          │
│  ...              │  ...              │  ...                  │
│                   │                   │                       │
│  [View All →]     │  [View All →]     │  [View All →]        │
└──────────────────────────────────────────────────────────────┘
```

### CSS

```css
.mega-menu {
  position: absolute;
  top: 64px;
  left: 0;
  right: 0;
  z-index: var(--z-dropdown);
  background: var(--color-surface-elevated);
  border-bottom: 1px solid var(--color-border-subtle);
  box-shadow: var(--shadow-elevated);
  opacity: 0;
  transform: translateY(-8px);
  pointer-events: none;
  transition: opacity var(--transition-base),
              transform var(--transition-base);
}

.mega-menu--open {
  opacity: 1;
  transform: translateY(0);
  pointer-events: auto;
}

.mega-menu__inner {
  max-width: 1440px;
  margin: 0 auto;
  padding: var(--space-8) var(--space-6);
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--space-8);
}

.mega-menu__category-title {
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--color-text-primary);
  margin-bottom: var(--space-3);
  padding-bottom: var(--space-2);
  border-bottom: 1px solid var(--color-border-subtle);
}

.mega-menu__list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}

.mega-menu__item a {
  font-size: 0.875rem;
  color: var(--color-text-secondary);
  text-decoration: none;
  padding: 4px 0;
  display: block;
  transition: color var(--transition-fast);
}

.mega-menu__item a:hover {
  color: var(--color-primary);
}
```

---

## Mobile Bottom Tab Bar

Replaces top nav links on mobile. Top bar still exists for logo + search + language.

### Structure

```
┌───────┬───────┬───────┬───────┬───────┐
│  🏠   │  📊   │  🔍   │  ⚖️   │  •••  │
│ Home  │ Rank  │Search │Compare│ More  │
└───────┴───────┴───────┴───────┴───────┘
```

### Dimensions

| Property           | Value                          |
|--------------------|--------------------------------|
| Height             | 56px + safe-area-inset-bottom  |
| Icon size          | 24px                           |
| Label font         | 10px, 500 weight               |
| Active color       | primary (#4F7DF7)              |
| Inactive color     | text-tertiary (#6B7280)        |
| Background         | bg-base at 95% + blur          |

### CSS

```css
.tab-bar {
  display: none;                   /* Hidden on desktop */
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: var(--z-nav);
  height: calc(56px + env(safe-area-inset-bottom, 0px));
  padding-bottom: env(safe-area-inset-bottom, 0px);
  background: rgba(10, 10, 15, 0.95);
  backdrop-filter: blur(16px) saturate(180%);
  -webkit-backdrop-filter: blur(16px) saturate(180%);
  border-top: 1px solid var(--color-border-subtle);
}

@media (max-width: 767px) {
  .tab-bar { display: flex; }

  /* Add bottom padding to page content to prevent overlap */
  body { padding-bottom: calc(56px + env(safe-area-inset-bottom, 0px)); }
}

.tab-bar__item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 2px;
  padding: 6px 0;
  text-decoration: none;
  color: var(--color-text-tertiary);
  transition: color var(--transition-fast);
  -webkit-tap-highlight-color: transparent;
}

.tab-bar__item--active {
  color: var(--color-primary);
}

.tab-bar__item svg {
  width: 24px;
  height: 24px;
}

.tab-bar__item span {
  font-size: 0.625rem;          /* 10px */
  font-weight: 500;
  letter-spacing: 0.02em;
}
```

### Mobile Top Bar (Simplified)

```css
@media (max-width: 767px) {
  .nav {
    height: 56px;
  }

  .nav__links {
    display: none;               /* Links move to bottom tab bar */
  }

  .nav__inner {
    padding: 0 var(--space-4);
  }

  .nav__logo img,
  .nav__logo svg {
    height: 24px;
  }
}
```

---

## Scroll Behavior

```css
/* Nav becomes more opaque on scroll */
.nav--scrolled {
  background: rgba(10, 10, 15, 0.95);
}

/* Hide/show nav on scroll direction (mobile only) */
@media (max-width: 767px) {
  .nav--hidden {
    transform: translateY(-100%);
    transition: transform var(--transition-base);
  }
}
```

---

## Accessibility

- Nav: `<nav role="navigation" aria-label="Main navigation">`
- Mobile tab bar: `<nav role="navigation" aria-label="Quick navigation">`
- Current page link: `aria-current="page"`
- Mega menu: `aria-expanded` on trigger, `role="menu"` on panel
- Language toggle: `role="radiogroup"` with `aria-label="Language"`, options are `role="radio"`
- Skip-to-content link as first focusable element: visually hidden until focused
- All interactive elements have minimum 48x48px touch target on mobile
