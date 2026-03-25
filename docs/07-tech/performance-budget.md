# Chartedly — Performance Budget

## Core Web Vitals Targets

| Metric | Target | Threshold (Good) | Measurement |
|---|---|---|---|
| **LCP** (Largest Contentful Paint) | < 2.0s | < 2.5s | Hero image or product card row |
| **CLS** (Cumulative Layout Shift) | < 0.05 | < 0.1 | Image placeholders, font swap |
| **INP** (Interaction to Next Paint) | < 100ms | < 200ms | Search overlay, filter clicks |
| **FCP** (First Contentful Paint) | < 1.2s | < 1.8s | Above-fold text renders |
| **TTI** (Time to Interactive) | < 3.0s | < 3.5s | Islands hydrated |
| **TTFB** (Time to First Byte) | < 100ms | < 200ms | CDN edge response |

## Bundle Size Budget

| Category | Budget | Notes |
|---|---|---|
| **Total JS (all pages)** | < 80KB gzipped | Astro ships 0KB by default; budget is for islands |
| **Per-page JS (typical)** | < 30KB gzipped | Most pages: search + lang toggle only |
| **Per-page JS (max)** | < 80KB gzipped | Comparison page with chart + table + search |
| **Total CSS** | < 25KB gzipped | Tailwind purge removes unused classes |
| **HTML per page** | < 50KB | Static HTML, product data inlined |
| **Pagefind base** | ~10KB | Loaded on search interaction only |
| **Pagefind index chunk** | ~2-5KB | Per loaded result set |

### JS Budget Breakdown (worst case: comparison page)

| Component | Estimated Size (gzipped) |
|---|---|
| Pagefind search | ~10KB |
| RadarChart (canvas/SVG) | ~8KB |
| ComparisonTable (sort/filter) | ~12KB |
| ImageGallery (lightbox) | ~10KB |
| HeroCarousel | ~6KB |
| Language toggle | ~2KB |
| **Total** | **~48KB** |

This is well under the 80KB budget. If Preact islands are used (~4KB runtime), total is ~52KB.

## Image Optimization Targets

| Context | Max Dimensions | Format | Quality | Max File Size |
|---|---|---|---|---|
| Product card thumbnail | 400x600 | WebP | 80 | 30KB |
| Product detail hero | 800x1200 | WebP | 85 | 80KB |
| Hero carousel | 1200x800 | WebP | 85 | 100KB |
| Comparison table thumb | 200x300 | WebP | 75 | 15KB |
| Category banner | 1200x400 | WebP | 80 | 60KB |
| OG social image | 1200x630 | PNG | 90 | 150KB |

### Image Loading Strategy

```
Above the fold (hero, first product row):
  loading="eager"
  fetchpriority="high"
  Preload via <link rel="preload">

Below the fold (all other images):
  loading="lazy"
  decoding="async"
  Native browser lazy loading
```

### Responsive Images

```html
<img
  srcset="product-200.webp 200w, product-400.webp 400w, product-800.webp 800w"
  sizes="(max-width: 640px) 200px, (max-width: 1024px) 400px, 800px"
  src="product-400.webp"
  alt="..."
  width="400"
  height="600"
  loading="lazy"
  decoding="async"
/>
```

## Font Loading Strategy

### Fonts Used
- **Inter** — UI text (Latin characters)
- **Noto Sans JP** — Japanese text
- **JetBrains Mono** — Code/specs (optional, can be removed)

### Loading Approach

```html
<!-- Preconnect to Google Fonts -->
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />

<!-- Inter: Latin subset, weights 400 + 600 + 700 only -->
<link rel="stylesheet"
  href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap" />

<!-- Noto Sans JP: Load only on /ja/ pages, weights 400 + 700 -->
<!-- Conditional: only include on Japanese locale pages -->
{lang === 'ja' && (
  <link rel="stylesheet"
    href="https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@400;700&display=swap" />
)}
```

### Font Display Strategy
- `font-display: swap` — show text immediately in system font, swap when loaded.
- System font fallback stack: `system-ui, -apple-system, sans-serif`.
- **Noto Sans JP only loads on `/ja/` pages.** English pages skip it entirely (~100KB savings).

### Font Size Targets
| Font | Weights | Estimated Size (gzipped) |
|---|---|---|
| Inter (Latin) | 400, 600, 700 | ~25KB |
| Noto Sans JP | 400, 700 | ~120KB (subset) |

Google Fonts serves optimized subsets based on `unicode-range`, so actual download is smaller than full font files.

## Page Weight Budgets

| Page | HTML | CSS | JS | Images | Fonts | Total |
|---|---|---|---|---|---|---|
| Homepage (EN) | 40KB | 20KB | 30KB | 200KB | 25KB | ~315KB |
| Homepage (JA) | 45KB | 20KB | 30KB | 200KB | 145KB | ~440KB |
| Product detail | 25KB | 20KB | 40KB | 100KB | 25KB | ~210KB |
| Comparison article | 35KB | 20KB | 50KB | 150KB | 25KB | ~280KB |
| Category listing | 30KB | 20KB | 25KB | 250KB | 25KB | ~350KB |

All within reasonable bounds for 3G connections (~1.5 Mbps): worst case loads in ~2.3s.

## Monitoring

### Build-Time Checks
- `astro build` reports page sizes.
- Add `bundlesize` or `size-limit` to CI:

```json
// package.json
{
  "size-limit": [
    { "path": "dist/**/*.js", "limit": "80 KB", "gzip": true },
    { "path": "dist/**/*.css", "limit": "25 KB", "gzip": true }
  ]
}
```

### Runtime Monitoring
- Cloudflare Web Analytics (Core Web Vitals, free).
- Google PageSpeed Insights on key pages (monthly manual check).
- Lighthouse CI in GitHub Actions (automated, per deploy).

### Performance Regression Prevention

Add to CI pipeline (see cicd-spec.md):

```yaml
- name: Lighthouse CI
  uses: treosh/lighthouse-ci-action@v11
  with:
    urls: |
      https://chartedly.com/en/
      https://chartedly.com/en/product/anessa-perfect-uv-milk
    budgetPath: .github/lighthouse-budget.json
```

```json
// .github/lighthouse-budget.json
[{
  "path": "/*",
  "timings": [
    { "metric": "largest-contentful-paint", "budget": 2500 },
    { "metric": "cumulative-layout-shift", "budget": 0.1 },
    { "metric": "interactive", "budget": 3500 }
  ],
  "resourceSizes": [
    { "resourceType": "script", "budget": 80 },
    { "resourceType": "stylesheet", "budget": 25 },
    { "resourceType": "total", "budget": 500 }
  ]
}]
```

## Cache Strategy

| Asset | Cache-Control | Notes |
|---|---|---|
| HTML pages | `max-age=0, must-revalidate` | Always fresh after deploy |
| CSS/JS (hashed) | `max-age=31536000, immutable` | Astro adds content hashes |
| Images | `max-age=2592000` (30 days) | Product images change rarely |
| Fonts (Google) | Handled by Google CDN | Long-lived cache headers |
| Pagefind index | `max-age=3600` (1 hour) | Rebuilt on each deploy |

Configured via `public/_headers` (Cloudflare Pages):

```
/assets/*
  Cache-Control: public, max-age=31536000, immutable

/images/*
  Cache-Control: public, max-age=2592000

/pagefind/*
  Cache-Control: public, max-age=3600
```
