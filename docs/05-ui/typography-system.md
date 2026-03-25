# Chartedly Typography System

---

## Font Loading

```html
<!-- Google Fonts — preconnect for performance -->
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Noto+Sans+JP:wght@400;500;600;700&display=swap" rel="stylesheet" />
```

```css
/* Font stacks */
--font-family-en: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
--font-family-jp: 'Noto Sans JP', 'Hiragino Sans', 'Yu Gothic', sans-serif;

/* Apply: English pages use font-family-en, Japanese pages use font-family-jp.
   Mixed content: set body to font-family-jp (which falls back to Inter for Latin). */
```

---

## Type Scale — Full Specification

### Display (Hero headlines only)

| Token          | Size    | Weight   | Line Height | Letter Spacing | Use Case                  |
|----------------|---------|----------|-------------|----------------|---------------------------|
| `display-xl`   | 60px    | 700 Bold | 1.2 (72px)  | -0.02em        | Hero headline EN          |
| `display-xl-jp`| 48px    | 700 Bold | 1.2 (57.6px)| 0em            | Hero headline JP          |
| `display-lg`   | 48px    | 700 Bold | 1.2 (57.6px)| -0.02em        | Secondary hero EN         |
| `display-lg-jp`| 36px    | 700 Bold | 1.2 (43.2px)| 0em            | Secondary hero JP         |

```css
.display-xl {
  font-family: var(--font-family-en);
  font-size: 3.75rem; /* 60px */
  font-weight: 700;
  line-height: 1.2;
  letter-spacing: -0.02em;
  color: var(--color-text-primary);
}

.display-xl-jp {
  font-family: var(--font-family-jp);
  font-size: 3rem; /* 48px */
  font-weight: 700;
  line-height: 1.2;
  letter-spacing: 0em;
  color: var(--color-text-primary);
}
```

**EN example:** "Find the Best Products for Life in Japan"
**JP example:** 「日本の暮らしに最適な商品を見つけよう」

### Headings

| Token      | Size    | Weight      | Line Height | Letter Spacing | Use Case                    |
|------------|---------|-------------|-------------|----------------|-----------------------------|
| `h1`       | 36px    | 700 Bold    | 1.2 (43.2px)| -0.02em        | Page titles EN              |
| `h1-jp`    | 30px    | 700 Bold    | 1.2 (36px)  | 0em            | Page titles JP              |
| `h2`       | 30px    | 600 Semi    | 1.2 (36px)  | -0.02em        | Section titles EN           |
| `h2-jp`    | 24px    | 600 Semi    | 1.2 (28.8px)| 0em            | Section titles JP           |
| `h3`       | 24px    | 600 Semi    | 1.2 (28.8px)| -0.01em        | Subsection / card title EN  |
| `h3-jp`    | 20px    | 600 Semi    | 1.2 (24px)  | 0em            | Subsection / card title JP  |
| `h4`       | 20px    | 600 Semi    | 1.2 (24px)  | 0em            | Card subtitle EN            |
| `h4-jp`    | 18px    | 600 Semi    | 1.2 (21.6px)| 0em            | Card subtitle JP            |

```css
.h1 {
  font-family: var(--font-family-en);
  font-size: 2.25rem;
  font-weight: 700;
  line-height: 1.2;
  letter-spacing: -0.02em;
  color: var(--color-text-primary);
}

.h2 {
  font-family: var(--font-family-en);
  font-size: 1.875rem;
  font-weight: 600;
  line-height: 1.2;
  letter-spacing: -0.02em;
  color: var(--color-text-primary);
}

.h3 {
  font-family: var(--font-family-en);
  font-size: 1.5rem;
  font-weight: 600;
  line-height: 1.2;
  letter-spacing: -0.01em;
  color: var(--color-text-primary);
}
```

**EN example H2:** "Best Rice Cookers 2026"
**JP example H2:** 「2026年おすすめ炊飯器ランキング」

### Body

