# Chartedly — Observability Plan

## Observability Layers

```
┌────────────────────────────────────────────────────┐
│ Layer 1: User-Facing Performance                   │
│ - Core Web Vitals (Cloudflare Web Analytics)       │
│ - Page load metrics (GA4)                          │
│ - Lighthouse CI (per deploy)                       │
├────────────────────────────────────────────────────┤
│ Layer 2: Build & Deploy Health                     │
│ - GitHub Actions logs                              │
│ - Build time tracking                              │
│ - Deploy success/failure                           │
├────────────────────────────────────────────────────┤
│ Layer 3: Data Pipeline Health                      │
│ - Rakuten API fetch success                        │
│ - AI enrichment completion                         │
│ - Product count tracking                           │
│ - Image download success rate                      │
├────────────────────────────────────────────────────┤
│ Layer 4: Content & Revenue Health                  │
│ - Affiliate link validation                        │
│ - Stale product detection                          │
│ - Search query tracking                            │
│ - 404 error monitoring                             │
└────────────────────────────────────────────────────┘
```

## Layer 1: User-Facing Performance

### Cloudflare Web Analytics (primary)
- **Cost:** Free with Cloudflare Pages.
- **Setup:** Enable in Cloudflare Dashboard > Web Analytics.
- **Metrics:** Core Web Vitals (LCP, CLS, INP), page views, visitors, top pages, countries.
- **Advantage:** Cookie-free, no consent banner required, privacy-compliant.

### Google Analytics 4 (supplementary)
- **Cost:** Free.
- **Setup:** Add GA4 measurement ID to site.
- **Tracking events:**

```javascript
// Custom events to track
gtag('event', 'affiliate_click', {
  product_slug: 'anessa-perfect-uv-milk',
  retailer: 'rakuten',
  category: 'Beauty',
});

gtag('event', 'search', {
  search_term: query,
  results_count: results.length,
});

gtag('event', 'comparison_view', {
  comparison_slug: 'best-sunscreen-japan-2026',
  products_compared: 8,
});

gtag('event', 'language_switch', {
  from_lang: 'en',
  to_lang: 'ja',
});
```

### Lighthouse CI (per deploy)
- **Where:** GitHub Actions (see cicd-spec.md).
- **Frequency:** Every push to `main`.
- **Alerts:** Build fails if performance score < 90 or LCP > 2.5s.

## Layer 2: Build & Deploy Health

### GitHub Actions Monitoring

All pipeline runs are logged in GitHub Actions. Key metrics to track:

| Metric | Where | Alert Threshold |
|---|---|---|
| Build time | GitHub Actions log | > 120s (warn), > 300s (error) |
| Build success rate | GitHub Actions history | < 95% over 7 days |
| Deploy time | Cloudflare Pages dashboard | > 180s |
| npm audit findings | CI pipeline step | Any high/critical |

### Build Output Tracking

Add to CI pipeline:

```yaml
- name: Track build metrics
  run: |
    echo "## Build Metrics" >> $GITHUB_STEP_SUMMARY
    echo "| Metric | Value |" >> $GITHUB_STEP_SUMMARY
    echo "|---|---|" >> $GITHUB_STEP_SUMMARY
    echo "| Total HTML pages | $(find dist -name '*.html' | wc -l) |" >> $GITHUB_STEP_SUMMARY
    echo "| Total JS size | $(find dist -name '*.js' -exec cat {} + | wc -c | numfmt --to=iec) |" >> $GITHUB_STEP_SUMMARY
    echo "| Total CSS size | $(find dist -name '*.css' -exec cat {} + | wc -c | numfmt --to=iec) |" >> $GITHUB_STEP_SUMMARY
    echo "| Product count | $(find dist/en/product -name '*.html' | wc -l) |" >> $GITHUB_STEP_SUMMARY
    echo "| Build dir size | $(du -sh dist/ | cut -f1) |" >> $GITHUB_STEP_SUMMARY
```

This writes a summary table to the GitHub Actions run page.

## Layer 3: Data Pipeline Health

### Pipeline Health Script (`scripts/pipeline-health.mjs`)

```javascript
/**
 * Check data pipeline health and output a report.
 * Run after each pipeline execution.
 *
 * Checks:
 * 1. Product count (expected growth, not sudden drops)
 * 2. Recent discoveries count
 * 3. Enrichment coverage (% of products with scores, reviews)
 * 4. Image coverage (% of products with local images)
 * 5. Bilingual coverage (% of products with both EN + JA content)
 * 6. Last API fetch date (staleness check)
 */

// Output format: GitHub Actions step summary + exit code
```

