'use client';

import { Suspense } from 'react';
import { useTranslation } from 'react-i18next';
import Image from 'next/image';
import ReservistForm from '@/components/ReservistForm';
import LanguageToggle from '@/components/LanguageToggle';

export default function Home() {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.dir() === 'rtl';

  return (
    <main className="min-h-screen bg-gradient-radial from-light via-white to-light overflow-hidden" dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Background Decorations */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className={`absolute -top-1/4 ${isRTL ? '-left-1/4' : '-right-1/4'} w-1/2 h-1/2 bg-primary/5 rounded-full blur-3xl`} />
        <div className={`absolute -bottom-1/4 ${isRTL ? '-right-1/4' : '-left-1/4'} w-1/2 h-1/2 bg-secondary/5 rounded-full blur-3xl`} />
      </div>

      <div className="relative container mx-auto px-4 py-8 md:py-12">
        {/* Header */}
        <header className="flex justify-between items-center mb-8">
          <Image 
            src="/Wlogo.svg"
            alt={t('logoAlt')}
            width={180}
            height={60}
            className="h-16 md:h-20 w-auto object-contain transition-transform duration-300 hover:scale-105"
            priority
          />
          <LanguageToggle />
        </header>

        <div className="max-w-6xl mx-auto">
          {/* Hero Section */}
          <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
            {/* Image Section - First on mobile */}
            <div className={`order-1 ${isRTL ? 'md:col-start-2' : 'md:col-start-1'}`}>
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-secondary/20 rounded-3xl transform rotate-6 scale-105" />
                <Image 
                  src="/1.png"
                  alt={t('heroImageAlt')}
                  width={600}
                  height={400}
                  className="relative rounded-3xl shadow-2xl w-full transition-all duration-300 hover:shadow-primary/20"
                  priority
                />
              </div>
            </div>
            {/* Text Section - Second on mobile */}
            <div className={`order-2 ${isRTL ? 'md:col-start-1' : 'md:col-start-2'} text-center ${isRTL ? 'md:text-right' : 'md:text-left'}`}>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-primary mb-6 leading-tight">
                {t('title.part1')}
                <br />
                <span className="text-brown">{t('title.part2')}</span>
              </h1>
              <p className="text-lg md:text-xl text-dark/80 leading-relaxed mb-8">
                {t('description')}
              </p>
            </div>
          </div>

          {/* Form Section */}
          <div className="relative max-w-4xl mx-auto">
            <div className="absolute inset-0 bg-gradient-conic from-primary/5 via-secondary/5 to-primary/5 rounded-3xl transform -rotate-3" />
            <div className="absolute inset-0 bg-light/80 backdrop-blur-xl rounded-3xl shadow-xl" />
            <div className="relative p-8 md:p-12">
              <Suspense fallback={
                <div className="flex justify-center items-center h-64">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
                </div>
              }>
                <ReservistForm />
              </Suspense>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
} 