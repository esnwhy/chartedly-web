# Chartedly -- Risk Register

**Document version:** 1.0
**Date:** 2026-03-24
**Author:** ATLAS (Strategy Consultant)

---

## Risk Rating Definitions

| Rating | Probability | Impact |
|--------|-------------|--------|
| **H (High)** | > 60% likely | Would significantly delay launch, reduce revenue > 50%, or cause legal liability |
| **M (Medium)** | 30--60% likely | Would require meaningful workaround, reduce revenue 10--50%, or cause reputational damage |
| **L (Low)** | < 30% likely | Minor inconvenience, revenue impact < 10%, or easily resolved |

---

## Risk Register

### R01: Amazon Associates Policy Changes

| Attribute | Detail |
|-----------|--------|
| **Category** | Revenue / Business Model |
| **Description** | Amazon Japan may reduce affiliate commission rates, change cookie duration (currently 24 hours), restrict product categories, or terminate the Associates program for sites that don't meet new criteria. Amazon has historically cut rates without notice (e.g., April 2020 US rate cuts of up to 70% in some categories). |
| **Probability** | **H** -- Amazon has changed rates multiple times historically |
| **Impact** | **H** -- Amazon JP is projected to be the primary revenue source (50--60% of affiliate income) |
| **Overall Rating** | **H** |
| **Mitigations** | 1. Diversify affiliate partnerships from day one: Rakuten, Yahoo Shopping, and direct merchant programs alongside Amazon JP. 2. Target a revenue split of no more than 50% from any single affiliate network by Month 12. 3. Build direct relationships with Japanese brands for sponsored content as a secondary revenue stream. 4. Monitor Amazon Associates policy update emails and compliance requirements proactively. |

---

### R02: Product Image Copyright Infringement

| Attribute | Detail |
|-----------|--------|
| **Category** | Legal / Compliance |
| **Description** | Using manufacturer product images without proper licensing could result in DMCA takedowns or lawsuits. Japanese copyright law (著作権法) protects product photography. |
| **Probability** | **M** -- Common issue for product review sites |
| **Impact** | **H** -- Takedown of key pages; potential legal action; loss of affiliate program membership |
| **Overall Rating** | **H** |
| **Mitigations** | 1. Use only images provided through affiliate program APIs (Amazon Product Advertising API, Rakuten API), which grant display rights. 2. For original photography, create in-house product photos. 3. Implement a content policy: never scrape or hotlink manufacturer websites. 4. Include proper attribution for any Creative Commons images. 5. Maintain a documented image source log for every product page. |

---

### R03: Content Accuracy Liability

| Attribute | Detail |
|-----------|--------|
| **Category** | Legal / Reputation |
| **Description** | Incorrect product specifications, outdated pricing, or misleading comparisons could expose Chartedly to consumer complaints or regulatory action under Japan's Act against Unjustifiable Premiums and Misleading Representations (景品表示法 / Keihin Hyoji Ho). |
| **Probability** | **M** -- Inevitable as product data changes frequently |
| **Impact** | **M** -- Regulatory warning, loss of user trust, potential fines |
| **Overall Rating** | **M** |
| **Mitigations** | 1. Include clear disclaimers: "Prices and availability are subject to change. Please verify on the retailer's website before purchasing." 2. Implement automated price/availability checks via affiliate APIs (weekly refresh). 3. Add "Last Updated" timestamps to every product page. 4. Avoid absolute claims ("the best in Japan") without qualification; use "our top pick" or "highest rated in our testing." 5. Establish a quarterly content audit process to review accuracy. |

---

### R04: Competitive Response from Established Players

| Attribute | Detail |
|-----------|--------|
| **Category** | Market / Competition |
| **Description** | mybest (30M+ monthly users) or Kakaku.com (68M monthly visits) could launch or improve English-language content, directly competing with Chartedly's core differentiation. mybest has already expanded to 8 countries. |
| **Probability** | **M** -- mybest is expanding internationally but focused on local-language sites per country, not English-in-Japan |
| **Impact** | **H** -- Would erode Chartedly's primary competitive advantage |
| **Overall Rating** | **H** |
| **Mitigations** | 1. Build brand loyalty and community among foreign residents before incumbents react (first-mover advantage in the bilingual niche). 2. Focus on content depth and cultural context that large sites can't easily replicate (e.g., "Why this rice cooker is great for one-room apartments" -- lifestyle framing). 3. Establish partnerships with foreigner-focused media (GaijinPot, Tokyo Cheapo, Japan Today) for backlinks and referrals. 4. Maintain content velocity: incumbents are slow to prioritise small niches. |

