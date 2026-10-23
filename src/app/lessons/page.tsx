'use client';

import * as React from 'react';
import Link from 'next/link';
import { ArrowRight, CheckCircle2, ClipboardList, Clock, HelpCircle } from 'lucide-react';

import { useLanguage } from '@/components/LanguageProvider';
import { useProgress } from '@/components/ProgressProvider';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Progress } from '@/components/ui/Progress';
import { lessons } from '@/content/lessons';
import { summarize } from '@/lib/progress';

export default function LessonsPage() {
  const { progress, hydrated } = useProgress();
  const { t } = useLanguage();
  const summary = summarize(progress, lessons.length);

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <header className="max-w-3xl">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white sm:text-4xl">{t('lessons.title')}</h1>
        <p className="mt-3 text-gray-600 dark:text-gray-300">{t('lessons.subtitle')}</p>
      </header>

      {/* Overall progress */}
      <section aria-label={t('lessons.overallAria')} className="mt-8 rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="font-medium text-gray-900 dark:text-white">
            {hydrated
              ? t('lessons.completedOf', {
                  done: summary.completedLessons,
                  total: summary.totalLessons,
                })
              : t('lessons.loading')}
          </p>
          {hydrated && summary.averageScore !== null && (
            <p className="text-sm text-gray-600 dark:text-gray-300">
              {t('lessons.avgScoreLabel')}{' '}
              <span className="font-semibold">{summary.averageScore}%</span>
            </p>
          )}
        </div>
        <Progress
          className="mt-3"
          value={hydrated ? summary.percent : 0}
          variant={summary.percent === 100 ? 'success' : 'default'}
          aria-label={t('progress.completionAria', { percent: hydrated ? summary.percent : 0 })}
        />
      </section>

      {/* Lesson grid */}
      <ul className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {lessons.map((lesson) => {
          const entry = progress.lessons[lesson.slug];
          const status = !hydrated
            ? null
            : entry?.completed
              ? 'completed'
              : entry && entry.bestScore !== null
                ? 'in-progress'
                : 'new';

          return (
            <li key={lesson.slug}>
              <Card className="flex h-full flex-col transition-shadow hover:shadow-md">
                <CardHeader>
                  <div className="mb-1 flex items-center justify-between gap-2">
                    <p className="text-sm font-medium text-primary-600 dark:text-primary-400">
                      {t('lessons.week', { week: lesson.week })}
                    </p>
                    {status === 'completed' && (
                      <Badge variant="success">
                        <CheckCircle2 className="mr-1 h-3 w-3" aria-hidden="true" />
                        {t('badge.completed')}
                      </Badge>
                    )}
                    {status === 'in-progress' && (
                      <Badge variant="warning">{t('badge.best', { score: entry?.bestScore ?? 0 })}</Badge>
                    )}
                    {status === 'new' && <Badge variant="secondary">{t('badge.notStarted')}</Badge>}
                  </div>
                  <CardTitle className="text-xl">
                    <Link
                      href={`/lessons/${lesson.slug}`}
                      className="rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
                    >
                      {lesson.title}
                    </Link>
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex flex-1 flex-col gap-4">
                  <p className="text-gray-600 dark:text-gray-300">{lesson.summary}</p>
                  <dl className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-gray-500 dark:text-gray-400">
                    <div className="flex items-center gap-1.5">
                      <Clock className="h-4 w-4" aria-hidden="true" />
                      <dt className="sr-only">{t('lessons.durationLabel')}</dt>
                      <dd>{t('lessons.minutesShort', { n: lesson.durationMinutes })}</dd>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <HelpCircle className="h-4 w-4" aria-hidden="true" />
                      <dt className="sr-only">{t('lessons.quizCountLabel')}</dt>
                      <dd>{t('lessons.quizCount', { n: lesson.quiz.length })}</dd>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <ClipboardList className="h-4 w-4" aria-hidden="true" />
                      <dt className="sr-only">{t('lessons.vocabLabel')}</dt>
                      <dd>{t('lessons.vocabCount', { n: lesson.vocabulary.length })}</dd>
                    </div>
                  </dl>
                  <Button asChild className="mt-auto w-full gap-2">
                    <Link href={`/lessons/${lesson.slug}`}>
                      {status === 'completed'
                        ? t('lessons.review')
                        : status === 'in-progress'
                          ? t('lessons.continue')
                          : t('lessons.open')}
                      <ArrowRight className="h-4 w-4" aria-hidden="true" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
