'use client';

import * as React from 'react';

import { LanguageProvider } from '@/components/LanguageProvider';
import { ProgressProvider } from '@/components/ProgressProvider';
import { ThemeProvider } from '@/components/ThemeProvider';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <ProgressProvider>{children}</ProgressProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}
