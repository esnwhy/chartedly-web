# ADR-007: Scheduled Data Refresh Pipeline

## Status
**Accepted** — 2026-03-24

## Context
Chartedly's product data comes from Rakuten API rankings, AI enrichment via Claude, and manual editorial input via Google Drive CSV. The pipeline must keep product data fresh (rankings change, prices change, products go out of stock) without requiring daily manual intervention.

## Decision
Use GitHub Actions scheduled workflows for automated data refresh. Keep the human in the loop for editorial decisions (new product approval, score overrides).

## Alternatives Considered

### Cloudflare Workers Cron Triggers
- **Pros:** Runs at the edge, no GitHub dependency, tight integration with deployment.
- **Cons:** Workers have a 10ms CPU time limit (free) or 30s (paid). Fetching Rakuten API, processing data, and writing files within these limits is fragile. Workers cannot commit to git or trigger Astro builds directly. Would need a separate orchestration layer.
- **Verdict:** Rejected. Wrong tool for batch data processing.

### Local cron job (Windows Task Scheduler)
- **Pros:** Simple, runs on founder's machine.
- **Cons:** Requires machine to be on and connected. Not reliable for scheduled production tasks. No logs, no retry, no notifications.
- **Verdict:** Rejected for production. Acceptable for ad-hoc manual runs during development.

### GitHub Actions (chosen)
- **Pros:**
  - 2,000 minutes/month free for public repos, 500 for private.
  - Cron scheduling (`schedule` trigger).
  - Can commit results back to repo and trigger Cloudflare Pages rebuild.
  - Full Node.js 22 environment with npm dependencies.
  - Logs, notifications, retry on failure.
  - Existing scripts (`fetch-rakuten.mjs`, `ai-enrich.mjs`, `sync-products.mjs`) run as-is.
- **Cons:**
  - Cron timing is approximate (can be delayed 5-15 min during peak GitHub load).
  - Requires secrets management for API keys (Rakuten, Anthropic).

## Pipeline Architecture

See `automation-pipeline.md` (sibling document) for the full detailed pipeline specification.

### Summary of Schedules

| Frequency | Task | Script | Trigger |
|---|---|---|---|
| Daily (06:00 JST) | Fetch Rakuten rankings | `fetch-rakuten.mjs --all` | GitHub Actions cron |
| Weekly (Mon 07:00 JST) | AI enrichment for new products | `ai-enrich.mjs --limit 20` | GitHub Actions cron |
| Weekly (Mon 08:00 JST) | Image refresh for new products | `sync-products.mjs` | Follows AI enrichment |
| Monthly (1st, 06:00 JST) | Full data validation | Custom validation script | GitHub Actions cron |
| On-demand | Manual CSV sync | `sync-products.mjs` | `workflow_dispatch` |

## Consequences
- Rakuten rankings are refreshed daily. New products appear in `rakuten-discoveries.csv` automatically.
- AI enrichment runs weekly on new discoveries, limited to 20 products per run (~$0.10 in Claude Haiku API costs).
- The founder reviews `rakuten-discoveries.csv` and curates which products enter `products.csv`.
- Automated commits from GitHub Actions trigger Cloudflare Pages rebuild.
- API keys (RAKUTEN_APP_ID, RAKUTEN_ACCESS_KEY, ANTHROPIC_API_KEY) stored as GitHub Actions secrets.
