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

const ALL_DOCTORS = [
    {
        id: 1,
        name: {
            en: "Dr. Murtuza Nuruddin",
            bn: "ড. মর্তুজা নুরুদ্দীন"
        },
        specialization: {
            en: "Consultant Ophthalmologist and Surgeon",
            bn: "কনসালটেন্ট চক্ষু বিশেষজ্ঞ ও সার্জন"
        },
        clinic: {
            en: "Chevron Eye Hospital",
            bn: "শেভরন আই হসপিটাল"
        },
        rating: 4.9,
        reviews: 289,
        distance: 2.1,
        availability: "today",
        coords: [22.3596, 91.8213] as [number, number],
        image: "https://chevroneyehospital.org/wp-content/uploads/2026/01/1767277508432_81hqj7_2_1-823x1024.webp"
    },
    {
        id: 2,
        name: {
            en: "Dr. Golam Mostafa Chy. (Shamim)",
            bn: "ড. গোলাম মোস্তফা চৌধুরী (শামীম)"
        },
        specialization: {
            en: "Consultant Ophthalmologist and Phaco Surgeon",
            bn: "কনসালটেন্ট চক্ষু বিশেষজ্ঞ ও ফ্যাকো সার্জন"
        },
        clinic: {
            en: "Chevron Eye Hospital",
            bn: "শেভরন আই হসপিটাল"
        },
        rating: 4.8,
        reviews: 245,
        distance: 2.1,
        availability: "today",
        coords: [22.3590, 91.8210] as [number, number],
        image: "https://chevroneyehospital.org/wp-content/uploads/2026/01/1767278718240_3iv4il_2_1.webp"
    },
    {
        id: 3,
        name: {
            en: "Dr. M A Karim PhD",
            bn: "ড. এম এ করিম পিএইচডি"
        },
        specialization: {
            en: "Glaucoma Specialist and Phaco Surgeon",
            bn: "গ্লুকোমা বিশেষজ্ঞ ও ফ্যাকো সার্জন"
        },
        clinic: {
            en: "Chevron Eye Hospital",
            bn: "শেভরন আই হসপিটাল"
        },
        rating: 4.9,
        reviews: 312,
        distance: 2.1,
        availability: "tomorrow",
        coords: [22.3592, 91.8212] as [number, number],
        image: "https://chevroneyehospital.org/wp-content/uploads/2026/01/img_1767447992536.webp"
    },
    {
        id: 4,
        name: {
            en: "Dr. M Delwar Hossain",
            bn: "ড. এম দেলোয়ার হোসেন"
        },
        specialization: {
            en: "Ophthalmologist and Vitreo Retinal Surgeon",
            bn: "চক্ষু বিশেষজ্ঞ ও ভিট্রিও রেটিনাল সার্জন"
        },
        clinic: {
            en: "Chevron Eye Hospital",
            bn: "শেভরন আই হসপিটাল"
        },
        rating: 4.7,
        reviews: 189,
        distance: 2.1,
        availability: "today",
        coords: [22.3588, 91.8208] as [number, number],
        image: "https://chevroneyehospital.org/wp-content/uploads/2026/01/1767278118743_6ixah4_2_1-823x1024.webp"
    },
    {
        id: 5,
        name: {
            en: "Dr. Md Shahadat Hossain",
            bn: "ড. মো. শাহাদাত হোসেন"
        },
        specialization: {
            en: "Consultant Ophthalmologist and Phaco Surgeon",
            bn: "কনসালটেন্ট চক্ষু বিশেষজ্ঞ ও ফ্যাকো সার্জন"
        },
        clinic: {
            en: "Chevron Eye Hospital",
            bn: "শেভরন আই হসপিটাল"
        },
        rating: 4.6,
        reviews: 156,
        distance: 2.2,
        availability: "tomorrow",
        coords: [22.3595, 91.8215] as [number, number],
        image: "https://chevroneyehospital.org/wp-content/uploads/2026/01/1767278060019_73m3eg_2_1-826x1024.webp"
    },
    {
        id: 6,
        name: {
            en: "Dr. Abdul Mannan Sikder",
            bn: "ড. আব্দুল মান্নান সিকদার"
        },
        specialization: {
            en: "Eye Specialist and Phaco Surgeon",
            bn: "চক্ষু বিশেষজ্ঞ ও ফ্যাকো সার্জন"
        },
        clinic: {
            en: "Chevron Eye Hospital",
            bn: "শেভরন আই হসপিটাল"
        },
        rating: 4.8,
        reviews: 178,
        distance: 2.1,
        availability: "today",
        coords: [22.3590, 91.8209] as [number, number],
        image: "https://chevroneyehospital.org/wp-content/uploads/2026/01/1767277631538_iwkwnx_2_1-825x1024.webp"
    },
    {
        id: 7,
        name: {
            en: "Dr. Sumed Dewan",
            bn: "ড. সুমেধ দেওয়ান"
        },
        specialization: {
            en: "Cornea Specialist",
            bn: "কর্নিয়া বিশেষজ্ঞ"
        },
        clinic: {
            en: "Chevron Eye Hospital",
            bn: "শেভরন আই হসপিটাল"
        },
        rating: 4.8,
        reviews: 204,
        distance: 2.1,
        availability: "today",
        coords: [22.3585, 91.8205] as [number, number],
        image: "https://chevroneyehospital.org/wp-content/uploads/2026/01/1767277552504_io1g1r_2_1-1.webp"
    },
    {
        id: 8,
        name: {
            en: "Dr. Wahid Alam",
            bn: "ড. ওয়াহিদ আলম"
        },
        specialization: {
            en: "Consultant Ophthalmologist and Surgeon",
            bn: "কনসালটেন্ট চক্ষু বিশেষজ্ঞ ও সার্জন"
        },
        clinic: {
            en: "Chevron Eye Hospital",
            bn: "শেভরন আই হসপিটাল"
        },
        rating: 4.7,
        reviews: 145,
        distance: 2.1,
        availability: "today",
        coords: [22.3592, 91.8210] as [number, number],
        image: "https://chevroneyehospital.org/wp-content/uploads/2026/01/1Zx8QEjK_Dbx3TyY-823x1024.webp"
    },
    {
        id: 9,
        name: {
            en: "Dr. Tasmia Tahmid",
            bn: "ড. তাসমিয়া তাহমিদ"
        },
        specialization: {
            en: "Consultant Ophthalmologist and Surgeon",
            bn: "কনসালটেন্ট চক্ষু বিশেষজ্ঞ ও সার্জন"
        },
        clinic: {
            en: "Chevron Eye Hospital",
            bn: "শেভরন আই হসপিটাল"
        },
        rating: 4.8,
        reviews: 134,
        distance: 2.1,
        availability: "tomorrow",
        coords: [22.3591, 91.8211] as [number, number],
        image: "https://chevroneyehospital.org/wp-content/uploads/2026/01/tvfucFC-PS-C_9uJ-824x1024.webp"
    },
    {
        id: 10,
        name: {
            en: "Dr. Tonima Roy",
            bn: "ড. তনিমা রায়"
        },
        specialization: {
            en: "Consultant Ophthalmologist and Surgeon",
            bn: "কনসালটেন্ট চক্ষু বিশেষজ্ঞ ও সার্জন"
        },
        clinic: {
            en: "Chevron Eye Hospital",
            bn: "শেভরন আই হসপিটাল"
        },
        rating: 4.6,
        reviews: 112,
        distance: 2.1,
        availability: "today",
        coords: [22.3590, 91.8212] as [number, number],
        image: "https://chevroneyehospital.org/wp-content/uploads/2026/01/3-Image_-1-640x1024.webp"
    },
    {
        id: 11,
        name: {
            en: "Dr. Farhadul Alam",
            bn: "ড. ফরহাদুল আলম"
        },
        specialization: {
            en: "Paediatric Ophthalmologist",
            bn: "শিশু চক্ষু বিশেষজ্ঞ"
        },
        clinic: {
            en: "Chevron Eye Hospital",
            bn: "শেভরন আই হসপিটাল"
        },
        rating: 4.7,
        reviews: 132,
        distance: 2.1,
        availability: "tomorrow",
        coords: [22.3591, 91.8211] as [number, number],
        image: "https://chevroneyehospital.org/wp-content/uploads/2026/01/dr.-Farhad-1-819x1024.jpg"
    }
];

