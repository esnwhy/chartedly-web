# Chartedly — System Architecture

## High-Level Architecture Diagram

```
                                    CONTENT PIPELINE
                                    ================

  +-----------------+     +-----------------+     +-----------------+
  | Rakuten API     |     | Google Drive     |     | Claude API      |
  | (daily cron)    |     | products.csv    |     | (Haiku 4.5)     |
  | fetch-rakuten   |     | (manual edits)  |     | ai-enrich.mjs   |
  +--------+--------+     +--------+--------+     +--------+--------+
           |                        |                       |
           v                        v                       v
  +------------------+    +------------------+    +------------------+
  | rakuten-          |    | products.csv     |    | Enriched data:   |
  | discoveries.csv  |    | (source of truth)|    | scores, pros,    |
  | (staging area)   |--->| on Google Drive   |<---| cons, reviews    |
  +------------------+    +--------+---------+    +------------------+
                                   |
                                   v
                          +------------------+
                          | sync-products    |
                          | .mjs             |
                          | - CSV -> JSON    |
                          | - image download |
                          +--------+---------+
                                   |
                    +--------------+---------------+
                    |                              |
                    v                              v
  +----------------------------+    +----------------------------+
  | src/content/products/      |    | public/images/products/    |
  | *.json (116 files)         |    | *.webp / *.jpg             |
  | Astro Content Collections  |    | Local image assets         |
  +----------------------------+    +----------------------------+
                    |                              |
                    +------+-----------------------+
                           |
                           v
              +----------------------------+
              | ASTRO 6 SSG BUILD          |
              |                            |
              | astro build                |
              | - Content Collections      |
              | - Tailwind CSS 4           |
              | - MDX comparisons          |
              | - i18n routing (/en/, /ja/)|
              | - Pagefind indexing         |
              | - Image optimization       |
              +-------------+--------------+
                            |
                            v
              +----------------------------+
              | dist/                      |
              | Static HTML + CSS + JS     |
              | Optimized images           |
              | Pagefind search index      |
              +-------------+--------------+
                            |
                            v
              +----------------------------+
              | CLOUDFLARE PAGES           |
              |                            |
              | - Global CDN (Tokyo edge)  |
              | - Automatic SSL            |
              | - HTTP/3 + Brotli          |
              | - Custom headers (CSP)     |
              | - chartedly.com            |
              +----------------------------+
                            |
              +----------------------------+
              | MONITORING                 |
              | - Cloudflare Analytics     |
              | - Google Analytics (GA4)   |
              | - GitHub Actions logs      |
              +----------------------------+


              INTERACTIVE ISLANDS (React/Preact)
              ==================================

  +------------------+  +------------------+  +------------------+
  | SearchOverlay    |  | RadarChart       |  | ComparisonTable  |
  | (Pagefind +      |  | (canvas/SVG)     |  | (sort, filter)   |
  | autocomplete)    |  |                  |  |                  |
  +------------------+  +------------------+  +------------------+
  | HeroCarousel     |  | ImageGallery     |  | LanguageToggle   |
  | (product slider) |  | (lightbox)       |  | (en <-> ja)      |
  +------------------+  +------------------+  +------------------+

  All interactive components hydrate via Astro Islands (client:visible
  or client:idle). Static HTML ships first; JS loads only when needed.
```

## Why Astro Stays

### The case is straightforward:

1. **Content-heavy, read-heavy site.** 116 products, comparison articles, category pages. Visitors read; they do not create. SSG is the optimal rendering strategy.

2. **Performance ceiling.** Astro ships zero JS by default. Every kilobyte of client JS is opt-in via islands. A Next.js or Remix build would ship a React runtime (~40-80KB gzipped) on every page whether it needs interactivity or not.

3. **Existing investment.** Content Collections schema, 16 components, 9 pipeline scripts, i18n system, and Tailwind theme are all built on Astro 6. Migration cost for zero architectural gain.

4. **Islands architecture matches requirements.** The wireframes (Phase 04) call for specific interactive widgets — search overlay, radar charts, comparison table sorting, image gallery. These are isolated interactive zones, not full-page app state. Islands model is purpose-built for this.

5. **Build speed.** Astro builds ~100 static pages in under 10 seconds. Content changes deploy in under 60 seconds via Cloudflare Pages.

6. **Japan edge performance.** SSG + Cloudflare CDN = sub-100ms TTFB from Tokyo edge. No server-side rendering latency. No cold starts.

### What Astro does NOT do well (and mitigations):

| Limitation | Mitigation |
|---|---|
| No server runtime for dynamic features | Not needed. All data is pre-built. Search is client-side via Pagefind. |
| No built-in auth/user accounts | Not in roadmap. If needed later, add Cloudflare Functions. |
| Smaller ecosystem than Next.js | Adequate for content site. Sharp, Pagefind, MDX all have first-class Astro support. |

## Data Flow Summary

```
Rakuten API -> discoveries.csv -> [human review] -> products.csv -> sync-products.mjs -> JSON files -> Astro build -> CDN
                                                          ^
                                                          |
                                                   ai-enrich.mjs
                                                   (Claude Haiku)
```

The human stays in the loop. AI enrichment generates drafts; the founder reviews via CSV before sync. This is deliberate — editorial quality matters more than full automation at 116 products.
