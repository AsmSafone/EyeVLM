'use client';

import Link from 'next/link';
import Image from 'next/image';
import BottomNav from '@/components/BottomNav';
import { useLanguage } from '@/app/context/LanguageContext';
import TipsCarousel from '@/components/TipsCarousel';
import { motion } from 'motion/react';

export default function Dashboard() {
  const { t } = useLanguage();

  return (
    <div className="bg-background font-sans min-h-screen flex flex-col antialiased pb-24 relative overflow-hidden transition-colors duration-300">
      {/* Decorative Background - Dark Mode Only */}
      <div className="absolute inset-0 z-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-900/20 via-slate-950 to-slate-950 pointer-events-none opacity-0 dark:opacity-100 transition-opacity duration-300"></div>
      <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-b from-cyan-500/5 dark:from-cyan-900/10 to-transparent pointer-events-none"></div>

      {/* Header */}
      <header className="sticky top-0 z-20 bg-surface/80 backdrop-blur-xl px-6 pt-12 pb-4 border-b border-slate-200 dark:border-white/5 transition-colors duration-300">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-primary text-xs font-medium tracking-wider uppercase mb-1">{t.goodMorning}</p>
            <h1 className="text-2xl font-bold tracking-tight text-text-main">{t.welcomeBackUser}</h1>
          </div>
          <button className="relative h-12 w-12 rounded-full overflow-hidden border border-slate-200 dark:border-white/10 shadow-[0_0_15px_rgba(34,211,238,0.2)] hover:shadow-[0_0_20px_rgba(34,211,238,0.4)] transition-all focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background">
            <Image
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuCj7TlOYBM68apVQ-KP6xMYJEuIltMbKhra9Q5ELf-Lurp6lHv2QOlhW3cs2vfIXK7kVYEzOdXk2MiNs3u-k5_bCQ5rpZzHTMXZxFdNLQ1xyjReppSTDoMDfQL1yGeDZDLf7GHqE-HHXg1YCUtl2y9lzNQcALzhq14LM-jeXA4pkZOB47tZo5NhSPQ2E38Gd-NgegPM3Djo2SWdUoNWcTOFEmJyF2OpSJlJ0QQmFz1n8clXgD9tfaaQzAFnG6mcq5YAY3IN02dvzYM"
              alt="Profile Picture"
              fill
              className="object-cover"
            />
          </button>
        </div>
      </header>

      <main className="p-6 space-y-8 flex-1 overflow-y-auto z-10 w-full overflow-x-hidden">
        {/* Main CTA: Start Scan */}
        <motion.section
          aria-label={t.startNewScan}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="relative overflow-hidden rounded-3xl bg-surface/80 backdrop-blur-xl border border-slate-200 dark:border-white/10 shadow-lg hover:shadow-cyan-500/20 group cursor-pointer transition-all duration-500 active:scale-[0.99]">
            {/* Decorative elements - adaptive to theme */}
            <div className="absolute -right-12 -top-12 h-48 w-48 rounded-full bg-cyan-500/10 dark:bg-cyan-400/10 blur-3xl group-hover:bg-cyan-500/20 transition-colors duration-500"></div>
            <div className="absolute -left-8 -bottom-8 h-32 w-32 rounded-full bg-blue-500/10 dark:bg-blue-600/20 blur-2xl group-hover:bg-blue-500/20 transition-colors duration-500"></div>

            <div className="relative p-6 flex flex-col gap-5">
              <div className="flex items-start justify-between">
                <div className="p-3 bg-cyan-500/10 dark:bg-cyan-500/20 rounded-2xl inline-flex items-center justify-center border border-cyan-500/20 text-cyan-600 dark:text-cyan-400">
                  <span className="material-symbols-outlined text-3xl drop-shadow-sm">photo_camera</span>
                </div>
                <span className="bg-surface-highlight px-3 py-1 rounded-full text-xs font-bold tracking-wide border border-slate-200 dark:border-white/10 flex items-center gap-1 text-text-main">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  {t.aiPowered}
                </span>
              </div>
              <div className="space-y-1">
                <h2 className="text-2xl font-bold tracking-tight text-text-main">{t.startNewScan}</h2>
                <p className="text-text-secondary text-sm leading-relaxed max-w-[85%] font-light">{t.useCameraDesc}</p>
              </div>
            </div>
          </div>
        </motion.section>

        {/* Dashboard Grid Replacement - Health Overview */}
        <motion.section
          aria-label={t.yourHealth}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-text-main tracking-tight">{t.dailyProgress}</h3>
            <span className="text-xs font-medium text-blue-400 bg-blue-500/10 border border-blue-500/20 px-3 py-1 rounded-full flex items-center gap-1">
              <span className="material-symbols-outlined text-xs">trending_up</span> Good
            </span>
          </div>

          <div className="bg-surface/50 backdrop-blur-xl border border-slate-200 dark:border-white/5 p-5 rounded-3xl shadow-lg relative overflow-hidden group transition-all hover:border-cyan-500/30 hover:shadow-cyan-500/10">
            {/* Background elements */}
            <div className="absolute right-0 top-0 w-32 h-32 bg-cyan-500/10 rounded-full blur-3xl group-hover:bg-cyan-500/20 transition-colors duration-500"></div>

            <div className="flex items-center gap-6 relative z-10">
              {/* Progress Ring */}
              <div className="relative h-20 w-20 shrink-0">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                  {/* Background Circle */}
                  <path
                    className="stroke-slate-200 dark:stroke-slate-700/50 fill-none"
                    strokeWidth="3.5"
                    strokeDasharray="100, 100"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                  {/* Progress Circle (75%) */}
                  <path
                    className="stroke-cyan-500 dark:stroke-cyan-400 fill-none drop-shadow-md dark:drop-shadow-[0_0_4px_rgba(34,211,238,0.5)] transition-all duration-1000 ease-out"
                    strokeWidth="3.5"
                    strokeDasharray="75, 100"
                    strokeLinecap="round"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center flex-col">
                  <span className="text-lg font-bold text-text-main">75%</span>
                </div>
              </div>

              <div className="flex-1">
                <h4 className="font-bold text-text-main text-lg mb-1 tracking-tight">{t.eyeHydration}</h4>
                <p className="text-sm text-text-secondary font-light mb-3 leading-relaxed">You've met 75% of your daily water intake goal.</p>
                <div className="flex items-center gap-2">
                  <button className="bg-cyan-500 text-white shadow hover:opacity-90 text-xs font-bold px-4 py-1.5 rounded-full transition-all active:scale-95 flex items-center gap-1">
                    <span className="material-symbols-outlined text-[14px]">water_drop</span>
                    Log Drink
                  </button>
                </div>
              </div>
            </div>

            <div className="mt-5 pt-4 border-t border-slate-200 dark:border-white/5 grid grid-cols-3 gap-2 justify-between items-center w-full relative z-10">
              <div className="flex flex-col items-center justify-center text-center group/item w-full">
                <p className="text-xs text-text-secondary mb-1 flex items-center gap-1"><span className="material-symbols-outlined text-[12px]">schedule</span> Screen Time</p>
                <p className="font-bold text-text-main group-hover/item:text-cyan-500 transition-colors">4h 20m</p>
              </div>

              <div className="flex flex-col items-center justify-center text-center group/item w-full relative">
                <div className="absolute -left-1 top-1/2 -translate-y-1/2 w-px h-8 bg-slate-200 dark:bg-white/10"></div>
                <p className="text-xs text-text-secondary mb-1 flex items-center gap-1"><span className="material-symbols-outlined text-[12px]">visibility</span> Blink Rate</p>
                <p className="font-bold text-emerald-500 transition-colors">{t.normal}</p>
                <div className="absolute -right-1 top-1/2 -translate-y-1/2 w-px h-8 bg-slate-200 dark:bg-white/10"></div>
              </div>

              <div className="flex flex-col items-center justify-center text-center group/item w-full">
                <p className="text-xs text-text-secondary mb-1 flex items-center gap-1"><span className="material-symbols-outlined text-[12px]">coffee</span> Last Break</p>
                <p className="font-bold text-text-main group-hover/item:text-cyan-500 transition-colors">15m ago</p>
              </div>
            </div>
          </div>
        </motion.section>

        {/* Quick Tips Carousel */}
        <TipsCarousel />
      </main>

      <BottomNav />
    </div>
  );
}
