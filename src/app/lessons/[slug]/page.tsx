import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, ArrowRight, Clock, Lightbulb, MessageCircle, Target } from 'lucide-react';

import { LessonProgressPanel } from '@/components/LessonProgressPanel';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { getAdjacentLessons, getLesson, lessons } from '@/content/lessons';

interface LessonPageProps {
  params: { slug: string };
}

export function generateStaticParams() {
  return lessons.map((lesson) => ({ slug: lesson.slug }));
}

// Static export: only the slugs listed above exist.
export const dynamicParams = false;

export function generateMetadata({ params }: LessonPageProps): Metadata {
  const lesson = getLesson(params.slug);
  if (!lesson) return {};
  return {
    title: lesson.title,
    description: lesson.summary,
  };
}

export default function LessonPage({ params }: LessonPageProps) {
  const lesson = getLesson(params.slug);
  if (!lesson) notFound();

  const { previous, next } = getAdjacentLessons(lesson.slug);

  return (
    <article className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <Link
        href="/lessons"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-primary-600 hover:text-primary-700 dark:text-primary-400"
      >
        <ArrowLeft className="h-4 w-4" aria-hidden="true" />
        All lessons
      </Link>

      <header className="mt-4">
        <div className="flex flex-wrap items-center gap-2">
          <Badge>Beginner</Badge>
          <Badge variant="outline">Week {lesson.week}</Badge>
          <span className="inline-flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400">
            <Clock className="h-4 w-4" aria-hidden="true" />
            {lesson.durationMinutes} min
          </span>
        </div>
        <h1 className="mt-3 text-3xl font-bold text-gray-900 dark:text-white sm:text-4xl">
          {lesson.title}
        </h1>
        <p className="mt-3 text-lg text-gray-600 dark:text-gray-300">{lesson.summary}</p>
      </header>

      {/* Objectives */}
      <section aria-labelledby="objectives-heading" className="mt-8">
        <h2 id="objectives-heading" className="flex items-center gap-2 text-xl font-semibold text-gray-900 dark:text-white">
          <Target className="h-5 w-5 text-primary-600 dark:text-primary-400" aria-hidden="true" />
          What you will learn
        </h2>
        <ul className="mt-3 space-y-2">
          {lesson.objectives.map((objective) => (
            <li key={objective} className="flex gap-2 text-gray-700 dark:text-gray-300">
              <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary-500" aria-hidden="true" />
              {objective}
            </li>
          ))}
        </ul>
      </section>

      {/* Lesson sections */}
      {lesson.sections.map((section, index) => (
        <section key={section.title} aria-labelledby={`section-${index}`} className="mt-10">
          <h2 id={`section-${index}`} className="text-xl font-semibold text-gray-900 dark:text-white">
            {section.title}
          </h2>
          {section.paragraphs.map((paragraph, paragraphIndex) => (
            <p key={paragraphIndex} className="mt-3 leading-7 text-gray-700 dark:text-gray-300">
              {paragraph}
            </p>
          ))}

          {section.keyPhrases && (
            <dl className="mt-4 divide-y divide-gray-100 rounded-xl border border-gray-200 bg-white dark:divide-gray-800 dark:border-gray-800 dark:bg-gray-900">
              {section.keyPhrases.map((item) => (
                <div key={item.phrase} className="p-4">
                  <dt className="font-medium text-primary-700 dark:text-primary-300">{item.phrase}</dt>
                  <dd className="mt-0.5 text-sm text-gray-600 dark:text-gray-400">{item.meaning}</dd>
                </div>
              ))}
            </dl>
          )}

          {section.examples && (
            <ul className="mt-4 space-y-2">
              {section.examples.map((example) => (
                <li
                  key={example}
                  className="rounded-lg border-l-4 border-primary-300 bg-primary-50 p-3 text-gray-800 dark:border-primary-800 dark:bg-primary-950/50 dark:text-gray-200"
                >
                  {example}
                </li>
              ))}
            </ul>
          )}
        </section>
      ))}

      {/* Vocabulary */}
      <section aria-labelledby="vocabulary-heading" className="mt-10">
        <h2 id="vocabulary-heading" className="flex items-center gap-2 text-xl font-semibold text-gray-900 dark:text-white">
          <MessageCircle className="h-5 w-5 text-primary-600 dark:text-primary-400" aria-hidden="true" />
          Key vocabulary
        </h2>
        <dl className="mt-4 grid gap-3 sm:grid-cols-2">
          {lesson.vocabulary.map((item) => (
            <div
              key={item.term}
              className="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900"
            >
              <dt className="font-semibold text-gray-900 dark:text-white">{item.term}</dt>
              <dd className="mt-1 text-sm text-gray-600 dark:text-gray-300">{item.definition}</dd>
              <dd className="mt-2 text-sm italic text-primary-700 dark:text-primary-300">
                “{item.example}”
              </dd>
            </div>
          ))}
        </dl>
      </section>

      {/* Tips */}
      {lesson.tips.length > 0 && (
        <section aria-labelledby="tips-heading" className="mt-10">
          <h2 id="tips-heading" className="flex items-center gap-2 text-xl font-semibold text-gray-900 dark:text-white">
            <Lightbulb className="h-5 w-5 text-accent-500" aria-hidden="true" />
            Practice tips
          </h2>
          <ul className="mt-3 space-y-2">
            {lesson.tips.map((tip) => (
              <li key={tip} className="flex gap-2 text-gray-700 dark:text-gray-300">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent-500" aria-hidden="true" />
                {tip}
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Quiz CTA + progress */}
      <div className="mt-10">
        <LessonProgressPanel slug={lesson.slug} quizCount={lesson.quiz.length} />
      </div>

      {/* Prev / next navigation */}
      <nav aria-label="Lesson navigation" className="mt-10 flex flex-col gap-3 border-t border-gray-200 pt-6 dark:border-gray-800 sm:flex-row sm:justify-between">
        {previous ? (
          <Button asChild variant="outline" className="gap-2">
            <Link href={`/lessons/${previous.slug}`}>
              <ArrowLeft className="h-4 w-4" aria-hidden="true" />
              {previous.title}
            </Link>
          </Button>
        ) : (
          <span />
        )}
        {next ? (
          <Button asChild variant="outline" className="gap-2">
            <Link href={`/lessons/${next.slug}`}>
              {next.title}
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </Button>
        ) : (
          <Button asChild variant="outline" className="gap-2">
            <Link href="/progress">
              See my progress
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </Button>
        )}
      </nav>
    </article>
  );
}
