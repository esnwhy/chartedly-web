# Chartedly i18n String File

**Date:** 2026-03-24
**Role:** INK -- Senior Content Strategist & Copywriter
**Purpose:** Complete i18n string file in JSON format, ready for developer import

---

## File Structure

Strings are organized by namespace. In an Astro/React project, these would typically live at:

```
src/
  i18n/
    en.json
    ja.json
```

Or for a namespace-based approach:

```
src/
  i18n/
    en/
      common.json
      nav.json
      comparison.json
      ...
    ja/
      common.json
      nav.json
      comparison.json
      ...
```

---

## en.json

```json
{
  "meta": {
    "siteName": "Chartedly",
    "siteTagline": "Clear comparisons for life in Japan",
    "locale": "en",
    "direction": "ltr"
  },
  "nav": {
    "home": "Home",
    "comparisons": "Comparisons",
    "about": "About",
    "guides": "Guides",
    "categories": "Categories",
    "search": "Search",
    "langSwitchLabel": "JP",
    "openMenu": "Open menu",
    "closeMenu": "Close menu",
    "skipToContent": "Skip to main content"
  },
  "hero": {
    "headline1": "Clear comparisons for life in Japan.",
    "headline2": "Find the best Japanese products in minutes.",
    "headline3": "No more guessing at the drugstore.",
    "headline4": "Honest rankings. Real testing. No guesswork.",
    "headline5": "We tested 50+ Japanese products so you don't have to.",
    "subtitle": "Find the best Japanese products with honest rankings and detailed charts — all in English.",
    "cta": "Browse Comparisons"
  },
  "sections": {
    "latestComparisons": "Latest Comparisons",
    "latestComparisonsSubtitle": "Our newest and most popular product comparisons.",
    "allComparisons": "All Skincare Comparisons",
    "howItWorks": "How Chartedly Works",
    "trustBar": "Independent reviews. No brand sponsorships. We buy everything ourselves.",
    "moreComparisons": "More Comparisons",
    "relatedComparisons": "Related Comparisons"
  },
  "howItWorks": {
    "step1Title": "We Research",
    "step1Desc": "We dig through Japanese review sites, @cosme rankings, Amazon JP data, and drugstore shelves to find every product worth considering.",
    "step2Title": "We Compare",
    "step2Desc": "Every product is scored on the same criteria — performance, price, availability, and how easy it is for foreigners to find and use.",
    "step3Title": "You Decide",
    "step3Desc": "Clear charts, honest verdicts, and direct buy links. Everything you need to pick the right product in minutes."
  },
  "newsletter": {
    "heading": "Get Weekly Picks",
    "subtitle": "The best Japanese products, delivered to your inbox every Friday.",
    "placeholder": "Your email address",
    "cta": "Subscribe",
    "privacy": "No spam. Unsubscribe anytime.",
    "successMessage": "You're in! Check your inbox for a welcome email.",
    "alreadySubscribed": "You're already subscribed. Check your inbox for our latest picks.",
    "unsubscribeSuccess": "You have been unsubscribed. Sorry to see you go."
  },
  "badges": {
    "topPick": "Top Pick",
    "budgetPick": "Budget Pick",
    "alsoGood": "Also Good"
  },
  "comparison": {
    "ourPicks": "Our Picks",
    "productsCompared": "{count} products compared",
    "readComparison": "Read Comparison",
    "readFullReview": "Read Full Review",
    "sortBy": "Sort by",
    "sortRanking": "Our Ranking",
    "sortPriceLow": "Price: Low to High",
    "sortPriceHigh": "Price: High to Low",
    "sortScore": "Score: High to Low",
    "sortNewest": "Newest First",
    "sortMostReviewed": "Most Reviewed",
    "howWeChose": "How We Chose",
    "whereToBy": "Where to Buy in Japan",
    "faq": "Frequently Asked Questions",
    "verdict": "Our Verdict",
    "score": "Score",
    "price": "Price",
    "product": "Product",
    "keyFeature": "Key Feature",
    "bestFor": "Best For",
    "prosTitle": "What we like",
    "consTitle": "What we don't",
    "specifications": "Specs",
    "vsTitle": "{productA} vs. {productB}: Which Should You Buy?",
    "winnerLabel": "Our Pick: {product}",
    "seeFullRanking": "See Full Ranking",
    "seeFullRankingDesc": "Read the complete comparison with all {count} products."
  },
  "card": {
    "topPick": "Top Pick:",
    "readMore": "Read Comparison →"
  },
  "filters": {
    "heading": "Filter Products",
    "priceRange": "Price Range",
    "category": "Category",
    "minimumScore": "Minimum Score",
    "availableAt": "Available at",
    "badges": "Badges",
    "allCategories": "All Categories",
    "apply": "Apply",
    "clearAll": "Clear All",
    "reset": "Reset"
  },
  "search": {
    "placeholder": "Search products, comparisons, guides...",
    "submit": "Search",
    "noResults": "No results for \"{query}\". Try a different search term, or browse all comparisons.",
    "resultsCount": "{count} results for \"{query}\"",
    "loading": "Searching..."
  },
  "buttons": {
    "buyAmazon": "Buy on Amazon JP",
    "checkRakuten": "Check Price at Rakuten",
    "findInStore": "Find in Store",
    "browseAll": "Browse All",
    "copyLink": "Copy Link",
    "share": "Share",
    "backToTop": "Back to Top",
    "loadMore": "Load More",
    "showAll": "Show All",
    "showLess": "Show Less",
    "compare": "Compare",
    "removeCompare": "Remove",
    "sendMessage": "Send Message",
    "close": "Close",
    "cancel": "Cancel",
    "tryAgain": "Try Again"
  },
  "pagination": {
    "previous": "Previous",
    "next": "Next",
    "pageOf": "Page {current} of {total}",
    "first": "First",
    "last": "Last",
    "showing": "Showing {from}-{to} of {total} results"
  },
  "timestamps": {
    "published": "Published {date}",
    "updated": "Updated {date}",
    "readingTime": "{minutes} min read",
    "byAuthor": "By {author}",
    "filedUnder": "Filed under {category}"
  },
  "emptyStates": {
    "noSearchResults": "No results for \"{query}\". Try a different search term, or browse all comparisons.",
    "noFilterMatch": "No products match your filters. Try adjusting your criteria.",
    "emptyCompareTray": "No products selected for comparison. Add products from any ranking page.",
    "categoryEmpty": "We're working on comparisons for this category. Check back soon."
  },
  "errors": {
    "generic": "Something went wrong. Please try again.",
    "notFound": "This page does not exist. It may have been moved or removed.",
    "serverError": "Our server is having a moment. Please try again in a few minutes.",
    "networkError": "Could not connect. Please check your internet connection and try again.",
    "invalidEmail": "Please enter a valid email address.",
    "emptyEmail": "Please enter your email address.",
    "requiredField": "This field is required.",
    "messageTooShort": "Please write at least 20 characters.",
    "rateLimit": "Too many requests. Please wait a moment and try again.",
    "brokenLink": "This product link may be outdated. Try searching for it directly on Amazon JP."
  },
  "success": {
    "linkCopied": "Link copied to clipboard.",
    "messageSent": "Message sent. We'll get back to you within 48 hours.",
    "addedToCompare": "Added to comparison.",
    "removedFromCompare": "Removed from comparison.",
    "filtersApplied": "Filters applied. Showing {count} products."
  },
  "loading": {
    "page": "Loading...",
    "search": "Searching...",
    "comparison": "Loading comparison...",
    "image": "Loading image",
    "prices": "Fetching latest prices..."
  },
  "toasts": {
    "articleUpdated": "This article was updated on {date}.",
    "pricesMayDiffer": "Prices were last checked on {date}. Current prices may differ.",
    "cookiesSaved": "Preferences saved.",
    "offline": "You're offline. Some features may not work.",
    "newArticles": "New comparisons published. Refresh to see the latest."
  },
  "cookies": {
    "heading": "We use cookies",
    "body": "We use cookies to improve your experience and analyze site traffic.",
    "acceptAll": "Accept All",
    "rejectNonEssential": "Reject Non-Essential",
    "managePreferences": "Manage Preferences",
    "privacyLink": "Read our Privacy Policy"
  },
  "a11y": {
    "searchInput": "Search Chartedly",
    "externalLink": "Opens in a new tab",
    "productImageAlt": "Photo of {product}",
    "chartAlt": "Chart comparing {metric} across {count} products",
    "starRating": "{score} out of 10",
    "expandSection": "Expand {section}",
    "collapseSection": "Collapse {section}",
    "languageSwitcher": "Switch language"
  },
  "disclosure": {
    "banner": "Chartedly earns a commission when you buy through our links. This never influences our picks.",
    "learnMore": "How we make money",
    "tooltipAffiliate": "This is an affiliate link. We earn a small commission at no extra cost to you."
  },
  "footer": {
    "tagline": "Clear comparisons for life in Japan.",
    "comparisons": "Comparisons",
    "aboutAndLegal": "About & Legal",
    "about": "About",
    "affiliateDisclosure": "Affiliate Disclosure",
    "privacyPolicy": "Privacy Policy",
    "terms": "Terms of Service",
    "follow": "Follow",
    "copyright": "© {year} Chartedly. All rights reserved.",
    "affiliateNote": "This site contains affiliate links. See disclosure."
  },
  "notFound": {
    "heading": "This page wandered off.",
    "body": "It might have been moved, renamed, or it never existed. No worries — here are some places to go instead:",
    "browseAll": "Browse all comparisons",
    "goHome": "Go to the homepage",
    "searchLink": "Search for something",
    "subtext": "Still lost? Email us at hello@chartedly.com and we'll point you in the right direction."
  },
  "about": {
    "pageTitle": "About Chartedly",
    "whoWeAre": "Who We Are",
    "whyWeBuiltThis": "Why We Built This",
    "howWeChoose": "How We Choose Products",
    "scoringSystem": "Our Scoring System",
    "howWeMakeMoney": "How We Make Money",
    "contact": "Contact"
  }
}
```

