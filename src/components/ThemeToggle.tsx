'use client';

import { Moon, Sun } from 'lucide-react';

import { useLanguage } from '@/components/LanguageProvider';
import { useTheme } from '@/components/ThemeProvider';

/**
 * Light / dark mode switch (sun & crescent moon).
 *
 * The visible icon is driven purely by CSS (`dark:hidden` / `hidden dark:block`)
 * so it matches the pre-paint `dark` class with no flash on load.
 */
export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const { t } = useLanguage();

  const label = theme === 'dark' ? t('theme.toLight') : t('theme.toDark');

  return (
    <button
      type="button"
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      aria-label={label}
      title={label}
      className="rounded-lg p-2 text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
    >
      <Sun className="h-5 w-5 dark:hidden" aria-hidden="true" />
      <Moon className="hidden h-5 w-5 dark:block" aria-hidden="true" />
    </button>
  );
}
