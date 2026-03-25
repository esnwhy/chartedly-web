# Chartedly Bilingual Content Framework

**Date:** 2026-03-24
**Role:** INK -- Senior Content Strategist & Copywriter
**Purpose:** Rules for managing bilingual (EN/JP) content across the entire Chartedly platform

---

## 1. Translation Workflow

### Direction: English First, Then Japanese

All content is authored in English first, then translated/adapted to Japanese. This is because:

1. **The primary audience at launch is English-speaking foreigners.** English is the revenue-generating language.
2. **SEO authority builds faster in one language first.** Splitting effort between two languages from day one dilutes both.
3. **The founder's editorial voice is established in English.** The Japanese version adapts the voice rather than originating it.

### Workflow Steps

```
1. Draft in English
   └── Writer/founder produces full English content
       ├── Follows tone-of-voice.md guidelines
       ├── Targets Flesch ≥ 65 reading ease
       └── Includes all structured data (scores, specs, prices)

2. Editorial review (English)
   └── Self-review checklist (tone, accuracy, SEO, disclosure)

3. Publish English version
   └── URL: chartedly.com/best-japanese-sunscreen
   └── Set hreflang to "en" with self-reference

4. Translate/adapt to Japanese
   └── NOT machine translation. Human adaptation.
   ├── Adapt voice to だ/である for reviews, です/ます for UI
   ├── Adjust cultural references as needed
   ├── Verify all product names use correct Japanese (katakana/kanji)
   └── Maintain all structured data (scores, specs, prices) identically

5. Japanese QA review
   └── Native speaker review for naturalness
   ├── Check: Does it sound like it was written in Japanese, not translated?
   ├── Check: Are honorifics and register appropriate?
   └── Check: Are product names correct (official Japanese names)?

6. Publish Japanese version
   └── URL: chartedly.com/ja/best-japanese-sunscreen
   └── Set hreflang to "ja" with cross-reference to "en" version
```

### Timeline Expectations

| Content Type | EN Draft | EN Publish | JP Adaptation | JP Publish |
|-------------|----------|------------|---------------|------------|
| Comparison article | Day 1-3 | Day 4 | Day 5-6 | Day 7 |
| Guide article | Day 1-2 | Day 3 | Day 4-5 | Day 6 |
| Microcopy / UI strings | Same batch | Same deploy | Same batch | Same deploy |
| Legal pages | Day 1 | Day 2 | Day 3-4 | Day 5 |

At MVP, the Japanese version may lag the English version by up to 2 weeks. This is acceptable. Completeness matters more than simultaneity.

---

## 2. Content Parity Requirements

### Must Be Identical in Both Languages

| Element | Rule |
|---------|------|
| Product scores | Identical numbers (9.2/10 in both) |
| Product prices | Identical yen amounts |
| Product specifications | Identical data |
| Badge assignments | Top Pick / Budget Pick same products in both languages |
| Ranking order | Same product order |
| Affiliate links | Same destination URLs |
| Publication date | Same date |
| Last updated date | Same date |
| Structured data (JSON-LD) | Identical values, localized labels |
| Image assets | Same images |

### May Differ Between Languages

| Element | How It May Differ |
|---------|------------------|
| Headline/title | Adapted for natural phrasing in each language, not literal translation |
| Meta description | Optimized for SEO keywords in each language independently |
| Review prose | Adapted tone (だ/である in JP vs. conversational EN). May emphasize different aspects. |
| Cultural context notes | JP version may omit explanations obvious to Japanese readers (e.g., what PA++++ means) |
| "Where to buy" section | JP version may include more physical store details; EN version may emphasize online options |
| FAQ section | Some questions may differ based on what each audience actually asks |
| Word count | JP version may be shorter (Japanese is denser than English) |

### Hard Rule: No "Partial Translation"

If a page exists in Japanese, it must be a complete page -- not a half-translated mix of English and Japanese. Either a page is fully available in Japanese or it displays the English version with a notice.

---

## 3. Fallback Behavior When Japanese Is Not Available

### Scenario: User on /ja/ path, but JP version does not exist

**Behavior:** Display the English version of the content with a bilingual notice at the top.

**Notice text:**

EN: "This article is not yet available in Japanese. You are reading the English version."
JP: "この記事はまだ日本語版がありません。英語版を表示しています。"

**Display rules:**
- The notice appears as a subtle banner below the header, before the article content.
- Style: surface-raised background, text-muted color, small text (14px).
- The notice includes a dismiss button ("Got it" / "了解").
- The page's `<html lang>` attribute remains "en" since the content is English.
- Hreflang tags point only to the existing language version.

### Fallback Priority Order

```
1. Japanese version exists → Show Japanese version
2. Japanese version does not exist → Show English version + notice
3. Neither exists → 404 page (in the language of the URL path)
```

### UI Elements Always Available in Both Languages

Regardless of content availability, the following are always in the user's selected language:

