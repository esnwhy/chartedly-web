# Chartedly — Infrastructure Specification

## Hosting: Cloudflare Pages

### Setup

1. **Connect GitHub repository:**
   - Go to Cloudflare Dashboard > Pages > Create a project
   - Connect `chartedly-web` GitHub repository
   - Production branch: `main`
   - Preview branches: all other branches

2. **Build configuration:**
   ```
   Framework preset: Astro
   Build command: npm run build
   Build output directory: dist
   Root directory: /
   Node.js version: 22
   ```

3. **Environment variables (Cloudflare Dashboard > Settings > Environment Variables):**
   ```
   NODE_VERSION = 22
   ```
   No API keys needed at build time — content is pre-built JSON.

### Custom Domain Setup

1. **Transfer DNS to Cloudflare** (or add site to Cloudflare):
   - Add `chartedly.com` to Cloudflare account
   - Update domain registrar nameservers to Cloudflare's

2. **DNS records:**
   ```
   Type    Name    Content                     Proxy
   CNAME   @       chartedly-web.pages.dev     Proxied
   CNAME   www     chartedly-web.pages.dev     Proxied
   ```

3. **Redirect www to apex:**
   - Cloudflare Dashboard > Rules > Redirect Rules
   - `www.chartedly.com/*` -> `https://chartedly.com/$1` (301 Permanent)

4. **SSL/TLS:**
   - Mode: Full (strict)
   - Minimum TLS version: 1.2
   - Always Use HTTPS: On
   - HSTS: On (max-age=31536000, includeSubDomains, preload)
   - Automatic HTTPS Rewrites: On

### CDN Configuration

Cloudflare's CDN is automatic for Pages deployments. Custom configuration via `_headers` and `_redirects` files.

#### Headers (`public/_headers`)

```
/*
  X-Frame-Options: DENY
  X-Content-Type-Options: nosniff
  Referrer-Policy: strict-origin-when-cross-origin
  Permissions-Policy: camera=(), microphone=(), geolocation=(), payment=()
  Strict-Transport-Security: max-age=31536000; includeSubDomains; preload
  Content-Security-Policy: default-src 'self'; script-src 'self' https://www.googletagmanager.com 'unsafe-inline'; style-src 'self' https://fonts.googleapis.com 'unsafe-inline'; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https://m.media-amazon.com https://thumbnail.image.rakuten.co.jp; connect-src 'self' https://www.google-analytics.com; frame-ancestors 'none'; base-uri 'self'; form-action 'none'

/assets/*
  Cache-Control: public, max-age=31536000, immutable

/images/*
  Cache-Control: public, max-age=2592000

/pagefind/*
  Cache-Control: public, max-age=3600

/*.html
  Cache-Control: public, max-age=0, must-revalidate
```

#### Redirects (`public/_redirects`)

```
# Language redirect: root to English
/ /en/ 302

# Legacy URL redirects (add as needed)
/product/* /en/product/:splat 301
/category/* /en/category/:splat 301
```

### Cloudflare Features to Enable

| Feature | Setting | Notes |
|---|---|---|
| Auto Minify | HTML, CSS, JS: On | Additional minification on top of Astro's |
| Brotli | On (default) | Better compression than gzip |
| HTTP/3 | On (default) | QUIC protocol for faster connections |
| Early Hints | On | Preload resources before HTML arrives |
| Rocket Loader | Off | Conflicts with Astro's island hydration |
| Web Analytics | On | Privacy-focused, cookie-free |
| Bot Fight Mode | On | Block known malicious bots |
| Browser Integrity Check | On | Block requests with suspicious headers |

### Cloudflare Features to Leave Off

| Feature | Reason |
|---|---|
| Rocket Loader | Breaks Astro island hydration by deferring inline scripts |
| Mirage | Designed for slow connections; Astro Image handles responsive images better |
| Polish | Redundant — images are pre-optimized at build time |
| Argo Smart Routing | Paid feature, unnecessary for static content |

## Cost Estimates

### Launch (Month 1-3)

| Item | Monthly Cost |
|---|---|
| Cloudflare Pages (Free plan) | $0 |
| Domain (chartedly.com) | ~$1/mo ($12/yr) |
| Google Fonts | $0 |
| GitHub (Free plan) | $0 |
| GitHub Actions (500 min/mo free) | $0 |
| Claude API (Haiku enrichment) | ~$2/mo |
| **Total** | **~$3/mo** |

### Growth (10x: ~10K visits/mo, ~500 products)

| Item | Monthly Cost |
|---|---|
| Cloudflare Pages (still Free) | $0 |
| Domain | ~$1/mo |
| GitHub Actions (may need more minutes) | $0-4/mo |
| Claude API (more products to enrich) | ~$5/mo |
| Algolia (if migrated from Pagefind) | $0 (free tier) |
| **Total** | **~$6-10/mo** |

### Scale (100x: ~100K visits/mo, ~2000 products)

| Item | Monthly Cost |
|---|---|
| Cloudflare Pages (still Free) | $0 |
| Cloudflare Pro (optional, for WAF rules) | $20/mo |
| Domain | ~$1/mo |
| GitHub Team (if needed for more Actions minutes) | $4/mo |
| Claude API (weekly enrichment of new products) | ~$15/mo |
| Algolia (paid plan if search volume grows) | $0-29/mo |
| **Total** | **~$40-69/mo** |

### Why Costs Stay Low

1. **Static site = no compute costs.** Cloudflare serves flat files from CDN. No serverless functions, no database, no backend.
2. **Cloudflare Pages has no bandwidth charges.** Even at 1M requests/month, cost is $0.
3. **AI enrichment is batch, not real-time.** Weekly batch of 20 products via Haiku costs pennies.
4. **No third-party SaaS dependencies** at launch. Everything is open source or free tier.

## DNS Configuration

```
# Required DNS records
chartedly.com.          CNAME   chartedly-web.pages.dev.    (Proxied)
www.chartedly.com.      CNAME   chartedly-web.pages.dev.    (Proxied)

# Email (if needed, using Cloudflare Email Routing)
chartedly.com.          MX      route1.mx.cloudflare.net.   (Priority 69)
chartedly.com.          MX      route2.mx.cloudflare.net.   (Priority 21)
chartedly.com.          TXT     "v=spf1 include:_spf.mx.cloudflare.net ~all"

# Optional: Google Search Console verification
chartedly.com.          TXT     "google-site-verification=XXXX"
```

## Deployment Architecture

```
Developer Machine                GitHub                    Cloudflare Pages
==================              ========                  ================

[Local development]
  astro dev
       |
       v
[git push main]  ──────────>  [GitHub repo]
                                    |
                                    ├── [GitHub Actions]
                                    |    - npm ci
                                    |    - npm audit
                                    |    - npm run build
                                    |    - Lighthouse CI
                                    |
                                    v
                              [Cloudflare webhook]
                                    |
                                    v
                              [Cloudflare Build]
                                    |    - npm ci
                                    |    - npm run build
                                    |    - Deploy to CDN
                                    |
                                    v
                              [Production: chartedly.com]
                              [Preview: <hash>.chartedly-web.pages.dev]
```

Build triggers:
- **Push to `main`** -> Production deployment
- **Push to any branch** -> Preview deployment
- **GitHub Actions data refresh** -> Commits to `main` -> Production deployment
