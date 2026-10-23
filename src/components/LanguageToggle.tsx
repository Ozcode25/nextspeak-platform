'use client';

import { useLanguage } from '@/components/LanguageProvider';
import { LANGS } from '@/lib/i18n';
import { cn } from '@/lib/utils';

/**
 * Compact EN / ES switcher shown in the header.
 *
 * It changes the interface language only — lessons, quizzes and
 * explanations stay in English (that is what the app teaches).
 */
export function LanguageToggle() {
  const { lang, setLang } = useLanguage();

  return (
    <div
      className="flex items-center rounded-lg border border-gray-200 p-0.5 dark:border-gray-700"
      role="group"
      aria-label="Language / Idioma"
    >
      {LANGS.map((option) => (
        <button
          key={option}
          type="button"
          lang={option}
          onClick={() => setLang(option)}
          aria-pressed={lang === option}
          className={cn(
            'rounded-md px-2 py-1 text-xs font-semibold uppercase tracking-wide transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500',
            lang === option
              ? 'bg-primary-600 text-white'
              : 'text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white'
          )}
        >
          {option}
        </button>
      ))}
    </div>
  );
}
