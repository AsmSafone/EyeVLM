'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/app/context/LanguageContext';
import dynamic from 'next/dynamic';

const MapComponent = dynamic(() => import('./MapComponent'), {
    ssr: false,
    loading: () => (
        <div className="w-full h-full bg-surface-highlight animate-pulse flex items-center justify-center">
            <span className="material-symbols-outlined text-text-secondary animate-spin">sync</span>
        </div>
    )
});

const DUMMY_DOCTORS = [
    {
        id: 1,
        name: {
            en: "Dr. Ayesha Rahman",
            bn: "ড. আয়েশা রহমান"
        },
        specialization: {
            en: "Retina Specialist",
            bn: "রেটিনা বিশেষজ্ঞ"
        },
        clinic: {
            en: "Vision Care Center",
            bn: "ভিশন কেয়ার সেন্টার"
        },
        rating: 4.8,
        reviews: 124,
        distance: 2.4, // in km
        availability: "today",
        coords: [23.7937, 90.4066] as [number, number]
    },
    {
        id: 2,
        name: {
            en: "Dr. Tariq Islam",
            bn: "ড. তারিক ইসলাম"
        },
        specialization: {
            en: "Glaucoma Expert",
            bn: "গ্লুকোমা বিশেষজ্ঞ"
        },
        clinic: {
            en: "Eye Health Hospital",
            bn: "আই হেলথ হাসপাতাল"
        },
        rating: 4.9,
        reviews: 310,
        distance: 4.1,
        availability: "tomorrow",
        coords: [23.8105, 90.4126] as [number, number]
    },
    {
        id: 3,
        name: {
            en: "Dr. Sarah Ahmed",
            bn: "ড. সারাহ আহমেদ"
        },
        specialization: {
            en: "Comprehensive Ophthalmologist",
            bn: "সার্বিক চক্ষু বিশেষজ্ঞ"
        },
        clinic: {
            en: "City Eye Clinic",
            bn: "সিটি আই ক্লিনিক"
        },
        rating: 4.6,
        reviews: 89,
        distance: 5.5,
        availability: "today",
        coords: [23.7461, 90.3742] as [number, number]
    },
    {
        id: 4,
        name: {
            en: "Dr. Kamal Hossain",
            bn: "ড. কামাল হোসেন"
        },
        specialization: {
            en: "Pediatric Ophthalmologist",
            bn: "শিশু চক্ষু বিশেষজ্ঞ"
        },
        clinic: {
            en: "Child Vision Institute",
            bn: "চাইল্ড ভিশন ইনস্টিটিউট"
        },
        rating: 4.7,
        reviews: 215,
        distance: 7.2,
        availability: "tomorrow",
        coords: [23.8223, 90.3654] as [number, number]
    }
];

