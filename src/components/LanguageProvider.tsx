'use client';

import * as React from 'react';

import {
  DEFAULT_LANG,
  LANG_STORAGE_KEY,
  translate,
  type Lang,
  type TKey,
  type TVars,
} from '@/lib/i18n';

type TFunction = (key: TKey, vars?: TVars) => string;

interface LanguageContextValue {
  lang: Lang;
  setLang: (lang: Lang) => void;
  /** Translate a UI string (site chrome only — lesson content is always English). */
  t: TFunction;
}

const LanguageContext = React.createContext<LanguageContextValue | null>(null);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = React.useState<Lang>(DEFAULT_LANG);

  // Read the saved language after mount (localStorage is unavailable during SSR).
  React.useEffect(() => {
    try {
      const stored = window.localStorage.getItem(LANG_STORAGE_KEY);
      if (stored === 'en' || stored === 'es') {
        setLangState(stored);
      }
    } catch {
      // Storage may be blocked — stay on the default language.
    }
  }, []);

  // Keep the document language in sync for browsers and screen readers.
  React.useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  const setLang = React.useCallback((next: Lang) => {
    setLangState(next);
    try {
      window.localStorage.setItem(LANG_STORAGE_KEY, next);
    } catch {
      // Ignore storage failures — the choice still applies for this session.
    }
  }, []);

  const t: TFunction = React.useCallback(
    (key, vars) => translate(lang, key, vars),
    [lang]
  );

  const value = React.useMemo<LanguageContextValue>(
    () => ({ lang, setLang, t }),
    [lang, setLang, t]
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage(): LanguageContextValue {
  const context = React.useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used inside a <LanguageProvider>');
  }
  return context;
}
