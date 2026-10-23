'use client';

import * as React from 'react';
import Link from 'next/link';
import { CheckCircle2, ListRestart, PlayCircle } from 'lucide-react';

import { useLanguage } from '@/components/LanguageProvider';
import { useProgress } from '@/components/ProgressProvider';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { PASSING_SCORE } from '@/lib/progress';

interface LessonProgressPanelProps {
  slug: string;
  quizCount: number;
}

export function LessonProgressPanel({ slug, quizCount }: LessonProgressPanelProps) {
  const { progress, hydrated, markCompleted, clearLesson } = useProgress();
  const { t } = useLanguage();
  const [announcement, setAnnouncement] = React.useState('');

  const entry = progress.lessons[slug];
  const completed = hydrated && entry?.completed;
  const bestScore = hydrated && typeof entry?.bestScore === 'number' ? entry.bestScore : null;

  const handleComplete = () => {
    markCompleted(slug);
    setAnnouncement(t('panel.markedAnnouncement'));
  };

  const handleClear = () => {
    clearLesson(slug);
    setAnnouncement(t('panel.resetAnnouncement'));
  };

  return (
    <section
      aria-label={t('panel.aria')}
      className="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900"
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">{t('panel.title')}</h2>
        {completed ? (
          <Badge variant="success">
            <CheckCircle2 className="mr-1 h-3 w-3" aria-hidden="true" />
            {t('badge.completed')}
          </Badge>
        ) : (
          <Badge variant="secondary">{t('panel.notCompleted')}</Badge>
        )}
      </div>

      <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
        {bestScore !== null
          ? t('panel.bestScore', { score: bestScore, pass: PASSING_SCORE })
          : t('panel.intro', { n: quizCount, pass: PASSING_SCORE })}
      </p>

      <div className="mt-4 flex flex-col gap-3 sm:flex-row">
        <Button asChild className="gap-2">
          <Link href={`/lessons/${slug}/quiz`}>
            <PlayCircle className="h-4 w-4" aria-hidden="true" />
            {bestScore !== null ? t('panel.retake') : t('panel.take')}
          </Link>
        </Button>

        {!completed && (
          <Button type="button" variant="outline" className="gap-2" onClick={handleComplete}>
            <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
            {t('panel.markCompleted')}
          </Button>
        )}

        {hydrated && entry && (
          <Button type="button" variant="ghost" className="gap-2" onClick={handleClear}>
            <ListRestart className="h-4 w-4" aria-hidden="true" />
            {t('panel.reset')}
          </Button>
        )}
      </div>

      <p className="sr-only" role="status" aria-live="polite">
        {announcement}
      </p>
    </section>
  );
}
