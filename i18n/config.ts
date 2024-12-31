'use client';

import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';
import { translations } from './translations';

i18next
  .use(initReactI18next)
  .init({
    resources: {
      he: {
        translation: translations.he,
      },
      en: {
        translation: translations.en,
      },
    },
    lng: 'he',
    fallbackLng: 'he',
    interpolation: {
      escapeValue: false,
    },
  });

export default i18next; 