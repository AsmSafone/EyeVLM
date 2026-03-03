'use client';

import React from 'react';
import Link from 'next/link';
import { useLanguage } from '@/app/context/LanguageContext';
import BottomNav from '@/components/BottomNav';

export default function ProgressPage() {
    const { t } = useLanguage();

    return (
        <div className="bg-background font-sans text-text-main min-h-screen flex flex-col relative overflow-hidden transition-colors duration-300">
            {/* Decorative Background - Dark Mode Only */}
            <div className="absolute inset-0 z-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-cyan-900/20 via-slate-950 to-slate-950 pointer-events-none opacity-0 dark:opacity-100 transition-opacity duration-300"></div>

            {/* Header */}
            <div className="sticky top-0 z-20 bg-surface/80 backdrop-blur-xl px-4 pb-4 pt-6 border-b border-slate-200 dark:border-white/5 transition-colors duration-300">
                <div className="flex items-center justify-between mb-2">
                    <Link href="/dashboard" className="flex size-10 items-center justify-center rounded-full hover:bg-surface-highlight transition-colors text-text-main border border-transparent hover:border-slate-200 dark:hover:border-white/10">
                        <span className="material-symbols-outlined text-2xl">arrow_back</span>
                    </Link>
                    <h1 className="text-xl font-bold leading-tight flex-1 text-center pr-10 tracking-wide text-text-main">{t.eyeHealthTrends}</h1>
                </div>
            </div>

            {/* Main Content */}
            <main className="flex-1 flex flex-col p-6 overflow-y-auto relative z-10 pb-36">
                <div className="flex flex-col gap-6 w-full max-w-lg mx-auto">

                    {/* Stats Grid */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-surface/60 backdrop-blur-md rounded-2xl p-4 border border-slate-200 dark:border-white/5 shadow-sm flex flex-col gap-2">
                            <div className="w-8 h-8 rounded-full bg-cyan-500/10 flex items-center justify-center text-cyan-500">
                                <span className="material-symbols-outlined text-lg">medical_information</span>
                            </div>
                            <span className="text-2xl font-black text-text-main">12</span>
                            <span className="text-xs text-text-secondary font-bold uppercase tracking-wider">{t.totalScans}</span>
                        </div>
                        <div className="bg-surface/60 backdrop-blur-md rounded-2xl p-4 border border-slate-200 dark:border-white/5 shadow-sm flex flex-col gap-2 relative overflow-hidden">
                            {/* Decorative gradient for the "good" stat */}
                            <div className="absolute -right-4 -top-4 w-16 h-16 bg-emerald-500/20 blur-2xl rounded-full"></div>
                            <div className="w-8 h-8 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                                <span className="material-symbols-outlined text-lg">task_alt</span>
                            </div>
                            <span className="text-2xl font-black text-text-main">92%</span>
                            <span className="text-xs text-text-secondary font-bold uppercase tracking-wider">{t.healthyRate}</span>
                        </div>
                    </div>

                    {/* Fake Chart Area */}
                    <div className="bg-surface/80 backdrop-blur-xl rounded-[24px] p-5 border border-slate-200 dark:border-white/5 shadow-lg mt-2 flex flex-col gap-4">
                        <div className="flex justify-between items-center w-full">
                            <span className="text-sm font-bold text-text-main">{t.confidenceScoreTrend}</span>
                            <div className="px-3 py-1 bg-surface-highlight rounded-full text-xs font-bold text-text-secondary">{t.last6Months}</div>
                        </div>

                        <div className="h-40 w-full relative flex flex-col justify-end pt-4 font-sans max-w-full overflow-hidden">
                            {/* Y-axis labels */}
                            <div className="absolute left-0 top-4 bottom-6 flex flex-col justify-between text-[10px] text-text-secondary opacity-50 font-bold z-10 w-6">
                                <span>100</span>
                                <span>50</span>
                                <span>0</span>
                            </div>

                            {/* Chart Data Area */}
                            <div className="relative w-full h-[calc(100%-24px)] pl-8">
                                {/* Grid Lines */}
                                <div className="absolute left-8 right-0 top-0 h-px bg-slate-200 dark:bg-white/5"></div>
                                <div className="absolute left-8 right-0 top-1/2 h-px bg-slate-200 dark:bg-white/5 -translate-y-px"></div>
                                <div className="absolute left-8 right-0 bottom-0 h-px bg-slate-200 dark:bg-white/10"></div>

                                {/* SVG Line Chart Mock */}
                                <svg className="absolute inset-0 left-8 right-0 w-[calc(100%-32px)] h-full overflow-visible" viewBox="0 0 340 80" preserveAspectRatio="none">
                                    <defs>
                                        <linearGradient id="gradientLine" x1="0%" y1="0%" x2="100%" y2="0%">
                                            <stop offset="0%" stopColor="#06b6d4" />
                                            <stop offset="100%" stopColor="#6366f1" />
                                        </linearGradient>
                                    </defs>
                                    <path
                                        d="M0,80 C40,65 60,30 100,40 C140,50 180,20 220,10 C260,0 300,5 340,15"
                                        fill="none"
                                        stroke="url(#gradientLine)"
                                        strokeWidth="4"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        className="drop-shadow-[0_4px_12px_rgba(6,182,212,0.4)]"
                                        vectorEffect="non-scaling-stroke"
                                    />
                                </svg>
                            </div>

                            {/* X-axis labels */}
                            <div className="w-full h-6 flex justify-between items-end pl-8 text-[10px] text-text-secondary font-bold uppercase tracking-widest mt-2 overflow-hidden">
                                <span>{t.may}</span>
                                <span>{t.jul}</span>
                                <span>{t.sep}</span>
                                <span>{t.nov}</span>
                            </div>
                        </div>
                    </div>

                    {/* Timeline / Recent Milestones */}
                    <div className="flex flex-col gap-4 mt-4">
                        <span className="text-lg font-bold text-text-main tracking-tight">{t.recentMilestones}</span>

                        <div className="flex flex-col gap-4 relative">
                            {/* Vertical connecting line */}
                            <div className="absolute left-[19px] top-6 bottom-6 w-0.5 bg-slate-200 dark:bg-white/5"></div>

                            {/* Milestone Item 1 */}
                            <div className="flex gap-4 relative">
                                <div className="w-10 h-10 rounded-full bg-primary/20 flex flex-shrink-0 items-center justify-center border-2 border-background z-10 text-primary shadow-[0_0_10px_rgba(6,182,212,0.2)]">
                                    <span className="material-symbols-outlined text-xl">award_star</span>
                                </div>
                                <div className="flex flex-col gap-1 pt-1.5 pb-4">
                                    <span className="text-sm font-bold text-text-main">{t.threeMonthStreak}</span>
                                    <span className="text-xs text-text-secondary leading-relaxed">{t.streakDesc}</span>
                                </div>
                            </div>

                            {/* Milestone Item 2 */}
                            <div className="flex gap-4 relative">
                                <div className="w-10 h-10 rounded-full bg-surface-highlight flex flex-shrink-0 items-center justify-center border-2 border-background z-10 text-text-secondary">
                                    <span className="material-symbols-outlined text-xl">trending_up</span>
                                </div>
                                <div className="flex flex-col gap-1 pt-1.5">
                                    <span className="text-sm font-bold text-text-main">{t.accuracyImproved}</span>
                                    <span className="text-xs text-text-secondary leading-relaxed">{t.accuracyDesc}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </main>

            <BottomNav />
        </div>
    );
}
