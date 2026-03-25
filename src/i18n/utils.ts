/**
 * Chartedly language detection and URL utilities.
 *
 * URL pattern: /en/... or /ja/...
 * Default language: 'en'
 */

export type Lang = 'en' | 'ja';

const SUPPORTED_LANGS: Lang[] = ['en', 'ja'];
const DEFAULT_LANG: Lang = 'en';

/**
 * Extract language from a URL path.
 * Checks for /en/ or /ja/ prefix. Returns 'en' if no match.
 *
 * @example
 *   getLang('/ja/comparisons/sunscreen') // => 'ja'
 *   getLang('/en/about')                 // => 'en'
 *   getLang('/about')                    // => 'en'
 *   getLang(new URL('https://chartedly.com/ja/')) // => 'ja'
 */
export function getLang(url: string | URL): Lang {
  const pathname = typeof url === 'string' ? url : url.pathname;
  const segments = pathname.split('/').filter(Boolean);
  const first = segments[0]?.toLowerCase();

  if (first && SUPPORTED_LANGS.includes(first as Lang)) {
    return first as Lang;
  }

  return DEFAULT_LANG;
}

/**
 * Prefix a path with the given language.
 * Strips any existing lang prefix first to avoid double-prefixing.
 *
 * @example
 *   localizedPath('/about', 'ja')              // => '/ja/about'
 *   localizedPath('/en/about', 'ja')            // => '/ja/about'
 *   localizedPath('/ja/comparisons', 'en')      // => '/en/comparisons'
 *   localizedPath('/', 'ja')                    // => '/ja/'
 */
export function localizedPath(path: string, lang: Lang): string {
  // Normalize: ensure leading slash
  const normalized = path.startsWith('/') ? path : `/${path}`;

  // Strip existing language prefix
  const segments = normalized.split('/').filter(Boolean);
  const first = segments[0]?.toLowerCase();

  let stripped: string;
  if (first && SUPPORTED_LANGS.includes(first as Lang)) {
    stripped = '/' + segments.slice(1).join('/');
  } else {
    stripped = normalized;
  }

  // Ensure trailing state matches input
  const base = stripped === '/' ? '/' : stripped;

  return `/${lang}${base === '/' ? '/' : base}`;
}

/**
 * Get the alternate language (for lang-switch links).
 */
export function getAlternateLang(lang: Lang): Lang {
  return lang === 'en' ? 'ja' : 'en';
}

/**
 * Check if a language code is supported.
 */
export function isSupportedLang(lang: string): lang is Lang {
  return SUPPORTED_LANGS.includes(lang as Lang);
}
