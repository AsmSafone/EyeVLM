'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useLanguage } from '@/app/context/LanguageContext';
import packageJson from '@/package.json';

export default function AboutApp() {
    const { t } = useLanguage();

    return (
        <div className="bg-background font-sans min-h-screen flex justify-center text-text-main antialiased relative overflow-clip transition-colors duration-300">
            <div className="absolute inset-0 z-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-slate-950 pointer-events-none opacity-0 dark:opacity-100 transition-opacity duration-300"></div>

            <div className="relative flex h-full w-full max-w-md flex-col bg-background shadow-2xl h-screen overflow-hidden pb-24 z-10 transition-colors duration-300">
                <div className="sticky top-0 z-20 bg-surface/80 backdrop-blur-xl px-4 pb-4 pt-6 border-b border-slate-200 dark:border-white/5 transition-colors duration-300">
                    <div className="flex items-center gap-4">
                        <Link href="/profile" className="flex size-10 items-center justify-center rounded-full hover:bg-surface-highlight transition-colors text-text-main border border-transparent hover:border-slate-200 dark:hover:border-white/10">
                            <span className="material-symbols-outlined text-2xl">arrow_back</span>
                        </Link>
                        <h1 className="text-xl font-bold leading-tight flex-1 text-text-main">{t.aboutApp}</h1>
                    </div>
                </div>

                <div className="flex-1 px-4 py-8 space-y-6 flex flex-col items-center">
                    <div className="size-32 rounded-3xl bg-surface-highlight shadow-xl flex items-center justify-center mb-4 mt-8 overflow-hidden border border-white/10">
                        <Image src="/icons/icon.png" alt="EyeVLM Logo" width={128} height={128} className="object-cover" />
                    </div>
                    <h2 className="text-3xl font-bold tracking-tight mb-1">EyeVLM</h2>
                    <p className="text-text-secondary font-medium tracking-wide mb-8">Version {packageJson.version}</p>

                    <div className="w-full bg-surface/40 backdrop-blur-md rounded-3xl border border-white/5 dark:border-white/5 border-slate-200 overflow-hidden shadow-sm">

                        <Link href="#" className="flex items-center justify-between p-5 border-b border-white/5 dark:border-white/5 border-slate-100 hover:bg-surface-highlight transition-colors group">
                            <div className="flex items-center gap-4">
                                <div className="size-10 rounded-xl bg-surface-highlight text-text-secondary flex items-center justify-center border border-white/5 dark:border-white/5 border-slate-200 group-hover:scale-110 transition-transform">
                                    <span className="material-symbols-outlined">description</span>
                                </div>
                                <p className="font-bold text-text-main group-hover:text-primary transition-colors">Terms of Service</p>
                            </div>
                            <span className="material-symbols-outlined text-text-secondary group-hover:text-primary transition-colors">chevron_right</span>
                        </Link>

                        <Link href="#" className="flex items-center justify-between p-5 hover:bg-surface-highlight transition-colors group">
                            <div className="flex items-center gap-4">
                                <div className="size-10 rounded-xl bg-surface-highlight text-text-secondary flex items-center justify-center border border-white/5 dark:border-white/5 border-slate-200 group-hover:scale-110 transition-transform">
                                    <span className="material-symbols-outlined">policy</span>
                                </div>
                                <p className="font-bold text-text-main group-hover:text-primary transition-colors">Privacy Policy</p>
                            </div>
                            <span className="material-symbols-outlined text-text-secondary group-hover:text-primary transition-colors">chevron_right</span>
                        </Link>

                    </div>

                    <p className="text-xs text-text-secondary/50 mt-12 text-center">
                        &copy; 2026 EyeVLM. All rights reserved.<br />
                        Developed by Safone.<br />
                        Powered by AI.
                    </p>
                </div>

            </div>
        </div>
    );
}
