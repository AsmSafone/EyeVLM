'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/app/context/LanguageContext';

export default function Splash() {
  const router = useRouter();
  const { t } = useLanguage();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push('/onboarding');
    }, 3000);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="bg-background font-sans antialiased text-text-main h-screen w-full overflow-hidden flex flex-col items-center justify-center relative transition-colors duration-300">
      {/* Decorative Background - Dark Mode Only */}
      <div className="absolute inset-0 z-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900 via-slate-950 to-slate-950 opacity-0 dark:opacity-100 transition-opacity duration-300"></div>
      
      {/* Grid Pattern */}
      <div className="absolute inset-0 z-0 opacity-20" 
           style={{ backgroundImage: 'linear-gradient(rgba(148, 163, 184, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(148, 163, 184, 0.1) 1px, transparent 1px)', backgroundSize: '40px 40px' }}>
      </div>

      {/* Top abstract shape */}
      <div className="absolute -top-40 -right-40 w-96 h-96 bg-blue-500/20 rounded-full blur-[100px] animate-pulse"></div>
      
      {/* Bottom abstract shape */}
      <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-cyan-500/20 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: '1s' }}></div>

      {/* Main Content Container */}
      <div className="relative z-10 flex flex-col items-center justify-center w-full max-w-md px-6 text-center h-full">
        
        {/* Logo Container with Effects */}
        <div className="relative mb-12 group">
          {/* Pulsing ring background */}
          <div className="absolute inset-0 -m-8">
            <div className="absolute w-full h-full rounded-full border border-blue-500/30 animate-[ping_3s_cubic-bezier(0,0,0.2,1)_infinite]"></div>
            <div className="absolute w-full h-full rounded-full border border-cyan-400/20 animate-[ping_3s_cubic-bezier(0,0,0.2,1)_infinite]" style={{ animationDelay: '0.5s' }}></div>
          </div>
          
          {/* Icon Wrapper */}
          <div className="relative bg-surface/80 backdrop-blur-xl rounded-full p-10 shadow-[0_0_60px_-15px_rgba(56,189,248,0.3)] border border-slate-200 dark:border-white/10 overflow-hidden ring-1 ring-slate-200 dark:ring-white/20 transition-colors duration-300">
            {/* Scan line */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_20px_rgba(34,211,238,0.8)] animate-[scan_2.5s_ease-in-out_infinite] z-10"></div>
            
            {/* Main Icon */}
            <span className="material-symbols-outlined text-transparent bg-clip-text bg-gradient-to-br from-blue-400 to-cyan-300 !text-[90px]" style={{ fontVariationSettings: "'FILL' 0, 'wght' 200, 'GRAD' 0, 'opsz' 48" }}>
              visibility
            </span>

            {/* Data overlay accent */}
            <div className="absolute bottom-8 right-8 flex gap-1">
              <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-bounce shadow-[0_0_8px_rgba(34,211,238,0.8)]" style={{ animationDelay: '0s' }}></div>
              <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce shadow-[0_0_8px_rgba(96,165,250,0.8)]" style={{ animationDelay: '0.1s' }}></div>
              <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce shadow-[0_0_8px_rgba(129,140,248,0.8)]" style={{ animationDelay: '0.2s' }}></div>
            </div>
          </div>
        </div>

        {/* Text Content */}
        <div className="space-y-6 animate-[fadeIn_1s_ease-out]">
          <h1 className="text-5xl font-bold tracking-tighter text-text-main drop-shadow-lg">
            Eye<span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">VLM</span>
          </h1>
          <p className="text-lg text-text-secondary font-light max-w-[280px] mx-auto leading-relaxed tracking-wide">
            AI-Powered Eye Disease<br />Screening
          </p>
        </div>

        {/* Loading / Status Indicator */}
        <div className="absolute bottom-16 w-full max-w-[240px] flex flex-col items-center gap-4">
          <div className="flex justify-between w-full text-xs font-medium text-primary/70 uppercase tracking-[0.2em]">
            <span>{t.initializing}</span>
            <span className="animate-pulse">84%</span>
          </div>
          <div className="w-full bg-surface-highlight rounded-full h-1 overflow-hidden backdrop-blur-sm border border-slate-200 dark:border-white/5">
            <div className="bg-gradient-to-r from-blue-500 via-cyan-400 to-blue-500 h-full rounded-full w-[84%] shadow-[0_0_15px_rgba(34,211,238,0.6)] animate-[shimmer_2s_linear_infinite] bg-[length:200%_100%]"></div>
          </div>
          <p className="text-[10px] text-text-secondary mt-2 font-mono tracking-widest opacity-60">{t.trustedBy}</p>
        </div>
      </div>

      <style jsx>{`
        @keyframes scan {
          0% { top: 0%; opacity: 0; }
          15% { opacity: 1; }
          85% { opacity: 1; }
          100% { top: 100%; opacity: 0; }
        }
        @keyframes shimmer {
          0% { background-position: 100% 0; }
          100% { background-position: -100% 0; }
        }
      `}</style>
    </div>
  );
}
