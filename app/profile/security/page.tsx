'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import BottomNav from '@/components/BottomNav';
import { useLanguage } from '@/app/context/LanguageContext';
import { Capacitor } from '@capacitor/core';
import { App } from '@capacitor/app';
import { Toast } from '@capacitor/toast';

export default function SecuritySettings() {
    const { t } = useLanguage();
    const router = useRouter();
    const [biometricEnabled, setBiometricEnabled] = useState(true);

    const handleDeleteAccount = async () => {
        localStorage.clear();
        // clear router history
        window.history.replaceState(null, '', '/');

        if (Capacitor.isNativePlatform()) {
            await Toast.show({
                text: 'Account deleted successfully. Exiting app...',
                duration: 'long'
            });
            App.exitApp();
        } else {
            router.refresh();
        }
    };

    return (
        <div className="bg-background font-sans min-h-screen flex justify-center text-text-main antialiased relative overflow-clip transition-colors duration-300">
            <div className="absolute inset-0 z-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-slate-950 pointer-events-none opacity-0 dark:opacity-100 transition-opacity duration-300"></div>

            <div className="relative flex h-full w-full max-w-md flex-col bg-background shadow-2xl min-h-screen pb-24 z-10 transition-colors duration-300">
                <div className="sticky top-0 z-20 bg-surface/80 backdrop-blur-xl px-4 pb-4 pt-6 border-b border-slate-200 dark:border-white/5 transition-colors duration-300">
                    <div className="flex items-center gap-4">
                        <Link href="/profile" className="flex size-10 items-center justify-center rounded-full hover:bg-surface-highlight transition-colors text-text-main border border-transparent hover:border-slate-200 dark:hover:border-white/10">
                            <span className="material-symbols-outlined text-2xl">arrow_back</span>
                        </Link>
                        <h1 className="text-xl font-bold leading-tight flex-1 text-text-main">{t.security}</h1>
                    </div>
                </div>

                <div className="flex-1 px-4 py-8 space-y-6">
                    <div className="bg-surface/40 backdrop-blur-md rounded-3xl border border-white/5 dark:border-white/5 border-slate-200 overflow-hidden shadow-sm">

                        <Link href="#" className="flex items-center justify-between p-5 border-b border-white/5 dark:border-white/5 border-slate-100 hover:bg-surface-highlight transition-colors group">
                            <div className="flex items-center gap-4">
                                <div className="size-10 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center border border-emerald-500/20 group-hover:scale-110 transition-transform">
                                    <span className="material-symbols-outlined">password</span>
                                </div>
                                <div>
                                    <p className="font-bold text-text-main group-hover:text-primary transition-colors">Change Password</p>
                                    <p className="text-xs text-text-secondary font-light">Last changed 3 months ago</p>
                                </div>
                            </div>
                            <span className="material-symbols-outlined text-text-secondary group-hover:text-emerald-500 transition-colors">chevron_right</span>
                        </Link>

                        <div className="flex items-center justify-between p-5 border-b border-white/5 dark:border-white/5 border-slate-100">
                            <div className="flex items-center gap-4">
                                <div className="size-10 rounded-xl bg-blue-500/10 text-blue-500 flex items-center justify-center border border-blue-500/20">
                                    <span className="material-symbols-outlined">fingerprint</span>
                                </div>
                                <div>
                                    <p className="font-bold text-text-main">Biometric Authentication</p>
                                    <p className="text-xs text-text-secondary font-light">Use FaceID or Fingerprint</p>
                                </div>
                            </div>
                            <button onClick={() => setBiometricEnabled(!biometricEnabled)} className={`w-12 h-6 rounded-full p-1 transition-colors duration-300 ${biometricEnabled ? 'bg-primary' : 'bg-slate-300 dark:bg-slate-700'}`}>
                                <div className={`w-4 h-4 bg-white rounded-full shadow-md transform transition-transform duration-300 ${biometricEnabled ? 'translate-x-6' : 'translate-x-0'}`}></div>
                            </button>
                        </div>

                        <button onClick={handleDeleteAccount} className="w-full flex items-center justify-between p-5 hover:bg-surface-highlight transition-colors group cursor-pointer">
                            <div className="flex items-center gap-4 text-left">
                                <div className="size-10 rounded-xl bg-red-500/10 text-red-500 flex items-center justify-center border border-red-500/20 group-hover:scale-110 transition-transform">
                                    <span className="material-symbols-outlined">delete_forever</span>
                                </div>
                                <div>
                                    <p className="font-bold text-text-main group-hover:text-primary transition-colors">Delete Account</p>
                                    <p className="text-xs text-text-secondary font-light">Permanently remove your data</p>
                                </div>
                            </div>
                            <span className="material-symbols-outlined text-text-secondary group-hover:text-red-500 transition-colors">chevron_right</span>
                        </button>

                    </div>
                </div>

                <BottomNav />
            </div>
        </div>
    );
}
