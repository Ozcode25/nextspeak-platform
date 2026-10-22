'use client';

import * as React from 'react';

import {
  clearLessonProgress,
  emptyProgress,
  loadProgress,
  markLessonCompleted,
  persistProgress,
  recordQuizResult,
  PROGRESS_STORAGE_KEY,
  type ProgressState,
} from '@/lib/progress';

interface ProgressContextValue {
  progress: ProgressState;
  /** True once localStorage has been read (avoids SSR/hydration mismatches). */
  hydrated: boolean;
  markCompleted: (slug: string) => void;
  recordQuiz: (slug: string, correct: number, total: number) => void;
  clearLesson: (slug: string) => void;
  resetProgress: () => void;
}

const ProgressContext = React.createContext<ProgressContextValue | null>(null);

export function ProgressProvider({ children }: { children: React.ReactNode }) {
  const [progress, setProgress] = React.useState<ProgressState>(emptyProgress);
  const [hydrated, setHydrated] = React.useState(false);
  const hydratedRef = React.useRef(false);

  // Read saved progress after mount (localStorage is unavailable during SSR).
  React.useEffect(() => {
    setProgress(loadProgress());
    hydratedRef.current = true;
    setHydrated(true);
  }, []);

  // Keep multiple open tabs in sync.
  React.useEffect(() => {
    const onStorage = (event: StorageEvent) => {
      if (event.key === null || event.key === PROGRESS_STORAGE_KEY) {
        setProgress(loadProgress());
      }
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  const update = React.useCallback((next: (state: ProgressState) => ProgressState) => {
    setProgress((current) => {
      // Never write before saved progress has been read: an update against the
      // initial empty state would overwrite the learner's real progress.
      if (!hydratedRef.current) return current;
      const updated = next(current);
      persistProgress(updated);
      return updated;
    });
  }, []);

  const value = React.useMemo<ProgressContextValue>(
    () => ({
      progress,
      hydrated,
      markCompleted: (slug) => update((state) => markLessonCompleted(state, slug)),
      recordQuiz: (slug, correct, total) =>
        update((state) => recordQuizResult(state, slug, correct, total)),
      clearLesson: (slug) => update((state) => clearLessonProgress(state, slug)),
      resetProgress: () => update(() => emptyProgress()),
    }),
    [progress, hydrated, update]
  );

  return <ProgressContext.Provider value={value}>{children}</ProgressContext.Provider>;
}

export function useProgress(): ProgressContextValue {
  const context = React.useContext(ProgressContext);
  if (!context) {
    throw new Error('useProgress must be used inside a <ProgressProvider>');
  }
  return context;
}
