'use client';

import * as React from 'react';

import { LanguageProvider } from '@/components/LanguageProvider';
import { ProgressProvider } from '@/components/ProgressProvider';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <LanguageProvider>
      <ProgressProvider>{children}</ProgressProvider>
    </LanguageProvider>
  );
}
