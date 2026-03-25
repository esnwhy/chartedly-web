# ADR-003: Astro Content Collections + JSON (No Headless CMS)

## Status
**Accepted** — 2026-03-24

## Context
Chartedly manages 116 products and comparison articles. Content is authored by a solo technical founder via Google Drive CSV and enriched by Claude API. The question is whether a headless CMS (Sanity, Contentful, Strapi) would improve the workflow.

## Decision
Keep Astro Content Collections with JSON files for products and MDX for comparisons. No headless CMS.

## Alternatives Considered

### Sanity.io
- **Pros:** Real-time preview, structured content, GROQ query language, generous free tier, good Astro integration.
- **Cons:** Adds a runtime dependency — build fetches from Sanity API, adding latency and a failure point. Schema defined in Sanity Studio, duplicating the Zod schema already in `content.config.ts`. Overkill for a single editor. Monthly cost at scale ($99+/mo for team plan). Vendor lock-in on content.
- **Verdict:** Rejected. Solves a multi-editor problem that does not exist.

### Contentful
- **Pros:** Enterprise-grade, CDN-backed API, webhooks.
- **Cons:** Expensive ($300+/mo beyond free tier). 25,000 record limit on free tier is fine now but constraining at scale. Same "adds a dependency for one person" problem.
- **Verdict:** Rejected. Cost and complexity mismatch.

### Strapi (self-hosted)
- **Pros:** Open source, full control, REST/GraphQL API.
- **Cons:** Requires hosting and maintaining a Node.js server + database. A VPS, backups, security patches — all for one person editing a CSV. Dramatic increase in operational burden.
- **Verdict:** Rejected. Operational overhead is disqualifying for a solo founder.

### Current: Astro Content Collections + JSON
- **Pros:**
  - Content is files in git. Full version history, no vendor dependency.
  - Zod schema validation catches errors at build time — typos, missing fields, invalid scores all fail the build.
  - Google Drive CSV is the editing interface. The founder already knows it. Zero learning curve.
  - `sync-products.mjs` bridges CSV to JSON. One command, deterministic.
  - AI enrichment writes to CSV. No API integration with a CMS needed.
  - MDX for comparisons allows embedded components (charts, tables) in editorial content.
  - Zero cost. Zero external dependency. Zero API calls at build time.
- **Cons:**
  - No visual editor. Editing requires CSV + terminal.
  - No real-time preview (must run `astro dev` locally).
  - If a second editor joins, CSV workflow does not scale.

## Migration Path (if needed later)
If Chartedly grows to need multiple editors:
1. Add Decap CMS (formerly Netlify CMS) — git-based, no backend, mounts on `/admin`.
2. Or migrate to Sanity with `@sanity/astro` — import existing JSON as initial data.

Both migrations are straightforward because the current schema is well-defined in Zod.

## Consequences
- Product data flow remains: `Google Drive CSV -> sync-products.mjs -> src/content/products/*.json -> Astro build`.
- Comparison articles are authored as MDX in `src/content/comparisons/`.
- Schema validation at build time is the quality gate — no invalid data reaches production.
- The founder edits content in Google Sheets (products.csv on Google Drive), which is synced to the local filesystem.
