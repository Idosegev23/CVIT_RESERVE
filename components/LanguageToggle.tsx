'use client';

import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

export default function LanguageToggle() {
  const { i18n } = useTranslation();
  const [isHebrew, setIsHebrew] = useState(true);

  useEffect(() => {
    setIsHebrew(i18n.language === 'he');
  }, [i18n.language]);

  const toggleLanguage = () => {
    const newLang = isHebrew ? 'en' : 'he';
    i18n.changeLanguage(newLang);
    setIsHebrew(!isHebrew);
    document.documentElement.dir = newLang === 'he' ? 'rtl' : 'ltr';
  };

  return (
    <button
      onClick={toggleLanguage}
      className="px-4 py-2 rounded-lg bg-primary text-white hover:bg-secondary transition-all flex items-center space-x-2 rtl:space-x-reverse"
    >
      <span className="text-sm font-medium">
        {isHebrew ? 'English' : 'עברית'}
      </span>
      <svg 
        xmlns="http://www.w3.org/2000/svg" 
        className="h-4 w-4" 
        fill="none" 
        viewBox="0 0 24 24" 
        stroke="currentColor"
      >
        <path 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          strokeWidth={2} 
          d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129"
        />
      </svg>
    </button>
  );
} 