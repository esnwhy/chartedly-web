# ADR-006: Cloudflare Pages for Hosting

## Status
**Accepted** — 2026-03-24

## Context
Chartedly is a static site targeting users in Japan (expats, tourists). Hosting must be fast in Japan, cheap at launch, and scalable without architecture changes.

## Decision
Deploy on Cloudflare Pages with custom domain `chartedly.com`.

## Alternatives Considered

### Vercel
- **Pros:** Excellent Astro support, automatic preview deployments, Web Analytics, generous free tier (100GB bandwidth).
- **Cons:** Edge network performance in Japan is good but Cloudflare's is better (more Tokyo PoPs). Free tier limits: 100 deployments/day, 1 concurrent build. Serverless functions (if needed later) are more expensive than Cloudflare Workers. Bandwidth overage: $40/100GB on Pro.
- **Verdict:** Strong alternative. Would choose if Cloudflare Pages had a dealbreaker.

### Netlify
- **Pros:** Mature platform, Astro adapter, form handling.
- **Cons:** Japan CDN performance historically worse than Cloudflare. Bandwidth: 100GB/mo free, $55/100GB after. Build minutes: 300/mo free. Pricing less favorable at scale.
- **Verdict:** Rejected. No advantage over Cloudflare or Vercel for this use case.

### Self-hosted VPS (already have 76.13.223.243)
- **Pros:** Full control, existing server, no bandwidth limits.
- **Cons:** Single point of failure. No CDN (slow for users outside the VPS region). Must manage nginx, SSL certs, deployments, DDoS protection. The VPS is already running OwlStreet Terminal and XC Intelligence Hub — adding a public-facing content site increases attack surface and resource contention.
- **Verdict:** Rejected. CDN-hosted static is the correct architecture for a content site.

### Cloudflare Pages (chosen)
- **Pros:**
  - **Free tier is absurd:** Unlimited bandwidth, 500 builds/month, 1 concurrent build. No bandwidth overage charges ever.
  - **Japan edge performance:** Cloudflare operates 3+ data centers in Japan (Tokyo, Osaka). Sub-50ms TTFB for Japanese users.
  - **Global edge:** 300+ PoPs worldwide. Fast for expat visitors anywhere.
  - **Git integration:** Auto-deploy on push to `main`. Preview URLs for PRs.
  - **Custom headers:** `_headers` file for CSP, cache control, security headers.
  - **Cloudflare Functions:** If server-side logic is ever needed, deploy alongside Pages at no additional cost (100,000 requests/day free).
  - **DDoS protection:** Included. No extra config.
  - **HTTP/3 + Brotli:** Enabled by default.
  - **Web Analytics:** Privacy-focused, no cookie banner needed, included free.
- **Cons:**
  - Build environment is less configurable than Vercel (e.g., no monorepo caching).
  - 25MB max file size (not an issue for optimized images).
  - 20,000 files max per deployment (well within budget at 116 products).

## Configuration

### Cloudflare Pages Setup

```
Project name: chartedly-web
Production branch: main
Build command: npm run build
Build output directory: dist
Node.js version: 22
```

### Custom Domain
```
chartedly.com -> Cloudflare Pages
www.chartedly.com -> 301 redirect to chartedly.com
```

### Environment Variables
```
# Set in Cloudflare Pages dashboard (not in code)
NODE_VERSION=22
```

No API keys needed at build time — content is pre-built from local JSON files.

## Cost Projection

| Scale | Monthly Cost |
|---|---|
| Launch (1K visits/mo) | $0 |
| Growth (10K visits/mo) | $0 |
| Scale (100K visits/mo) | $0 |
| Enterprise (1M visits/mo) | $0 (still free tier) |

Cloudflare Pages has no bandwidth charges. The only cost trigger would be Cloudflare Functions exceeding 100,000 requests/day — and Chartedly does not use Functions.

## Consequences
- Deployment is `git push` to `main`. No manual steps.
- Preview deployments for every PR branch.
- DNS must be managed through Cloudflare (nameservers pointed to Cloudflare).
- SSL is automatic and free.
- If the site needs server-side functionality later (e.g., API proxy for affiliate link tracking), Cloudflare Functions are available at the same URL with no migration.
