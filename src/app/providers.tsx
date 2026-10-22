'use client';

import * as React from 'react';

import { ProgressProvider } from '@/components/ProgressProvider';

export function Providers({ children }: { children: React.ReactNode }) {
  return <ProgressProvider>{children}</ProgressProvider>;
}