export default function ConsultPage() {
    const router = useRouter();
    const { language, t } = useLanguage();
    const [searchQuery, setSearchQuery] = useState('');

    const filteredDoctors = DUMMY_DOCTORS.filter(doc =>
        doc.name[language as 'en' | 'bn'].toLowerCase().includes(searchQuery.toLowerCase()) ||
        doc.specialization[language as 'en' | 'bn'].toLowerCase().includes(searchQuery.toLowerCase()) ||
        doc.clinic[language as 'en' | 'bn'].toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="bg-background font-sans antialiased text-text-main min-h-screen flex flex-col relative overflow-hidden transition-colors duration-300">
            {/* Decorative Background - Dark Mode Only */}
            <div className="absolute inset-0 z-0 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-slate-950 pointer-events-none opacity-0 dark:opacity-100 transition-opacity duration-300"></div>

            {/* Top App Bar */}
            <div className="sticky top-0 z-50 bg-surface/80 backdrop-blur-xl border-b border-slate-200 dark:border-white/5 transition-colors duration-300">
                <div className="flex items-center justify-between p-4">
                    <button onClick={() => router.back()} className="flex size-10 items-center justify-center rounded-full hover:bg-surface-highlight transition-colors text-text-main border border-transparent hover:border-slate-200 dark:hover:border-white/10">
                        <span className="material-symbols-outlined text-[24px]">arrow_back</span>
                    </button>
                    <h1 className="text-lg font-bold leading-tight tracking-wide text-center flex-1 pr-10 drop-shadow-md">{t.findDoctor}</h1>
                </div>
            </div>

            <main className="flex-1 flex flex-col w-full max-w-md mx-auto relative z-10 overflow-y-auto">
                {/* Search Bar */}
                <div className="px-4 pt-6 pb-2 sticky top-0 bg-background/95 backdrop-blur z-40 transition-colors duration-300">
                    <div className="relative flex items-center w-full h-12 rounded-2xl bg-surface border border-slate-200 dark:border-white/10 overflow-hidden focus-within:border-primary/50 focus-within:ring-1 focus-within:ring-primary/50 transition-all shadow-sm">
                        <span className="material-symbols-outlined absolute left-4 text-text-secondary text-[20px]">search</span>
                        <input
                            type="text"
                            placeholder={t.searchDoctor}
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full h-full bg-transparent pl-12 pr-4 text-sm text-text-main placeholder:text-text-secondary/70 focus:outline-none"
                        />
                    </div>
                </div>

                {/* Map Area */}
                <div className="px-4 py-4 shrink-0">
                    <div className="w-full h-48 rounded-3xl bg-surface overflow-hidden relative border border-slate-200 dark:border-white/5 shadow-inner z-0">
                        <MapComponent doctors={filteredDoctors} language={language} />
                    </div>
                </div>

                {/* Doctor List */}
                <div className="flex-1 px-4 pb-24 flex flex-col gap-4 relative z-10">
                    {filteredDoctors.length > 0 ? (
                        filteredDoctors.map(doc => (
                            <div key={doc.id} className="bg-surface/60 backdrop-blur-md rounded-3xl p-5 border border-slate-200 dark:border-white/5 shadow-md hover:border-primary/30 transition-colors group">
                                {/* Header info */}
                                <div className="flex gap-4 mb-4">
                                    {/* Avatar */}
                                    <div className="size-14 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center shrink-0 border border-primary/20 shadow-inner overflow-hidden">
                                        <span className="material-symbols-outlined text-[32px] text-primary/80">person</span>
                                    </div>

                                    {/* Details */}
                                    <div className="flex-1 flex flex-col justify-center">
                                        <h3 className="text-base font-bold text-text-main leading-tight tracking-tight">{doc.name[language as 'en' | 'bn']}</h3>
                                        <p className="text-xs font-semibold text-primary mt-0.5">{doc.specialization[language as 'en' | 'bn']}</p>
                                        <p className="text-xs text-text-secondary mt-1 max-w-[200px] truncate">{doc.clinic[language as 'en' | 'bn']}</p>
                                    </div>
                                </div>

                                {/* Metrics */}
                                <div className="flex items-center gap-4 mb-5 pt-4 border-t border-slate-200 dark:border-white/5">
                                    <div className="flex items-center gap-1.5">
                                        <span className="material-symbols-outlined text-[16px] text-amber-400">star</span>
                                        <span className="text-sm font-bold text-text-main">{doc.rating}</span>
                                        <span className="text-xs text-text-secondary">({doc.reviews} {t.reviews})</span>
                                    </div>
                                    <div className="w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-700"></div>
                                    <div className="flex items-center gap-1.5">
                                        <span className="material-symbols-outlined text-[16px] text-text-secondary">location_on</span>
                                        <span className="text-xs font-medium text-text-secondary">{doc.distance} {t.kmAway}</span>
                                    </div>
                                </div>

                                {/* Availability and Actions */}
                                <div className="flex flex-col gap-3">
                                    <div className="flex items-center gap-2 px-3 py-2 bg-emerald-500/10 rounded-xl border border-emerald-500/20">
                                        <span className="material-symbols-outlined text-[16px] text-emerald-500">calendar_today</span>
                                        <span className="text-xs text-text-main">
                                            <strong className="font-bold text-emerald-500 pr-1">{t.availability}</strong>
                                            {doc.availability === 'today' ? t.today : t.tomorrow}
                                        </span>
                                    </div>

                                    <div className="grid grid-cols-2 gap-3 mt-1">
                                        <button className="flex items-center justify-center gap-2 py-3 rounded-xl border border-primary/30 text-primary font-bold text-sm bg-primary/5 hover:bg-primary/10 transition-colors active:scale-95">
                                            <span className="material-symbols-outlined text-[18px]">call</span>
                                            {t.callNow}
                                        </button>
                                        <button className="flex items-center justify-center gap-2 py-3 rounded-xl bg-primary hover:bg-primary-dark text-white font-bold text-sm shadow-[0_0_15px_rgba(6,182,212,0.3)] transition-all hover:shadow-[0_0_20px_rgba(6,182,212,0.4)] active:scale-95 border border-primary/20">
                                            <span className="material-symbols-outlined text-[18px]">event_available</span>
                                            {t.bookAppointment}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="w-full flex flex-col items-center justify-center py-20 text-text-secondary opacity-60">
                            <span className="material-symbols-outlined text-[64px] mb-4">search_off</span>
                            <p className="font-medium text-center">No doctors found matching your search.</p>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
