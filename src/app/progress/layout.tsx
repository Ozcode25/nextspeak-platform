import type { Metadata } from 'next';
import * as React from 'react';

/**
 * The progress page is a client component (it reads saved progress), and
 * client components cannot export `metadata`. This layout provides the page
 * title and description for /progress.
 */
export const metadata: Metadata = {
  title: 'My progress',
  description:
    'See your NextSpeak progress: lessons completed, best quiz scores and course completion — stored only in your browser.',
};

export default function ProgressLayout({ children }: { children: React.ReactNode }) {
  return children;
}