- Navigation labels
- Footer text
- Cookie notice
- Error messages
- Button labels
- Badge labels (Top Pick / トップピック)
- Search placeholder
- Loading states

These strings come from the i18n JSON files and are independent of article content.

---

## 4. URL Structure

### Pattern

```
English:  chartedly.com/{slug}
Japanese: chartedly.com/ja/{slug}
```

### Rules

| Rule | Implementation |
|------|---------------|
| English is the default (no prefix) | `chartedly.com/best-japanese-sunscreen` |
| Japanese uses `/ja/` prefix | `chartedly.com/ja/best-japanese-sunscreen` |
| Slugs are in English for both versions | The slug `best-japanese-sunscreen` is used in both `/` and `/ja/` paths |
| No Japanese characters in URLs | URLs must be ASCII-safe for maximum compatibility |
| Language prefix is the ONLY difference | `/best-japanese-sunscreen` and `/ja/best-japanese-sunscreen` are language variants of the same page |
| Root path `/` is English homepage | `/ja/` is Japanese homepage |

### Why English Slugs for Japanese Pages?

1. **URL consistency.** The same slug in both languages makes cross-referencing, link building, and analytics simpler.
2. **Japanese URLs with encoded characters are ugly.** `chartedly.com/ja/%E6%97%A5%E7%84%BC%E3%81%91%E6%AD%A2%E3%82%81` is unreadable and shareable.
3. **SEO for Japanese searches.** Google in Japan indexes content in the `<title>` and body, not the URL. The URL slug having English words does not harm Japanese SEO ranking.
4. **Industry standard.** Sites like japan-guide.com, tokyo-cheapo.com, and international sites with `/ja/` prefixes all use English slugs.

### Future Language Expansion

If Chartedly adds Chinese, Korean, or other languages:

```
chartedly.com/zh/{slug}    (Simplified Chinese)
chartedly.com/ko/{slug}    (Korean)
```

The English version always remains at the root (`/`) with no prefix. This avoids the cost of migrating all English URLs to `/en/` later.

---

## 5. SEO Implications of Bilingual Content

### Hreflang Implementation

Every page that exists in both languages must include hreflang tags in the `<head>`:

```html
<!-- On the English version: -->
<link rel="alternate" hreflang="en" href="https://chartedly.com/best-japanese-sunscreen" />
<link rel="alternate" hreflang="ja" href="https://chartedly.com/ja/best-japanese-sunscreen" />
<link rel="alternate" hreflang="x-default" href="https://chartedly.com/best-japanese-sunscreen" />

<!-- On the Japanese version: -->
<link rel="alternate" hreflang="en" href="https://chartedly.com/best-japanese-sunscreen" />
<link rel="alternate" hreflang="ja" href="https://chartedly.com/ja/best-japanese-sunscreen" />
<link rel="alternate" hreflang="x-default" href="https://chartedly.com/best-japanese-sunscreen" />
```

**Critical rules:**
- Every hreflang page must reference itself AND all other language versions.
- `x-default` points to the English version (the fallback for unrecognized languages).
- Tags must be bidirectional: if EN points to JA, JA must point back to EN.
- Canonical URLs are self-referencing within each language version. The Japanese page's canonical is the Japanese URL, not the English URL.
- Validate with Ahrefs or Screaming Frog. 75% of hreflang implementations contain errors.

### Separate SEO Strategy Per Language

| Aspect | English | Japanese |
|--------|---------|---------|
| Target keywords | English keywords (e.g., "best japanese sunscreen") | Japanese keywords (e.g., "日焼け止め おすすめ 外国人") |
| Meta title | Optimized for English SERPs | Optimized for Japanese SERPs (different keywords) |
| Meta description | English-optimized | Japanese-optimized |
| Structured data | English labels | Japanese labels |
| Sitemap | Included in main sitemap with hreflang | Included in main sitemap with hreflang |

**Do not simply translate English keywords into Japanese.** Japanese search behavior differs:
- Japanese users use shorter queries
- Katakana brand names are common search terms (ビオレ, アネッサ)
- The word order in Japanese queries differs from English
- Research Japanese keywords from scratch using Japanese tools (Google Keyword Planner set to Japan, Ubersuggest, @cosme search data)

### Duplicate Content Prevention

- Hreflang tags signal to Google that the two versions are language alternatives, not duplicates.
- Each page has a self-referencing canonical URL.
- Japanese and English pages will rank independently in their respective language SERPs.
- Never serve both languages on the same URL based on IP/browser language detection. This causes indexing confusion. Always use separate URLs.

---

## 6. Product Name Conventions

### Display Rules

