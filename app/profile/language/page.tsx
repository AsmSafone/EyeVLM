'use client';

import Link from 'next/link';
import BottomNav from '@/components/BottomNav';
import { useLanguage } from '@/app/context/LanguageContext';

export default function LanguageSettings() {
  const { language, setLanguage, t } = useLanguage();

  const languages = [
    { code: 'en', name: 'English', nativeName: 'English' },
    { code: 'bn', name: 'Bengali', nativeName: 'বাংলা' },
  ];

  return (
    <div className="bg-background font-sans min-h-screen flex justify-center text-text-main antialiased relative overflow-clip transition-colors duration-300">
      {/* Decorative Background - Dark Mode Only */}
      <div className="absolute inset-0 z-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-slate-950 pointer-events-none opacity-0 dark:opacity-100 transition-opacity duration-300"></div>

      <div className="relative flex h-full w-full max-w-md flex-col bg-background shadow-2xl min-h-screen pb-24 z-10 transition-colors duration-300">
        {/* Header */}
        <div className="sticky top-0 z-20 bg-surface/80 backdrop-blur-xl px-4 pb-4 pt-6 border-b border-slate-200 dark:border-white/5 transition-colors duration-300">
          <div className="flex items-center gap-4">
            <Link href="/profile" className="flex size-10 items-center justify-center rounded-full hover:bg-surface-highlight transition-colors text-text-main border border-transparent hover:border-slate-200 dark:hover:border-white/10">
              <span className="material-symbols-outlined text-2xl">arrow_back</span>
            </Link>
            <h1 className="text-xl font-bold leading-tight flex-1 text-text-main">{t.language}</h1>
          </div>
        </div>

        {/* Language List */}
        <div className="flex-1 px-4 py-8 space-y-6">
          <div className="bg-surface/40 backdrop-blur-md rounded-3xl border border-slate-200 dark:border-white/5 overflow-hidden shadow-sm transition-colors duration-300">
            {languages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => setLanguage(lang.code as 'en' | 'bn')}
                className="w-full flex items-center justify-between p-5 hover:bg-surface-highlight transition-colors border-b border-slate-200 dark:border-white/5 last:border-0 group cursor-pointer"
              >
                <div className="flex items-center gap-4 text-left">
                  <div className={`size-10 rounded-xl flex items-center justify-center border transition-all duration-300 group-hover:scale-110 ${language === lang.code ? 'bg-primary/20 text-primary border-primary/30 shadow-[0_0_15px_rgba(6,182,212,0.2)]' : 'bg-slate-500/10 text-slate-500 border-slate-500/20 group-hover:text-primary group-hover:bg-primary/10 group-hover:border-primary/20'}`}>
                    <span className="material-symbols-outlined">translate</span>
                  </div>
                  <div>
                    <p className={`font-bold transition-colors ${language === lang.code ? 'text-primary' : 'text-text-main group-hover:text-primary'}`}>{lang.nativeName}</p>
                    <p className="text-xs text-text-secondary font-light">{lang.name}</p>
                  </div>
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

        <BottomNav />
      </div>
    </div>
  );
}
