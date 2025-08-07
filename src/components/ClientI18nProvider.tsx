'use client';

import { useEffect } from 'react';
import '../lib/i18n'; // Initialize i18n

export default function ClientI18nProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // i18n is already initialized in the import above
  }, []);

  return <>{children}</>;
}