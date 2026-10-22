'use client';

import * as React from 'react';
import Link from 'next/link';
import { ArrowRight, CheckCircle2, ClipboardList, Clock, HelpCircle } from 'lucide-react';

import { useProgress } from '@/components/ProgressProvider';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Progress } from '@/components/ui/Progress';
import { lessons } from '@/content/lessons';
import { summarize } from '@/lib/progress';

export default function LessonsPage() {
  const { progress, hydrated } = useProgress();
  const summary = summarize(progress, lessons.length);

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <header className="max-w-3xl">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white sm:text-4xl">Beginner lessons</h1>
        <p className="mt-3 text-gray-600 dark:text-gray-300">
          Follow the lessons in order or pick any topic you like. Each lesson takes 15–25 minutes and
          finishes with a short quiz.
        </p>
      </header>

      {/* Overall progress */}
      <section aria-label="Overall progress" className="mt-8 rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="font-medium text-gray-900 dark:text-white">
            {hydrated
              ? `${summary.completedLessons} of ${summary.totalLessons} lessons completed`
              : 'Loading your progress…'}
          </p>
          {hydrated && summary.averageScore !== null && (
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Average quiz score: <span className="font-semibold">{summary.averageScore}%</span>
            </p>
          )}
        </div>
        <Progress
          className="mt-3"
          value={hydrated ? summary.percent : 0}
          variant={summary.percent === 100 ? 'success' : 'default'}
          aria-label={`Course completion: ${hydrated ? summary.percent : 0}%`}
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
                      Week {lesson.week}
                    </p>
                    {status === 'completed' && (
                      <Badge variant="success">
                        <CheckCircle2 className="mr-1 h-3 w-3" aria-hidden="true" />
                        Completed
                      </Badge>
                    )}
                    {status === 'in-progress' && (
                      <Badge variant="warning">Best: {entry?.bestScore ?? 0}%</Badge>
                    )}
                    {status === 'new' && <Badge variant="secondary">Not started</Badge>}
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
                      <dt className="sr-only">Duration:</dt>
                      <dd>{lesson.durationMinutes} min</dd>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <HelpCircle className="h-4 w-4" aria-hidden="true" />
                      <dt className="sr-only">Quiz questions:</dt>
                      <dd>{lesson.quiz.length} quiz questions</dd>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <ClipboardList className="h-4 w-4" aria-hidden="true" />
                      <dt className="sr-only">Vocabulary items:</dt>
                      <dd>{lesson.vocabulary.length} words</dd>
                    </div>
                  </dl>
                  <Button asChild className="mt-auto w-full gap-2">
                    <Link href={`/lessons/${lesson.slug}`}>
                      {status === 'completed' ? 'Review lesson' : status === 'in-progress' ? 'Continue' : 'Open lesson'}
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
