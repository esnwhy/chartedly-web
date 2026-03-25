# Chartedly — Security Plan

## Threat Model

Chartedly is a **static content site** with no user accounts, no forms, no database, and no server-side code. This dramatically reduces the attack surface compared to a typical web application.

| Threat | Applicability | Risk Level |
|---|---|---|
| SQL Injection | N/A — no database | None |
| XSS (Stored) | N/A — no user input stored | None |
| XSS (Reflected) | Low — search input is client-side only | Low |
| CSRF | N/A — no forms, no state changes | None |
| Authentication bypass | N/A — no auth | None |
| Data exposure | API keys in scripts (Rakuten, Anthropic) | Medium |
| Supply chain attack | npm dependencies | Medium |
| Affiliate link manipulation | Tampered URLs | Medium |
| CDN/DNS hijacking | Domain takeover | Low |
| DDoS | Service availability | Low (Cloudflare mitigates) |

## OWASP Top 10 — Addressed

### A01: Broken Access Control
**Not applicable.** No user accounts, no roles, no permissions. The site is fully public, read-only static HTML.

### A02: Cryptographic Failures
**Mitigated.**
- HTTPS enforced via Cloudflare (automatic SSL, HSTS).
- No sensitive data transmitted (no forms, no login).
- API keys are never shipped to the client — used only in build scripts and GitHub Actions secrets.

### A03: Injection
**Not applicable.** No server-side processing of user input. No database queries. Search is client-side via Pagefind (operates on a static index, no eval/innerHTML from user input).

**Mitigation for search input:**
```javascript
// Sanitize search input before display
function sanitize(input) {
  return input.replace(/[<>"'&]/g, '');
}
```

### A04: Insecure Design
**Mitigated.** Architecture is SSG — the attack surface is a flat file CDN. No server logic to exploit.

### A05: Security Misconfiguration
**Addressed via headers and configuration:**

#### Content Security Policy (CSP)

```
// public/_headers (Cloudflare Pages)
/*
  Content-Security-Policy: default-src 'self'; script-src 'self' https://www.googletagmanager.com https://pagefind.app 'unsafe-inline'; style-src 'self' https://fonts.googleapis.com 'unsafe-inline'; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https://m.media-amazon.com https://thumbnail.image.rakuten.co.jp https://picsum.photos; connect-src 'self' https://www.google-analytics.com; frame-ancestors 'none'; base-uri 'self'; form-action 'none'
  X-Frame-Options: DENY
  X-Content-Type-Options: nosniff
  Referrer-Policy: strict-origin-when-cross-origin
  Permissions-Policy: camera=(), microphone=(), geolocation=(), payment=()
  Strict-Transport-Security: max-age=31536000; includeSubDomains; preload
  X-XSS-Protection: 0
```

**Notes:**
- `script-src 'unsafe-inline'` is needed for Astro's island hydration scripts. Can be tightened with nonce-based CSP if Astro adds support.
- `img-src` allows Amazon and Rakuten image domains for fallback external images.
- `form-action 'none'` — no forms on the site.
- `frame-ancestors 'none'` — prevent clickjacking.

### A06: Vulnerable and Outdated Components
**Mitigated.**
- Run `npm audit` in CI pipeline (see cicd-spec.md).
- Dependabot or Renovate for automated dependency updates.
- Minimal dependency tree: Astro, Tailwind, MDX, Lucide icons. No large framework runtime.

```yaml
# .github/dependabot.yml
version: 2
updates:
  - package-ecosystem: "npm"
    directory: "/"
    schedule:
      interval: "weekly"
    open-pull-requests-limit: 5
```

### A07: Identification and Authentication Failures
**Not applicable.** No authentication system.

### A08: Software and Data Integrity Failures
**Mitigated.**
- `package-lock.json` committed — deterministic installs.
- GitHub Actions uses pinned action versions (SHA, not `@latest`).
- Cloudflare Pages builds from git — no manual file uploads.
- Subresource Integrity (SRI) for external scripts if any are added.

