# Chartedly — CI/CD Specification

## Pipeline Overview

```
Push to main
     |
     v
GitHub Actions: CI Pipeline
     |
     ├── 1. Install dependencies (npm ci)
     ├── 2. Lint (TypeScript, Astro check)
     ├── 3. Security audit (npm audit)
     ├── 4. Build (astro build + Pagefind)
     ├── 5. Lighthouse CI (performance budget)
     └── 6. Deploy triggers Cloudflare Pages (via webhook)
```

## Workflow Files

### 1. Main CI/CD Pipeline (`.github/workflows/ci.yml`)

```yaml
name: CI

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

concurrency:
  group: ${{ github.workflow }}-${{ github.ref }}
  cancel-in-progress: true

jobs:
  build:
    runs-on: ubuntu-latest
    timeout-minutes: 10

    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Astro check (TypeScript)
        run: npx astro check

      - name: Security audit
        run: npm audit --audit-level=high

      - name: Build
        run: npm run build

      - name: Check build output
        run: |
          echo "Build output size:"
          du -sh dist/
          echo "Page count:"
          find dist -name "*.html" | wc -l
          echo "JS bundle sizes:"
          find dist -name "*.js" -exec du -sh {} \;

      - name: Upload build artifact
        if: github.ref == 'refs/heads/main'
        uses: actions/upload-artifact@v4
        with:
          name: dist
          path: dist/
          retention-days: 7

  lighthouse:
    needs: build
    if: github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest
    timeout-minutes: 5

    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Download build artifact
        uses: actions/download-artifact@v4
        with:
          name: dist
          path: dist/

      - name: Lighthouse CI
        uses: treosh/lighthouse-ci-action@v11
        with:
          uploadArtifacts: true
          configPath: .github/lighthouserc.json
```

### 2. Data Refresh Pipeline (`.github/workflows/data-refresh.yml`)

```yaml
name: Data Refresh

on:
  schedule:
    # Daily at 06:00 JST (21:00 UTC previous day)
    - cron: '0 21 * * *'
  workflow_dispatch:
    inputs:
      task:
        description: 'Task to run'
        required: true
        type: choice
        options:
          - fetch-rankings
          - ai-enrich
          - sync-products
          - full-pipeline

jobs:
  fetch-rankings:
    if: github.event_name == 'schedule' || github.event.inputs.task == 'fetch-rankings' || github.event.inputs.task == 'full-pipeline'
    runs-on: ubuntu-latest
    timeout-minutes: 10

    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 22

      - name: Fetch Rakuten rankings
        env:
          RAKUTEN_APP_ID: ${{ secrets.RAKUTEN_APP_ID }}
          RAKUTEN_ACCESS_KEY: ${{ secrets.RAKUTEN_ACCESS_KEY }}
          RAKUTEN_AFFILIATE_ID: ${{ secrets.RAKUTEN_AFFILIATE_ID }}
        run: node scripts/fetch-rakuten.mjs --all

      - name: Commit discoveries
        run: |
          git config user.name "github-actions[bot]"
          git config user.email "github-actions[bot]@users.noreply.github.com"
          git add -A
          git diff --cached --quiet || git commit -m "chore: daily Rakuten ranking refresh"
          git push

  ai-enrich:
    if: github.event.inputs.task == 'ai-enrich' || github.event.inputs.task == 'full-pipeline'
    needs: [fetch-rankings]
    runs-on: ubuntu-latest
    timeout-minutes: 15

    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 22

      - name: AI enrichment
        env:
          ANTHROPIC_API_KEY: ${{ secrets.ANTHROPIC_API_KEY }}
        run: node scripts/ai-enrich.mjs --limit 20

      - name: Commit enriched data
        run: |
          git config user.name "github-actions[bot]"
          git config user.email "github-actions[bot]@users.noreply.github.com"
          git add -A
          git diff --cached --quiet || git commit -m "chore: AI product enrichment"
          git push

  sync-and-build:
    if: github.event.inputs.task == 'sync-products' || github.event.inputs.task == 'full-pipeline'
    needs: [ai-enrich]
    runs-on: ubuntu-latest
    timeout-minutes: 10

    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 22

      - name: Sync products
        run: node scripts/sync-products.mjs

      - name: Build site
        run: npm run build

      - name: Commit and push
        run: |
          git config user.name "github-actions[bot]"
          git config user.email "github-actions[bot]@users.noreply.github.com"
          git add -A
          git diff --cached --quiet || git commit -m "chore: sync products and rebuild"
          git push
```

