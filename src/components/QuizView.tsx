'use client';

import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

import { QuizRunner } from '@/components/QuizRunner';
import { useLanguage } from '@/components/LanguageProvider';
import { PASSING_SCORE } from '@/lib/progress';
import type { Lesson } from '@/content/lessons';

/**
 * Quiz page body (client so the interface language can switch).
 * Questions, options and explanations stay in English.
 */
export function QuizView({ lesson }: { lesson: Lesson }) {
  const { t } = useLanguage();

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <Link
        href={`/lessons/${lesson.slug}`}
        className="inline-flex items-center gap-1.5 text-sm font-medium text-primary-600 hover:text-primary-700 dark:text-primary-400"
      >
        <ArrowLeft className="h-4 w-4" aria-hidden="true" />
        {t('quiz.backTo', { title: lesson.title })}
      </Link>

      <header className="mt-4">
        <p className="text-sm font-medium text-primary-600 dark:text-primary-400">{t('quiz.label')}</p>
        <h1 className="mt-1 text-3xl font-bold text-gray-900 dark:text-white sm:text-4xl">
          {lesson.title}
        </h1>
        <p className="mt-3 text-gray-600 dark:text-gray-300">
          {t('quiz.intro', { n: lesson.quiz.length, pass: PASSING_SCORE })}
        </p>
      </header>

      <div className="mt-8">
        <QuizRunner lesson={lesson} />
      </div>
    </div>
  );
}