export default function ConsultPage() {
    const router = useRouter();
    const { language, t } = useLanguage();
    const [searchQuery, setSearchQuery] = useState('');

    const filteredDoctors = ALL_DOCTORS.filter(doc =>
        doc.name[language as 'en' | 'bn'].toLowerCase().includes(searchQuery.toLowerCase()) ||
        doc.specialization[language as 'en' | 'bn'].toLowerCase().includes(searchQuery.toLowerCase()) ||
        doc.clinic[language as 'en' | 'bn'].toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="bg-background font-sans antialiased text-text-main min-h-screen flex justify-center relative overflow-hidden transition-colors duration-300">
            {/* Decorative Background - Dark Mode Only */}
            <div className="absolute inset-0 z-0 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-slate-950 pointer-events-none opacity-0 dark:opacity-100 transition-opacity duration-300"></div>

            <div className="relative flex flex-col w-full max-w-md min-h-screen z-10">

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
                                            {doc.image ? (
                                                /* eslint-disable-next-line @next/next/no-img-element */
                                                <img src={doc.image} alt={doc.name[language as 'en' | 'bn']} className="w-full h-full object-cover" />
                                            ) : (
                                                <span className="material-symbols-outlined text-[32px] text-primary/80">person</span>
                                            )}
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

                                        <div className="flex flex-wrap gap-3 mt-1">
                                            <a href="tel:+880241355817" className="flex-1 min-w-[130px] flex items-center justify-center gap-2 py-3 px-3 rounded-xl border border-primary/30 text-primary font-bold text-sm bg-primary/5 hover:bg-primary/10 transition-colors active:scale-95 text-center">
                                                <span className="material-symbols-outlined text-[18px] shrink-0">call</span>
                                                <span>{t.callNow}</span>
                                            </a>
                                            <a href="https://appointment.chevroneyehospital.org/" target="_blank" rel="noopener noreferrer" className="flex-1 min-w-[160px] flex items-center justify-center gap-2 py-3 px-3 rounded-xl bg-primary hover:bg-primary-dark text-white font-bold text-sm shadow-[0_0_15px_rgba(6,182,212,0.3)] transition-all hover:shadow-[0_0_20px_rgba(6,182,212,0.4)] active:scale-95 border border-primary/20 text-center">
                                                <span className="material-symbols-outlined text-[18px] shrink-0">event_available</span>
                                                <span>{t.bookAppointment}</span>
                                            </a>
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
        </div>
    );
}
