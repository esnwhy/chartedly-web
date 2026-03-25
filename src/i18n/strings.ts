/**
 * Chartedly i18n string catalog — server-side translation utility.
 *
 * Usage in .astro files:
 *   import { t } from '../i18n/strings';
 *   const label = t('nav.home', 'ja'); // => 'ホーム'
 */

export type Lang = 'en' | 'ja';

const strings: Record<Lang, Record<string, string>> = {
  en: {
    // ── Meta ──
    'meta.siteName': 'Chartedly',
    'meta.siteTagline': 'Clear comparisons for life in Japan',

    // ── Nav ──
    'nav.home': 'Home',
    'nav.comparisons': 'Comparisons',
    'nav.about': 'About',
    'nav.guides': 'Guides',
    'nav.categories': 'Categories',
    'nav.search': 'Search',
    'nav.langSwitchLabel': 'JP',
    'nav.openMenu': 'Open menu',
    'nav.closeMenu': 'Close menu',
    'nav.skipToContent': 'Skip to main content',

    // ── Hero ──
    'hero.headline1': 'Clear comparisons for life in Japan.',
    'hero.headline2': 'Find the best Japanese products in minutes.',
    'hero.headline3': 'No more guessing at the drugstore.',
    'hero.headline4': 'Honest rankings. Real testing. No guesswork.',
    'hero.headline5': 'We tested 50+ Japanese products so you don\'t have to.',
    'hero.subtitle': 'Find the best Japanese products with honest rankings and detailed charts — all in English.',
    'hero.cta': 'Browse Comparisons',

    // ── Sections ──
    'sections.latestComparisons': 'Latest Comparisons',
    'sections.latestComparisonsSubtitle': 'Our newest and most popular product comparisons.',
    'sections.allComparisons': 'All Skincare Comparisons',
    'sections.howItWorks': 'How Chartedly Works',
    'sections.trustBar': 'Independent reviews. No brand sponsorships. We buy everything ourselves.',
    'sections.moreComparisons': 'More Comparisons',
    'sections.relatedComparisons': 'Related Comparisons',

    // ── How It Works ──
    'howItWorks.step1Title': 'We Research',
    'howItWorks.step1Desc': 'We dig through Japanese review sites, @cosme rankings, Amazon JP data, and drugstore shelves to find every product worth considering.',
    'howItWorks.step2Title': 'We Compare',
    'howItWorks.step2Desc': 'Every product is scored on the same criteria — performance, price, availability, and how easy it is for foreigners to find and use.',
    'howItWorks.step3Title': 'You Decide',
    'howItWorks.step3Desc': 'Clear charts, honest verdicts, and direct buy links. Everything you need to pick the right product in minutes.',

    // ── Newsletter ──
    'newsletter.heading': 'Get Weekly Picks',
    'newsletter.subtitle': 'The best Japanese products, delivered to your inbox every Friday.',
    'newsletter.placeholder': 'Your email address',
    'newsletter.cta': 'Subscribe',
    'newsletter.privacy': 'No spam. Unsubscribe anytime.',
    'newsletter.successMessage': 'You\'re in! Check your inbox for a welcome email.',

    // ── Badges ──
    'badges.topPick': 'Top Pick',
    'badges.budgetPick': 'Budget Pick',
    'badges.alsoGood': 'Also Good',

    // ── Comparison ──
    'comparison.ourPicks': 'Our Picks',
    'comparison.productsCompared': '{count} products compared',
    'comparison.readComparison': 'Read Comparison',
    'comparison.readFullReview': 'Read Full Review',
    'comparison.sortBy': 'Sort by',
    'comparison.sortRanking': 'Our Ranking',
    'comparison.sortPriceLow': 'Price: Low to High',
    'comparison.sortPriceHigh': 'Price: High to Low',
    'comparison.sortScore': 'Score: High to Low',
    'comparison.sortNewest': 'Newest First',
    'comparison.howWeChose': 'How We Chose',
    'comparison.whereToBy': 'Where to Buy in Japan',
    'comparison.faq': 'Frequently Asked Questions',
    'comparison.verdict': 'Our Verdict',
    'comparison.score': 'Score',
    'comparison.price': 'Price',
    'comparison.product': 'Product',
    'comparison.keyFeature': 'Key Feature',
    'comparison.bestFor': 'Best For',
    'comparison.prosTitle': 'What we like',
    'comparison.consTitle': 'What we don\'t',
    'comparison.specifications': 'Specs',

    // ── Card ──
    'card.topPick': 'Top Pick:',
    'card.readMore': 'Read Comparison \u2192',

    // ── Filters ──
    'filters.heading': 'Filter Products',
    'filters.priceRange': 'Price Range',
    'filters.category': 'Category',
    'filters.minimumScore': 'Minimum Score',
    'filters.allCategories': 'All Categories',
    'filters.apply': 'Apply',
    'filters.clearAll': 'Clear All',
    'filters.reset': 'Reset',

    // ── Search ──
    'search.placeholder': 'Search products, comparisons, guides...',
    'search.submit': 'Search',
    'search.noResults': 'No results for "{query}". Try a different search term, or browse all comparisons.',
    'search.loading': 'Searching...',

    // ── Buttons ──
    'buttons.buyAmazon': 'Buy on Amazon JP',
    'buttons.checkRakuten': 'Check Price at Rakuten',
    'buttons.findInStore': 'Find in Store',
    'buttons.browseAll': 'Browse All',
    'buttons.copyLink': 'Copy Link',
    'buttons.share': 'Share',
    'buttons.backToTop': 'Back to Top',
    'buttons.loadMore': 'Load More',
    'buttons.showAll': 'Show All',
    'buttons.showLess': 'Show Less',
    'buttons.compare': 'Compare',
    'buttons.close': 'Close',
    'buttons.cancel': 'Cancel',
    'buttons.tryAgain': 'Try Again',

    // ── Pagination ──
    'pagination.previous': 'Previous',
    'pagination.next': 'Next',
    'pagination.pageOf': 'Page {current} of {total}',

    // ── Timestamps ──
    'timestamps.published': 'Published {date}',
    'timestamps.updated': 'Updated {date}',
    'timestamps.readingTime': '{minutes} min read',

    // ── Empty States ──
    'emptyStates.noSearchResults': 'No results for "{query}". Try a different search term, or browse all comparisons.',
    'emptyStates.noFilterMatch': 'No products match your filters. Try adjusting your criteria.',
    'emptyStates.categoryEmpty': 'We\'re working on comparisons for this category. Check back soon.',

    // ── Errors ──
    'errors.generic': 'Something went wrong. Please try again.',
    'errors.notFound': 'This page does not exist. It may have been moved or removed.',
    'errors.networkError': 'Could not connect. Please check your internet connection and try again.',

    // ── Success ──
    'success.linkCopied': 'Link copied to clipboard.',

    // ── Loading ──
    'loading.page': 'Loading...',
    'loading.search': 'Searching...',
    'loading.prices': 'Fetching latest prices...',

    // ── Score Labels ──
    'score.quality': 'Quality',
    'score.value': 'Value',
    'score.popularity': 'Popularity',
    'score.ease': 'Ease of Use',
    'score.innovation': 'Innovation',
    'score.excellent': 'Excellent',
    'score.good': 'Good',
    'score.poor': 'Poor',

    // ── Disclosure ──
    'disclosure.banner': 'Chartedly earns a commission when you buy through our links. This never influences our picks.',
    'disclosure.learnMore': 'How we make money',

    // ── Footer ──
    'footer.tagline': 'Clear comparisons for life in Japan.',
    'footer.comparisons': 'Comparisons',
    'footer.aboutAndLegal': 'About & Legal',
    'footer.about': 'About',
    'footer.affiliateDisclosure': 'Affiliate Disclosure',
    'footer.privacyPolicy': 'Privacy Policy',
    'footer.terms': 'Terms of Service',
    'footer.follow': 'Follow',
    'footer.copyright': '\u00A9 {year} Chartedly. All rights reserved.',

    // ── 404 ──
    'notFound.heading': 'This page wandered off.',
    'notFound.body': 'It might have been moved, renamed, or it never existed. No worries — here are some places to go instead:',
    'notFound.browseAll': 'Browse all comparisons',
    'notFound.goHome': 'Go to the homepage',

    // ── About ──
    'about.pageTitle': 'About Chartedly',
    'about.whoWeAre': 'Who We Are',
    'about.howWeChoose': 'How We Choose Products',
    'about.scoringSystem': 'Our Scoring System',
    'about.howWeMakeMoney': 'How We Make Money',
    'about.contact': 'Contact',

    // ── Accessibility ──
    'a11y.searchInput': 'Search Chartedly',
    'a11y.externalLink': 'Opens in a new tab',
    'a11y.languageSwitcher': 'Switch language',

    // ── Language Switch (legacy compat) ──
    'lang.switch': '日本語',
  },

  ja: {
    // ── Meta ──
    'meta.siteName': 'Chartedly',
    'meta.siteTagline': '日本の暮らしを、わかりやすく比較',

    // ── Nav ──
    'nav.home': 'ホーム',
    'nav.comparisons': '比較',
    'nav.about': 'サイトについて',
    'nav.guides': 'ガイド',
    'nav.categories': 'カテゴリー',
    'nav.search': '検索',
    'nav.langSwitchLabel': 'EN',
    'nav.openMenu': 'メニューを開く',
    'nav.closeMenu': 'メニューを閉じる',
    'nav.skipToContent': 'メインコンテンツへ',

    // ── Hero ──
    'hero.headline1': '日本の暮らしを、わかりやすく比較。',
    'hero.headline2': '最適な日本製品が、数分で見つかる。',
    'hero.headline3': 'ドラッグストアで迷う時間は終わり。',
    'hero.headline4': '正直なランキング。実際のテスト。当て推量なし。',
    'hero.headline5': '50以上の日本製品をテスト済み。あなたの代わりに。',
    'hero.subtitle': '詳しいチャートと正直なランキングで、最適な日本製品が見つかります。',
    'hero.cta': '比較を見る',

    // ── Sections ──
    'sections.latestComparisons': '最新の比較',
    'sections.latestComparisonsSubtitle': '最新の人気比較記事をご覧ください。',
    'sections.allComparisons': 'スキンケア比較一覧',
    'sections.howItWorks': 'Charted lyの使い方',
    'sections.trustBar': '独立したレビュー。企業スポンサーなし。すべて自費購入。',
    'sections.moreComparisons': '関連する比較',
    'sections.relatedComparisons': '関連する比較',

    // ── How It Works ──
    'howItWorks.step1Title': '徹底リサーチ',
    'howItWorks.step1Desc': '日本のレビューサイト、@cosmeランキング、Amazon JPのデータ、ドラッグストアの棚まで、検討に値するすべての製品を調査します。',
    'howItWorks.step2Title': '公平に比較',
    'howItWorks.step2Desc': 'すべての製品を同じ基準で評価。性能、価格、入手しやすさ、外国人にとっての使いやすさ。',
    'howItWorks.step3Title': 'あなたが選ぶ',
    'howItWorks.step3Desc': 'わかりやすいチャート、正直な評価、購入リンク。最適な製品を数分で選べます。',

    // ── Newsletter ──
    'newsletter.heading': '週刊おすすめを受け取る',
    'newsletter.subtitle': '毎週金曜日、おすすめ日本製品をお届け。',
    'newsletter.placeholder': 'メールアドレス',
    'newsletter.cta': '登録する',
    'newsletter.privacy': 'スパムなし。いつでも解除可能。',
    'newsletter.successMessage': '登録完了。ウェルカムメールをご確認ください。',

    // ── Badges ──
    'badges.topPick': 'トップピック',
    'badges.budgetPick': 'コスパ最強',
    'badges.alsoGood': 'こちらもおすすめ',

    // ── Comparison ──
    'comparison.ourPicks': 'おすすめ',
    'comparison.productsCompared': '{count}製品を比較',
    'comparison.readComparison': '比較を見る',
    'comparison.readFullReview': '詳細レビューを読む',
    'comparison.sortBy': '並べ替え',
    'comparison.sortRanking': 'おすすめ順',
    'comparison.sortPriceLow': '価格が安い順',
    'comparison.sortPriceHigh': '価格が高い順',
    'comparison.sortScore': 'スコアが高い順',
    'comparison.sortNewest': '新着順',
    'comparison.howWeChose': '選定方法',
    'comparison.whereToBy': '日本での購入方法',
    'comparison.faq': 'よくある質問',
    'comparison.verdict': '評価',
    'comparison.score': 'スコア',
    'comparison.price': '価格',
    'comparison.product': '製品',
    'comparison.keyFeature': '特徴',
    'comparison.bestFor': 'こんな人に',
    'comparison.prosTitle': '良い点',
    'comparison.consTitle': '気になる点',
    'comparison.specifications': '仕様',

    // ── Card ──
    'card.topPick': 'トップピック：',
    'card.readMore': '比較を見る \u2192',

    // ── Filters ──
    'filters.heading': '製品を絞り込む',
    'filters.priceRange': '価格帯',
    'filters.category': 'カテゴリー',
    'filters.minimumScore': '最低スコア',
    'filters.allCategories': 'すべてのカテゴリー',
    'filters.apply': '適用',
    'filters.clearAll': 'すべてクリア',
    'filters.reset': 'リセット',

    // ── Search ──
    'search.placeholder': '製品・比較・ガイドを検索...',
    'search.submit': '検索',
    'search.noResults': '「{query}」の検索結果はありません。別のキーワードで検索するか、すべての比較をご覧ください。',
    'search.loading': '検索中...',

    // ── Buttons ──
    'buttons.buyAmazon': 'Amazonで購入',
    'buttons.checkRakuten': '楽天で価格を確認',
    'buttons.findInStore': '店舗で探す',
    'buttons.browseAll': 'すべて見る',
    'buttons.copyLink': 'リンクをコピー',
    'buttons.share': 'シェア',
    'buttons.backToTop': 'トップに戻る',
    'buttons.loadMore': 'もっと見る',
    'buttons.showAll': 'すべて表示',
    'buttons.showLess': '閉じる',
    'buttons.compare': '比較する',
    'buttons.close': '閉じる',
    'buttons.cancel': 'キャンセル',
    'buttons.tryAgain': 'もう一度試す',

    // ── Pagination ──
    'pagination.previous': '前へ',
    'pagination.next': '次へ',
    'pagination.pageOf': '{total}ページ中{current}ページ目',

    // ── Timestamps ──
    'timestamps.published': '{date} 公開',
    'timestamps.updated': '{date} 更新',
    'timestamps.readingTime': '読了時間 {minutes}分',

    // ── Empty States ──
    'emptyStates.noSearchResults': '「{query}」の検索結果はありません。別のキーワードか、すべての比較をご覧ください。',
    'emptyStates.noFilterMatch': '条件に一致する製品がありません。条件を変更してください。',
    'emptyStates.categoryEmpty': 'このカテゴリーの比較記事を準備中です。近日公開予定。',

    // ── Errors ──
    'errors.generic': 'エラーが発生しました。もう一度お試しください。',
    'errors.notFound': 'このページは存在しません。移動または削除された可能性があります。',
    'errors.networkError': '接続できませんでした。インターネット接続を確認し、もう一度お試しください。',

    // ── Success ──
    'success.linkCopied': 'リンクをコピーしました。',

    // ── Loading ──
    'loading.page': '読み込み中...',
    'loading.search': '検索中...',
    'loading.prices': '最新の価格を取得中...',

    // ── Score Labels ──
    'score.quality': '品質',
    'score.value': 'コスパ',
    'score.popularity': '人気度',
    'score.ease': '使いやすさ',
    'score.innovation': '革新性',
    'score.excellent': '優秀',
    'score.good': '良好',
    'score.poor': '要改善',

    // ── Disclosure ──
    'disclosure.banner': 'Charted lyはリンク経由の購入で手数料を受け取りますが、おすすめの選定には一切影響しません。',
    'disclosure.learnMore': '収益化について',

    // ── Footer ──
    'footer.tagline': '日本の暮らしを、わかりやすく比較。',
    'footer.comparisons': '比較',
    'footer.aboutAndLegal': 'サイト情報',
    'footer.about': 'サイトについて',
    'footer.affiliateDisclosure': 'アフィリエイト開示',
    'footer.privacyPolicy': 'プライバシーポリシー',
    'footer.terms': '利用規約',
    'footer.follow': 'フォロー',
    'footer.copyright': '\u00A9 {year} Chartedly. All rights reserved.',

    // ── 404 ──
    'notFound.heading': 'ページが見つかりませんでした。',
    'notFound.body': 'このページは移動・削除されたか、存在しません。以下からお探しください：',
    'notFound.browseAll': 'すべての比較を見る',
    'notFound.goHome': 'トップページへ',

    // ── About ──
    'about.pageTitle': 'Charted lyについて',
    'about.whoWeAre': '私たちについて',
    'about.howWeChoose': '製品の選定方法',
    'about.scoringSystem': 'スコアリングシステム',
    'about.howWeMakeMoney': '収益化について',
    'about.contact': 'お問い合わせ',

    // ── Accessibility ──
    'a11y.searchInput': 'Charted lyを検索',
    'a11y.externalLink': '新しいタブで開きます',
    'a11y.languageSwitcher': '言語を切替',

    // ── Language Switch (legacy compat) ──
    'lang.switch': 'English',
  },
};

/**
 * Translate a key for a given language.
 * Falls back to English if the key is missing in the target language.
 * Supports {variable} interpolation via optional params.
 */
export function t(
  key: string,
  lang: Lang = 'en',
  params?: Record<string, string | number>,
): string {
  let value = strings[lang]?.[key] ?? strings['en']?.[key] ?? key;

  if (params) {
    for (const [k, v] of Object.entries(params)) {
      value = value.replace(new RegExp(`\\{${k}\\}`, 'g'), String(v));
    }
  }

  return value;
}

/** Get all keys available (useful for type checking in dev) */
export type StringKey = keyof typeof strings['en'];