| Context | Format | Example |
|---------|--------|---------|
| English article body | English name first, Japanese in parentheses on first mention | Biore UV Aqua Rich Watery Essence (ビオレUV アクアリッチ ウォータリーエッセンス) |
| English article subsequent mentions | English name only | Biore UV Aqua Rich |
| Japanese article body | Japanese name first, English in parentheses on first mention | ビオレUV アクアリッチ ウォータリーエッセンス (Biore UV Aqua Rich Watery Essence) |
| Japanese article subsequent mentions | Japanese name only | ビオレUV アクアリッチ |
| Product cards (EN context) | English name primary, Japanese subtitle | **Biore UV Aqua Rich** / ビオレUV アクアリッチ |
| Product cards (JP context) | Japanese name primary, English subtitle | **ビオレUV アクアリッチ** / Biore UV Aqua Rich |
| Comparison tables | English name in EN version, Japanese name in JP version | Column shows name in the page's language |
| Search index | Both names indexed | Searching "ビオレ" or "Biore" finds the same product |
| URLs | English transliteration only | `/best-japanese-sunscreen` (not `/best-japanese-日焼け止め`) |
| Structured data (schema.org) | Official product name in the schema's language context | EN schema: "Biore UV Aqua Rich" / JP schema: "ビオレUV アクアリッチ" |

### Name Lookup Sources

When determining the correct Japanese name for a product:

1. **Official manufacturer website** (e.g., kao.com/jp/ for Biore products) -- the authoritative source.
2. **Amazon.co.jp product listing** -- usually matches the official name.
3. **@cosme product page** -- Japan's largest beauty review site.
4. **Physical product packaging** -- the ultimate source of truth.

Never guess at katakana spellings. Verify every product name.

### Handling Brand Names

| Brand | EN Usage | JP Usage |
|-------|----------|----------|
| Biore | Biore | ビオレ |
| Anessa | Anessa | アネッサ |
| Hada Labo | Hada Labo | 肌ラボ |
| Skin Aqua | Skin Aqua | スキンアクア |
| Rohto | Rohto | ロート |
| Zojirushi | Zojirushi | 象印 |
| Tiger | Tiger | タイガー |
| Panasonic | Panasonic | パナソニック |

Note: Some brands use different names in English vs. Japanese contexts (e.g., 肌ラボ is "Hada Labo" internationally but literally "Skin Lab" -- always use the established English name, not a literal translation).

---

## 7. Language Switcher UX

### Implementation

- A language toggle ("EN" / "JP") appears in the header navigation.
- Clicking it switches to the same page in the other language.
- If the other language version does not exist, redirect to the other language's homepage with a toast: "This page is only available in English." / "このページは英語のみです。"

### State Persistence

- Store the user's language preference in a cookie (`lang=en` or `lang=ja`).
- On subsequent visits, auto-redirect to the preferred language version.
- The cookie preference is overridden by explicit URL navigation (if user manually types `/ja/`, show Japanese regardless of cookie).

### No Auto-Detection at MVP

Do not auto-detect language from browser headers or IP at MVP. Reasons:
1. Many foreigners in Japan have Japanese-locale browsers but want English content.
2. Language detection creates confusion and annoys users who are shown the wrong language.
3. The default (English, no prefix) serves the primary audience. Japanese speakers can click "JP."

Auto-detection may be added in Phase 3 with a clear "You appear to be in Japan. Would you like to switch to Japanese?" prompt.

---

## 8. Phase Rollout Plan

### MVP (Launch)

- English content only.
- Japanese UI strings are ready in i18n files but not deployed.
- No `/ja/` routes exist.
- Language switcher is not visible.
- All legal pages are in English only. (特定商取引法 page is prepared but published on `/ja/` launch.)

### Phase 2 (Month 3-6)

- Launch `/ja/` with Japanese UI.
- Translate top 3 highest-traffic articles to Japanese.
- Enable language switcher in header.
- Implement hreflang tags.
- Publish 特定商取引法 page.
- Japanese meta titles and descriptions for translated pages.

### Phase 3 (Month 6-12)

- Translate all comparison articles to Japanese.
- Japanese-language SEO keyword research and optimization.
- Japanese newsletter variant.
- Japanese social media presence.
- Consider auto-language detection with opt-out.

---

*End of Bilingual Content Framework. This document governs all language-related decisions for the Chartedly platform.*

Sources:
- [Multilingual SEO in Japanese - Humble Bunny](https://www.humblebunny.com/multilingual-seo-in-japanese/)
- [Japanese Bilingual Website Design - Imagine Web Creation](https://imaginewebcreation.com/blog/japanese-bilingual-website-design/01/2018/)
- [Japanese Website Localization - iCross Border Japan](https://www.icrossborderjapan.com/en/blog/website-design/japan-website-localization/)
- [Website Localization in Japanese - Upgrade Co](https://www.upgrade.co.jp/en/website-localization-in-japanese-practical-guide-for-global-business/)
- [Microcopy UX Guide - Shopify](https://www.shopify.com/enterprise/blog/how-to-write-microcopy-that-influences-customers-even-if-they-don-t-read-it)
- [UX Writing Best Practices - Smashing Magazine](https://www.smashingmagazine.com/2024/06/how-improve-microcopy-ux-writing-tips-non-ux-writers/)
