import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Providers } from './providers';

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: 'NextSpeak - Aprende inglés con confianza',
    template: '%s | NextSpeak',
  },
  description: 'Plataforma educativa para aprender inglés con clases personalizadas, seguimiento de progreso y certificación.',
  keywords: ['inglés', 'educación', 'curso', 'aprender inglés', 'certificación', 'NextSpeak'],
  authors: [{ name: 'NextSpeak' }],
  creator: 'NextSpeak',
  publisher: 'NextSpeak',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'),
  openGraph: {
    type: 'website',
    locale: 'es_ES',
    url: '/',
    siteName: 'NextSpeak',
    title: 'NextSpeak - Aprende inglés con confianza',
    description: 'Plataforma educativa para aprender inglés con clases personalizadas, seguimiento de progreso y certificación.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'NextSpeak',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'NextSpeak - Aprende inglés con confianza',
    description: 'Plataforma educativa para aprender inglés con clases personalizadas.',
    images: ['/og-image.png'],
    creator: '@nextspeak',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon-16x16.png',
    apple: '/apple-touch-icon.png',
  },
  manifest: '/site.webmanifest',
};

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#0ea5e9' },
    { media: '(prefers-color-scheme: dark)', color: '#0369a1' },
  ],
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
    <html lang="es" className={`${inter.variable} antialiased`} suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="min-h-screen bg-gray-50 dark:bg-gray-950">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}