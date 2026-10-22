'use client';

import * as React from 'react';
import Link from 'next/link';
import { CheckCircle2, ListRestart, PlayCircle } from 'lucide-react';

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
  const [announcement, setAnnouncement] = React.useState('');

  const entry = progress.lessons[slug];
  const completed = hydrated && entry?.completed;
  const bestScore = hydrated && typeof entry?.bestScore === 'number' ? entry.bestScore : null;

  const handleComplete = () => {
    markCompleted(slug);
    setAnnouncement('Lesson marked as completed. Great job!');
  };

  const handleClear = () => {
    clearLesson(slug);
    setAnnouncement('Progress for this lesson was reset.');
  };

  return (
    <section
      aria-label="Your progress for this lesson"
      className="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900"
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Your progress</h2>
        {completed ? (
          <Badge variant="success">
            <CheckCircle2 className="mr-1 h-3 w-3" aria-hidden="true" />
            Completed
          </Badge>
        ) : (
          <Badge variant="secondary">Not completed yet</Badge>
        )}
      </div>

      <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
        {bestScore !== null
          ? `Best quiz score: ${bestScore}% (pass mark ${PASSING_SCORE}%).`
          : `Take the ${quizCount}-question quiz and score ${PASSING_SCORE}% or more to complete this lesson automatically.`}
      </p>

      <div className="mt-4 flex flex-col gap-3 sm:flex-row">
        <Button asChild className="gap-2">
          <Link href={`/lessons/${slug}/quiz`}>
            <PlayCircle className="h-4 w-4" aria-hidden="true" />
            {bestScore !== null ? 'Retake the quiz' : 'Take the quiz'}
          </Link>
        </Button>

        {!completed && (
          <Button type="button" variant="outline" className="gap-2" onClick={handleComplete}>
            <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
            Mark lesson as completed
          </Button>
        )}

        {hydrated && entry && (
          <Button type="button" variant="ghost" className="gap-2" onClick={handleClear}>
            <ListRestart className="h-4 w-4" aria-hidden="true" />
            Reset lesson progress
          </Button>
        )}
      </div>

      <p className="sr-only" role="status" aria-live="polite">
        {announcement}
      </p>
    </section>
  );
}
