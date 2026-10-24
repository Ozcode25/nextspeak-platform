'use client';

import * as React from 'react';

export type Theme = 'light' | 'dark';

/**
 * Keep in sync with the inline pre-paint script in `src/app/layout.tsx`
 * (the script runs before first paint so dark-mode users never see a flash).
 */
export const THEME_STORAGE_KEY = 'nextspeak-theme-v1';

interface ThemeContextValue {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = React.createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = React.useState<Theme>('light');

  // The inline script already applied the correct `dark` class before paint;
  // sync the React state (icon label) with it right after hydration.
  React.useEffect(() => {
    setThemeState(document.documentElement.classList.contains('dark') ? 'dark' : 'light');
  }, []);

  const apply = React.useCallback((next: Theme) => {
    document.documentElement.classList.toggle('dark', next === 'dark');
    setThemeState(next);
  }, []);

  const setTheme = React.useCallback(
    (next: Theme) => {
      apply(next);
      try {
        window.localStorage.setItem(THEME_STORAGE_KEY, next);
      } catch {
        // Ignore storage failures — the choice still applies for this session.
      }
    },
    [apply]
  );

  // While the user hasn't chosen explicitly, follow the OS preference live.
  React.useEffect(() => {
    const query = window.matchMedia('(prefers-color-scheme: dark)');
    const onChange = () => {
      let stored: string | null = null;
      try {
        stored = window.localStorage.getItem(THEME_STORAGE_KEY);
      } catch {
        // Storage blocked — keep following the OS preference.
      }
      if (stored !== 'light' && stored !== 'dark') {
        apply(query.matches ? 'dark' : 'light');
      }
    };
    query.addEventListener('change', onChange);
    return () => query.removeEventListener('change', onChange);
  }, [apply]);

  const value = React.useMemo<ThemeContextValue>(() => ({ theme, setTheme }), [theme, setTheme]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme(): ThemeContextValue {
  const context = React.useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used inside a <ThemeProvider>');
  }
  return context;
}
