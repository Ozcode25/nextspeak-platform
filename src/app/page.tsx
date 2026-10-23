'use client';

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

import { useLanguage } from '@/components/LanguageProvider';
import { InstallAppButton } from '@/components/InstallAppButton';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { lessons, totalQuizQuestions } from '@/content/lessons';
import type { TKey } from '@/lib/i18n';

const steps: { icon: typeof BookOpen; titleKey: TKey; textKey: TKey }[] = [
  { icon: BookOpen, titleKey: 'home.step1Title', textKey: 'home.step1Text' },
  { icon: GraduationCap, titleKey: 'home.step2Title', textKey: 'home.step2Text' },
  { icon: ListChecks, titleKey: 'home.step3Title', textKey: 'home.step3Text' },
];

const features: { icon: typeof BookOpen; titleKey: TKey; textKey: TKey }[] = [
  { icon: Smartphone, titleKey: 'home.feature1Title', textKey: 'home.feature1Text' },
  { icon: Download, titleKey: 'home.feature2Title', textKey: 'home.feature2Text' },
  { icon: WifiOff, titleKey: 'home.feature3Title', textKey: 'home.feature3Text' },
  { icon: Keyboard, titleKey: 'home.feature4Title', textKey: 'home.feature4Text' },
];

const installTips: TKey[] = ['home.installTip1', 'home.installTip2', 'home.installTip3'];

export default function HomePage() {
  const { t } = useLanguage();
  const featuredLessons = lessons.slice(0, 3);

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-b from-primary-50 via-white to-white dark:from-primary-950/40 dark:via-gray-950 dark:to-gray-950">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24">
          <div className="mx-auto max-w-3xl text-center">
            <p className="mb-4 inline-flex items-center gap-2 rounded-full bg-primary-100 px-4 py-1.5 text-sm font-medium text-primary-700 dark:bg-primary-900/40 dark:text-primary-300">
              <Sparkles className="h-4 w-4" aria-hidden="true" />
              {t('home.badge', { n: lessons.length })}
            </p>
            <h1 className="text-balance text-4xl font-display font-bold tracking-tight text-gray-900 dark:text-white sm:text-5xl lg:text-6xl">
              {t('home.heroTitle')}{' '}
              <span className="text-primary-600 dark:text-primary-400">{t('home.heroAccent')}</span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-gray-600 dark:text-gray-300">
              {t('home.heroSubtitle')}
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Button asChild size="lg" className="w-full gap-2 sm:w-auto">
                <Link href="/lessons">
                  {t('home.ctaStart')}
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="w-full sm:w-auto">
                <Link href="/progress">{t('home.ctaProgress')}</Link>
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
      <section aria-label={t('home.statsAria')} className="border-y border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-950">
        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-6 px-4 py-8 sm:grid-cols-3 sm:px-6">
          {[
            { value: `${lessons.length}`, label: t('home.statLessons') },
            { value: `${totalQuizQuestions}`, label: t('home.statQuestions') },
            { value: '100%', label: t('home.statFree') },
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
          {t('home.howTitle')}
        </h2>
        <p className="mx-auto mt-3 max-w-2xl text-center text-gray-600 dark:text-gray-300">
          {t('home.howSubtitle')}
        </p>
        <div className="mt-10 grid gap-6 sm:grid-cols-3">
          {steps.map((step) => (
            <Card key={step.titleKey}>
              <CardHeader>
                <span
                  className="mb-3 flex h-11 w-11 items-center justify-center rounded-lg bg-primary-100 text-primary-600 dark:bg-primary-900/40 dark:text-primary-400"
                  aria-hidden="true"
                >
                  <step.icon className="h-6 w-6" />
                </span>
                <CardTitle className="text-lg">{t(step.titleKey)}</CardTitle>
              </CardHeader>
              <CardContent className="text-gray-600 dark:text-gray-300">{t(step.textKey)}</CardContent>
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
                {t('home.featuredTitle')}
              </h2>
              <p className="mt-3 text-gray-600 dark:text-gray-300">{t('home.featuredSubtitle')}</p>
            </div>
            <Button asChild variant="outline" className="gap-2">
              <Link href="/lessons">
                {t('home.viewAll')}
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
                      {t('home.weekMin', { week: lesson.week, min: lesson.durationMinutes })}
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
                      {t('home.openLesson')}
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
          {t('home.featuresTitle')}
        </h2>
        <div className="mt-10 grid gap-6 sm:grid-cols-2">
          {features.map((feature) => (
            <Card key={feature.titleKey}>
              <CardHeader>
                <span
                  className="mb-3 flex h-11 w-11 items-center justify-center rounded-lg bg-accent-100 text-accent-600 dark:bg-accent-900/40 dark:text-accent-400"
                  aria-hidden="true"
                >
                  <feature.icon className="h-6 w-6" />
                </span>
                <CardTitle className="text-lg">{t(feature.titleKey)}</CardTitle>
              </CardHeader>
              <CardContent className="text-gray-600 dark:text-gray-300">{t(feature.textKey)}</CardContent>
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
                {t('home.installTitle')}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-5 text-gray-600 dark:text-gray-300">
              <p>{t('home.installText')}</p>
              <InstallAppButton />
              <ul className="space-y-2">
                {installTips.map((tipKey) => (
                  <li key={tipKey} className="flex gap-2">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-green-600 dark:text-green-400" aria-hidden="true" />
                    <span>{t(tipKey)}</span>
                  </li>
                ))}
              </ul>
              <p className="text-sm text-gray-500 dark:text-gray-400">{t('home.installNote')}</p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Final CTA */}
      <section className="bg-primary-600 py-14 dark:bg-primary-700">
        <div className="mx-auto flex max-w-4xl flex-col items-center gap-6 px-4 text-center sm:px-6">
          <h2 className="text-3xl font-bold text-white sm:text-4xl">{t('home.finalTitle')}</h2>
          <Button asChild size="lg" variant="secondary" className="w-full gap-2 bg-white text-primary-700 hover:bg-gray-100 sm:w-auto">
            <Link href="/lessons/greetings-and-introductions">
              {t('home.finalCta')}
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
