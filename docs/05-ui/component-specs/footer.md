# Component Spec: Footer

Rich footer with category links, social, newsletter, trust badges, and legal.

---

## Structure

```
┌──────────────────────────────────────────────────────────────────┐
│                                                                  │
│  ┌─────────────────────────────────────────────────────────────┐ │
│  │ [Logo]                    Newsletter                        │ │
│  │ Your guide to the best    ┌────────────────────────┬──────┐ │ │
│  │ products for life in      │ Enter your email       │ Join │ │ │
│  │ Japan.                    └────────────────────────┴──────┘ │ │
│  │                           Get weekly picks. No spam.        │ │
│  └─────────────────────────────────────────────────────────────┘ │
│                                                                  │
│  ┌──────────┬──────────┬──────────┬──────────┬──────────┐       │
│  │ Kitchen  │ Home     │ Tech     │ Company  │ Support  │       │
│  │ ─────    │ ─────    │ ─────    │ ─────    │ ─────    │       │
│  │ Rice...  │ Futons   │ Smart... │ About    │ Contact  │       │
│  │ Knives   │ Air Pur..│ Laptops  │ Method   │ FAQ      │       │
│  │ Blenders │ Robot... │ Cameras  │ Team     │ Feedback │       │
│  │ Toasters │ Dehumid..│ Head...  │ Press    │ Report   │       │
│  └──────────┴──────────┴──────────┴──────────┴──────────┘       │
│                                                                  │
│  ────────────────────────────────────────────────────────────    │
│                                                                  │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐                      │
│  │ Trust    │  │ Trust    │  │ Trust    │   [X] [IG] [YT]      │
│  │ Badge 1  │  │ Badge 2  │  │ Badge 3  │                      │
│  └──────────┘  └──────────┘  └──────────┘                      │
│                                                                  │
│  (c) 2026 Chartedly. All rights reserved.                       │
│  Privacy Policy  ·  Terms  ·  Tokushoho                         │
│                                                                  │
└──────────────────────────────────────────────────────────────────┘
```

---

## Dimensions