### Metrics to Track

| Metric | Data Source | Expected | Alert If |
|---|---|---|---|
| Total products | `src/content/products/*.json` count | Growing | Drops by > 5 |
| Products with images | JSON files with `image` starting with `/images/` | > 90% | < 80% |
| Products with radar scores | JSON files with `radar` object | > 95% | < 85% |
| Products with reviews | JSON files with non-empty `review` | > 90% | < 80% |
| Bilingual coverage | JSON files with `name_ja` field | Growing | Stops growing |
| Discoveries this week | `rakuten-discoveries.csv` entries in last 7 days | > 0 | = 0 for 7+ days |
| Last enrichment | `enrich-progress.json` timestamp | < 14 days ago | > 14 days ago |
| Failed image downloads | Sync log output | < 10% | > 20% |

### Automated Alerting

GitHub Actions can create issues automatically on failure:

```yaml
- name: Create issue on pipeline failure
  if: failure()
  uses: actions/github-script@v7
  with:
    script: |
      await github.rest.issues.create({
        owner: context.repo.owner,
        repo: context.repo.repo,
        title: `Pipeline failure: ${context.workflow} - ${new Date().toISOString().split('T')[0]}`,
        body: `The ${context.workflow} workflow failed.\n\nRun: ${context.serverUrl}/${context.repo.owner}/${context.repo.repo}/actions/runs/${context.runId}`,
        labels: ['pipeline', 'bug']
      });
```

## Layer 4: Content & Revenue Health

### Affiliate Link Verification

Monthly automated check (see automation-pipeline.md):

```
For each product:
  1. Extract all retailer URLs (amazon, rakuten, yahoo)
  2. HEAD request to each URL
  3. Verify:
     - HTTP 200 or 301 (not 404, 500)
     - Affiliate ID present in URL
     - Redirect stays on expected domain
  4. Report broken/suspicious links
```

**Report format:**
```
AFFILIATE LINK REPORT — 2026-03-24
===================================
Total products checked: 116
Total links checked: 182

OK:     170 (93.4%)
Broken:   8 (4.4%)
Suspect:  4 (2.2%)

BROKEN:
  - product-slug-1: rakuten URL returns 404
  - product-slug-2: amazon URL returns 503

SUSPECT:
  - product-slug-3: rakuten URL missing affiliate ID
  - product-slug-4: redirect to unexpected domain
```

### Stale Product Detection

Products older than 90 days without updates, or missing from recent Rakuten rankings for 3+ months:

```javascript
// Stale detection criteria
const STALE_THRESHOLD_DAYS = 90;
const isStale = (product) => {
  const lastUpdate = product.dateUpdated || product.dateAdded;
  const daysSince = (Date.now() - new Date(lastUpdate)) / (1000 * 60 * 60 * 24);
  return daysSince > STALE_THRESHOLD_DAYS;
};
```

### Search Query Tracking

Track what users search for to inform content strategy:

```javascript
// In SearchOverlay component
function trackSearch(query, resultsCount) {
  if (typeof gtag === 'function') {
    gtag('event', 'search', {
      search_term: query,
      results_count: resultsCount,
    });
  }
}

// Track searches with zero results separately
function trackZeroResults(query) {
  if (typeof gtag === 'function') {
    gtag('event', 'search_zero_results', {
      search_term: query,
    });
  }
}
```

Zero-result searches are the most valuable signal — they tell you what content to create next.

### 404 Error Monitoring

Cloudflare Analytics shows 404 responses. Additionally, the custom 404 page can report:

```javascript
// In 404.astro
if (typeof gtag === 'function') {
  gtag('event', 'page_not_found', {
    page_path: window.location.pathname,
    referrer: document.referrer,
  });
}
```

## Dashboard (Manual Review)

No paid monitoring tool needed at launch. Monthly manual review of:

1. **Cloudflare Dashboard** — Traffic, performance, security events
2. **GA4 Dashboard** — User behavior, search queries, affiliate clicks
3. **GitHub Actions** — Pipeline success rates, build times
4. **Google Search Console** — Indexing, search impressions, crawl errors

Create a recurring monthly task: "Review Chartedly metrics" with checklist of the above four dashboards.

## Escalation Path

```
Automated check fails
       |
       v
GitHub Issue created automatically
       |
       v
Founder reviews issue
       |
       ├── Data issue (stale, broken links) -> Fix in CSV, re-sync
       ├── Build issue (npm audit, build fail) -> Fix code, push
       ├── Performance issue (Lighthouse fail) -> Investigate, optimize
       └── API issue (Rakuten/Claude down) -> Wait, retry next scheduled run
```
