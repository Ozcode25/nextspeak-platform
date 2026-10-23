import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { QuizView } from '@/components/QuizView';
import { getLesson, lessons } from '@/content/lessons';

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

  return <QuizView lesson={lesson} />;
}