### 3. Weekly Enrichment (`.github/workflows/weekly-enrich.yml`)

```yaml
name: Weekly Enrichment

on:
  schedule:
    # Monday at 07:00 JST (22:00 UTC Sunday)
    - cron: '0 22 * * 0'

jobs:
  enrich-and-sync:
    runs-on: ubuntu-latest
    timeout-minutes: 20

    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 22

      - name: Install dependencies
        run: npm ci

      - name: AI enrichment (new products)
        env:
          ANTHROPIC_API_KEY: ${{ secrets.ANTHROPIC_API_KEY }}
        run: node scripts/ai-enrich.mjs --limit 20

      - name: Sync products to JSON
        run: node scripts/sync-products.mjs

      - name: Build to verify
        run: npm run build

      - name: Commit results
        run: |
          git config user.name "github-actions[bot]"
          git config user.email "github-actions[bot]@users.noreply.github.com"
          git add -A
          git diff --cached --quiet || git commit -m "chore: weekly enrichment and sync"
          git push
```

### 4. Monthly Validation (`.github/workflows/monthly-validate.yml`)

```yaml
name: Monthly Validation

on:
  schedule:
    # 1st of month at 06:00 JST (21:00 UTC last day of previous month)
    - cron: '0 21 1 * *'
  workflow_dispatch:

jobs:
  validate:
    runs-on: ubuntu-latest
    timeout-minutes: 15

    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 22

      - name: Install dependencies
        run: npm ci

      - name: Validate product data
        run: node scripts/validate-products.mjs

      - name: Validate affiliate links
        run: node scripts/validate-affiliates.mjs

      - name: Build verification
        run: npm run build

      - name: Report
        if: failure()
        run: echo "::error::Monthly validation found issues. Check logs above."
```

## Lighthouse CI Configuration

### `.github/lighthouserc.json`

```json
{
  "ci": {
    "collect": {
      "staticDistDir": "dist",
      "url": [
        "/en/index.html",
        "/ja/index.html"
      ]
    },
    "assert": {
      "assertions": {
        "categories:performance": ["error", { "minScore": 0.9 }],
        "categories:accessibility": ["warn", { "minScore": 0.9 }],
        "categories:best-practices": ["warn", { "minScore": 0.9 }],
        "categories:seo": ["error", { "minScore": 0.9 }],
        "largest-contentful-paint": ["error", { "maxNumericValue": 2500 }],
        "cumulative-layout-shift": ["error", { "maxNumericValue": 0.1 }],
        "interactive": ["warn", { "maxNumericValue": 3500 }],
        "total-byte-weight": ["warn", { "maxNumericValue": 500000 }]
      }
    },
    "upload": {
      "target": "temporary-public-storage"
    }
  }
}
```

## Required GitHub Secrets

| Secret | Used By | Description |
|---|---|---|
| `RAKUTEN_APP_ID` | data-refresh.yml | Rakuten API application ID |
| `RAKUTEN_ACCESS_KEY` | data-refresh.yml | Rakuten API access key |
| `RAKUTEN_AFFILIATE_ID` | data-refresh.yml | Rakuten affiliate tracking ID |
| `ANTHROPIC_API_KEY` | weekly-enrich.yml | Claude API for product enrichment |

Set via: GitHub repo > Settings > Secrets and variables > Actions > New repository secret

## Build Scripts Update

Update `package.json` to include all build steps:

```json
{
  "scripts": {
    "dev": "astro dev",
    "build": "astro build && npx pagefind --site dist",
    "preview": "astro preview",
    "check": "astro check",
    "lint": "astro check",
    "validate": "node scripts/validate-products.mjs",
    "sync": "node scripts/sync-products.mjs",
    "fetch": "node scripts/fetch-rakuten.mjs --all",
    "enrich": "node scripts/ai-enrich.mjs",
    "images": "node scripts/optimize-images.mjs"
  }
}
```

## Deployment Flow

```
Developer pushes to main
         |
         v
GitHub Actions CI runs (2-3 min)
  - TypeScript check
  - Security audit
  - Build + Pagefind
  - Lighthouse CI
         |
         v (if passes)
Cloudflare Pages auto-deploys (1-2 min)
  - Detects push to main
  - Runs own build
  - Deploys to CDN
         |
         v
Live at chartedly.com (~3-5 min total)
```

PR branches get preview deployments at `<hash>.chartedly-web.pages.dev` automatically.
