# User Flow: Language Switch (EN/JP)

**Flow ID:** UF-05
**Primary personas:** Emma (EN default, switches to JP for product names), Yuki (JP default), Marco (EN only), Aiko (JP default)
**Entry point:** Language toggle (available on all pages)
**Exit point:** Same page in target language
**Research basis:** Phase 02 Theme 2 (Language Barrier as Market Gap), Need #4 (English-language product info), Synthesis finding that "bilingual architecture must be built in from day one"

---

## Happy Path

```
┌─────────────────────────────────────────────┐
│  1. USER IS ON ANY PAGE                     │
│     Current language: English               │
│     URL: /en/product/biore-uv-aqua-rich/    │
│                                             │
│     Language toggle visible in:             │
│     - Header nav (desktop): "EN | JP"       │
│     - Header nav (mobile): "EN | JP"        │
│     Current language highlighted/underlined  │
└──────────────────────┬──────────────────────┘
                       │
              [Taps "JP"]
                       │
                       ▼
┌─────────────────────────────────────────────┐
│  2. LANGUAGE SWITCH PROCESSING              │
│     - URL changes: /en/... → /ja/...        │
│     - All UI chrome updates to Japanese     │
│     - Product content loads in Japanese     │
│     - Preference saved to localStorage      │
│     - No page reload (client-side swap)     │
│       OR minimal-latency navigation         │
│     - Scroll position preserved             │
└──────────────────────┬──────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────┐
│  3. PAGE RENDERED IN JAPANESE               │
│     URL: /ja/product/biore-uv-aqua-rich/    │
│                                             │
│     All content now in Japanese:            │
│     - Product name: ビオレ UV アクアリッチ    │
│     - Verdict: Japanese editorial text      │
│     - Nav labels: ホーム, 探す, ランキング    │
│     - Price: ¥1,580 (unchanged)             │
│     - Buy button: "Amazonで購入"             │
│                                             │
│     Toggle now shows: "EN | JP" with JP     │
│     highlighted                             │
└─────────────────────────────────────────────┘
```

---

## Step-by-Step Detail

| Step | Screen | User Action | Emotion | Technical Detail |
|------|--------|-------------|---------|-----------------|
| 1 | Any page | Locates language toggle in header | Neutral, intentional | Toggle is always in the same position. Uses language codes (EN/JP), not flags — flags represent countries, not languages |
| 2 | Transition | Taps target language | Expects instant change | Client-side: swap content via pre-fetched JSON. Server-side fallback: navigate to `/ja/` equivalent URL. Target: <300ms perceived switch time |
| 3 | Same page, new language | Confirms content is in target language | Satisfied if seamless; frustrated if partial | Every string on-screen must change. No mixed-language states |

---

## Language Detection & Defaults

| Signal | Priority | Behavior |
|--------|----------|----------|
| URL path prefix (`/en/` or `/ja/`) | 1 (highest) | Explicit language from URL always wins |
| Saved preference (localStorage) | 2 | If user previously selected a language, use it for root `/` visits |
| `Accept-Language` header | 3 | First visit with no preference: detect from browser settings |
| Default fallback | 4 (lowest) | English (EN) — per project brief, EN is Phase 1 primary |

**First visit flow:**
1. User visits `chartedly.com/` (no language prefix)
2. Server checks `Accept-Language` header
3. If `ja` is present and preferred → redirect to `/ja/`
4. Otherwise → redirect to `/en/`
5. Preference stored in localStorage for subsequent visits

---

## URL Structure

| English | Japanese | Notes |
|---------|----------|-------|
| `/en/` | `/ja/` | Homepage |
| `/en/explore/beauty/` | `/ja/explore/beauty/` | Category — slug stays English (for URL consistency and SEO) |
| `/en/product/biore-uv-aqua-rich/` | `/ja/product/biore-uv-aqua-rich/` | Product — slug stays English |
| `/en/search/?q=sunscreen` | `/ja/search/?q=日焼け止め` | Search query can be in either language |
| `/en/blog/tax-free-guide/` | `/ja/blog/tax-free-guide/` | Blog slug stays English |

**Key decision:** URL slugs remain in English across both languages. This avoids:
- Duplicate content confusion for search engines
- Broken links when sharing across language contexts
- Complexity of maintaining two slug systems

`hreflang` tags on every page link the EN and JA versions for search engines.

---

## Alternate Paths

