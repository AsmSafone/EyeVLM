'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/app/context/LanguageContext';

export default function Login() {
  const router = useRouter();
  const { t } = useLanguage();

  const handleLogin = () => {
    localStorage.setItem('isLoggedIn', 'true');
    router.push('/dashboard');
  };

  return (
    <div className="bg-background font-sans min-h-screen flex items-center justify-center p-4 relative overflow-hidden transition-colors duration-300">
      {/* Decorative Background - Dark Mode Only */}
      <div className="absolute inset-0 z-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/40 via-slate-950 to-slate-950 pointer-events-none opacity-0 dark:opacity-100 transition-opacity duration-300"></div>
      <div className="absolute top-[-20%] right-[-10%] w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-[100px] animate-pulse opacity-0 dark:opacity-100 transition-opacity duration-300"></div>
      <div className="absolute bottom-[-20%] left-[-10%] w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[100px] animate-pulse opacity-0 dark:opacity-100 transition-opacity duration-300" style={{ animationDelay: '2s' }}></div>

      <div className="w-full max-w-md bg-surface/60 backdrop-blur-xl border border-slate-200 dark:border-white/10 rounded-2xl shadow-2xl shadow-slate-200/50 dark:shadow-black/50 overflow-hidden flex flex-col relative z-10 transition-colors duration-300">
        {/* Header Section */}
        <div className="flex flex-col items-center pt-10 pb-6 px-8">
          <div className="relative mb-6 group">
            <div className="absolute inset-0 bg-cyan-500/20 rounded-full blur-xl group-hover:bg-cyan-400/30 transition-all duration-500"></div>
            <div className="relative h-20 w-20 bg-surface rounded-full flex items-center justify-center border border-slate-200 dark:border-white/10 shadow-lg group-hover:scale-105 transition-transform duration-300">
              <span className="material-symbols-outlined text-transparent bg-clip-text bg-gradient-to-br from-cyan-400 to-blue-500 text-5xl">visibility</span>
            </div>
          </div>
          <h2 className="text-text-main text-3xl font-bold leading-tight tracking-tight text-center mb-2">
            {t.login}
          </h2>
          <p className="text-text-secondary text-base font-light leading-normal text-center max-w-xs mx-auto">
            {t.welcomeBack}
          </p>
        </div>

        {/* Form Section */}
        <div className="flex flex-col px-8 py-6 gap-5">
          {/* Email Input */}
          <label className="flex flex-col gap-2 group">
            <span className="text-text-secondary text-sm font-medium tracking-wide ml-1 group-focus-within:text-primary transition-colors">{t.emailOrPhone}</span>
            <input
              className="w-full rounded-xl border border-slate-200 dark:border-white/10 bg-surface/50 text-text-main h-14 px-4 text-lg placeholder:text-text-secondary/50 focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all outline-none shadow-inner"
              placeholder="name@example.com"
              type="text"
            />
          </label>

          {/* Password Input */}
          <label className="flex flex-col gap-2 group">
            <span className="text-text-secondary text-sm font-medium tracking-wide ml-1 group-focus-within:text-primary transition-colors">{t.password}</span>
            <div className="relative flex w-full items-center">
              <input
                className="w-full rounded-xl border border-slate-200 dark:border-white/10 bg-surface/50 text-text-main h-14 pl-4 pr-12 text-lg placeholder:text-text-secondary/50 focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all outline-none shadow-inner"
                placeholder={t.enterPassword}
                type="password"
              />
              <button className="absolute right-0 top-0 h-full px-4 text-text-secondary hover:text-primary transition-colors flex items-center justify-center" type="button">
                <span className="material-symbols-outlined">visibility_off</span>
              </button>
            </div>
          </label>

          {/* Forgot Password Link */}
          <div className="flex justify-end">
            <Link className="text-primary text-sm font-medium hover:text-primary-dark transition-colors py-1" href="/forgot-password">
              {t.forgotPassword}
            </Link>
          </div>

          {/* Login Button */}
          <button onClick={handleLogin} className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-lg h-14 rounded-xl shadow-[0_0_20px_rgba(6,182,212,0.3)] hover:shadow-[0_0_30px_rgba(6,182,212,0.5)] transition-all active:scale-[0.98] flex items-center justify-center gap-2 mt-2 group">
            {t.login}
            <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">arrow_forward</span>
          </button>

          {/* Divider */}
          <div className="relative flex py-2 items-center">
            <div className="flex-grow border-t border-slate-200 dark:border-white/10"></div>
            <span className="flex-shrink mx-4 text-text-secondary text-sm font-light">{t.or}</span>
            <div className="flex-grow border-t border-slate-200 dark:border-white/10"></div>
          </div>

          {/* Google Login Button */}
          <button className="w-full bg-surface-highlight border border-slate-200 dark:border-white/10 hover:bg-surface text-text-main font-medium text-lg h-14 rounded-xl transition-all flex items-center justify-center gap-3 group hover:border-slate-300 dark:hover:border-white/20">
            <svg className="w-6 h-6 group-hover:scale-110 transition-transform" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
              <path d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" fill="#EA4335"></path>
              <path d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" fill="#4285F4"></path>
              <path d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" fill="#FBBC05"></path>
              <path d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" fill="#34A853"></path>
              <path d="M0 0h48v48H0z" fill="none"></path>
            </svg>
            {t.continueWithGoogle}
          </button>

          {/* Sign Up Link */}
          <p className="text-center text-text-secondary text-sm mt-2 pb-6">
            {t.dontHaveAccount} <Link className="text-primary font-semibold hover:text-primary-dark hover:underline transition-colors" href="/signup">{t.signUp}</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
