'use client';

import Link from 'next/link';
import BottomNav from '@/components/BottomNav';
import { useLanguage } from '@/app/context/LanguageContext';

export default function PersonalInfo() {
    const { t } = useLanguage();

    return (
        <div className="bg-background font-sans min-h-screen flex justify-center text-text-main antialiased relative overflow-hidden transition-colors duration-300">
            <div className="absolute inset-0 z-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-slate-950 pointer-events-none opacity-0 dark:opacity-100 transition-opacity duration-300"></div>

            <div className="relative flex h-full w-full max-w-md flex-col bg-background overflow-x-hidden shadow-2xl min-h-screen pb-24 z-10 transition-colors duration-300">
                <div className="sticky top-0 z-20 bg-surface/80 backdrop-blur-xl px-4 pb-4 pt-6 border-b border-slate-200 dark:border-white/5 transition-colors duration-300">
                    <div className="flex items-center gap-4">
                        <Link href="/profile" className="flex size-10 items-center justify-center rounded-full hover:bg-surface-highlight transition-colors text-text-main border border-transparent hover:border-slate-200 dark:hover:border-white/10">
                            <span className="material-symbols-outlined text-2xl">arrow_back</span>
                        </Link>
                        <h1 className="text-xl font-bold leading-tight flex-1 text-text-main">{t.personalInfo}</h1>
                    </div>
                </div>

                <div className="flex-1 px-6 py-8 space-y-6">
                    <div className="flex justify-center mb-8">
                        <div className="size-24 rounded-full bg-blue-500/10 text-blue-500 flex items-center justify-center border border-blue-500/20 shadow-lg">
                            <span className="material-symbols-outlined text-[48px]">person</span>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-widest text-text-secondary mb-2 ml-1">Full Name</label>
                            <input type="text" defaultValue="John Doe" className="w-full rounded-2xl border border-slate-200 dark:border-white/10 bg-surface/50 px-4 py-4 text-text-main placeholder:text-text-secondary/50 focus:ring-1 focus:ring-primary focus:border-primary/50 transition-all font-medium" />
                        </div>
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-widest text-text-secondary mb-2 ml-1">Email Address</label>
                            <input type="email" defaultValue="john.doe@example.com" className="w-full rounded-2xl border border-slate-200 dark:border-white/10 bg-surface/50 px-4 py-4 text-text-main placeholder:text-text-secondary/50 focus:ring-1 focus:ring-primary focus:border-primary/50 transition-all font-medium" />
                        </div>
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-widest text-text-secondary mb-2 ml-1">Phone Number</label>
                            <input type="tel" placeholder="+1 (555) 000-0000" className="w-full rounded-2xl border border-slate-200 dark:border-white/10 bg-surface/50 px-4 py-4 text-text-main placeholder:text-text-secondary/50 focus:ring-1 focus:ring-primary focus:border-primary/50 transition-all font-medium" />
                        </div>
                    </div>

                    <button className="w-full mt-8 bg-primary hover:bg-primary-dark text-white font-bold py-4 rounded-2xl shadow-[0_0_20px_rgba(6,182,212,0.3)] transition-all active:scale-[0.98]">
                        Save Changes
                    </button>
                </div>

                <BottomNav />
            </div>
        </div>
    );
}
