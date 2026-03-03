'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/app/context/LanguageContext';

export default function Onboarding() {
  const { t } = useLanguage();
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    {
      title: t.onboardingTitle1,
      description: t.onboardingDesc1,
      image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
      icon: "medical_services"
    },
    {
      title: t.onboardingTitle2,
      description: t.onboardingDesc2,
      image: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
      icon: "center_focus_strong"
    },
    {
      title: t.onboardingTitle3,
      description: t.onboardingDesc3,
      image: "https://images.unsplash.com/photo-1551076805-e1869033e561?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
      icon: "analytics"
    }
  ];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      localStorage.setItem('onboardingCompleted', 'true');
      router.push('/login');
    }
  };

  const handleSkip = () => {
    localStorage.setItem('onboardingCompleted', 'true');
    router.push('/login');
  };

  return (
    <div className="bg-background font-sans antialiased text-text-main h-screen w-full flex justify-center relative overflow-hidden transition-colors duration-300">
      {/* Decorative Background - Dark Mode Only */}
      <div className="absolute inset-0 z-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/20 via-slate-950 to-slate-950 pointer-events-none opacity-0 dark:opacity-100 transition-opacity duration-300"></div>


      <div className="relative flex h-full max-w-md w-full flex-col bg-background overflow-hidden shadow-2xl sm:rounded-xl sm:h-[90vh] sm:my-auto z-10 transition-colors duration-300">
        {/* Top Navigation Bar */}
        <div className="flex items-center justify-between p-6 z-20">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-2xl drop-shadow-[0_0_10px_rgba(34,211,238,0.5)]">visibility</span>
            <h2 className="text-text-main text-lg font-bold leading-tight tracking-wide">EyeVLM</h2>
          </div>
          <button
            onClick={handleSkip}
            className="flex items-center justify-center rounded-full px-3 py-1.5 hover:bg-surface-highlight transition-colors border border-transparent hover:border-slate-200 dark:hover:border-white/10"
          >
            <p className="text-text-secondary text-sm font-medium leading-normal shrink-0 hover:text-text-main transition-colors">{t.skip}</p>
          </button>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col items-center justify-start overflow-y-auto px-6 pb-8 relative z-10">
          {/* Hero Image Container */}
          <div className="w-full aspect-[4/5] max-h-[45vh] relative rounded-3xl overflow-hidden mb-8 bg-surface shadow-2xl border border-slate-200 dark:border-white/5 group transition-colors duration-300">
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-slate-950/90 z-10"></div>
            <div
              className="absolute inset-0 bg-center bg-no-repeat bg-cover transition-transform duration-700 ease-out group-hover:scale-105 opacity-80"
              style={{ backgroundImage: `url("${steps[currentStep].image}")` }}
            ></div>

            {/* Floating icon badge */}
            <div className="absolute bottom-6 right-6 bg-surface/80 backdrop-blur-md p-4 rounded-2xl shadow-lg z-20 flex items-center justify-center transition-all duration-300 transform translate-y-0 opacity-100 border border-primary/30">
              <span className="material-symbols-outlined text-primary text-3xl drop-shadow-[0_0_10px_rgba(34,211,238,0.5)]">
                {steps[currentStep].icon}
              </span>
            </div>
          </div>

          {/* Text Content */}
          <div className="w-full text-center flex flex-col gap-4 animate-[fadeIn_0.5s_ease-out]" key={currentStep}>
            <h1 className="text-text-main tracking-tight text-3xl font-bold leading-tight drop-shadow-md">
              {steps[currentStep].title}
            </h1>
            <p className="text-text-secondary text-lg font-normal leading-relaxed px-2">
              {steps[currentStep].description}
            </p>
          </div>

          {/* Spacer */}
          <div className="flex-1 min-h-[2rem]"></div>

          {/* Progress Indicators */}
          <div className="flex w-full flex-row items-center justify-center gap-2 mb-8">
            {steps.map((_, index) => (
              <div
                key={index}
                className={`h-2 rounded-full transition-all duration-500 ${index === currentStep
                  ? 'w-8 bg-primary shadow-[0_0_10px_rgba(34,211,238,0.6)]'
                  : 'w-2 bg-surface-highlight'
                  }`}
              ></div>
            ))}
          </div>

          {/* Primary Action Button */}
          <button
            onClick={handleNext}
            className="w-full bg-primary hover:bg-primary-dark text-white text-lg font-bold h-14 rounded-2xl shadow-[0_0_20px_rgba(6,182,212,0.3)] transition-all active:scale-[0.98] flex items-center justify-center gap-2 group border border-primary/20 hover:shadow-[0_0_30px_rgba(6,182,212,0.5)]"
          >
            {currentStep === steps.length - 1 ? t.getStarted : t.continue}
            <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">arrow_forward</span>
          </button>
        </div>
      </div>
    </div>
  );
}
