import type { Metadata } from 'next';
import * as React from 'react';

/**
 * The lessons list page is a client component (it reads saved progress), and
 * client components cannot export `metadata`. This layout provides the page
 * title and description for every /lessons URL.
 */
export const metadata: Metadata = {
  title: {
    template: '%s | NextSpeak',
    default: 'Lessons',
  },
  description:
    'Browse the free beginner English lessons: greetings, daily routines, describing people, places in town, the past and the future.',
};

export default function LessonsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
