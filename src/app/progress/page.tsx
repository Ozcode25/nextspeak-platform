'use client';

import * as React from 'react';
import Link from 'next/link';
import { ArrowRight, CheckCircle2, CircleDashed, HardDrive, Trash2 } from 'lucide-react';

import { useLanguage } from '@/components/LanguageProvider';
import { useProgress } from '@/components/ProgressProvider';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Progress } from '@/components/ui/Progress';
import { lessons } from '@/content/lessons';
import { summarize } from '@/lib/progress';

export default function ProgressPage() {
  const { progress, hydrated, clearLesson, resetProgress } = useProgress();
  const { t } = useLanguage();
  const [confirmingReset, setConfirmingReset] = React.useState(false);
  const summary = summarize(progress, lessons.length);

  const handleReset = () => {
    if (!confirmingReset) {
      setConfirmingReset(true);
      return;
    }
    resetProgress();
    setConfirmingReset(false);
  };

  const stats = [
    {
      label: t('progress.statCompleted'),
      value: hydrated ? `${summary.completedLessons}/${summary.totalLessons}` : '—',
    },
    {
      label: t('progress.statAvgScore'),
      value: hydrated && summary.averageScore !== null ? `${summary.averageScore}%` : '—',
    },
    { label: t('progress.statQuizzes'), value: hydrated ? `${summary.quizzesTaken}` : '—' },
  ];

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
      <header className="max-w-3xl">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white sm:text-4xl">{t('progress.title')}</h1>
        <p className="mt-3 text-gray-600 dark:text-gray-300">{t('progress.subtitle')}</p>
      </header>

      {/* Stat cards */}
      <dl className="mt-8 grid gap-4 sm:grid-cols-3">
        {stats.map((stat) => (
          <Card key={stat.label}>
            <CardContent className="pt-6 text-center">
              <dt className="text-sm text-gray-500 dark:text-gray-400">{stat.label}</dt>
              <dd className="mt-1 text-3xl font-bold text-primary-600 dark:text-primary-400">{stat.value}</dd>
            </CardContent>
          </Card>
        ))}
      </dl>

      {/* Overall bar */}
      <section aria-label={t('progress.completion')} className="mt-6 rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold text-gray-900 dark:text-white">{t('progress.completion')}</h2>
          <span className="text-sm text-gray-600 dark:text-gray-300">{hydrated ? summary.percent : 0}%</span>
        </div>
        <Progress
          className="mt-3"
          value={hydrated ? summary.percent : 0}
          variant={summary.percent === 100 ? 'success' : 'default'}
          aria-label={t('progress.completionAria', { percent: hydrated ? summary.percent : 0 })}
        />
      </section>

      {/* Per-lesson list */}
      <section aria-labelledby="per-lesson-heading" className="mt-10">
        <h2 id="per-lesson-heading" className="text-xl font-semibold text-gray-900 dark:text-white">
          {t('progress.byLesson')}
        </h2>
        <ul className="mt-4 divide-y divide-gray-100 rounded-xl border border-gray-200 bg-white dark:divide-gray-800 dark:border-gray-800 dark:bg-gray-900">
          {lessons.map((lesson) => {
            const entry = progress.lessons[lesson.slug];
            const completed = hydrated && entry?.completed;
            const bestScore = hydrated && typeof entry?.bestScore === 'number' ? entry.bestScore : null;

            return (
              <li key={lesson.slug} className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="min-w-0">
                  <Link
                    href={`/lessons/${lesson.slug}`}
                    className="rounded font-medium text-gray-900 hover:text-primary-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 dark:text-white dark:hover:text-primary-400"
                  >
                    {lesson.title}
                  </Link>
                  <p className="mt-0.5 text-sm text-gray-500 dark:text-gray-400">
                    {bestScore !== null
                      ? t('progress.bestScore', { score: bestScore })
                      : entry
                        ? t('progress.quizNotTaken')
                        : t('badge.notStarted')}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  {completed ? (
                    <Badge variant="success">
                      <CheckCircle2 className="mr-1 h-3 w-3" aria-hidden="true" />
                      {t('badge.completed')}
                    </Badge>
                  ) : entry ? (
                    <Badge variant="secondary">
                      <CircleDashed className="mr-1 h-3 w-3" aria-hidden="true" />
                      {t('progress.inProgress')}
                    </Badge>
                  ) : (
                    <Badge variant="secondary">
                      <CircleDashed className="mr-1 h-3 w-3" aria-hidden="true" />
                      {t('badge.notStarted')}
                    </Badge>
                  )}
                  <Button asChild size="sm" variant="ghost" className="gap-1.5">
                    <Link href={`/lessons/${lesson.slug}/quiz`}>
                      {bestScore !== null ? t('progress.retake') : t('progress.take')}
                      <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                    </Link>
                  </Button>
                  {entry && (
                    <Button
                      type="button"
                      size="sm"
                      variant="ghost"
                      className="gap-1.5 text-red-600 hover:text-red-700 dark:text-red-400"
                      onClick={() => clearLesson(lesson.slug)}
                      aria-label={t('progress.clearAria', { title: lesson.title })}
                    >
                      <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
                    </Button>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      </section>

      {/* Storage note + reset */}
      <section className="mt-10 rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900">
        <h2 className="flex items-center gap-2 font-semibold text-gray-900 dark:text-white">
          <HardDrive className="h-5 w-5 text-primary-600 dark:text-primary-400" aria-hidden="true" />
          {t('progress.storageTitle')}
        </h2>
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">{t('progress.storageText')}</p>
        <div className="mt-4">
          <Button
            type="button"
            variant={confirmingReset ? 'destructive' : 'outline'}
            className="gap-2"
            onClick={handleReset}
            disabled={!hydrated || summary.totalLessons === 0 || (!confirmingReset && Object.keys(progress.lessons).length === 0)}
          >
            <Trash2 className="h-4 w-4" aria-hidden="true" />
            {confirmingReset ? t('progress.confirmDelete') : t('progress.resetAll')}
          </Button>
          {confirmingReset && (
            <p role="alert" className="mt-2 text-sm text-red-600 dark:text-red-400">
              {t('progress.confirmWarning')}
            </p>
          )}
        </div>
      </section>
    </div>
  );
}
