import { translations, type Lang, type TranslationKey } from './translations';

const STORAGE_KEY = 'chartedly-lang';

/** Get the current language from localStorage, falling back to browser preference */
export function getLang(): Lang {
  if (typeof window === 'undefined') return 'en';
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored === 'en' || stored === 'ja') return stored;
  // Auto-detect from browser
  const browserLang = navigator.language.toLowerCase();
  return browserLang.startsWith('ja') ? 'ja' : 'en';
}

/** Set language and persist */
export function setLang(lang: Lang) {
  localStorage.setItem(STORAGE_KEY, lang);
  document.documentElement.lang = lang;
  applyTranslations(lang);
}

/** Toggle between en and ja */
export function toggleLang() {
  const current = getLang();
  setLang(current === 'en' ? 'ja' : 'en');
}

/** Translate a key */
export function t(key: TranslationKey, lang?: Lang): string {
  const l = lang ?? getLang();
  return translations[l][key] ?? translations['en'][key] ?? key;
}

/** Apply translations to all elements with data-i18n attribute */
export function applyTranslations(lang?: Lang) {
  const l = lang ?? getLang();
  document.querySelectorAll<HTMLElement>('[data-i18n]').forEach((el) => {
    const key = el.getAttribute('data-i18n') as TranslationKey;
    if (key && translations[l][key]) {
      el.textContent = translations[l][key];
    }
  });

  // Update placeholders
  document.querySelectorAll<HTMLInputElement>('[data-i18n-placeholder]').forEach((el) => {
    const key = el.getAttribute('data-i18n-placeholder') as TranslationKey;
    if (key && translations[l][key]) {
      el.placeholder = translations[l][key];
    }
  });

  // Update aria-labels
  document.querySelectorAll<HTMLElement>('[data-i18n-aria]').forEach((el) => {
    const key = el.getAttribute('data-i18n-aria') as TranslationKey;
    if (key && translations[l][key]) {
      el.setAttribute('aria-label', translations[l][key]);
    }
  });

  // Update page title if present
  const titleEl = document.querySelector('[data-i18n-title]');
  if (titleEl) {
    const key = titleEl.getAttribute('data-i18n-title') as TranslationKey;
    if (key && translations[l][key]) {
      document.title = translations[l][key];
    }
  }

  // Update the language switch button text
  document.querySelectorAll<HTMLElement>('[data-lang-switch]').forEach((el) => {
    el.textContent = translations[l]['lang.switch'];
  });

  // Dispatch event for components that need custom logic
  window.dispatchEvent(new CustomEvent('lang-changed', { detail: { lang: l } }));
}

/** Initialize i18n on page load */
export function initI18n() {
  const lang = getLang();
  document.documentElement.lang = lang;
  // Apply after a microtask to ensure DOM is ready
  queueMicrotask(() => applyTranslations(lang));
}
