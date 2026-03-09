'use client';

import Link from 'next/link';
import BottomNav from '@/components/BottomNav';
import { useLanguage } from '@/app/context/LanguageContext';

export default function HelpSupport() {
    const { t } = useLanguage();

    return (
        <div className="bg-background font-sans min-h-screen flex justify-center text-text-main antialiased relative overflow-clip transition-colors duration-300">
            <div className="absolute inset-0 z-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-slate-950 pointer-events-none opacity-0 dark:opacity-100 transition-opacity duration-300"></div>

            <div className="relative flex h-full w-full max-w-md flex-col bg-background shadow-2xl min-h-screen pb-24 z-10 transition-colors duration-300">
                <div className="sticky top-0 z-20 bg-surface/80 backdrop-blur-xl px-4 pb-4 pt-6 border-b border-slate-200 dark:border-white/5 transition-colors duration-300">
                    <div className="flex items-center gap-4">
                        <Link href="/profile" className="flex size-10 items-center justify-center rounded-full hover:bg-surface-highlight transition-colors text-text-main border border-transparent hover:border-slate-200 dark:hover:border-white/10">
                            <span className="material-symbols-outlined text-2xl">arrow_back</span>
                        </Link>
                        <h1 className="text-xl font-bold leading-tight flex-1 text-text-main">{t.helpSupport}</h1>
                    </div>
                </div>

                <div className="flex-1 px-4 py-8 space-y-6">
                    <div className="bg-surface/40 backdrop-blur-md rounded-3xl border border-white/5 dark:border-white/5 border-slate-200 overflow-hidden shadow-sm p-6 text-center">
                        <div className="size-20 rounded-full bg-cyan-500/10 text-cyan-500 flex items-center justify-center border border-cyan-500/20 mx-auto mb-4">
                            <span className="material-symbols-outlined text-[40px]">support_agent</span>
                        </div>
                        <h2 className="text-xl font-bold mb-2">How can we help you?</h2>
                        <p className="text-sm text-text-secondary font-light">Our support team is available 24/7 to assist you with any questions or issues.</p>
                    </div>

                    <div className="bg-surface/40 backdrop-blur-md rounded-3xl border border-white/5 dark:border-white/5 border-slate-200 overflow-hidden shadow-sm">

                        <Link href="#" className="flex items-center justify-between p-5 border-b border-white/5 dark:border-white/5 border-slate-100 hover:bg-surface-highlight transition-colors group">
                            <div className="flex items-center gap-4">
                                <div className="size-10 rounded-xl bg-orange-500/10 text-orange-500 flex items-center justify-center border border-orange-500/20 group-hover:scale-110 transition-transform">
                                    <span className="material-symbols-outlined">quiz</span>
                                </div>
                                <div>
                                    <p className="font-bold text-text-main group-hover:text-primary transition-colors">FAQ</p>
                                    <p className="text-xs text-text-secondary font-light">Frequently asked questions</p>
                                </div>
                            </div>
                            <span className="material-symbols-outlined text-text-secondary group-hover:text-primary transition-colors">chevron_right</span>
                        </Link>

                        <Link href="#" className="flex items-center justify-between p-5 hover:bg-surface-highlight transition-colors group">
                            <div className="flex items-center gap-4">
                                <div className="size-10 rounded-xl bg-blue-500/10 text-blue-500 flex items-center justify-center border border-blue-500/20 group-hover:scale-110 transition-transform">
                                    <span className="material-symbols-outlined">chat</span>
                                </div>
                                <div>
                                    <p className="font-bold text-text-main group-hover:text-primary transition-colors">Contact Support</p>
                                    <p className="text-xs text-text-secondary font-light">Send us a message</p>
                                </div>
                            </div>
                            <span className="material-symbols-outlined text-text-secondary group-hover:text-primary transition-colors">chevron_right</span>
                        </Link>

                    </div>
                </div>

                <BottomNav />
            </div>
        </div>
    );
}
