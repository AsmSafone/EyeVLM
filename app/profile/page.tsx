'use client';

import Link from 'next/link';
import Image from 'next/image';
import BottomNav from '@/components/BottomNav';
import { useLanguage } from '@/app/context/LanguageContext';
import { useTheme } from '@/app/context/ThemeContext';
import { useRouter } from 'next/navigation';

export default function Profile() {
  const { t } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  const router = useRouter();

  return (
    <div className="bg-background font-sans min-h-screen flex justify-center text-text-main antialiased relative overflow-hidden transition-colors duration-300">
      {/* Decorative Background - Dark Mode Only */}
      <div className="absolute inset-0 z-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-slate-950 pointer-events-none opacity-0 dark:opacity-100 transition-opacity duration-300"></div>

      <div className="relative flex h-full w-full max-w-md flex-col bg-background overflow-x-hidden shadow-2xl min-h-screen pb-24 z-10 transition-colors duration-300">
        {/* Header */}
        <div className="bg-surface/80 backdrop-blur-xl px-6 pb-8 pt-8 shadow-lg rounded-b-[3rem] border-b border-white/5 dark:border-white/5 border-slate-200 relative overflow-hidden transition-colors duration-300">
          {/* Header Background Effect */}
          <div className="absolute inset-0 bg-gradient-to-b from-cyan-900/10 to-transparent pointer-events-none opacity-0 dark:opacity-100 transition-opacity duration-300"></div>

          <div className="relative z-10 flex justify-between items-start mb-6">
            <h1 className="text-2xl font-bold text-text-main tracking-wide">{t.profile}</h1>
            <button className="p-2 rounded-full hover:bg-surface-highlight transition-colors text-text-secondary hover:text-text-main">
              <span className="material-symbols-outlined">settings</span>
            </button>
          </div>

          <div className="relative z-10 flex flex-col items-center">
            <div className="relative mb-5 group cursor-pointer">
              <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full blur opacity-40 group-hover:opacity-75 transition duration-500 hidden dark:block"></div>
              <div className="size-28 rounded-full overflow-hidden border-2 border-surface shadow-2xl relative z-10">
                <Image
                  src="avatar.webp"
                  alt="Profile"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
            <h2 className="text-xl font-bold text-text-main tracking-tight">Admin</h2>
            <p className="text-primary/80 text-sm font-medium tracking-wide">admin@eyevlm.com</p>
            <Link href="/profile/personal-info" className="mt-5 px-6 py-2 bg-surface border border-white/10 dark:border-white/10 border-slate-200 text-text-secondary rounded-full text-sm font-semibold hover:bg-surface-highlight hover:text-text-main hover:border-primary/20 transition-all shadow-sm">
              {t.editProfile}
            </Link>
          </div>
        </div>

        {/* Settings List */}
        <div className="flex-1 px-4 py-8 space-y-8">
          {/* Account Settings */}
          <section>
            <h3 className="px-2 text-xs font-bold uppercase tracking-widest text-text-secondary mb-3 ml-1">{t.settings}</h3>
            <div className="bg-surface/40 backdrop-blur-md rounded-3xl border border-white/5 dark:border-white/5 border-slate-200 overflow-hidden shadow-sm transition-colors duration-300">
              <Link href="/profile/language" className="flex items-center gap-4 p-4 hover:bg-surface-highlight transition-colors border-b border-white/5 dark:border-white/5 border-slate-100 group">
                <div className="size-10 rounded-xl bg-purple-500/10 text-purple-500 flex items-center justify-center border border-purple-500/20 group-hover:scale-110 transition-transform">
                  <span className="material-symbols-outlined">language</span>
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-text-main group-hover:text-primary transition-colors">{t.language}</p>
                </div>
                <span className="material-symbols-outlined text-text-secondary group-hover:text-purple-500 transition-colors">chevron_right</span>
              </Link>

              {/* Theme Toggle */}
              <button
                onClick={toggleTheme}
                className="w-full flex items-center gap-4 p-4 hover:bg-surface-highlight transition-colors border-b border-white/5 dark:border-white/5 border-slate-100 group"
              >
                <div className="size-10 rounded-xl bg-yellow-500/10 text-yellow-500 flex items-center justify-center border border-yellow-500/20 group-hover:scale-110 transition-transform">
                  <span className="material-symbols-outlined">
                    {theme === 'dark' ? 'dark_mode' : 'light_mode'}
                  </span>
                </div>
                <div className="flex-1 text-left">
                  <p className="font-semibold text-text-main group-hover:text-primary transition-colors">{t.appearance}</p>
                </div>
                <div className="flex items-center gap-2">
                  <div className={`w-10 h-6 rounded-full p-1 transition-colors duration-300 ${theme === 'dark' ? 'bg-primary' : 'bg-slate-300'}`}>
                    <div className={`w-4 h-4 bg-white rounded-full shadow-md transform transition-transform duration-300 ${theme === 'dark' ? 'translate-x-4' : 'translate-x-0'}`}></div>
                  </div>
                </div>
              </button>

              <Link href="/profile/notifications" className="flex items-center gap-4 p-4 hover:bg-surface-highlight transition-colors border-b border-white/5 dark:border-white/5 border-slate-100 group">
                <div className="size-10 rounded-xl bg-orange-500/10 text-orange-500 flex items-center justify-center border border-orange-500/20 group-hover:scale-110 transition-transform">
                  <span className="material-symbols-outlined">notifications</span>
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-text-main group-hover:text-primary transition-colors">{t.notifications}</p>
                </div>
                <span className="material-symbols-outlined text-text-secondary group-hover:text-orange-500 transition-colors">chevron_right</span>
              </Link>
              <Link href="/profile/security" className="flex items-center gap-4 p-4 hover:bg-surface-highlight transition-colors group">
                <div className="size-10 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center border border-emerald-500/20 group-hover:scale-110 transition-transform">
                  <span className="material-symbols-outlined">security</span>
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-text-main group-hover:text-primary transition-colors">{t.security}</p>
                </div>
                <span className="material-symbols-outlined text-text-secondary group-hover:text-emerald-500 transition-colors">chevron_right</span>
              </Link>
            </div>
          </section>

          {/* Support */}
          <section>
            <h3 className="px-2 text-xs font-bold uppercase tracking-widest text-text-secondary mb-3 ml-1">{t.helpSupport}</h3>
            <div className="bg-surface/40 backdrop-blur-md rounded-3xl border border-white/5 dark:border-white/5 border-slate-200 overflow-hidden shadow-sm transition-colors duration-300">
              <Link href="/profile/help" className="flex items-center gap-4 p-4 hover:bg-surface-highlight transition-colors border-b border-white/5 dark:border-white/5 border-slate-100 group">
                <div className="size-10 rounded-xl bg-surface-highlight text-text-secondary flex items-center justify-center border border-white/5 dark:border-white/5 border-slate-200 group-hover:scale-110 transition-transform">
                  <span className="material-symbols-outlined">help</span>
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-text-main group-hover:text-primary transition-colors">{t.helpSupport}</p>
                </div>
                <span className="material-symbols-outlined text-text-secondary group-hover:text-primary transition-colors">chevron_right</span>
              </Link>
              <Link href="/profile/about" className="flex items-center gap-4 p-4 hover:bg-surface-highlight transition-colors group">
                <div className="size-10 rounded-xl bg-surface-highlight text-text-secondary flex items-center justify-center border border-white/5 dark:border-white/5 border-slate-200 group-hover:scale-110 transition-transform">
                  <span className="material-symbols-outlined">info</span>
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-text-main group-hover:text-primary transition-colors">{t.aboutApp}</p>
                </div>
                <span className="material-symbols-outlined text-text-secondary group-hover:text-primary transition-colors">chevron_right</span>
              </Link>
            </div>
          </section>

          <button
            onClick={() => {
              localStorage.removeItem('isLoggedIn');
              router.push('/login');
            }}
            className="w-full p-4 rounded-2xl bg-red-500/10 text-red-500 font-bold hover:bg-red-500/20 border border-red-500/20 transition-all flex items-center justify-center gap-2 hover:shadow-[0_0_15px_rgba(239,68,68,0.2)] active:scale-[0.98]"
          >
            <span className="material-symbols-outlined">logout</span>
            {t.logOut}
          </button>
        </div>

        <BottomNav />
      </div>
    </div>
  );
}
