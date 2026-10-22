import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';

import { Footer } from '@/components/layout/Footer';
import { Header } from '@/components/layout/Header';
import { ServiceWorkerRegister } from '@/components/ServiceWorkerRegister';

import { Providers } from './providers';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const siteUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://nextspeak-platform.vercel.app';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'NextSpeak — Learn English with confidence',
    template: '%s | NextSpeak',
  },
  description:
    'Free beginner English lessons with interactive quizzes and progress tracking that stays on your device. Installable as an app on any phone, tablet or computer.',
  keywords: ['English', 'learn English', 'beginner lessons', 'quizzes', 'PWA', 'NextSpeak'],
  authors: [{ name: 'NextSpeak' }],
  creator: 'NextSpeak',
  manifest: '/site.webmanifest',
  icons: {
    icon: '/favicon.ico',
    apple: '/icon-152.png',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: '/',
    siteName: 'NextSpeak',
    title: 'NextSpeak — Learn English with confidence',
    description:
      'Free beginner English lessons with interactive quizzes. Progress is saved on your device — no account needed.',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'NextSpeak' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'NextSpeak — Learn English with confidence',
    description: 'Free beginner English lessons with interactive quizzes and local progress tracking.',
    images: ['/og-image.png'],
  },
};

export const viewport: Viewport = {
  themeColor: '#0ea5e9',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} antialiased`}>
      <body className="flex min-h-screen flex-col bg-gray-50 font-sans text-gray-900 dark:bg-gray-950 dark:text-gray-50">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-primary-600 focus:px-4 focus:py-2 focus:text-white"
        >
          Skip to main content
        </a>
        <Providers>
          <Header />
          <main id="main-content" className="flex-1">
            {children}
          </main>
          <Footer />
        </Providers>
        <ServiceWorkerRegister />
      </body>
    </html>
  );
}
