'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { questions } from '@/app/lib/questions';
import { motion, AnimatePresence } from 'motion/react';
import { useLanguage } from '@/app/context/LanguageContext';

export default function SymptomCheck() {
  const router = useRouter();
  const { language, t } = useLanguage();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [direction, setDirection] = useState(0);

  const currentQuestions = questions[language];
  const currentQuestion = currentQuestions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / currentQuestions.length) * 100;

  const handleAnswer = (answer: string) => {
    const updatedAnswers = { ...answers, [currentQuestion.id]: answer };
    setAnswers(updatedAnswers);

    if (currentQuestionIndex < currentQuestions.length - 1) {
      setDirection(1);
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      // Finished
      sessionStorage.setItem('symptomAnswers', JSON.stringify(updatedAnswers));
      router.push('/scan/analysis');
    }
  };

  const handleBack = () => {
    if (currentQuestionIndex > 0) {
      setDirection(-1);
      setCurrentQuestionIndex(prev => prev - 1);
    } else {
      router.push('/scan/patient-info');
    }
  };

  const handleSkip = () => {
    sessionStorage.setItem('symptomAnswers', JSON.stringify(answers));
    router.push('/scan/analysis');
  };

  return (
    <div className="bg-background min-h-screen font-sans flex flex-col items-center justify-center relative overflow-hidden transition-colors duration-300">
      {/* Decorative Background - Dark Mode Only */}
      <div className="absolute inset-0 z-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-slate-950 pointer-events-none opacity-0 dark:opacity-100 transition-opacity duration-300"></div>
      <div className="absolute top-0 left-0 w-full h-full bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-5 pointer-events-none"></div>

      {/* Mobile Container */}
      <div className="relative flex h-full min-h-screen w-full max-w-md flex-col overflow-hidden bg-background shadow-2xl z-10 transition-colors duration-300">
        {/* Top App Bar */}
        <div className="flex items-center justify-between p-4 pt-6 pb-2 relative z-20">
          <Link href="/scan/patient-info" className="flex size-10 shrink-0 items-center justify-center rounded-full text-text-secondary hover:text-text-main hover:bg-surface-highlight transition-colors">
            <span className="material-symbols-outlined text-[24px]">close</span>
          </Link>
          <h2 className="flex-1 text-center text-lg font-bold leading-tight tracking-wide text-text-main pr-10 drop-shadow-md">{t.symptomCheck}</h2>
        </div>

        {/* Progress Section */}
        <div className="flex flex-col gap-3 px-6 py-4 relative z-20">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium leading-normal text-text-secondary uppercase tracking-wider">
              {t.question} <span className="text-text-main">{currentQuestionIndex + 1}</span> {t.of} {currentQuestions.length}
            </p>
            <span className="text-xs font-bold text-primary">{Math.round(progress)}%</span>
          </div>
          <div className="h-1.5 w-full rounded-full bg-surface-highlight border border-slate-200 dark:border-white/5">
            <div
              className="h-full rounded-full bg-primary transition-all duration-300 ease-out shadow-[0_0_10px_rgba(6,182,212,0.6)]"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex flex-1 flex-col items-center justify-center px-6 text-center overflow-hidden relative z-10">
          <AnimatePresence mode="wait" initial={false} custom={direction}>
            <motion.div
              key={currentQuestion.id}
              custom={direction}
              initial={{ opacity: 0, x: direction > 0 ? 50 : -50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: direction > 0 ? -50 : 50 }}
              transition={{ duration: 0.3, ease: "circOut" }}
              className="w-full flex flex-col items-center"
            >
              {/* Illustration / Icon */}
              <div className="mb-8 flex size-28 items-center justify-center rounded-full bg-surface/50 border border-primary/20 text-primary shadow-[0_0_30px_rgba(6,182,212,0.15)] relative">
                <div className="absolute inset-0 rounded-full bg-primary/5 animate-pulse"></div>
                <span className="material-symbols-outlined text-[56px] drop-shadow-[0_0_10px_rgba(6,182,212,0.5)]">
                  {currentQuestionIndex < 5 ? 'blur_on' :
                    currentQuestionIndex < 9 ? 'healing' :
                      currentQuestionIndex < 13 ? 'visibility' : 'history'}
                </span>
              </div>

              {/* Question */}
              <h1 className="mb-4 text-2xl font-bold leading-tight tracking-tight text-text-main min-h-[4rem] flex items-center justify-center drop-shadow-sm">
                {currentQuestion.text}?
              </h1>

              {/* Description */}
              <p className="mb-10 text-lg font-normal leading-relaxed text-text-secondary max-w-xs mx-auto">
                {t.selectOption}
              </p>

              {/* Action Buttons */}
              <div className="flex w-full flex-col gap-4">
                <button
                  onClick={() => handleAnswer('Yes')}
                  className="group flex h-16 w-full cursor-pointer items-center justify-center gap-3 rounded-2xl bg-primary text-white shadow-[0_0_20px_rgba(6,182,212,0.25)] transition-all active:scale-[0.98] hover:bg-primary-dark hover:shadow-[0_0_30px_rgba(6,182,212,0.4)] border border-primary/20"
                >
                  <span className="material-symbols-outlined text-[24px]">check</span>
                  <span className="text-xl font-bold tracking-wide">{t.yes}</span>
                </button>
                <button
                  onClick={() => handleAnswer('No')}
                  className="group flex h-16 w-full cursor-pointer items-center justify-center gap-3 rounded-2xl bg-surface/50 border border-slate-200 dark:border-white/10 text-text-secondary hover:bg-surface-highlight hover:text-text-main hover:border-slate-300 dark:hover:border-white/20 transition-all active:scale-[0.98] backdrop-blur-sm"
                >
                  <span className="material-symbols-outlined text-[24px]">close</span>
                  <span className="text-xl font-bold tracking-wide">{t.no}</span>
                </button>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Bottom Navigation */}
        <div className="mt-auto flex w-full items-center justify-between border-t border-slate-200 dark:border-white/5 bg-surface/50 backdrop-blur-xl p-6 z-20 transition-colors duration-300">
          <button
            onClick={handleBack}
            className="flex items-center gap-2 rounded-xl py-2 pl-2 pr-4 text-base font-medium text-text-secondary hover:text-text-main transition-colors"
          >
            <span className="material-symbols-outlined text-[20px]">arrow_back</span>
            {t.back}
          </button>
          <button
            onClick={handleSkip}
            className="flex items-center gap-2 rounded-xl bg-surface-highlight border border-slate-200 dark:border-white/5 px-6 py-2.5 text-base font-bold text-text-secondary hover:bg-surface hover:text-text-main hover:border-slate-300 dark:hover:border-white/10 transition-colors"
          >
            {t.skip}
            <span className="material-symbols-outlined text-[20px]">skip_next</span>
          </button>
        </div>
      </div>
    </div>
  );
}
