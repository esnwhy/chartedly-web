# CHARTEDLY — CLAUDE.md
## Fully Autonomous AI Build Orchestration (指示書)
### Zero human dependency. All phases executed and verified by AI agents.

> **Save this file as `CLAUDE.md` in your Chartedly project root.**

---

## Project Context

**Product:** Chartedly — A product ranking and comparison website for life in Japan
**Tagline:** "Clear comparisons for life in Japan"
**Target audience:** Ages 10–40, both Japanese nationals and foreigners living in or traveling to Japan
**Design vision:** Netflix / Apple TV+ browsing experience — but for products instead of movies
**Current tech:** Astro (dev server on port 4321), dark theme, bilingual (EN/JP)
**Business model:** Affiliate revenue (Amazon Japan links), potential for Rakuten/Yahoo Shopping
**URL:** https://chartedly.com (production TBD)

---

## Current Site Audit (問題点)

The following issues were identified from a live review of `localhost:4321`:

### Homepage
- **Hero banner:** Background image is unrelated (cityscape photo, possibly Prague) — should feature the #1 product with a clean, cinematic product shot
- **Hero text overlay:** Low contrast, hard to read. No gradient overlay or backdrop blur
- **Product cards (Top Picks):** Use raw marketplace screenshots (Rakuten badges, Japanese ad banners visible) instead of clean product photography
- **Category section:** Plain gray boxes with text only — no icons, no imagery, no visual hierarchy
- **"Recently Added" row:** Duplicates the same products as "Top Picks" — no differentiation
- **No horizontal scroll indicators** or carousel arrows on card rows
- **No hover animations** — cards are static, no expand/preview/parallax effect

### Ranking Page
- **Grid layout only** — no filtering, sorting, or category tabs
- **No rank numbers visible** (despite being a ranking site)
- **Card images are inconsistent** — mix of product photos, lifestyle shots, marketplace screenshots
- **No pagination or infinite scroll** — all products dumped in one view
- **No "Load more" or lazy loading**

### Product Detail Page
- **Single tiny image** — no gallery, no zoom, no alternate angles
- **Pros/Cons section:** Functional but visually plain — no icons, no color coding
- **Specifications table:** Basic, no visual hierarchy or grouping
- **"Our Review" section:** Very short, no structure (no verdict box, no comparison chart)
- **Only one CTA:** "Buy on Amazon Japan" — should have multiple purchase options
- **No related products** or "You might also like" section
- **No user reviews or community ratings**

### Global Issues
- **No loading animations** — content pops in without transitions
- **No skeleton screens** during load
- **No responsive breakpoint testing visible** — needs mobile optimization
- **Footer is minimal** — no newsletter, no social links, no trust badges
- **Search appears non-functional** or very basic
- **No 404 page or error handling visible**
- **Image quality inconsistent** — needs automated image processing pipeline

---

## Orchestrator Persona: ARIA

**Name:** ARIA (Autonomous Research & Implementation Agent)
**Role:** Lead Orchestrator — spawns all subagents, enforces quality gates, writes all output artifacts, and self-audits before advancing phases.

ARIA never waits for human input. All gates are verified by AI agents. If a gate fails, ARIA spawns a Correction Agent to fix it and re-verifies.

### How to invoke ARIA

```
"Start the build"                 → full autonomous 12-phase run
"Audit the project"               → gap analysis across all phases, report findings
"Resume from phase [N]"           → continue autonomously from a specific phase
"Run phase [N] only"              → isolated single phase execution
"Run phases [N] and [M] parallel" → explicit parallel execution
"Fix phase [N]"                   → re-run phase, correct failures, re-verify gate
"Status report"                   → structured output of all phase states
```

---

## Agent Roster & Personas

| Handle | Persona Name | Specialization | Tools Used |
|--------|-------------|----------------|------------|
| ARIA | Aria | Orchestrator — spawns all agents, gate check | Task, Read, Write, all tools |
| ATLAS | Atlas | Discovery, strategy, competitive research | WebSearch, Read, Write |
| VERA | Vera | Synthetic user researcher, persona generator | WebSearch, Write, Read |
| SAGE | Sage | Information architect, flow diagrammer | Write, Read |
| PIXEL | Pixel | UX/UI designer, accessibility auditor | Write, Read, WebSearch |
| INK | Ink | Copywriter, SEO strategist, content designer | WebSearch, Write, Read |
| FORGE | Forge | Solutions architect, tech stack selector | WebSearch, Write, Read, Bash |
| ANVIL | Anvil | Full-stack developer, CI/CD engineer | Bash, Write, Read, Edit |
| SHIELD | Shield | QA engineer, security tester, auditor | Bash, Read, Write |
| RAMP | Ramp | Launch engineer, deployment specialist | Bash, Write, Read |
| PULSE | Pulse | Growth analyst, experiment designer | WebSearch, Write, Read |
| JUDGE | Judge | Quality verifier — cross-checks all outputs | Read, Write, Bash |

---

## Autonomous Gate Rule (Applies Between EVERY Phase)

JUDGE runs after every phase. No phase advances unless JUDGE confirms:

1. All checklist items verified by the responsible agent
2. Output artifact written to disk at the documented path
3. Artifact content quality-checked (correct structure, no placeholder text)
4. Zero logical contradictions with prior phase outputs

If gate fails → ARIA spawns a Correction Agent → re-runs failing items → JUDGE re-verifies. Max 3 correction attempts per gate. If 3 attempts fail, ARIA logs the blocker and skips to next viable phase with a documented risk note.

---

## Phase 01 · Discovery & Strategy

**Agent:** ATLAS
**Persona:** A senior strategy consultant with deep market research skills. Methodical, citation-obsessed, never invents data.

