/**
 * Progress storage for NextSpeak.
 *
 * Everything is saved in the browser's localStorage — there are no accounts
 * and no server involved. Each device keeps its own progress.
 *
 * Data shape (stored under PROGRESS_STORAGE_KEY):
 * {
 *   "version": 1,
 *   "lessons": {
 *     "<lesson-slug>": {
 *       "completed": true,
 *       "completedAt": "2026-01-31T18:00:00.000Z",
 *       "bestScore": 80,
 *       "bestCorrect": 4,
 *       "quizTotal": 5,
 *       "attempts": 2,
 *       "lastAttemptAt": "2026-01-31T17:58:00.000Z"
 *     }
 *   }
 * }
 */

export const PROGRESS_STORAGE_KEY = 'nextspeak-progress-v1';

/** Quiz score (0-100) required to auto-complete a lesson. */
export const PASSING_SCORE = 70;

export interface LessonProgress {
  /** True once the learner completed the lesson (quiz passed or marked manually). */
  completed: boolean;
  /** ISO date when the lesson was completed. */
  completedAt?: string;
  /** Best quiz score so far (0-100). */
  bestScore: number | null;
  /** Number of correct answers in the best attempt. */
  bestCorrect?: number;
  /** Total number of questions in that quiz. */
  quizTotal?: number;
  /** How many quiz attempts were made. */
  attempts: number;
  /** ISO date of the last quiz attempt. */
  lastAttemptAt?: string;
}

export interface ProgressState {
  version: 1;
  lessons: Record<string, LessonProgress>;
}

export function emptyProgress(): ProgressState {
  return { version: 1, lessons: {} };
}

/** Load saved progress. Safe to call during SSR (returns empty progress). */
export function loadProgress(): ProgressState {
  if (typeof window === 'undefined') return emptyProgress();
  try {
    const raw = window.localStorage.getItem(PROGRESS_STORAGE_KEY);
    if (!raw) return emptyProgress();
    const parsed = JSON.parse(raw) as ProgressState;
    if (!parsed || parsed.version !== 1 || typeof parsed.lessons !== 'object' || parsed.lessons === null) {
      return emptyProgress();
    }
    return parsed;
  } catch {
    // Corrupted JSON or storage disabled (private mode, blocked cookies).
    return emptyProgress();
  }
}

/** Persist progress. Failures (private mode, quota) are swallowed on purpose. */
export function persistProgress(state: ProgressState): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(PROGRESS_STORAGE_KEY, JSON.stringify(state));
  } catch {
    // Ignore: the app keeps working, progress just won't survive a reload.
  }
}

export function scorePercent(correct: number, total: number): number {
  if (total <= 0) return 0;
  return Math.round((correct / total) * 100);
}

function upsert(state: ProgressState, slug: string): { entry: LessonProgress; lessons: ProgressState['lessons'] } {
  const entry: LessonProgress = state.lessons[slug] ?? {
    completed: false,
    bestScore: null,
    attempts: 0,
  };
  return { entry, lessons: { ...state.lessons, [slug]: entry } };
}

/** Record a finished quiz attempt, keeping the best score. */
export function recordQuizResult(
  state: ProgressState,
  slug: string,
  correct: number,
  total: number
): ProgressState {
  const { entry } = upsert(state, slug);
  const percent = scorePercent(correct, total);
  const now = new Date().toISOString();

  const updated: LessonProgress = {
    ...entry,
    attempts: entry.attempts + 1,
    lastAttemptAt: now,
    bestScore: Math.max(entry.bestScore ?? 0, percent),
    bestCorrect: (entry.bestScore ?? 0) >= percent ? entry.bestCorrect ?? correct : correct,
    quizTotal: total,
  };

  if (percent >= PASSING_SCORE && !entry.completed) {
    updated.completed = true;
    updated.completedAt = now;
  }

  return { ...state, lessons: { ...state.lessons, [slug]: updated } };
}

/** Manually mark a lesson as completed. */
export function markLessonCompleted(state: ProgressState, slug: string): ProgressState {
  const { entry } = upsert(state, slug);
  if (entry.completed) return state;
  return {
    ...state,
    lessons: { ...state.lessons, [slug]: { ...entry, completed: true, completedAt: new Date().toISOString() } },
  };
}

/** Remove progress for a single lesson (e.g. before retaking). */
export function clearLessonProgress(state: ProgressState, slug: string): ProgressState {
  if (!state.lessons[slug]) return state;
  const lessons = { ...state.lessons };
  delete lessons[slug];
  return { ...state, lessons };
}

export interface ProgressSummary {
  completedLessons: number;
  totalLessons: number;
  /** Course completion percentage based on completed lessons (0-100). */
  percent: number;
  quizzesTaken: number;
  /** Average of best quiz scores, or null when no quiz was taken yet. */
  averageScore: number | null;
}

export function summarize(state: ProgressState, totalLessons: number): ProgressSummary {
  const entries = Object.values(state.lessons);
  const completedLessons = entries.filter((entry) => entry.completed).length;
  const scored = entries.filter((entry) => entry.bestScore !== null);
  const averageScore =
    scored.length > 0
      ? Math.round(scored.reduce((sum, entry) => sum + (entry.bestScore ?? 0), 0) / scored.length)
      : null;

  return {
    completedLessons,
    totalLessons,
    percent: totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0,
    quizzesTaken: scored.length,
    averageScore,
  };
}
