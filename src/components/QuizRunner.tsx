'use client';

import * as React from 'react';
import Link from 'next/link';
import { ArrowRight, CheckCircle2, RotateCcw, XCircle } from 'lucide-react';

import { useProgress } from '@/components/ProgressProvider';
import { useLanguage } from '@/components/LanguageProvider';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Progress } from '@/components/ui/Progress';
import { PASSING_SCORE } from '@/lib/progress';
import { cn } from '@/lib/utils';
import type { Lesson, QuizQuestion } from '@/content/lessons';

interface AnswerRecord {
  question: QuizQuestion;
  selectedIndex: number;
  correct: boolean;
}

const LETTERS = ['A', 'B', 'C', 'D'];

export function QuizRunner({ lesson }: { lesson: Lesson }) {
  const { recordQuiz } = useProgress();
  const { t } = useLanguage();

  const [step, setStep] = React.useState(0);
  const [selected, setSelected] = React.useState<number | null>(null);
  const [checked, setChecked] = React.useState(false);
  const [answers, setAnswers] = React.useState<AnswerRecord[]>([]);
  const [finished, setFinished] = React.useState(false);
  const questionHeadingRef = React.useRef<HTMLHeadingElement | null>(null);
  const savedResultRef = React.useRef(false);

  const question = lesson.quiz[step];
  const isLast = step === lesson.quiz.length - 1;
  const correctCount = answers.filter((answer) => answer.correct).length;
  const scorePercent = Math.round((correctCount / lesson.quiz.length) * 100);
  const passed = scorePercent >= PASSING_SCORE;

  const startOver = () => {
    savedResultRef.current = false;
    setStep(0);
    setSelected(null);
    setChecked(false);
    setAnswers([]);
    setFinished(false);
    requestAnimationFrame(() => questionHeadingRef.current?.focus());
  };

  const checkAnswer = () => {
    if (selected === null || checked) return;
    const isCorrect = selected === question.correctIndex;
    setAnswers((current) => [
      ...current,
      { question, selectedIndex: selected, correct: isCorrect },
    ]);
    setChecked(true);
  };

  const nextQuestion = () => {
    if (!checked) return;
    if (isLast) {
      if (!savedResultRef.current) {
        savedResultRef.current = true;
        recordQuiz(lesson.slug, correctCount, lesson.quiz.length);
      }
      setFinished(true);
      requestAnimationFrame(() => document.getElementById('quiz-result-heading')?.focus());
      return;
    }
    setStep((current) => current + 1);
    setSelected(null);
    setChecked(false);
    requestAnimationFrame(() => questionHeadingRef.current?.focus());
  };

  // ── Result screen ──────────────────────────────────────────────────────────
  if (finished) {
    return (
      <Card>
        <CardHeader>
          <p className="text-sm font-medium text-primary-600 dark:text-primary-400">{t('quiz.finishedLabel')}</p>
          <CardTitle id="quiz-result-heading" tabIndex={-1} className="text-2xl focus:outline-none">
            {t('quiz.resultScore', {
              correct: correctCount,
              total: lesson.quiz.length,
              percent: scorePercent,
            })}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <Progress
            value={scorePercent}
            variant={passed ? 'success' : 'warning'}
            aria-label={t('quiz.scoreAria', { percent: scorePercent })}
          />

          <p
            className={cn(
              'rounded-lg p-4 text-sm',
              passed
                ? 'bg-green-50 text-green-800 dark:bg-green-950/50 dark:text-green-300'
                : 'bg-yellow-50 text-yellow-800 dark:bg-yellow-950/50 dark:text-yellow-300'
            )}
          >
            {passed ? t('quiz.passedMsg', { pass: PASSING_SCORE }) : t('quiz.failedMsg', { pass: PASSING_SCORE })}
          </p>

          {/* Recap with explanations */}
          <section aria-labelledby="recap-heading">
            <h3 id="recap-heading" className="font-semibold text-gray-900 dark:text-white">
              {t('quiz.recap')}
            </h3>
            <ol className="mt-3 space-y-3">
              {answers.map((answer, index) => (
                <li
                  key={answer.question.id}
                  className="rounded-lg border border-gray-200 p-4 dark:border-gray-800"
                >
                  <p className="flex gap-2 font-medium text-gray-900 dark:text-white">
                    {answer.correct ? (
                      <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-green-600 dark:text-green-400" aria-hidden="true" />
                    ) : (
                      <XCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-600 dark:text-red-400" aria-hidden="true" />
                    )}
                    <span>
                      {index + 1}. {answer.question.prompt}
                    </span>
                  </p>
                  {!answer.correct && (
                    <p className="mt-1 pl-7 text-sm text-gray-600 dark:text-gray-400">
                      {t('quiz.correctAnswerLabel')}{' '}
                      <strong>{answer.question.options[answer.question.correctIndex]}</strong>
                    </p>
                  )}
                  <p className="mt-1 pl-7 text-sm text-gray-600 dark:text-gray-400">
                    {answer.question.explanation}
                  </p>
                </li>
              ))}
            </ol>
          </section>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Button type="button" className="gap-2" onClick={startOver}>
              <RotateCcw className="h-4 w-4" aria-hidden="true" />
              {t('quiz.retake')}
            </Button>
            <Button asChild variant="outline">
              <Link href={`/lessons/${lesson.slug}`}>{t('quiz.backToLesson')}</Link>
            </Button>
            <Button asChild variant="ghost" className="gap-2">
              <Link href="/progress">
                {t('quiz.myProgress')}
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  // ── Question screen ────────────────────────────────────────────────────────
  return (
    <Card>
      <CardContent className="space-y-6 pt-6">
        <div>
          <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-300">
            <span>
              {t('quiz.questionOf', { current: step + 1, total: lesson.quiz.length })}
            </span>
            <span>{t('quiz.correctSoFar', { n: correctCount })}</span>
          </div>
          <Progress
            className="mt-2"
            value={((step + (checked ? 1 : 0)) / lesson.quiz.length) * 100}
            aria-label={t('quiz.progressAria', { current: step + 1, total: lesson.quiz.length })}
          />
        </div>

        <fieldset>
          <legend className="w-full">
            <h2
              ref={questionHeadingRef}
              tabIndex={-1}
              className="text-lg font-semibold text-gray-900 focus:outline-none dark:text-white"
            >
              {question.prompt}
            </h2>
          </legend>

          <div className="mt-4 space-y-2" role="presentation">
            {question.options.map((option, index) => {
              const isSelected = selected === index;
              const isCorrectAnswer = index === question.correctIndex;
              return (
                <label
                  key={option}
                  htmlFor={`option-${index}`}
                  className={cn(
                    'flex cursor-pointer items-center gap-3 rounded-xl border-2 p-4 transition-colors',
                    !checked && 'border-gray-200 bg-white hover:border-primary-300 hover:bg-primary-50 dark:border-gray-700 dark:bg-gray-900 dark:hover:border-primary-700 dark:hover:bg-primary-950/40',
                    checked && isCorrectAnswer && 'border-green-500 bg-green-50 dark:bg-green-950/50',
                    checked && isSelected && !isCorrectAnswer && 'border-red-400 bg-red-50 dark:bg-red-950/50',
                    checked && !isSelected && !isCorrectAnswer && 'border-gray-200 opacity-60 dark:border-gray-700',
                    'focus-within:ring-2 focus-within:ring-primary-500 focus-within:ring-offset-2'
                  )}
                >
                  <input
                    type="radio"
                    id={`option-${index}`}
                    name={`question-${question.id}`}
                    value={index}
                    checked={isSelected}
                    disabled={checked}
                    onChange={() => setSelected(index)}
                    className="h-4 w-4 shrink-0 accent-primary-600"
                  />
                  <span className="text-gray-800 dark:text-gray-100">
                    <span className="mr-2 font-semibold text-gray-500 dark:text-gray-400" aria-hidden="true">
                      {LETTERS[index]}.
                    </span>
                    {option}
                  </span>
                </label>
              );
            })}
          </div>
        </fieldset>

        {/* Instant feedback */}
        <div role="status" aria-live="polite" className="min-h-[1.5rem]">
          {checked && (
            <div
              className={cn(
                'rounded-lg p-4 text-sm',
                selected === question.correctIndex
                  ? 'bg-green-50 text-green-800 dark:bg-green-950/50 dark:text-green-300'
                  : 'bg-red-50 text-red-800 dark:bg-red-950/50 dark:text-red-300'
              )}
            >
              <p className="font-semibold">
                {selected === question.correctIndex ? t('quiz.correct') : t('quiz.notQuite')}
              </p>
              <p className="mt-1">{question.explanation}</p>
            </div>
          )}
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          {!checked ? (
            <Button type="button" className="sm:w-40" disabled={selected === null} onClick={checkAnswer}>
              {t('quiz.check')}
            </Button>
          ) : (
            <Button type="button" className="sm:w-40 gap-2" onClick={nextQuestion}>
              {isLast ? t('quiz.seeResult') : t('quiz.next')}
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
