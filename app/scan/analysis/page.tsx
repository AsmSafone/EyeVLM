'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useLanguage } from '@/app/context/LanguageContext';

export default function Analysis() {
  const router = useRouter();
  const { t } = useLanguage();
  const [imageSrc, setImageSrc] = useState<string | null>(null);

  useEffect(() => {
    const storedImage = sessionStorage.getItem('capturedEyeImage');
    if (storedImage) {
      setImageSrc(storedImage);
    }

    const timer = setTimeout(() => {
      router.push('/scan/results');
    }, 3000);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="bg-background min-h-screen flex flex-col justify-between overflow-x-hidden text-text-main relative overflow-hidden transition-colors duration-300">
      {/* Decorative Background - Dark Mode Only */}
      <div className="absolute inset-0 z-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-slate-950 pointer-events-none opacity-0 dark:opacity-100 transition-opacity duration-300"></div>
      <div className="absolute top-0 left-0 w-full h-full bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-5 pointer-events-none"></div>

      {/* Top Navigation */}
      <div className="flex items-center p-4 pb-2 justify-between w-full relative z-20">
        <Link href="/scan/symptoms" className="flex size-12 shrink-0 items-center justify-center rounded-full hover:bg-surface-highlight transition-colors text-text-main">
          <span className="material-symbols-outlined" style={{ fontSize: '24px' }}>arrow_back</span>
        </Link>
        <h2 className="text-lg font-bold leading-tight tracking-wide flex-1 text-center pr-12 text-text-main drop-shadow-md">{t.analysisInProgress}</h2>
      </div>

      {/* Main Content Area */}
      <div className="flex flex-col flex-grow items-center justify-center px-6 py-6 w-full max-w-md mx-auto relative z-10">
        {/* Central Visualization */}
        <div className="relative flex flex-col items-center justify-center mb-10 w-full">
          {/* Pulsing Rings Effect (Static Representation) */}
          <div className="absolute w-64 h-64 rounded-full border border-primary/20 bg-primary/5 transform scale-125 animate-pulse shadow-[0_0_50px_rgba(6,182,212,0.1)]"></div>
          <div className="absolute w-52 h-52 rounded-full border border-primary/30 bg-primary/10 transform scale-110 animate-pulse delay-75 shadow-[0_0_30px_rgba(6,182,212,0.15)]"></div>
          
          {/* Central Image Container */}
          <div className="relative z-10 w-40 h-40 rounded-full bg-surface shadow-2xl flex items-center justify-center border-2 border-primary/50 overflow-hidden">
            {/* Eye Scanning Graphic Overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/30 to-transparent w-full h-full z-20 animate-[scan-vertical_2s_ease-in-out_infinite]"></div>
            <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-primary shadow-[0_0_15px_rgba(34,211,238,0.8)] z-30 w-full animate-[scan-line_2s_ease-in-out_infinite]"></div>
            
            {/* User's Eye Image */}
            <div 
              className="w-full h-full bg-cover bg-center opacity-80"
              style={{ backgroundImage: `url("${imageSrc || 'https://lh3.googleusercontent.com/aida-public/AB6AXuCJIAB4Lg62y0dGmLErDDZhvi5Z2MjwpGX5ZSgVTmJURWguoxOuqiMu1-cFGRIYh6XRlnmJPIC33iwLVpbUYiFs0tal7H9imJEN6I3o-qnq3PZGov5ihWczjehJkiv0xV0nfbG-neGiGShJ-GnxQS-Xn0fhYwrysQf9JU2ADO4y6DA3py868mgPiHhqfAlpzmSKJVYvRKovMwPXkYXV65xH3zkICQ8r3gw4Rvwt9eeUR7LjIWnuPjXcONYSb7tADSb4UF9d355TcZk'}")` }}
            ></div>
          </div>

          {/* Status Icons */}
          <div className="absolute -bottom-6 bg-surface/80 backdrop-blur-md px-5 py-2 rounded-full shadow-[0_0_20px_rgba(0,0,0,0.5)] border border-primary/30 flex items-center gap-2 z-20">
            <span className="material-symbols-outlined text-primary text-sm animate-spin">sync</span>
            <span className="text-xs font-bold text-primary tracking-wide uppercase">{t.aiProcessing}</span>
          </div>
        </div>

        {/* Text Content */}
        <div className="flex flex-col items-center gap-3 text-center w-full mt-6">
          <h1 className="text-2xl font-bold leading-tight tracking-tight text-text-main drop-shadow-sm">{t.analyzingEye}</h1>
          <p className="text-text-secondary text-sm font-normal leading-relaxed max-w-[280px]">
            {t.waitProcessing}
          </p>
        </div>
      </div>

      {/* Bottom Status Area */}
      <div className="w-full px-6 pb-10 max-w-md mx-auto relative z-10">
        {/* Progress Indicator */}
        <div className="flex flex-col gap-3">
          <div className="flex justify-between items-end mb-1">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-primary" style={{ fontSize: '20px' }}>smart_toy</span>
              <p className="text-text-main text-sm font-bold tracking-wide">{t.eyevlmEngine}</p>
            </div>
            <span className="text-primary font-bold text-sm">65%</span>
          </div>
          <div className="w-full h-2 bg-surface-highlight rounded-full overflow-hidden border border-slate-200 dark:border-white/5">
            <div className="bg-primary h-full rounded-full w-[65%] shadow-[0_0_15px_rgba(6,182,212,0.6)] animate-[progress_2s_ease-out_forwards]"></div>
          </div>
          <div className="flex justify-between items-start mt-1">
            <p className="text-text-secondary text-xs font-medium uppercase tracking-wider">{t.scanningRetinal}</p>
            <p className="text-text-secondary text-xs font-medium uppercase tracking-wider">{t.secRemaining}</p>
          </div>
        </div>

        {/* Info Card */}
        <div className="mt-8 bg-surface/50 backdrop-blur-md rounded-2xl p-5 border border-primary/20 flex items-start gap-4 shadow-lg">
          <div className="p-2 bg-primary/10 rounded-lg border border-primary/20 shrink-0">
            <span className="material-symbols-outlined text-primary text-[20px]">lightbulb</span>
          </div>
          <div className="flex flex-col gap-1">
            <p className="text-xs font-bold text-primary uppercase tracking-wider mb-1">{t.didYouKnow}</p>
            <p className="text-xs text-text-secondary leading-relaxed font-medium">
              {t.didYouKnowDesc}
            </p>
          </div>
        </div>
      </div>
      
      <style jsx>{`
        @keyframes scan-vertical {
          0%, 100% { transform: translateY(-100%); opacity: 0; }
          50% { transform: translateY(0); opacity: 1; }
        }
        @keyframes scan-line {
          0%, 100% { top: 0%; opacity: 0; }
          50% { top: 50%; opacity: 1; }
          100% { top: 100%; opacity: 0; }
        }
      `}</style>
    </div>
  );
}
