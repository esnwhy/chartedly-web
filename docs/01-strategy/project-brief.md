# Chartedly -- Project Brief

**Document version:** 1.0
**Date:** 2026-03-24
**Author:** ATLAS (Strategy Consultant)

---

## 1. Vision Statement

Chartedly is a bilingual (English / Japanese) product ranking and comparison platform that delivers clear, trustworthy comparisons for everyday life in Japan. The experience is modeled on the Netflix / Apple TV+ content-browsing paradigm -- horizontal scroll rails, hero cards, mood- and context-based discovery -- applied to physical products instead of movies. Every recommendation is editorially curated and transparently scored, so both Japanese nationals and foreign residents can make confident purchase decisions without reading Japanese-language reviews or navigating fragmented e-commerce ecosystems.

**Tagline:** "Clear comparisons for life in Japan."

---

## 2. Scope

### In-Scope (Phase 1 -- MVP)

| Area | Details |
|------|---------|
| **Content categories** | Daily essentials, kitchen & home, electronics, beauty & personal care, health & wellness, seasonal goods |
| **Audience segments** | Japanese nationals (ages 10--40), foreign residents in Japan (~4.13 million as of end-2025, per Japan Times, Oct 2025), short-term tourists (~42.7 million in 2025, per Nippon.com) |
| **Languages** | English (primary for Phase 1), Japanese (Phase 2) |
| **Platforms** | Responsive web (mobile-first); no native apps |
| **Monetisation** | Affiliate links to Amazon Japan, Rakuten, Yahoo Shopping |
| **Core pages** | Homepage (Netflix-style browse), category pages, product detail/comparison pages, "Best of" curated lists, search |
| **SEO** | Server-rendered pages (Astro SSG/SSR), structured data (JSON-LD Product, ItemList), sitemap |

### Out-of-Scope (Phase 1)

- Native iOS / Android applications
- User-generated reviews or community features
- Direct e-commerce (inventory, checkout, payment processing)
- B2B / enterprise licensing
- Paid subscription tiers
- Video content production
- Physical product testing lab (unlike mybest)
- Markets outside Japan

---

## 3. Success Criteria

| Criterion | Target | Timeframe |
|-----------|--------|-----------|
| Monthly unique visitors | 50,000 | Month 12 |
| Affiliate click-through rate | >= 3% | Month 6 onward |
| Monthly affiliate revenue | JPY 100,000 | Month 12 |
| Product coverage | 500+ products across 6 categories | Month 12 |
| Average session duration | > 3 minutes | Month 6 onward |
| Bounce rate | < 45% | Month 6 onward |
| Google indexed pages | 200+ | Month 6 |

---

## 4. Constraints

### 4.1 Technical Constraint Inventory

| Constraint | Specification |
|------------|---------------|
| **Framework** | Astro (SSG/SSR) with TypeScript |
| **Browser targets** | Last 2 versions of Chrome, Safari, Firefox, Edge; iOS Safari 15+; Samsung Internet |
| **Device targets** | Mobile-first (360px min-width); tablets (768px); desktop (1280px+) |
| **Performance budgets** | LCP < 2.5s, FID < 100ms, CLS < 0.1 (Core Web Vitals "Good" threshold per Google) |
| **Page weight** | < 500 KB initial load (compressed) |
| **i18n requirements** | Phase 1: English UI + product names in romaji/English; Phase 2: full Japanese localisation (ja-JP) with ICU message format |
| **Accessibility** | WCAG 2.1 AA minimum |
| **Hosting** | Static deploy (Cloudflare Pages or Vercel) for low-latency CDN in Asia-Pacific |
| **Image handling** | WebP/AVIF with responsive srcset; lazy loading below the fold |

### 4.2 Business Constraints

- Solo founder operation -- all content, development, and marketing handled by one person
- Zero external funding; bootstrapped with organic growth
- Must comply with Japan's Specified Commercial Transactions Act (特定商取引法) and Act against Unjustifiable Premiums and Misleading Representations (景品表示法)
- Amazon Associates Japan program requires disclosure of affiliate relationship on every page containing affiliate links
- Rakuten Affiliate program requires approval per merchant
- Content must not infringe on manufacturer copyrights (product images sourced via affiliate APIs or Creative Commons)

---

## 5. Assumptions

| # | Assumption | Risk if invalid |
|---|-----------|-----------------|
| A1 | Foreign residents in Japan actively search for product recommendations in English | Core audience does not exist; pivot to Japanese-only |
| A2 | Amazon Japan and Rakuten affiliate APIs provide sufficient product data (images, prices, descriptions) | Manual data entry required; slows content velocity |
| A3 | Affiliate commission rates remain stable (Amazon JP: 2--8%; Rakuten: 3--7%) | Revenue projections become invalid |
| A4 | Google organic search will be the primary traffic driver (>60%) | Must invest heavily in social/paid acquisition |
| A5 | Netflix-style horizontal-scroll UX translates well to product browsing | UX experiments needed; may revert to grid layout |
| A6 | Japan's anti-stealth-marketing regulations (Oct 2023) do not prohibit editorial affiliate content with proper disclosure | Legal review required |
| A7 | A single person can produce 10--15 quality comparison articles per month | Content velocity too low; consider AI-assisted drafting |

---

## 6. Stakeholders

| Role | Person | Responsibility |
|------|--------|----------------|
| Founder / Product Owner | LAIRIA Holdings (solo) | Vision, priorities, final decisions |
| Strategy Consultant | ATLAS | Market research, competitive analysis, KPIs |
| Development | Founder (self) | Full-stack implementation |
| Content | Founder (self) | Product research, article writing, photography |

---

## 7. Timeline (High-Level)

| Phase | Duration | Milestone |
|-------|----------|-----------|
| Phase 0: Strategy & Research | Weeks 1--2 | This document + all Phase 01 deliverables |
| Phase 1: MVP Build | Weeks 3--8 | Core site live with 50 products, 3 categories |
| Phase 2: Content Ramp | Months 3--6 | 200 products, 6 categories, Japanese language support |
| Phase 3: Growth | Months 6--12 | SEO traction, 500 products, affiliate revenue target |

---

*Document prepared by ATLAS. All statistics cited from sources gathered 2026-03-24.*
