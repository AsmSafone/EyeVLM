'use client';

import Link from 'next/link';
import Image from 'next/image';
import BottomNav from '@/components/BottomNav';
import { useLanguage } from '@/app/context/LanguageContext';
import TipsCarousel from '@/components/TipsCarousel';
import { motion, AnimatePresence } from 'motion/react';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { quotes } from '@/app/lib/quotes';

export default function Dashboard() {
  const router = useRouter();
  const { t, language } = useLanguage();

  const [hydrationLevel, setHydrationLevel] = useState(0);
  const [greeting, setGreeting] = useState('');
  const [quoteIndex, setQuoteIndex] = useState(() => Math.floor(Math.random() * quotes.length));
  const [quoteDir, setQuoteDir] = useState(1);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const savedHydration = localStorage.getItem('eyeHydrationLevel');
    if (savedHydration) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setHydrationLevel(parseInt(savedHydration));
    } else {
      setHydrationLevel(15);
    }

    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) {
      setGreeting(t.goodMorning);
    } else if (hour >= 12 && hour < 17) {
      setGreeting(t.goodAfternoon);
    } else if (hour >= 17 && hour < 21) {
      setGreeting(t.goodEvening);
    } else {
      setGreeting(t.goodNight);
    }
  }, [t]);

  // Quote carousel: advance every 60 seconds, progress bar every second
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setProgress(0);
    const tick = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          setQuoteDir(1);
          setQuoteIndex(i => (i + 1) % quotes.length);
          return 0;
        }
        return prev + 100 / 45; // ~2.22% per second → 100% in 45s
      });
    }, 1000);
    return () => clearInterval(tick);
  }, [quoteIndex]);

  const handleLogDrink = () => {
    setHydrationLevel(prev => {
      const newLevel = Math.min(prev + 15, 100);
      localStorage.setItem('eyeHydrationLevel', newLevel.toString());
      return newLevel;
    });
  };

  const goToQuote = (dir: 1 | -1) => {
    setQuoteDir(dir);
    setProgress(0);
    setQuoteIndex(i => (i + dir + quotes.length) % quotes.length);
  };

  return (
    <div className="bg-background font-sans min-h-screen flex flex-col antialiased pb-24 relative overflow-hidden transition-colors duration-300">
      {/* Decorative Background - Dark Mode Only */}
      <div className="absolute inset-0 z-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-900/20 via-slate-950 to-slate-950 pointer-events-none opacity-0 dark:opacity-100 transition-opacity duration-300"></div>
      <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-b from-cyan-500/5 dark:from-cyan-900/10 to-transparent pointer-events-none"></div>

      {/* Header */}
      <header className="sticky top-0 z-20 bg-surface/80 backdrop-blur-xl px-6 pt-12 pb-4 border-b border-slate-200 dark:border-white/5 transition-colors duration-300">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-primary text-xs font-medium tracking-wider uppercase mb-1">{greeting}</p>
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
          <div className="flex flex-col gap-6 relative">
            {/* Top Interactive Area: Start Scan Heading & CTA */}
            <div className="relative pt-6 flex flex-col items-center text-center z-10 transition-colors">
              <div className="mb-6 relative group inline-flex">
                <div className="absolute -inset-1.5 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-3xl blur opacity-30 group-hover:opacity-60 transition duration-500"></div>
                <div className="relative size-20 sm:size-24 bg-surface dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-white/10 shadow-xl flex items-center justify-center overflow-hidden">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(6,182,212,0.1)_0%,transparent_70%)]"></div>
                  <span className="material-symbols-outlined text-[40px] sm:text-[48px] text-cyan-500 drop-shadow-[0_0_15px_rgba(6,182,212,0.5)] group-hover:scale-110 transition-transform duration-500">
                    center_focus_strong
                  </span>
                </div>
              </div>

              <div className="space-y-3 mb-8">
                <div className="flex justify-center mb-2">
                  <span className="bg-surface/80 backdrop-blur-md px-4 py-1.5 rounded-full text-xs font-bold tracking-wide border border-slate-200 dark:border-white/10 flex items-center gap-2 text-text-main shadow-sm">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.8)]"></span>
                    {t.aiPowered}
                  </span>
                </div>
                <h2 className="text-3xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-text-main to-text-secondary pb-1">{t.startNewScan}</h2>
                <p className="text-text-secondary text-base leading-relaxed max-w-[90%] mx-auto font-medium">{t.useCameraDesc}</p>
              </div>

              <Link href="/scan" className="w-full max-w-[280px] bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-white font-bold py-4 rounded-2xl shadow-[0_10px_30px_-10px_rgba(6,182,212,0.6)] flex items-center justify-center gap-3 transition-all transform hover:scale-105 active:scale-95 border border-white/20">
                <span className="text-lg">Begin Screening</span>
              </Link>
            </div>

            {/* Bottom Area: Daily Inspiration Quote Carousel */}
            <div className="relative bg-surface/60 backdrop-blur-xl border border-slate-200 dark:border-white/10 rounded-3xl shadow-lg z-20 overflow-hidden mt-4">
              {/* Subtle background for the quote area */}
              <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -right-12 -top-12 h-40 w-40 rounded-full bg-violet-500/5 blur-3xl transition-colors duration-500 group-hover:bg-violet-500/10"></div>
              </div>

              <div className="relative p-5 pb-4">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-[10px] font-bold text-violet-500 dark:text-violet-400 uppercase tracking-widest flex items-center gap-1.5 opacity-90">
                    <span className="material-symbols-outlined text-[14px]">format_quote</span>
                    {t.dailyQuotes || "Daily Quotes"}
                  </p>
                  <div className="flex items-center gap-0.5">
                    <button
                      onClick={() => goToQuote(-1)}
                      className="w-7 h-7 rounded-full flex items-center justify-center text-text-secondary hover:text-text-main hover:bg-surface-highlight transition-all active:scale-90 border border-transparent hover:border-slate-200 dark:hover:border-white/10"
                      aria-label="Previous quote"
                    >
                      <span className="material-symbols-outlined text-[18px]">chevron_left</span>
                    </button>
                    <button
                      onClick={() => goToQuote(1)}
                      className="w-7 h-7 rounded-full flex items-center justify-center text-text-secondary hover:text-text-main hover:bg-surface-highlight transition-all active:scale-90 border border-transparent hover:border-slate-200 dark:hover:border-white/10"
                      aria-label="Next quote"
                    >
                      <span className="material-symbols-outlined text-[18px]">chevron_right</span>
                    </button>
                  </div>
                </div>

                <div className="relative min-h-[64px] overflow-hidden">
                  <AnimatePresence mode="wait" initial={false}>
                    <motion.div
                      key={quoteIndex}
                      initial={{ x: quoteDir * 40, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      exit={{ x: quoteDir * -40, opacity: 0 }}
                      transition={{ duration: 0.35, ease: 'easeInOut' }}
                    >
                      <p className="text-text-main text-[13px] font-medium leading-relaxed italic mb-1.5 opacity-90">
                        &ldquo;{quotes[quoteIndex].text[language as 'en' | 'bn'] || quotes[quoteIndex].text.en}&rdquo;
                      </p>
                      <p className="text-text-secondary text-[11px] font-semibold tracking-wider uppercase">— {quotes[quoteIndex].author[language as 'en' | 'bn'] || quotes[quoteIndex].author.en}</p>
                    </motion.div>
                  </AnimatePresence>
                </div>
              </div>

              {/* Progress bar attached to the bottom */}
              <div className="h-[2px] w-full bg-slate-200/50 dark:bg-white/5 relative overflow-hidden mt-auto">
                <div
                  className="absolute left-0 top-0 h-full bg-gradient-to-r from-violet-500 to-cyan-400 transition-all ease-linear"
                  style={{ width: `${Math.min(progress, 100)}%`, transitionDuration: progress === 0 ? '0s' : '1s' }}
                ></div>
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
                  {/* Progress Circle */}
                  <path
                    className="stroke-cyan-500 dark:stroke-cyan-400 fill-none drop-shadow-md dark:drop-shadow-[0_0_4px_rgba(34,211,238,0.5)] transition-all duration-1000 ease-out"
                    strokeWidth="3.5"
                    strokeDasharray={`${hydrationLevel}, 100`}
                    strokeLinecap="round"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center flex-col">
                  <span className="text-lg font-bold text-text-main">{hydrationLevel}%</span>
                </div>
              </div>

              <div className="flex-1">
                <h4 className="font-bold text-text-main text-lg mb-1 tracking-tight">{t.eyeHydration}</h4>
                <p className="text-sm text-text-secondary font-light mb-3 leading-relaxed">You&apos;ve met {hydrationLevel}% of your daily water intake goal.</p>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleLogDrink}
                    className="bg-cyan-500 text-white shadow hover:opacity-90 text-xs font-bold px-4 py-1.5 rounded-full transition-all active:scale-95 flex items-center gap-1">
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