| Property              | Value                     |
|-----------------------|---------------------------|
| Background            | bg-deep (#0D0D18)         |
| Top border            | 1px solid border-subtle   |
| Max content width     | 1440px                    |
| Horizontal padding    | 24px                      |
| Vertical padding      | 64px top, 32px bottom     |
| Link column count     | 5 (desktop), 2 (mobile)   |
| Column gap            | 32px                      |
| Row gap               | 48px                      |

---

## CSS

### Container

```css
.footer {
  background: var(--color-bg-deep);
  border-top: 1px solid var(--color-border-subtle);
  padding-top: var(--space-16);     /* 64px */
  padding-bottom: var(--space-8);   /* 32px */
}

.footer__inner {
  max-width: 1440px;
  margin: 0 auto;
  padding: 0 var(--space-6);
}
```

### Top Section (Logo + Newsletter)

```css
.footer__top {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: var(--space-10);
  margin-bottom: var(--space-12);   /* 48px */
}

@media (max-width: 767px) {
  .footer__top {
    flex-direction: column;
    gap: var(--space-8);
  }
}

.footer__brand {
  max-width: 280px;
}

.footer__logo {
  height: 28px;
  margin-bottom: var(--space-3);
}

.footer__tagline {
  font-size: 0.875rem;
  line-height: 1.6;
  color: var(--color-text-tertiary);
}
```

### Newsletter Input

```css
.footer__newsletter {
  max-width: 400px;
  width: 100%;
}

.footer__newsletter-title {
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--color-text-primary);
  margin-bottom: var(--space-3);
}

.footer__newsletter-form {
  display: flex;
  gap: 0;
}

.footer__newsletter-input {
  flex: 1;
  height: 44px;
  padding: 0 16px;
  background: var(--color-surface-input);
  border: 1px solid var(--color-border-subtle);
  border-right: none;
  border-radius: var(--radius-md) 0 0 var(--radius-md);
  color: var(--color-text-primary);
  font-size: 0.875rem;
  outline: none;
  transition: border-color var(--transition-fast);
}

.footer__newsletter-input::placeholder {
  color: var(--color-text-tertiary);
}

.footer__newsletter-input:focus {
  border-color: var(--color-primary);
}

.footer__newsletter-btn {
  height: 44px;
  padding: 0 20px;
  background: var(--color-primary);
  color: var(--color-text-primary);
  font-size: 0.875rem;
  font-weight: 600;
  border: none;
  border-radius: 0 var(--radius-md) var(--radius-md) 0;
  cursor: pointer;
  transition: background var(--transition-fast);
  white-space: nowrap;
}

.footer__newsletter-btn:hover {
  background: var(--color-primary-400);
}

.footer__newsletter-hint {
  font-size: 0.75rem;
  color: var(--color-text-tertiary);
  margin-top: var(--space-2);
}
```

### Category Links Grid

```css
.footer__links {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: var(--space-8);
  margin-bottom: var(--space-12);
}

@media (max-width: 1023px) {
  .footer__links {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (max-width: 639px) {
  .footer__links {
    grid-template-columns: repeat(2, 1fr);
    gap: var(--space-6);
  }
}

.footer__link-group-title {
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--color-text-primary);
  margin-bottom: var(--space-3);
}

.footer__link-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}

.footer__link-list a {
  font-size: 0.875rem;
  color: var(--color-text-tertiary);
  text-decoration: none;
  transition: color var(--transition-fast);
  display: block;
  padding: 2px 0;
}

.footer__link-list a:hover {
  color: var(--color-text-secondary);
}
```

### Divider

```css
.footer__divider {
  border: none;
  border-top: 1px solid var(--color-border-subtle);
  margin: 0 0 var(--space-8);
}
```

### Trust Badges + Social

```css
.footer__badges-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--space-8);
}

@media (max-width: 639px) {
  .footer__badges-row {
    flex-direction: column;
    gap: var(--space-6);
    align-items: flex-start;
  }
}

.footer__trust-badges {
  display: flex;
  gap: var(--space-4);
}

.footer__trust-badge {
  height: 36px;
  padding: 6px 12px;
  background: var(--color-surface-card);
  border: 1px solid var(--color-border-subtle);
  border-radius: var(--radius-sm);
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.625rem;
  font-weight: 500;
  color: var(--color-text-tertiary);
  letter-spacing: 0.02em;
}

.footer__trust-badge svg {
  width: 16px;
  height: 16px;
  color: var(--color-text-tertiary);
}

/* Social icons */
.footer__social {
  display: flex;
  gap: var(--space-3);
}

.footer__social-link {
  width: 36px;
  height: 36px;
  border-radius: var(--radius-full);
  background: var(--color-surface-card);
  border: 1px solid var(--color-border-subtle);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-text-tertiary);
  transition: all var(--transition-fast);
  text-decoration: none;
}

.footer__social-link:hover {
  background: var(--color-surface-elevated);
  color: var(--color-text-primary);
  border-color: var(--color-border-default);
}

.footer__social-link svg {
  width: 18px;
  height: 18px;
}
```

### Bottom Legal Row

```css
.footer__bottom {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: var(--space-4);
}

.footer__copyright {
  font-size: 0.75rem;
  color: var(--color-text-disabled);
}

.footer__legal-links {
  display: flex;
  gap: var(--space-4);
  list-style: none;
  padding: 0;
  margin: 0;
}

.footer__legal-links a {
  font-size: 0.75rem;
  color: var(--color-text-disabled);
  text-decoration: none;
  transition: color var(--transition-fast);
}

.footer__legal-links a:hover {
  color: var(--color-text-tertiary);
}

/* Separator dots between legal links */
.footer__legal-links li + li::before {
  content: '\00B7';
  margin-right: var(--space-4);
  color: var(--color-text-disabled);
}
```

---

## Accessibility

- Footer: `<footer role="contentinfo">`
- Link groups: each group in a `<nav>` with `aria-label` (e.g., "Kitchen categories")
- Newsletter: `<form>` with `aria-label="Newsletter signup"`, input has `aria-label="Email address"`
- Social links: `aria-label` on each (e.g., "Chartedly on X (Twitter)")
- Trust badges: `alt` text on any images, `aria-label` on badge containers