---

### R05: Amazon Product Advertising API Rate Limits

| Attribute | Detail |
|-----------|--------|
| **Category** | Technical / Infrastructure |
| **Description** | Amazon's Product Advertising API has strict rate limits (1 request/second for new associates, scaling with revenue). With 500+ products, frequent price/availability updates could hit rate limits, causing stale data or broken pages. |
| **Probability** | **M** -- Will be encountered as product count grows |
| **Impact** | **M** -- Stale pricing data; broken "Buy Now" links; poor user experience |
| **Overall Rating** | **M** |
| **Mitigations** | 1. Implement a caching layer: fetch product data daily/weekly and store locally rather than making real-time API calls per page view. 2. Use static site generation (Astro SSG) to bake product data into pages at build time, reducing API dependency. 3. Stagger API calls across time to stay within rate limits. 4. As revenue grows, API rate limits automatically increase with Amazon Associates tier. 5. Supplement with Rakuten API data as fallback. |

---

### R06: Japan Regulatory Compliance (特定商取引法 / 景品表示法)

| Attribute | Detail |
|-----------|--------|
| **Category** | Legal / Regulatory |
| **Description** | Japan's Specified Commercial Transactions Act (特定商取引法) requires disclosure of operator information for commercial websites. The Act against Unjustifiable Premiums and Misleading Representations (景品表示法) prohibits misleading advertising. Japan's October 2023 anti-stealth marketing regulation (ステルスマーケティング規制) requires explicit disclosure when content is commercially motivated (including affiliate links). Non-compliance can result in administrative orders and public naming. |
| **Probability** | **M** -- Regulations exist and enforcement is increasing |
| **Impact** | **H** -- Administrative orders, fines, public naming, loss of affiliate program access |
| **Overall Rating** | **H** |
| **Mitigations** | 1. Publish a compliant 特定商取引法 disclosure page (operator name, address, contact information). 2. Add clear affiliate disclosure banners on every page containing affiliate links (e.g., "This page contains affiliate links. We may earn a commission at no extra cost to you."). 3. Never use false urgency, fake scarcity, or exaggerated claims in product descriptions. 4. Review content against Consumer Affairs Agency (消費者庁) guidelines quarterly. 5. Consult with a Japanese legal professional before launch for compliance review. |

---

### R07: SEO Dependency and Google Algorithm Changes

| Attribute | Detail |
|-----------|--------|
| **Category** | Traffic / Acquisition |
| **Description** | Chartedly projects 65% of traffic from organic search by Month 12. A Google core algorithm update (which occur 3--4 times per year) could significantly reduce rankings overnight. Google's 2023--2024 "Helpful Content Updates" specifically targeted thin affiliate content. |
| **Probability** | **H** -- Google algorithm updates are certain; impact on any individual site is uncertain |
| **Impact** | **H** -- 50%+ traffic loss is possible from a single unfavorable update |
| **Overall Rating** | **H** |
| **Mitigations** | 1. Prioritise content quality: original analysis, clear methodology, cited sources -- aligned with Google's E-E-A-T (Experience, Expertise, Authoritativeness, Trustworthiness) guidelines. 2. Diversify traffic sources: build email newsletter (target 5,000 subscribers by Month 12), social media presence (X/Twitter for Japan community), partnerships with expat media. 3. Aim for no more than 65% traffic from any single source. 4. Monitor Google Search Console for ranking changes weekly. 5. Follow Google Search Central updates proactively. |

---

### R08: Bilingual Content Maintenance Burden

| Attribute | Detail |
|-----------|--------|
| **Category** | Operations / Content |
| **Description** | Maintaining content in both English and Japanese doubles the content production and update workload. A solo founder producing 10--15 articles per month in one language would need to produce 20--30 per month to maintain parity, which is unsustainable. |
| **Probability** | **H** -- Certain once Japanese language support launches in Phase 2 |
| **Impact** | **M** -- Content gaps between languages; SEO dilution; user frustration if one language falls behind |
| **Overall Rating** | **M** |
| **Mitigations** | 1. Phase 2 (Japanese) launches only after English content is established and generating revenue. 2. Use AI-assisted translation (with human review) to reduce per-article translation time to ~30 minutes. 3. Prioritise translating top-performing English articles first (top 20% of traffic). 4. Consider hiring a part-time Japanese translator once affiliate revenue exceeds JPY 200,000/month. 5. Use a CMS structure that supports linked translations (i18n content collections in Astro). |

