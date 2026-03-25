# Chartedly — Navigation Taxonomy

**Document version:** 1.0
**Date:** 2026-03-24
**Author:** SAGE (Information Architecture)
**Derived from:** Sitemap, Phase 02 personas & user needs, competitor UX audit

---

## Design Rationale

Navigation decisions are derived directly from Phase 02 findings:

1. **Browse-first, not search-first** (Theme 3): The primary nav leads with "Explore" (visual category browse), not a search bar. Search is always accessible but not the hero element.
2. **Quick answer access** (Theme 4): "Rankings" is a top-level nav item so Aiko can reach #1 picks in 2 taps.
3. **Tourist entry point** (Need #9): "Best For" collections are accessible from the Explore mega-menu and homepage, giving Marco a clear path.
4. **5-item maximum for primary nav** (mobile tab bar limit): Research shows mobile bottom navigation works best with 4-5 items.
5. **Language toggle always visible** (Theme 2): Language switching must be 1 tap from any page.

---

## Primary Navigation

### Desktop (persistent top bar)

```
┌──────────────────────────────────────────────────────────────┐
│  [Logo: Chartedly]   Home   Explore ▾   Rankings   New      │
│                                              [Search 🔍] EN|JP│
└──────────────────────────────────────────────────────────────┘
```

| Item | Label (EN) | Label (JP) | Destination | Notes |
|------|-----------|-----------|-------------|-------|
| Logo | Chartedly | Chartedly | `/en/` or `/ja/` | Always returns to homepage |
| Home | Home | ホーム | `/en/` | Active when on homepage |
| Explore | Explore | 探す | Opens mega-menu | Category browse entry point |
| Rankings | Rankings | ランキング | `/en/rankings/` | Direct path to top-rated products |
| New | New | 新着 | `/en/new/` | Recently reviewed and updated |
| Search | Search icon | Search icon | Opens search overlay | Icon only (no label) on desktop |
| Language | EN \| JP | EN \| JP | Switches language | Always visible. Current language highlighted |

### Explore Mega-Menu (desktop)

Triggered by hovering/clicking "Explore" in primary nav.

```
┌──────────────────────────────────────────────────────────────────┐
│  Explore                                                         │
│  ┌──────────────┬──────────────┬──────────────┬─────────────┐   │
│  │  Beauty       │  Electronics  │  Kitchen      │  Home        │  │
│  │  · Skincare   │  · Audio      │  · Knives     │  · Cleaning  │  │
│  │  · Makeup     │  · Cameras    │  · Cookware   │  · Storage   │  │
│  │  · Hair Care  │  · Gadgets    │  · Tableware  │  · Bedding   │  │
│  │  · Body Care  │  · Appliances │  · Tools      │  · Air       │  │
│  ├──────────────┼──────────────┼──────────────┼─────────────┤   │
│  │  Fashion      │  Food & Drink │  Health       │  Travel      │  │
│  │  · Basics     │  · Snacks     │  · Supplements│  · Bags      │  │
│  │  · Outerwear  │  · Beverages  │  · Eye Care   │  · Toiletries│  │
│  │  · Accessories│  · Instant    │  · Oral Care  │  · Accessories│ │
│  │               │  · Specialty  │  · First Aid  │              │  │
│  ├──────────────┼──────────────┼──────────────┴─────────────┤   │
│  │  Stationery   │  Baby & Kids  │                             │  │
│  │  · Pens       │  · Feeding    │  Collections:               │  │
│  │  · Notebooks  │  · Care       │  · Best for Tourists        │  │
│  │  · Desk       │  · Toys       │  · Under ¥1,000             │  │
│  │               │               │  · Best Gifts from Japan    │  │
│  └──────────────┴──────────────┴──────────────────────────────┘  │
└──────────────────────────────────────────────────────────────────┘
```

### Mobile (bottom tab bar)

```
┌──────────────────────────────────────────┐
│              [Page Content]              │
│                                          │
├──────────────────────────────────────────┤
│  🏠        🔍        📊       ✨        │
│  Home    Search   Rankings    New        │
└──────────────────────────────────────────┘
```

| Position | Icon | Label (EN) | Label (JP) | Destination |
|----------|------|-----------|-----------|-------------|
| 1 | House | Home | ホーム | Homepage |
| 2 | Magnifying glass | Search | 検索 | Search overlay |
| 3 | Chart bars | Rankings | ランキング | Rankings hub |
| 4 | Sparkle | New | 新着 | What's New feed |

**Note:** "Explore" is not in the mobile tab bar. Categories are accessed via:
- Homepage category cards row
- Search (typing a category name)
- Hamburger menu (top-left) which contains the full Explore hierarchy

### Mobile Header

```
┌──────────────────────────────────────────┐
│  [☰]   [Logo: Chartedly]      EN|JP     │
└──────────────────────────────────────────┘
```

| Element | Behavior |
|---------|----------|
| Hamburger (☰) | Opens slide-out drawer with: Explore categories (collapsible tree), Collections, Blog, About |
| Logo | Taps to homepage |
| EN\|JP | Language toggle, always visible |

---

## Secondary Navigation

### Breadcrumbs (all pages below homepage)

```
Home > Beauty > Skincare > Biore UV Aqua Rich
ホーム > ビューティー > スキンケア > ビオレ UV アクアリッチ
```

| Rule | Detail |
|------|--------|
| Shown on | All pages except homepage and search results |
| Max depth | 4 levels (Home > Category > Subcategory > Product) |
| Truncation | On mobile, show last 2 levels only: "... > Skincare > Biore UV Aqua Rich" |
| Clickable | Every breadcrumb segment is a link |
| Schema markup | BreadcrumbList JSON-LD for SEO |

### In-Page Navigation (Product Detail)

On long product detail pages, a sticky secondary nav appears after scrolling past the hero:

```
┌──────────────────────────────────────────────────┐
│  Overview  |  Specs  |  Review  |  Where to Buy  │
└──────────────────────────────────────────────────┘
```

Tapping a section scrolls smoothly to that anchor. Active section is highlighted as user scrolls.

---

## Footer Navigation

Consistent across all pages. Two-column layout on mobile, four-column on desktop.

```
┌──────────────────────────────────────────────────────────────────┐
│  Chartedly                                                       │
│  Clear comparisons for life in Japan.                            │
│                                                                  │
│  Explore          Resources         Legal              Connect   │
│  · Beauty          · Blog / Guides   · Affiliate         · X     │
│  · Electronics     · About            Disclosure        · Instagram│
│  · Kitchen         · Methodology     · Privacy Policy   · Contact │
│  · Home            · What's New      · 特定商取引法               │
│  · Fashion                                                       │
│  · Food & Drink                                                  │
│  · Health                                                        │
│  · Travel                                                        │
│  · Stationery                                                    │
│  · Baby & Kids                                                   │
│                                                                  │
│  ──────────────────────────────────────────────────────────────  │
│  © 2026 Chartedly. All rights reserved.          EN | JP         │
└──────────────────────────────────────────────────────────────────┘
```

| Section | Items | Notes |
|---------|-------|-------|
| Explore | All 10 categories | Direct links to category pages. Gives search engines a crawl path to every category |
| Resources | Blog, About, Methodology, What's New | Methodology in footer addresses Trust Deficit (Theme 1) — always 1 click away |
| Legal | Affiliate Disclosure, Privacy Policy, 特定商取引法 | Required by Amazon Associates TOS, Japanese law |
| Connect | X (Twitter), Instagram, Contact form | Social links + contact. No Facebook (low relevance for target demo) |

---

## Category Taxonomy

The 10 top-level categories are derived from Phase 02 findings on cross-category coverage (Theme 5) and the project brief's launch categories.

| Category | EN Label | JP Label | Subcategories | Rationale |
|----------|----------|----------|---------------|-----------|
| Beauty | Beauty | ビューティー | Skincare, Makeup, Hair Care, Body Care | @cosme's domain — Chartedly adds bilingual + visual browse |
| Electronics | Electronics | 家電・電子機器 | Audio, Cameras, Gadgets, Appliances | kakaku.com's domain — Chartedly adds English + curation |
| Kitchen | Kitchen | キッチン | Knives, Cookware, Tableware, Tools | High tourist interest (Marco: knives, cookware) |
| Home | Home | 暮らし | Cleaning, Storage, Air Quality, Bedding | Aiko's primary need area (air purifiers, daily essentials) |
| Fashion | Fashion | ファッション | Basics, Outerwear, Accessories | Uniqlo/MUJI cross-category — strong for tourists + residents |
| Food & Drink | Food & Drink | グルメ | Snacks, Beverages, Instant, Specialty | Tourist souvenirs + resident daily life |
| Health | Health | 健康 | Supplements, Eye Care, Oral Care, First Aid | Japan-specific products (eye drops, supplements) high in Emma's needs |
| Travel Essentials | Travel | 旅行グッズ | Bags, Toiletries, Accessories | Marco's primary category. Tourist mode gateway |
| Stationery | Stationery | 文房具 | Pens, Notebooks, Desk Accessories | Japan's stationery reputation. Strong for tourists + Yuki |
| Baby & Kids | Baby & Kids | ベビー・キッズ | Feeding, Care, Toys | Aiko's secondary need area. Underserved in English |

---

## Navigation States

| State | Desktop Behavior | Mobile Behavior |
|-------|-----------------|-----------------|
| Default | Top bar visible, no mega-menu | Bottom tab bar visible, header minimal |
| Scrolling down | Top bar hides (scroll-to-hide) | Bottom tab bar stays visible. Header hides |
| Scrolling up | Top bar re-appears | Header re-appears |
| On product detail (scrolled past hero) | In-page nav appears below top bar | In-page nav replaces header |
| Search active | Search overlay covers page | Full-screen search overlay |
| Explore mega-menu open | Overlay below nav bar, dimmed background | Hamburger drawer slides in from left |
| Compare tray active (products selected) | Sticky bar at bottom, above footer | Sticky bar above bottom tab bar |

---

## Accessibility Requirements

| Requirement | Implementation |
|-------------|---------------|
| Keyboard navigation | All nav items focusable via Tab. Enter/Space activates. Esc closes overlays |
| Skip to content | Hidden "Skip to main content" link as first focusable element |
| ARIA labels | `aria-label` on icon-only buttons (search, hamburger). `aria-current="page"` on active nav item |
| Focus trap | Search overlay and mega-menu trap focus when open. Esc returns focus to trigger |
| Mobile tap targets | Minimum 44x44px for all interactive elements (WCAG 2.1 AA) |
| Screen reader | Nav landmarks: `<nav aria-label="Primary">`, `<nav aria-label="Footer">`, `<nav aria-label="Breadcrumb">` |
| Reduced motion | Scroll-to-hide and mega-menu animations respect `prefers-reduced-motion` |
