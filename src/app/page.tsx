import Link from 'next/link';
import {
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Download,
  GraduationCap,
  Keyboard,
  ListChecks,
  Smartphone,
  Sparkles,
  WifiOff,
} from 'lucide-react';

import { InstallAppButton } from '@/components/InstallAppButton';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { lessons, totalQuizQuestions } from '@/content/lessons';

const steps = [
  {
    icon: BookOpen,
    title: '1. Pick a lesson',
    text: 'Start with greetings or jump to any topic — every lesson is beginner friendly.',
  },
  {
    icon: GraduationCap,
    title: '2. Study the content',
    text: 'Short explanations, real examples, key phrases and a vocabulary list per lesson.',
  },
  {
    icon: ListChecks,
    title: '3. Take the quiz',
    text: 'Answer five questions and get instant feedback with clear explanations.',
  },
];

const features = [
  {
    icon: Smartphone,
    title: 'Works on any device',
    text: 'Phones, tablets and desktops — the layout adapts automatically and everything is easy to tap.',
  },
  {
    icon: Download,
    title: 'Installable as an app',
    text: 'Add NextSpeak to your home screen and open it like any native app. No store, no download fees.',
  },
  {
    icon: WifiOff,
    title: 'Keeps working offline',
    text: 'Lessons you have opened stay available without internet. Your progress is saved on your device.',
  },
  {
    icon: Keyboard,
    title: 'Accessible by design',
    text: 'Full keyboard support, clear focus states, readable text and screen-reader friendly pages.',
  },
];

