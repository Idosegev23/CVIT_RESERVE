'use client';

import { useEffect } from 'react';
import { I18nextProvider } from 'react-i18next';
import i18next from '../i18n/config';

export function Providers({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Initialize i18n on the client side
    const dir = i18next.dir();
    document.documentElement.dir = dir;
  }, []);

  return (
    <I18nextProvider i18n={i18next}>
      {children}
    </I18nextProvider>
  );
} 