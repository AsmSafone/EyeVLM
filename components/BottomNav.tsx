'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useLanguage } from '@/app/context/LanguageContext';

export default function BottomNav() {
  const { t } = useLanguage();
  const pathname = usePathname();

  const navItems = [
    { path: '/dashboard', icon: 'home', label: t.home },
    { path: '/progress', icon: 'monitoring', label: t.progress },
    { path: '/scan', icon: 'visibility', label: t.scans },
    { path: '/history', icon: 'history', label: t.history },
    { path: '/profile', icon: 'person', label: t.profile },
  ];

  // We'll map the icon 'visibility' to 'add' for the scan button to match design
  return (
    <div className="fixed bottom-6 left-0 right-0 px-4 z-50 flex justify-center pointer-events-none">
      <nav className="bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-white/5 rounded-[40px] shadow-[0_10px_40px_rgba(0,0,0,0.1)] dark:shadow-[0_10px_40px_rgba(0,0,0,0.5)] px-4 py-3 pointer-events-auto w-full max-w-sm transition-colors duration-300 relative flex items-center h-[72px]">
        <div className="flex justify-between items-center w-full">
          {navItems.map((item) => {
            const isActive = pathname === item.path;
            const isScan = item.path === '/scan';

            if (isScan) {
              return (
                <div key={item.path} className="relative flex-col items-center flex -translate-y-6 z-50">
                  <Link
                    href={item.path}
                    className="w-[68px] h-[68px] rounded-full bg-primary hover:bg-primary-dark active:scale-95 transition-all text-white flex items-center justify-center ring-[6px] ring-background shadow-lg shadow-primary/30"
                  >
                    <span className="material-symbols-outlined text-[36px] leading-none font-light">visibility</span>
                  </Link>
                  <span className={`text-[10px] font-bold tracking-wide mt-1.5 transition-colors ${isActive ? 'text-primary' : 'text-text-secondary opacity-0 group-hover:opacity-100'}`}>
                    {item.label}
                  </span>
                </div>
              );
            }

            return (
              <Link
                key={item.path}
                href={item.path}
                className={`flex flex-col items-center gap-1.5 transition-all duration-300 relative group w-14 ${isActive ? 'text-primary' : 'text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300'
                  }`}
              >
                <span
                  className={`material-symbols-outlined text-[28px] transition-transform duration-300 ${isActive ? 'font-variation-fill scale-110 drop-shadow-md' : 'scale-100'
                    }`}
                  style={{
                    fontVariationSettings: isActive ? "'FILL' 1, 'wght' 400" : "'FILL' 0, 'wght' 300",
                  }}
                >
                  {item.icon}
                </span>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