---

### R09: Solo Founder Burnout / Key Person Risk

| Attribute | Detail |
|-----------|--------|
| **Category** | Operations / Human Resources |
| **Description** | Chartedly is one of multiple projects in the LAIRIA portfolio (alongside Movemate, XC Intelligence Hub, FinBuddy, OwlStreet, OwnersDesk). Spreading attention across 6+ projects risks burnout, content velocity collapse, and site stagnation. |
| **Probability** | **H** -- Solo founders managing multiple ventures consistently report this |
| **Impact** | **H** -- Project abandonment or indefinite stall |
| **Overall Rating** | **H** |
| **Mitigations** | 1. Set a fixed weekly time allocation for Chartedly (e.g., 10 hours/week) and protect it. 2. Batch content production: dedicate specific days to Chartedly content. 3. Automate everything possible: API-driven price updates, scheduled builds, automated link checking. 4. Set a "minimum viable cadence" of 2 articles/week even during busy periods. 5. Define a clear "pause criteria" -- if Chartedly is not meeting Month 6 KPIs, evaluate whether to continue or reallocate time. |

---

### R10: Affiliate Program Rejection or Termination

| Attribute | Detail |
|-----------|--------|
| **Category** | Revenue / Business Model |
| **Description** | Amazon Associates Japan requires sites to generate qualifying sales within 180 days or face account closure. Rakuten requires per-merchant approval. A new site with low traffic may struggle to meet minimums or be rejected outright. |
| **Probability** | **M** -- Common for new affiliate sites |
| **Impact** | **M** -- Delays monetisation; forces reliance on fewer affiliate networks |
| **Overall Rating** | **M** |
| **Mitigations** | 1. Apply to Amazon Associates Japan only after the site has 20+ quality articles live. 2. Drive initial traffic through social media and direct outreach to ensure qualifying sales within the 180-day window. 3. Apply to Rakuten and Yahoo Shopping simultaneously to diversify. 4. Consider ValueCommerce (Japan's largest affiliate network) as an additional channel. 5. In worst case, use direct Amazon links (non-affiliate) until the site qualifies. |

---

## Risk Summary Matrix

| ID | Risk | Probability | Impact | Overall | Status |
|----|------|-------------|--------|---------|--------|
| R01 | Amazon Associates policy changes | H | H | **H** | Open |
| R02 | Product image copyright infringement | M | H | **H** | Open |
| R03 | Content accuracy liability | M | M | **M** | Open |
| R04 | Competitive response from incumbents | M | H | **H** | Open |
| R05 | Amazon API rate limits | M | M | **M** | Open |
| R06 | Japan regulatory compliance (特定商取引法 / 景品表示法) | M | H | **H** | Open |
| R07 | SEO dependency / Google algorithm changes | H | H | **H** | Open |
| R08 | Bilingual content maintenance burden | H | M | **M** | Open |
| R09 | Solo founder burnout / key person risk | H | H | **H** | Open |
| R10 | Affiliate program rejection or termination | M | M | **M** | Open |

**Risk distribution:** 5 High, 4 Medium, 1 Low -- reflecting the inherent challenges of a bootstrapped affiliate content business in a competitive, regulated market.

---

### Sources

- [Amazon Associates Operating Agreement](https://affiliate-program.amazon.com/help/operating/compare)
- [ULPA - Affiliate Marketing in Japan (anti-stealth marketing regulations)](https://www.ulpa.jp/post/affiliate-marketing-in-japan-a-complete-guide)
- [Yano Research - Affiliate Marketing Market](https://www.yanoresearch.com/en/press-release/show/press_id/3746)
- [Google Search Central - Helpful Content System](https://developers.google.com/search/docs/appearance/helpful-content-system)
- [Consumer Affairs Agency Japan (消費者庁) - 景品表示法](https://www.caa.go.jp/policies/policy/representation/)
- [IMD - Future of Affiliate Marketing Trends 2026](https://www.imd.org/blog/marketing/affiliate-marketing/)

*Document prepared by ATLAS. All statistics cited from sources gathered 2026-03-24.*
