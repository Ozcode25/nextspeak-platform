import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';

import { QuizRunner } from '@/components/QuizRunner';
import { getLesson, lessons } from '@/content/lessons';
import { PASSING_SCORE } from '@/lib/progress';

interface QuizPageProps {
  params: { slug: string };
}

export function generateStaticParams() {
  return lessons.map((lesson) => ({ slug: lesson.slug }));
}

export const dynamicParams = false;

export function generateMetadata({ params }: QuizPageProps): Metadata {
  const lesson = getLesson(params.slug);
  if (!lesson) return {};
  return {
    title: `Quiz: ${lesson.title}`,
    description: `Test what you learned in “${lesson.title}” with instant feedback.`,
  };
}

export default function QuizPage({ params }: QuizPageProps) {
  const lesson = getLesson(params.slug);
  if (!lesson) notFound();

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <Link
        href={`/lessons/${lesson.slug}`}
        className="inline-flex items-center gap-1.5 text-sm font-medium text-primary-600 hover:text-primary-700 dark:text-primary-400"
      >
        <ArrowLeft className="h-4 w-4" aria-hidden="true" />
        Back to “{lesson.title}”
      </Link>

      <header className="mt-4">
        <p className="text-sm font-medium text-primary-600 dark:text-primary-400">Quiz</p>
        <h1 className="mt-1 text-3xl font-bold text-gray-900 dark:text-white sm:text-4xl">
          {lesson.title}
        </h1>
        <p className="mt-3 text-gray-600 dark:text-gray-300">
          {lesson.quiz.length} questions · instant feedback · score {PASSING_SCORE}% or more to complete the
          lesson automatically.
        </p>
      </header>

      <div className="mt-8">
        <QuizRunner lesson={lesson} />
      </div>
    </div>
  );
}
