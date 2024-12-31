'use client';

import { Suspense } from 'react';
import { useTranslation } from 'react-i18next';
import ReservistForm from '@/components/ReservistForm';
import LanguageToggle from '@/components/LanguageToggle';

export default function Home() {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.dir() === 'rtl';

  return (
    <main className="min-h-screen bg-gradient-radial from-light via-white to-light overflow-hidden">
      {/* Background Decorations */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-1/4 -right-1/4 w-1/2 h-1/2 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-1/4 -left-1/4 w-1/2 h-1/2 bg-secondary/5 rounded-full blur-3xl" />
      </div>

      <div className="relative container mx-auto px-4 py-8 md:py-12">
        {/* Header */}
        <header className="flex justify-between items-center mb-8">
          <img 
            src="https://res.cloudinary.com/dsoh3yteb/image/upload/v1735156794/MailLogo_jrcesy.png"
            alt={t('logoAlt')}
            className="h-12 md:h-16 transition-transform duration-300 hover:scale-105"
          />
          <LanguageToggle />
        </header>

        <div className="max-w-6xl mx-auto">
          {/* Hero Section */}
          <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
            <div className={`${isRTL ? 'order-2 md:order-1' : 'order-2'} text-center ${isRTL ? 'md:text-right' : 'md:text-left'}`}>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-dark mb-6 leading-tight">
                {t('title.part1')}
                <br />
                <span className="text-primary">{t('title.part2')}</span>
              </h1>
              <p className="text-lg md:text-xl text-dark/80 leading-relaxed mb-8">
                {t('description')}
              </p>
              <div className={`flex justify-center ${isRTL ? 'md:justify-end' : 'md:justify-start'} space-x-4 ${isRTL ? 'space-x-reverse' : ''}`}>
                <img 
                  src="https://res.cloudinary.com/dsoh3yteb/image/upload/v1732464729/1_i9skom.svg"
                  alt={t('decorationAlt')}
                  className="w-8 h-8 animate-float"
                />
                <img 
                  src="https://res.cloudinary.com/dsoh3yteb/image/upload/v1732464730/3_dr3mew.svg"
                  alt={t('decorationAlt')}
                  className="w-8 h-8 animate-float delay-150"
                />
              </div>
            </div>
            <div className={`${isRTL ? 'order-1 md:order-2' : 'order-1'}`}>
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-secondary/20 rounded-3xl transform rotate-6 scale-105" />
                <img 
                  src="https://res.cloudinary.com/dsoh3yteb/image/upload/v1732740917/%D7%AA%D7%9E%D7%95%D7%A0%D7%94_%D7%9C%D7%94%D7%93%D7%A8_hfxkhd.png"
                  alt={t('heroImageAlt')}
                  className="relative rounded-3xl shadow-2xl w-full transition-all duration-300 hover:shadow-primary/20"
                />
              </div>
            </div>
          </div>

          {/* Form Section */}
          <div className="relative max-w-4xl mx-auto">
            <div className="absolute inset-0 bg-gradient-conic from-primary/5 via-secondary/5 to-primary/5 rounded-3xl transform -rotate-3" />
            <div className="absolute inset-0 bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl" />
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