### A09: Security Logging and Monitoring Failures
**Partially applicable.**
- Cloudflare provides request logs and security event logs.
- GitHub Actions logs all build and deployment activity.
- No application-level logging needed (static site).

### A10: Server-Side Request Forgery (SSRF)
**Not applicable.** No server-side code that accepts URLs from users.

## API Key Management

### Keys Used

| Key | Used In | Risk if Exposed |
|---|---|---|
| RAKUTEN_APP_ID | `fetch-rakuten.mjs` | Low — public API, rate limited |
| RAKUTEN_ACCESS_KEY | `fetch-rakuten.mjs` | Medium — could be used to impersonate |
| RAKUTEN_AFFILIATE_ID | `fetch-rakuten.mjs` | Low — affiliate commission theft unlikely |
| ANTHROPIC_API_KEY | `ai-enrich.mjs` | High — direct billing impact |

### Current State (needs fixing)

The Rakuten keys are currently **hardcoded in `fetch-rakuten.mjs`** (lines 27-29). This must be fixed before the repo goes public.

### Required Actions

1. **Remove hardcoded keys from source code:**
```javascript
// BEFORE (insecure)
const RAKUTEN_APP_ID = process.env.RAKUTEN_APP_ID || 'c6fa6ed2-...';

// AFTER (secure)
const RAKUTEN_APP_ID = process.env.RAKUTEN_APP_ID;
if (!RAKUTEN_APP_ID) {
  console.error('RAKUTEN_APP_ID not set. Add to .env file.');
  process.exit(1);
}
```

2. **Add `.env` file (local development):**
```env
# .env (NEVER commit this file)
RAKUTEN_APP_ID=c6fa6ed2-...
RAKUTEN_ACCESS_KEY=pk_HlDOZRpiz5L7...
RAKUTEN_AFFILIATE_ID=520a0491...
ANTHROPIC_API_KEY=sk-ant-...
```

3. **Ensure `.env` is in `.gitignore`:**
```
# .gitignore
.env
.env.local
.env.*.local
```

4. **Add to GitHub Actions secrets:**
   - `RAKUTEN_APP_ID`
   - `RAKUTEN_ACCESS_KEY`
   - `RAKUTEN_AFFILIATE_ID`
   - `ANTHROPIC_API_KEY`

5. **Rotate the exposed Rakuten keys** once removed from source. The current keys in `fetch-rakuten.mjs` should be considered compromised.

## Affiliate Link Validation

Affiliate links are the revenue mechanism. Tampered or broken links mean lost income.

### Validation Script (`scripts/validate-affiliates.mjs`)

```javascript
/**
 * Validate all affiliate URLs in product JSON files.
 * - Check URL format
 * - Verify affiliate ID is present
 * - Test HTTP response (HEAD request)
 * - Flag broken or suspicious links
 */

// Expected affiliate IDs
const EXPECTED_IDS = {
  rakuten: '520a0491.97d8289b.520a0492.f21fca06',
  amazon: 'chartedly-22',
};

// Validation rules:
// 1. Rakuten URLs must contain the affiliate ID
// 2. Amazon URLs must contain the associate tag
// 3. All URLs must return 200 or 301 (not 404)
// 4. No URLs should redirect to unexpected domains
```

Run monthly in CI pipeline.

## Dependency Audit

### CI Integration

```yaml
# In GitHub Actions workflow
- name: Security audit
  run: npm audit --audit-level=high
  continue-on-error: false  # Fail build on high/critical vulnerabilities
```

### Current Dependencies (as of 2026-03-24)

| Package | Version | Risk Notes |
|---|---|---|
| astro | ^6.0.4 | Core framework, well-maintained |
| @astrojs/mdx | ^5.0.0 | Astro official, low risk |
| tailwindcss | ^4.2.1 | CSS only, no runtime |
| @tailwindcss/vite | ^4.2.1 | Build only |
| lucide-astro | ^0.556.0 | SVG icons, no runtime |

This is a minimal dependency tree. No heavy runtime libraries. Attack surface is small.