---

## ja.json

```json
{
  "meta": {
    "siteName": "Chartedly",
    "siteTagline": "日本の暮らしを、わかりやすく比較",
    "locale": "ja",
    "direction": "ltr"
  },
  "nav": {
    "home": "ホーム",
    "comparisons": "比較",
    "about": "サイトについて",
    "guides": "ガイド",
    "categories": "カテゴリー",
    "search": "検索",
    "langSwitchLabel": "EN",
    "openMenu": "メニューを開く",
    "closeMenu": "メニューを閉じる",
    "skipToContent": "メインコンテンツへ"
  },
  "hero": {
    "headline1": "日本の暮らしを、わかりやすく比較。",
    "headline2": "最適な日本製品が、数分で見つかる。",
    "headline3": "ドラッグストアで迷う時間は終わり。",
    "headline4": "正直なランキング。実際のテスト。当て推量なし。",
    "headline5": "50以上の日本製品をテスト済み。あなたの代わりに。",
    "subtitle": "詳しいチャートと正直なランキングで、最適な日本製品が見つかります。",
    "cta": "比較を見る"
  },
  "sections": {
    "latestComparisons": "最新の比較",
    "latestComparisonsSubtitle": "最新の人気比較記事をご覧ください。",
    "allComparisons": "スキンケア比較一覧",
    "howItWorks": "Charted lyの使い方",
    "trustBar": "独立したレビュー。企業スポンサーなし。すべて自費購入。",
    "moreComparisons": "関連する比較",
    "relatedComparisons": "関連する比較"
  },
  "howItWorks": {
    "step1Title": "徹底リサーチ",
    "step1Desc": "日本のレビューサイト、@cosmeランキング、Amazon JPのデータ、ドラッグストアの棚まで、検討に値するすべての製品を調査します。",
    "step2Title": "公平に比較",
    "step2Desc": "すべての製品を同じ基準で評価。性能、価格、入手しやすさ、外国人にとっての使いやすさ。",
    "step3Title": "あなたが選ぶ",
    "step3Desc": "わかりやすいチャート、正直な評価、購入リンク。最適な製品を数分で選べます。"
  },
  "newsletter": {
    "heading": "週刊おすすめを受け取る",
    "subtitle": "毎週金曜日、おすすめ日本製品をお届け。",
    "placeholder": "メールアドレス",
    "cta": "登録する",
    "privacy": "スパムなし。いつでも解除可能。",
    "successMessage": "登録完了。ウェルカムメールをご確認ください。",
    "alreadySubscribed": "すでに登録済みです。最新のおすすめはメールをご確認ください。",
    "unsubscribeSuccess": "登録を解除しました。またのご利用をお待ちしています。"
  },
  "badges": {
    "topPick": "トップピック",
    "budgetPick": "コスパ最強",
    "alsoGood": "こちらもおすすめ"
  },
  "comparison": {
    "ourPicks": "おすすめ",
    "productsCompared": "{count}製品を比較",
    "readComparison": "比較を見る",
    "readFullReview": "詳細レビューを読む",
    "sortBy": "並べ替え",
    "sortRanking": "おすすめ順",
    "sortPriceLow": "価格が安い順",
    "sortPriceHigh": "価格が高い順",
    "sortScore": "スコアが高い順",
    "sortNewest": "新着順",
    "sortMostReviewed": "レビュー数順",
    "howWeChose": "選定方法",
    "whereToBy": "日本での購入方法",
    "faq": "よくある質問",
    "verdict": "評価",
    "score": "スコア",
    "price": "価格",
    "product": "製品",
    "keyFeature": "特徴",
    "bestFor": "こんな人に",
    "prosTitle": "良い点",
    "consTitle": "気になる点",
    "specifications": "仕様",
    "vsTitle": "{productA} vs {productB}：どちらを買うべき？",
    "winnerLabel": "おすすめ：{product}",
    "seeFullRanking": "ランキング全体を見る",
    "seeFullRankingDesc": "{count}製品すべてを含む比較記事を読む。"
  },
  "card": {
    "topPick": "トップピック：",
    "readMore": "比較を見る →"
  },
  "filters": {
    "heading": "製品を絞り込む",
    "priceRange": "価格帯",
    "category": "カテゴリー",
    "minimumScore": "最低スコア",
    "availableAt": "販売店",
    "badges": "バッジ",
    "allCategories": "すべてのカテゴリー",
    "apply": "適用",
    "clearAll": "すべてクリア",
    "reset": "リセット"
  },
  "search": {
    "placeholder": "製品・比較・ガイドを検索...",
    "submit": "検索",
    "noResults": "「{query}」の検索結果はありません。別のキーワードで検索するか、すべての比較をご覧ください。",
    "resultsCount": "「{query}」の検索結果：{count}件",
    "loading": "検索中..."
  },
  "buttons": {
    "buyAmazon": "Amazonで購入",
    "checkRakuten": "楽天で価格を確認",
    "findInStore": "店舗で探す",
    "browseAll": "すべて見る",
    "copyLink": "リンクをコピー",
    "share": "シェア",
    "backToTop": "トップに戻る",
    "loadMore": "もっと見る",
    "showAll": "すべて表示",
    "showLess": "閉じる",
    "compare": "比較する",
    "removeCompare": "削除",
    "sendMessage": "メッセージを送信",
    "close": "閉じる",
    "cancel": "キャンセル",
    "tryAgain": "もう一度試す"
  },
  "pagination": {
    "previous": "前へ",
    "next": "次へ",
    "pageOf": "{total}ページ中{current}ページ目",
    "first": "最初",
    "last": "最後",
    "showing": "{total}件中{from}-{to}件を表示"
  },
  "timestamps": {
    "published": "{date} 公開",
    "updated": "{date} 更新",
    "readingTime": "読了時間 {minutes}分",
    "byAuthor": "著者：{author}",
    "filedUnder": "カテゴリー：{category}"
  },
  "emptyStates": {
    "noSearchResults": "「{query}」の検索結果はありません。別のキーワードか、すべての比較をご覧ください。",
    "noFilterMatch": "条件に一致する製品がありません。条件を変更してください。",
    "emptyCompareTray": "比較する製品が選択されていません。ランキングページから追加してください。",
    "categoryEmpty": "このカテゴリーの比較記事を準備中です。近日公開予定。"
  },
  "errors": {
    "generic": "エラーが発生しました。もう一度お試しください。",
    "notFound": "このページは存在しません。移動または削除された可能性があります。",
    "serverError": "サーバーに問題が発生しています。数分後にもう一度お試しください。",
    "networkError": "接続できませんでした。インターネット接続を確認し、もう一度お試しください。",
    "invalidEmail": "有効なメールアドレスを入力してください。",
    "emptyEmail": "メールアドレスを入力してください。",
    "requiredField": "この項目は必須です。",
    "messageTooShort": "20文字以上入力してください。",
    "rateLimit": "リクエストが多すぎます。少々お待ちいただき、もう一度お試しください。",
    "brokenLink": "この製品リンクは古くなっている可能性があります。Amazon JPで直接検索してください。"
  },
  "success": {
    "linkCopied": "リンクをコピーしました。",
    "messageSent": "メッセージを送信しました。48時間以内にご返信します。",
    "addedToCompare": "比較に追加しました。",
    "removedFromCompare": "比較から削除しました。",
    "filtersApplied": "フィルターを適用。{count}件の製品を表示中。"
  },
  "loading": {
    "page": "読み込み中...",
    "search": "検索中...",
    "comparison": "比較を読み込み中...",
    "image": "画像を読み込み中",
    "prices": "最新の価格を取得中..."
  },
  "toasts": {
    "articleUpdated": "この記事は{date}に更新されました。",
    "pricesMayDiffer": "価格は{date}に最終確認済み。現在の価格は異なる場合があります。",
    "cookiesSaved": "設定を保存しました。",
    "offline": "オフラインです。一部の機能が利用できない場合があります。",
    "newArticles": "新しい比較記事が公開されました。更新してご覧ください。"
  },
  "cookies": {
    "heading": "Cookieを使用しています",
    "body": "サイトの利用体験向上とトラフィック分析のためにCookieを使用しています。",
    "acceptAll": "すべて許可",
    "rejectNonEssential": "必須以外を拒否",
    "managePreferences": "設定を管理",
    "privacyLink": "プライバシーポリシーを読む"
  },
  "a11y": {
    "searchInput": "Charted lyを検索",
    "externalLink": "新しいタブで開きます",
    "productImageAlt": "{product}の写真",
    "chartAlt": "{count}製品の{metric}比較チャート",
    "starRating": "10点中{score}点",
    "expandSection": "{section}を展開",
    "collapseSection": "{section}を閉じる",
    "languageSwitcher": "言語を切替"
  },
  "disclosure": {
    "banner": "Charted lyはリンク経由の購入で手数料を受け取りますが、おすすめの選定には一切影響しません。",
    "learnMore": "収益化について",
    "tooltipAffiliate": "アフィリエイトリンクです。追加費用なしで少額の手数料を受け取ります。"
  },
  "footer": {
    "tagline": "日本の暮らしを、わかりやすく比較。",
    "comparisons": "比較",
    "aboutAndLegal": "サイト情報",
    "about": "サイトについて",
    "affiliateDisclosure": "アフィリエイト開示",
    "privacyPolicy": "プライバシーポリシー",
    "terms": "利用規約",
    "follow": "フォロー",
    "copyright": "© {year} Chartedly. All rights reserved.",
    "affiliateNote": "本サイトにはアフィリエイトリンクが含まれています。開示をご覧ください。"
  },
  "notFound": {
    "heading": "ページが見つかりませんでした。",
    "body": "このページは移動・削除されたか、存在しません。以下からお探しください：",
    "browseAll": "すべての比較を見る",
    "goHome": "トップページへ",
    "searchLink": "検索する",
    "subtext": "お困りの場合は hello@chartedly.com までご連絡ください。"
  },
  "about": {
    "pageTitle": "Charted lyについて",
    "whoWeAre": "私たちについて",
    "whyWeBuiltThis": "なぜ作ったのか",
    "howWeChoose": "製品の選定方法",
    "scoringSystem": "スコアリングシステム",
    "howWeMakeMoney": "収益化について",
    "contact": "お問い合わせ"
  }
}
```

---

## Developer Notes

1. **Interpolation syntax:** Uses `{variable}` placeholders compatible with most i18n libraries (i18next, next-intl, @astrojs/i18n, vue-i18n). Adapt the syntax to your framework if needed.

2. **Pluralization:** For strings that need plural forms (e.g., "1 product" vs. "5 products"), the Japanese strings do not require plural forms since Japanese does not distinguish grammatically. English plural strings can be extended with `_one` / `_other` suffixes per i18next conventions:
   ```json
   "productsCompared_one": "{count} product compared",
   "productsCompared_other": "{count} products compared"
   ```

3. **Date formatting:** Dates should be formatted by the i18n library, not hardcoded. Use `Intl.DateTimeFormat` or your framework's date utility.

4. **String keys are stable.** Once a key is published, do not rename it. Add new keys; deprecate old ones.

5. **Missing translations:** If a Japanese translation is unavailable, fall back to English. See `bilingual-framework.md` for fallback rules.

---

*End of i18n Strings. Total unique string keys: 180+. All strings provided in EN and JP.*
