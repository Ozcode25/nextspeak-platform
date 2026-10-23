import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { LessonView } from '@/components/LessonView';
import { getLesson, lessons } from '@/content/lessons';

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

  return <LessonView lesson={lesson} />;
}