| Token        | Size    | Weight      | Line Height | Letter Spacing | Use Case                  |
|--------------|---------|-------------|-------------|----------------|---------------------------|
| `body-lg`    | 18px    | 400 Regular | 1.5 (27px)  | 0em            | Lead paragraphs EN        |
| `body-lg-jp` | 18px    | 400 Regular | 1.6 (28.8px)| 0.02em         | Lead paragraphs JP        |
| `body`       | 16px    | 400 Regular | 1.5 (24px)  | 0em            | Default body EN           |
| `body-jp`    | 16px    | 400 Regular | 1.6 (25.6px)| 0.02em         | Default body JP           |
| `body-sm`    | 14px    | 400 Regular | 1.5 (21px)  | 0em            | Secondary info EN         |
| `body-sm-jp` | 14px    | 400 Regular | 1.6 (22.4px)| 0.02em         | Secondary info JP         |
| `body-bold`  | 16px    | 600 Semi    | 1.5 (24px)  | 0em            | Emphasis within text      |

```css
.body {
  font-family: var(--font-family-en);
  font-size: 1rem;
  font-weight: 400;
  line-height: 1.5;
  letter-spacing: 0em;
  color: var(--color-text-secondary);
}

.body-jp {
  font-family: var(--font-family-jp);
  font-size: 1rem;
  font-weight: 400;
  line-height: 1.6;
  letter-spacing: 0.02em;
  color: var(--color-text-secondary);
}
```

**EN example:** "We tested 47 rice cookers across 5 categories to find the best options for every budget."
**JP example:** 「47台の炊飯器を5つのカテゴリーで徹底テストし、予算別のベストを見つけました。」

### UI Text

| Token        | Size    | Weight      | Line Height | Letter Spacing | Use Case                    |
|--------------|---------|-------------|-------------|----------------|-----------------------------|
| `label`      | 14px    | 500 Medium  | 1.5 (21px)  | 0em            | Form labels, nav links      |
| `label-jp`   | 14px    | 500 Medium  | 1.5 (21px)  | 0.04em         | Form labels JP              |
| `caption`    | 12px    | 400 Regular | 1.5 (18px)  | 0.02em         | Timestamps, metadata EN     |
| `caption-jp` | 12px    | 400 Regular | 1.5 (18px)  | 0.04em         | Timestamps, metadata JP     |
| `overline`   | 12px    | 600 Semi    | 1.5 (18px)  | 0.08em         | Category labels, ALL CAPS   |
| `button`     | 14px    | 600 Semi    | 1.0 (14px)  | 0.02em         | Button text                 |
| `button-lg`  | 16px    | 600 Semi    | 1.0 (16px)  | 0.02em         | Large button text           |
| `score-lg`   | 36px    | 700 Bold    | 1.0 (36px)  | -0.02em        | Score number on detail page |
| `score-sm`   | 14px    | 700 Bold    | 1.0 (14px)  | 0em            | Score number on card        |

```css
.overline {
  font-family: var(--font-family-en);
  font-size: 0.75rem;
  font-weight: 600;
  line-height: 1.5;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--color-text-tertiary);
}

.score-lg {
  font-family: var(--font-family-en);
  font-size: 2.25rem;
  font-weight: 700;
  line-height: 1;
  letter-spacing: -0.02em;
  font-variant-numeric: tabular-nums;
}
```

---

## Responsive Adjustments

```css
/* Mobile: reduce display and heading sizes */
@media (max-width: 767px) {
  .display-xl     { font-size: 2.25rem; }   /* 60 → 36px */
  .display-xl-jp  { font-size: 1.875rem; }  /* 48 → 30px */
  .display-lg     { font-size: 1.875rem; }  /* 48 → 30px */
  .display-lg-jp  { font-size: 1.5rem; }    /* 36 → 24px */
  .h1             { font-size: 1.875rem; }  /* 36 → 30px */
  .h1-jp          { font-size: 1.5rem; }    /* 30 → 24px */
  .h2             { font-size: 1.5rem; }    /* 30 → 24px */
  .h2-jp          { font-size: 1.25rem; }   /* 24 → 20px */
}
```

---

## Text Truncation Patterns

```css
/* Single line truncation */
.truncate-1 {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* Multi-line clamp (2 lines for card titles) */
.truncate-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* 3-line clamp for card descriptions */
.truncate-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
```

---

## Font Feature Settings

```css
/* Tabular numbers for scores and prices */
.tabular-nums {
  font-variant-numeric: tabular-nums;
}

/* Japanese text optimization */
.jp-text {
  word-break: break-all;              /* Allow mid-word breaks for JP */
  overflow-wrap: break-word;
  -webkit-font-smoothing: antialiased;
  text-rendering: optimizeLegibility;
}
```
