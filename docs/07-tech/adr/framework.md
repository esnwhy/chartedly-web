# ADR-001: Keep Astro 6 as Application Framework

## Status
**Accepted** — 2026-03-24

## Context
Chartedly is a product ranking and comparison website for life in Japan. It currently runs on Astro 6 with 116 products, 16 components, 9 pipeline scripts, and bilingual i18n. The question is whether to keep Astro or migrate to Next.js or Remix for Phase 07 implementation.

## Decision
Keep Astro 6. No framework migration.

## Alternatives Considered

### Next.js 15 (App Router)
- **Pros:** Largest ecosystem, Vercel-optimized deployment, server components, built-in image optimization, massive community.
- **Cons:** Ships React runtime on every page (~44KB gzipped min). Server components add complexity for a static content site. `use client` / `use server` boundary management is overhead for a solo founder. ISR/SSG in Next.js is an afterthought compared to Astro's SSG-first design. Migration cost: rewrite all 16 `.astro` components to React, restructure routing, rebuild content layer.
- **Verdict:** Overkill. Chartedly has no server-side dynamic requirements. Next.js optimizes for a problem space (full-stack React apps) that does not apply here.

### Remix (React Router v7)
- **Pros:** Excellent data loading patterns, progressive enhancement, nested routes.
- **Cons:** Server-required architecture. Remix's strength is server-side data loading and mutations — Chartedly has neither. Would require a server runtime (Cloudflare Workers or Node), adding cost and complexity. Same React runtime overhead as Next.js. No content collections equivalent.
- **Verdict:** Wrong tool. Remix is for interactive web applications, not content sites.

### Astro 6 (current)
- **Pros:**
  - Zero JS by default. Only interactive islands ship client JS.
  - Content Collections with Zod schema validation — already configured with 116 products.
  - First-class MDX for comparison articles.
  - Tailwind CSS 4 via Vite plugin — already configured.
  - Islands architecture: search, charts, and galleries hydrate independently.
  - Build speed: full site in <10s.
  - Cloudflare Pages deployment with no server runtime needed.
  - Existing codebase: 16 components, i18n system, 9 scripts — all Astro-native.
- **Cons:**
  - Smaller ecosystem than Next.js.
  - If dynamic server features are needed later (auth, user accounts, real-time data), Astro requires middleware or Cloudflare Functions.
  - Island framework choice (React/Preact/Svelte) requires a secondary decision.

## Rationale
The site is content-heavy and read-only. Visitors browse products, compare options, and click affiliate links. There are no forms, no user accounts, no real-time features. SSG is the optimal strategy, and Astro is the best SSG framework available in 2026.

Migration would cost 2-4 weeks of solo founder time for zero user-facing benefit. The existing Astro codebase is well-structured and functional.

## Consequences
- Interactive components (search, charts, comparison tool) will use Astro Islands with Preact (see separate ADR if island framework decision is needed).
- Server-side features, if ever needed, will use Cloudflare Functions alongside Pages, not a framework migration.
- The content pipeline (CSV -> JSON -> Astro Content Collections) remains unchanged.
