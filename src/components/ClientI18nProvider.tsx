'use client';

import { useEffect, useState } from 'react';
import { initI18n } from '../lib/i18n';

export default function ClientI18nProvider({ children }: { children: React.ReactNode }) {
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    // Initialize i18n only on client side
    initI18n();
    setIsInitialized(true);
  }, []);

  // Show loading state or children based on initialization
  if (!isInitialized) {
    return <div className="min-h-screen bg-dark"></div>; // Simple loading state
  }

  return <>{children}</>;
}