export default function HomePage() {
  const featuredLessons = lessons.slice(0, 3);

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-b from-primary-50 via-white to-white dark:from-primary-950/40 dark:via-gray-950 dark:to-gray-950">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24">
          <div className="mx-auto max-w-3xl text-center">
            <p className="mb-4 inline-flex items-center gap-2 rounded-full bg-primary-100 px-4 py-1.5 text-sm font-medium text-primary-700 dark:bg-primary-900/40 dark:text-primary-300">
              <Sparkles className="h-4 w-4" aria-hidden="true" />
              Free · No sign-up · {lessons.length} beginner lessons
            </p>
            <h1 className="text-balance text-4xl font-display font-bold tracking-tight text-gray-900 dark:text-white sm:text-5xl lg:text-6xl">
              Learn English with <span className="text-primary-600 dark:text-primary-400">confidence</span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-gray-600 dark:text-gray-300">
              Short, friendly lessons with real examples and interactive quizzes. Your progress is saved
              on your own device — start now, continue anytime, anywhere.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Button asChild size="lg" className="w-full gap-2 sm:w-auto">
                <Link href="/lessons">
                  Start learning
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="w-full sm:w-auto">
                <Link href="/progress">See my progress</Link>
              </Button>
            </div>
          </div>
        </div>
        <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden" aria-hidden="true">
          <div className="absolute left-10 top-10 h-72 w-72 rounded-full bg-primary-200/40 blur-3xl dark:bg-primary-900/30" />
          <div className="absolute bottom-10 right-10 h-96 w-96 rounded-full bg-accent-200/40 blur-3xl dark:bg-accent-900/30" />
        </div>
      </section>

      {/* Stats */}
      <section aria-label="Course facts" className="border-y border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-950">
        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-6 px-4 py-8 sm:grid-cols-3 sm:px-6">
          {[
            { value: `${lessons.length}`, label: 'beginner lessons' },
            { value: `${totalQuizQuestions}`, label: 'quiz questions with feedback' },
            { value: '100%', label: 'free, forever' },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="text-3xl font-bold text-primary-600 dark:text-primary-400">{stat.value}</p>
              <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <h2 className="text-center text-3xl font-bold text-gray-900 dark:text-white sm:text-4xl">
          How it works
        </h2>
        <p className="mx-auto mt-3 max-w-2xl text-center text-gray-600 dark:text-gray-300">
          Three simple steps — repeat them at your own pace.
        </p>
        <div className="mt-10 grid gap-6 sm:grid-cols-3">
          {steps.map((step) => (
            <Card key={step.title}>
              <CardHeader>
                <span
                  className="mb-3 flex h-11 w-11 items-center justify-center rounded-lg bg-primary-100 text-primary-600 dark:bg-primary-900/40 dark:text-primary-400"
                  aria-hidden="true"
                >
                  <step.icon className="h-6 w-6" />
                </span>
                <CardTitle className="text-lg">{step.title}</CardTitle>
              </CardHeader>
              <CardContent className="text-gray-600 dark:text-gray-300">{step.text}</CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Featured lessons */}
      <section className="bg-white py-16 dark:bg-gray-950">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white sm:text-4xl">
                Start with these lessons
              </h2>
              <p className="mt-3 text-gray-600 dark:text-gray-300">
                From first “hello” to talking about your future plans.
              </p>
            </div>
            <Button asChild variant="outline" className="gap-2">
              <Link href="/lessons">
                View all lessons
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </Button>
          </div>

          <ul className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featuredLessons.map((lesson) => (
              <li key={lesson.slug}>
                <Card className="h-full transition-shadow hover:shadow-md">
                  <CardHeader>
                    <p className="text-sm font-medium text-primary-600 dark:text-primary-400">
                      Week {lesson.week} · {lesson.durationMinutes} min
                    </p>
                    <CardTitle className="text-xl">
                      <Link
                        href={`/lessons/${lesson.slug}`}
                        className="rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
                      >
                        {lesson.title}
                      </Link>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="flex h-[calc(100%-4rem)] flex-col gap-4">
                    <p className="text-gray-600 dark:text-gray-300">{lesson.summary}</p>
                    <p className="mt-auto flex items-center gap-2 text-sm font-medium text-primary-600 dark:text-primary-400">
                      Open lesson
                      <ArrowRight className="h-4 w-4" aria-hidden="true" />
                    </p>
                  </CardContent>
                </Card>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Features */}
      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <h2 className="text-center text-3xl font-bold text-gray-900 dark:text-white sm:text-4xl">
          Made for learning anywhere
        </h2>
        <div className="mt-10 grid gap-6 sm:grid-cols-2">
          {features.map((feature) => (
            <Card key={feature.title}>
              <CardHeader>
                <span
                  className="mb-3 flex h-11 w-11 items-center justify-center rounded-lg bg-accent-100 text-accent-600 dark:bg-accent-900/40 dark:text-accent-400"
                  aria-hidden="true"
                >
                  <feature.icon className="h-6 w-6" />
                </span>
                <CardTitle className="text-lg">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent className="text-gray-600 dark:text-gray-300">{feature.text}</CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Install */}
      <section id="install" className="scroll-mt-20 bg-white py-16 dark:bg-gray-950">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-2xl">
                <Download className="h-6 w-6 text-primary-600 dark:text-primary-400" aria-hidden="true" />
                Add NextSpeak to your home screen
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-5 text-gray-600 dark:text-gray-300">
              <p>
                NextSpeak is a Progressive Web App (PWA): install it like a native app and open it in
                one tap. On most phones and computers your browser offers an install option.
              </p>
              <InstallAppButton />
              <ul className="space-y-2">
                {[
                  'Android (Chrome): tap “Install NextSpeak” above, or choose “Add to Home screen” in the menu.',
                  'iPhone / iPad (Safari): Share → Add to Home Screen.',
                  'Computer (Chrome / Edge): click the install icon in the address bar.',
                ].map((tip) => (
                  <li key={tip} className="flex gap-2">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-green-600 dark:text-green-400" aria-hidden="true" />
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Good to know: lessons are cached after your first visit, so they keep working offline.
                A first-time visit and future updates need an internet connection.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Final CTA */}
      <section className="bg-primary-600 py-14 dark:bg-primary-700">
        <div className="mx-auto flex max-w-4xl flex-col items-center gap-6 px-4 text-center sm:px-6">
          <h2 className="text-3xl font-bold text-white sm:text-4xl">Ready to say your first “hello”?</h2>
          <Button asChild size="lg" variant="secondary" className="w-full gap-2 bg-white text-primary-700 hover:bg-gray-100 sm:w-auto">
            <Link href="/lessons/greetings-and-introductions">
              Start the first lesson
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
