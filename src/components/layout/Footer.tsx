'use client';

import Image from 'next/image';
import Link from 'next/link';

import { useLanguage } from '@/components/LanguageProvider';

export function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="border-t border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-950">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 sm:grid-cols-2 sm:px-6 lg:grid-cols-3">
        <div className="space-y-3">
          <Link href="/" className="flex items-center gap-2" aria-label="NextSpeak home">
            <span
              className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-white ring-1 ring-black/5 dark:ring-white/10 sm:h-11 sm:w-11"
              aria-hidden="true"
            >
              <Image
                src="/icon-152.png"
                alt=""
                width={44}
                height={44}
                className="h-full w-full object-contain"
              />
            </span>
            <span className="font-display text-lg font-bold text-gray-900 dark:text-white sm:text-xl">NextSpeak</span>
          </Link>
          <p className="max-w-xs text-sm text-gray-500 dark:text-gray-400">{t('footer.tagline')}</p>
        </div>

        <nav aria-label={t('footer.learn')}>
          <h2 className="text-sm font-semibold text-gray-900 dark:text-white">{t('footer.learn')}</h2>
          <ul className="mt-3 space-y-2">
            <li>
              <Link href="/lessons" className="text-sm text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white">
                {t('footer.allLessons')}
              </Link>
            </li>
            <li>
              <Link href="/progress" className="text-sm text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white">
                {t('footer.myProgress')}
              </Link>
            </li>
            <li>
              <Link href="/#install" className="text-sm text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white">
                {t('footer.install')}
              </Link>
            </li>
          </ul>
        </nav>

        <div>
          <h2 className="text-sm font-semibold text-gray-900 dark:text-white">{t('footer.about')}</h2>
          <ul className="mt-3 space-y-2 text-sm text-gray-500 dark:text-gray-400">
            <li>{t('footer.author')}</li>
            <li>
              <a href="mailto:contacto@nextspeak.com" className="hover:text-gray-900 dark:hover:text-white">
                contacto@nextspeak.com
              </a>
            </li>
            <li>{t('footer.privacy')}</li>
          </ul>
        </div>
      </div>

      <div className="border-t border-gray-200 py-6 dark:border-gray-800">
        <p className="text-center text-sm text-gray-500 dark:text-gray-400">
          {t('footer.rights', { year: new Date().getFullYear() })}
        </p>
      </div>
    </footer>
  );
}