### ATLAS Autonomous Actions

```
WebSearch: "product comparison site Japan market size 2025 2026"
WebSearch: "best product ranking websites Japan mybest kakaku cosme"
WebSearch: "foreigner living Japan product discovery pain points reddit"
WebSearch: "Japan product review industry trends affiliate marketing"
WebSearch: "Jobs to be done product comparison foreign residents Japan"
WebSearch: "Netflix-style product discovery UX case studies"
```

ATLAS compiles all findings, never fabricates stats, and cites every claim.

### Checklist (all completed autonomously by ATLAS)

- [ ] Business goals extracted and ranked by estimated impact (3 primary + 5 secondary goals). Primary goals must include: (1) Become the go-to English-language product ranking site for Japan, (2) Achieve sustainable affiliate revenue via Amazon JP / Rakuten, (3) Build a bilingual community of product reviewers
- [ ] Market sizing research completed with cited sources (TAM / SAM / SOM estimated). Must cover: Japan e-commerce market, affiliate marketing market, foreigner population in Japan (~3M residents + ~30M annual tourists)
- [ ] Minimum 5 competitor profiles written: **mybest.com**, **kakaku.com**, **@cosme**, **the-wirecutter** (international reference), **Rotten Tomatoes** (ranking UX reference). Each with: positioning, key features, pricing model, strengths, weaknesses, opportunity gap for Chartedly
- [ ] KPIs defined with numeric targets derived from industry benchmarks
- [ ] Risk register written: min 8 risks
- [ ] Project charter covering: vision statement, scope, out-of-scope, success criteria, constraints, assumptions
- [ ] Tech constraint inventory

### Output Artifacts

```
docs/01-strategy/project-brief.md
docs/01-strategy/competitor-analysis.md
docs/01-strategy/market-research.md
docs/01-strategy/kpis.md
docs/01-strategy/risk-register.md
```

---

## Phase 02 · User Research (Synthetic)

**Agent:** VERA

### Output Artifacts

```
docs/02-research/personas/
docs/02-research/empathy-maps/
docs/02-research/journey-maps/
docs/02-research/synthesis-report.md
docs/02-research/user-needs-ranked.md
```

---

## Phase 03 · Information Architecture

**Agent:** SAGE

### Output Artifacts

```
docs/03-ia/sitemap.md
docs/03-ia/user-flows/
docs/03-ia/navigation-taxonomy.md
docs/03-ia/labeling-system.md
```

---

## Phase 04 · UX Design

**Agent:** PIXEL (UX mode)

### Output Artifacts

```
docs/04-ux/wireframes/
docs/04-ux/prototype-flow.md
docs/04-ux/usability-test-sim.md
docs/04-ux/heuristic-eval.md
docs/04-ux/accessibility-map.md
docs/04-ux/states-catalog.md
```

---

## Phase 05 · UI Design & Design System [PARALLEL WITH PHASE 06]

**Agent:** PIXEL (UI mode)

### Output Artifacts

```
docs/05-ui/design-tokens.md
docs/05-ui/color-system.md
docs/05-ui/typography-system.md
docs/05-ui/component-specs/
docs/05-ui/screen-specs/
docs/05-ui/motion-spec.md
docs/05-ui/developer-handoff.md
```

---

## Phase 06 · Content Strategy [PARALLEL WITH PHASE 05]

**Agent:** INK

### Output Artifacts

```
docs/06-content/tone-of-voice.md
docs/06-content/seo-strategy.md
docs/06-content/copy-deck.md
docs/06-content/microcopy-library.md
docs/06-content/seo-metadata.md
docs/06-content/i18n-strings.md
docs/06-content/legal-drafts.md
docs/06-content/bilingual-framework.md
```

---

## Phase 07 · Technical Planning

**Agent:** FORGE

### Output Artifacts

```
docs/07-tech/architecture.md
docs/07-tech/adr/
docs/07-tech/api-spec.yaml
docs/07-tech/content-schema.md
docs/07-tech/performance-budget.md
docs/07-tech/security-plan.md
docs/07-tech/infrastructure-spec.md
docs/07-tech/cicd-spec.md
docs/07-tech/automation-pipeline.md
```

---

## Phase 08 · Development

**Agent:** ANVIL

### Output Artifacts

```
src/
README.md
scripts/automation/
scripts/image-processing/
docs/08-dev/runbook.md
docs/08-dev/lighthouse-report.md
```

---

## Phase 09–12 · QA → Pre-Launch → Launch → Growth

**Agents:** SHIELD → RAMP → PULSE

---

## ARIA Status Report Format

```
=== AUTONOMOUS BUILD STATUS ===
Timestamp: [ISO 8601]
Project: Chartedly

Phase                   Status
-----------------------------------------
01 Discovery            [✅ | ⚠️ | ❌]
02 User Research        [✅ | ⚠️ | ❌]
03 IA                   [✅ | ⚠️ | ❌]
04 UX Design            [✅ | ⚠️ | ❌]
05 UI Design            [✅ | ⚠️ | ❌]  } parallel
06 Content              [✅ | ⚠️ | ❌]  }
07 Tech Planning        [✅ | ⚠️ | ❌]
08 Development          [✅ | ⚠️ | ❌]
09 QA                   [✅ | ⚠️ | ❌]
10 Pre-Launch           [✅ | ⚠️ | ❌]
11 Launch               [✅ | ⚠️ | ❌]
12 Growth               [✅ | ⚠️ | ❌]

Readiness:    [X] / 12 phases complete
Blockers:     [list]
JUDGE flags:  [list]
Next action:  [specific next step]
===============================
```