### Alt 1a: First-time visitor on Japanese browser
User visits `chartedly.com/` from a Japanese-locale browser.
- `Accept-Language: ja,en;q=0.9`
- Auto-redirects to `/ja/`
- All content loads in Japanese
- EN/JP toggle shows JP highlighted
- If user switches to EN, preference saved and subsequent visits load EN

### Alt 1b: User arrives via shared English URL but prefers Japanese
Marco shares `/en/product/biore-uv-aqua-rich/` with a Japanese friend.
- Friend's browser loads the English page (URL explicit = highest priority)
- Friend taps "JP" toggle
- URL changes to `/ja/product/biore-uv-aqua-rich/`
- Preference saved for future visits

### Alt 2a: User searches in Japanese while on English site
Emma types "日焼け止め" into the search bar while on `/en/`.
- Search understands Japanese query regardless of site language
- Results displayed in English (current site language)
- Product names show both English and Japanese names in results
- This cross-language search is critical for expats who know the Japanese product name

### Alt 3a: Content not yet available in target language
User switches to Japanese, but a specific blog post only exists in English.
- Banner at top: "This article is not yet available in Japanese. Showing English version."
- Page renders in English with Japanese UI chrome
- Toggle still shows JP as active (UI is Japanese, content is English fallback)

---

## Edge Cases & Error States

| Scenario | Behavior | UI Response |
|----------|----------|-------------|
| localStorage is disabled / private browsing | Preference cannot be saved | Language toggle still works per-session. Each new session re-detects from `Accept-Language` |
| User rapidly toggles between EN and JP | Debounce: 300ms before executing switch | No jarring content flashing. Final selection wins |
| SEO crawler visits without `Accept-Language` | Default to English | Root `/` serves EN. Crawlers follow `hreflang` to discover JA versions |
| Product detail page has partial JP content (e.g., specs in EN, review in JP) | Full page renders in target language | Any missing JP fields show English fallback with "(English)" label. No empty fields |
| URL manually edited to invalid language (e.g., `/fr/explore/beauty/`) | 404 or redirect | Redirect to `/en/explore/beauty/` with toast: "Content available in English and Japanese" |
| User bookmarks the JA version of a page | Bookmark preserves `/ja/` prefix | Loads in Japanese regardless of localStorage preference (URL wins) |
| Comparison page: products added in EN, user switches to JP | All product names and specs switch to JP | Comparison table re-renders with JP content. Product slugs in URL unchanged |
| Right-to-left text concern | Not applicable | Japanese (vertical/horizontal LTR) and English (LTR) both use LTR layout |

---

## Content Parity Requirements

Per Phase 02 synthesis: "EN/JP must be co-equal content systems, not a translation layer."

| Content Type | EN | JP | Notes |
|-------------|----|----|-------|
| UI labels (nav, buttons, filters) | Required | Required | See labeling-system.md |
| Product names | English / Romaji | Japanese (katakana/kanji) | Both stored in content model |
| Product verdicts | Original EN editorial | Original JP editorial | Not machine-translated |
| Specs / attributes | EN | JP | Standardized values (e.g., "50ml" is universal) |
| Blog / guides | EN | JP (where available) | Fallback to EN if JP not yet written |
| Legal pages | EN | JP | Both required for compliance |
| Error messages | EN | JP | Full localization |
| Metadata (title, description) | EN | JP | Separate SEO optimization per language |

---

## Persona-Specific Notes

- **Emma (28):** Primary language is English but occasionally switches to Japanese to check the local product name before going to a physical store. Cross-language search (typing Japanese on EN site) is critical for her daily workflow.

- **Yuki (22):** Uses the Japanese site by default. May switch to English when sharing a product link with her non-Japanese-speaking friends. The toggle is a social sharing enabler.

- **Marco (35):** English only. He will never toggle to Japanese. But if he accidentally lands on a `/ja/` page (e.g., from a Japanese friend's link), the visible EN toggle gets him back immediately.

- **Aiko (40):** Japanese only in most cases. The existence of the English version is invisible to her unless she explicitly looks for it. The JP site must not feel like a secondary translation — it must feel native.

---

## Success Metrics

| Metric | Target | Measurement |
|--------|--------|-------------|
| Language toggle usage rate | 5-10% of sessions | Toggle click events / total sessions |
| Bounce rate after language switch | <15% | Bounces within 10s of toggle / toggle events |
| Content parity coverage | >95% of product pages in both languages | CMS audit |
| Language detection accuracy | >90% correct on first visit | Correct language served vs. user's subsequent manual switch |
| Cross-language search success | >80% return relevant results | Zero-result rate for cross-language queries |
