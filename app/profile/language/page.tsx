'use client';

import Link from 'next/link';
import { useLanguage } from '@/app/context/LanguageContext';

export default function LanguageSettings() {
  const { language, setLanguage, t } = useLanguage();

  const languages = [
    { code: 'en', name: 'English', nativeName: 'English' },
    { code: 'bn', name: 'Bengali', nativeName: 'বাংলা' },
  ];

  return (
    <div className="bg-background font-sans min-h-screen flex justify-center text-text-main antialiased relative overflow-hidden transition-colors duration-300">
      {/* Decorative Background - Dark Mode Only */}
      <div className="absolute inset-0 z-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-slate-950 pointer-events-none opacity-0 dark:opacity-100 transition-opacity duration-300"></div>
      
      <div className="relative flex h-full w-full max-w-md flex-col bg-background overflow-x-hidden shadow-2xl min-h-screen z-10 transition-colors duration-300">
        {/* Header */}
        <div className="bg-surface/50 backdrop-blur-xl px-4 py-4 sticky top-0 z-20 shadow-lg border-b border-slate-200 dark:border-white/5 flex items-center transition-colors duration-300">
          <Link href="/profile" className="flex size-10 items-center justify-center rounded-full hover:bg-surface-highlight transition-colors text-text-main border border-transparent hover:border-slate-200 dark:hover:border-white/10">
            <span className="material-symbols-outlined">arrow_back</span>
          </Link>
          <h1 className="text-lg font-bold leading-tight flex-1 text-center pr-10 tracking-wide drop-shadow-md">{t.language}</h1>
        </div>

        {/* Language List */}
        <div className="flex-1 px-4 py-8">
          <div className="bg-surface/40 backdrop-blur-md rounded-3xl border border-slate-200 dark:border-white/5 overflow-hidden shadow-inner transition-colors duration-300">
            {languages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => setLanguage(lang.code as 'en' | 'bn')}
                className="w-full flex items-center justify-between p-5 hover:bg-surface-highlight transition-colors border-b border-slate-200 dark:border-white/5 last:border-0 group"
              >
                <div className="flex flex-col items-start gap-1">
                  <span className={`font-bold text-lg transition-colors ${language === lang.code ? 'text-primary' : 'text-text-main group-hover:text-primary/80'}`}>{lang.nativeName}</span>
                  <span className="text-sm text-text-secondary font-medium">{lang.name}</span>
                </div>
                {language === lang.code && (
                  <div className="size-8 rounded-full bg-primary/10 flex items-center justify-center border border-primary/20 shadow-[0_0_10px_rgba(6,182,212,0.2)]">
                    <span className="material-symbols-outlined text-primary text-[20px]">check</span>
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
