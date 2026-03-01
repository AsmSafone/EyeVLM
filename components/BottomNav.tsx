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
    { path: '/scan', icon: 'visibility', label: t.scans },
    { path: '/history', icon: 'history', label: t.history },
    { path: '/profile', icon: 'person', label: t.profile },
  ];

  return (
    <div className="fixed bottom-6 left-0 right-0 px-4 z-50 flex justify-center pointer-events-none">
      <nav className="bg-surface/80 backdrop-blur-xl border border-slate-200 dark:border-white/10 rounded-2xl shadow-2xl shadow-slate-200/50 dark:shadow-black/50 px-2 py-3 pointer-events-auto w-full max-w-md transition-colors duration-300">
        <div className="flex justify-around items-center">
          {navItems.map((item) => {
            const isActive = pathname === item.path;
            return (
              <Link 
                key={item.path} 
                href={item.path} 
                className={`flex flex-1 flex-col items-center gap-1 transition-all duration-300 relative group ${
                  isActive ? 'text-primary scale-110' : 'text-text-secondary hover:text-text-main'
                }`}
              >
                {isActive && (
                  <div className="absolute -top-8 w-8 h-8 bg-primary/20 rounded-full blur-xl animate-pulse"></div>
                )}
                <span 
                  className={`material-symbols-outlined text-[26px] transition-transform duration-300 ${
                    isActive ? 'font-variation-fill' : ''
                  }`}
                  style={{ 
                    fontVariationSettings: isActive ? "'FILL' 1, 'wght' 400" : "'FILL' 0, 'wght' 300",
                    textShadow: isActive ? '0 0 12px var(--color-primary)' : 'none'
                  }}
                >
                  {item.icon}
                </span>
                <span className={`text-[10px] font-medium tracking-wide ${isActive ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'} transition-opacity whitespace-nowrap`}>
                  {item.label}
                </span>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
