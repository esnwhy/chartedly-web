# ADR-005: Pagefind for Static Search

## Status
**Accepted** — 2026-03-24

## Context
Phase 04 wireframes specify search with autocomplete. Chartedly needs bilingual search (EN + JP) across 116 products and comparison articles. The search must be fast, work without a server, and handle both Latin and CJK characters.

## Decision
Use Pagefind for launch. Fully static, zero-cost, zero-server search with CJK support.

## Alternatives Considered

### Algolia
- **Pros:** Best-in-class relevance, typo tolerance, faceted filtering, analytics, instant UI components.
- **Cons:** Cost. Free tier is 10,000 searches/month and 10,000 records. Chartedly would fit in free tier initially, but growth to 1000+ products or viral traffic would hit paid tiers ($1+/1000 searches). Requires API key management, index sync pipeline, and external dependency. Adds ~30KB JS for InstantSearch.
- **Verdict:** Deferred. Re-evaluate when search analytics show demand for faceted filtering or when product count exceeds 500.

### Fuse.js / Lunr.js (client-side fuzzy search)
- **Pros:** Lightweight, no build step, flexible scoring.
- **Cons:** Loads entire index into memory. At 116 products this is fine (~50KB), but at 500+ products the index bloats. No built-in CJK tokenization — Japanese search would require custom tokenizer. No pre-built UI.
- **Verdict:** Rejected. Pagefind solves the same problem with better CJK support and smaller index size.

### Pagefind (chosen)
- **Pros:**
  - Runs at build time. Indexes all HTML output, produces a static search index.
  - Index is chunked and loaded on demand — only fetches relevant chunks. ~10KB base JS + ~5KB per result page.
  - Built-in CJK tokenization. Japanese product names and descriptions are searchable without custom tokenizer.
  - Bilingual: indexes both `/en/` and `/ja/` pages. Language-aware filtering possible.
  - Zero hosting cost. Index is static files served from CDN.
  - Pre-built UI component or use the JS API for custom UI.
  - Astro integration: `@astrojs/pagefind` or post-build `npx pagefind`.
- **Cons:**
  - No typo tolerance (exact substring match).
  - No search analytics (what users search for).
  - No faceted filtering out of the box (must be configured via `data-pagefind-filter`).

## Implementation

### 1. Install and Configure

```bash
npm install pagefind --save-dev
```

Add to `package.json` scripts:

```json
{
  "scripts": {
    "build": "astro build && npx pagefind --site dist",
    "postbuild": "npx pagefind --site dist"
  }
}
```

### 2. Mark Searchable Content

In product detail pages:

```astro
<main data-pagefind-body>
  <h1 data-pagefind-meta="title">{product.name}</h1>
  <p data-pagefind-meta="description">{product.shortDescription}</p>
  <span data-pagefind-filter="category">{product.category}</span>
  <span data-pagefind-filter="type">{product.type}</span>
  <span data-pagefind-sort="score" data-pagefind-meta="score">{product.score}</span>
</main>
```

Exclude non-content areas:

```astro
<nav data-pagefind-ignore>...</nav>
<footer data-pagefind-ignore>...</footer>
```

### 3. Custom Search UI (SearchOverlay.astro island)

```javascript
// Initialize Pagefind
const pagefind = await import('/pagefind/pagefind.js');
await pagefind.init();

// Search with language filter
const results = await pagefind.search(query, {
  filters: {
    language: currentLang  // 'en' or 'ja'
  }
});

// Load result data
for (const result of results.results.slice(0, 8)) {
  const data = await result.data();
  // data.meta.title, data.meta.description, data.meta.image
  // data.excerpt (highlighted match)
}
```

### 4. Pagefind Configuration (pagefind.yml)

```yaml
site: dist
glob: "**/*.html"
exclude_selectors:
  - "nav"
  - "footer"
  - "[data-pagefind-ignore]"
```

## Performance Impact
- Base JS: ~10KB (loaded on search interaction, not on page load)
- Index chunks: ~2-5KB per loaded chunk
- Search latency: <50ms for 116 products
- No server round-trip. Everything is local to the CDN edge.

## Consequences
- Search works offline and on CDN-served static pages.
- Autocomplete from Phase 04 wireframes is implemented via Pagefind's JS API with debounced input.
- Japanese search works out of the box via CJK tokenization.
- If search analytics are needed later, add a simple event to GA4 (`search_term` event) from the search UI.
- Migration to Algolia later is non-breaking — swap the search UI component, keep Pagefind as fallback.
