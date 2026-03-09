'use client';

import Link from 'next/link';
import BottomNav from '@/components/BottomNav';
import { useLanguage } from '@/app/context/LanguageContext';
import { useState } from 'react';

export default function NotificationsSettings() {
    const { t } = useLanguage();
    const [appNotifs, setAppNotifs] = useState(true);
    const [emailNotifs, setEmailNotifs] = useState(false);
    const [scanReminders, setScanReminders] = useState(true);

    const toggle = (setter: React.Dispatch<React.SetStateAction<boolean>>) => {
        setter(prev => !prev);
    }

    return (
        <div className="bg-background font-sans min-h-screen flex justify-center text-text-main antialiased relative overflow-clip transition-colors duration-300">
            <div className="absolute inset-0 z-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-slate-950 pointer-events-none opacity-0 dark:opacity-100 transition-opacity duration-300"></div>

            <div className="relative flex h-full w-full max-w-md flex-col bg-background shadow-2xl min-h-screen pb-24 z-10 transition-colors duration-300">
                <div className="sticky top-0 z-20 bg-surface/80 backdrop-blur-xl px-4 pb-4 pt-6 border-b border-slate-200 dark:border-white/5 transition-colors duration-300">
                    <div className="flex items-center gap-4">
                        <Link href="/profile" className="flex size-10 items-center justify-center rounded-full hover:bg-surface-highlight transition-colors text-text-main border border-transparent hover:border-slate-200 dark:hover:border-white/10">
                            <span className="material-symbols-outlined text-2xl">arrow_back</span>
                        </Link>
                        <h1 className="text-xl font-bold leading-tight flex-1 text-text-main">{t.notifications}</h1>
                    </div>
                </div>

                <div className="flex-1 px-4 py-8 space-y-6">
                    <div className="bg-surface/40 backdrop-blur-md rounded-3xl border border-white/5 dark:border-white/5 border-slate-200 overflow-hidden shadow-sm">

                        <div className="flex items-center justify-between p-5 border-b border-white/5 dark:border-white/5 border-slate-100">
                            <div className="flex items-center gap-4">
                                <div className="size-10 rounded-xl bg-orange-500/10 text-orange-500 flex items-center justify-center border border-orange-500/20">
                                    <span className="material-symbols-outlined">notifications_active</span>
                                </div>
                                <div>
                                    <p className="font-bold text-text-main">In-App Notifications</p>
                                    <p className="text-xs text-text-secondary font-light">Receive alerts inside the app</p>
                                </div>
                            </div>
                            <button onClick={() => toggle(setAppNotifs)} className={`w-12 h-6 rounded-full p-1 transition-colors duration-300 ${appNotifs ? 'bg-primary' : 'bg-slate-300 dark:bg-slate-700'}`}>
                                <div className={`w-4 h-4 bg-white rounded-full shadow-md transform transition-transform duration-300 ${appNotifs ? 'translate-x-6' : 'translate-x-0'}`}></div>
                            </button>
                        </div>

                        <div className="flex items-center justify-between p-5 border-b border-white/5 dark:border-white/5 border-slate-100">
                            <div className="flex items-center gap-4">
                                <div className="size-10 rounded-xl bg-blue-500/10 text-blue-500 flex items-center justify-center border border-blue-500/20">
                                    <span className="material-symbols-outlined">mail</span>
                                </div>
                                <div>
                                    <p className="font-bold text-text-main">Email Notifications</p>
                                    <p className="text-xs text-text-secondary font-light">Weekly health summaries</p>
                                </div>
                            </div>
                            <button onClick={() => toggle(setEmailNotifs)} className={`w-12 h-6 rounded-full p-1 transition-colors duration-300 ${emailNotifs ? 'bg-primary' : 'bg-slate-300 dark:bg-slate-700'}`}>
                                <div className={`w-4 h-4 bg-white rounded-full shadow-md transform transition-transform duration-300 ${emailNotifs ? 'translate-x-6' : 'translate-x-0'}`}></div>
                            </button>
                        </div>

                        <div className="flex items-center justify-between p-5">
                            <div className="flex items-center gap-4">
                                <div className="size-10 rounded-xl bg-cyan-500/10 text-cyan-500 flex items-center justify-center border border-cyan-500/20">
                                    <span className="material-symbols-outlined">alarm</span>
                                </div>
                                <div>
                                    <p className="font-bold text-text-main">Scan Reminders</p>
                                    <p className="text-xs text-text-secondary font-light">Daily reminders to scan</p>
                                </div>
                            </div>
                            <button onClick={() => toggle(setScanReminders)} className={`w-12 h-6 rounded-full p-1 transition-colors duration-300 ${scanReminders ? 'bg-primary' : 'bg-slate-300 dark:bg-slate-700'}`}>
                                <div className={`w-4 h-4 bg-white rounded-full shadow-md transform transition-transform duration-300 ${scanReminders ? 'translate-x-6' : 'translate-x-0'}`}></div>
                            </button>
                        </div>

                    </div>
                </div>

                <BottomNav />
            </div>
        </div>
    );
}
