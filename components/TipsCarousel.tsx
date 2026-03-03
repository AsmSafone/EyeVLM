'use client';

import Image from 'next/image';
import { motion, AnimatePresence } from 'motion/react';
import { useLanguage } from '@/app/context/LanguageContext';
import { eyeHealthTips, Tip } from '@/app/lib/tips';
import { useState, useRef, useEffect } from 'react';

export default function TipsCarousel() {
    const { t } = useLanguage();
    const [hoveredTip, setHoveredTip] = useState<string | null>(null);
    const [selectedTip, setSelectedTip] = useState<Tip | null>(null);
    const scrollContainerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const interval = setInterval(() => {
            if (scrollContainerRef.current && !hoveredTip && !selectedTip) {
                const container = scrollContainerRef.current;
                // Approximate width of card + gap
                const scrollAmount = window.innerWidth < 640 ? 300 : 320;
                const maxScrollLeft = container.scrollWidth - container.clientWidth;

                // If we reach the end, loop back smoothly
                if (container.scrollLeft >= maxScrollLeft - 10) {
                    container.scrollTo({ left: 0, behavior: 'smooth' });
                } else {
                    container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
                }
            }
        }, 3000); // Auto scroll every 3 seconds

        return () => clearInterval(interval);
    }, [hoveredTip, selectedTip]);

    return (
        <section aria-label="Daily Tips" className="relative">
            <motion.div
                className="flex items-center justify-between mb-4 mt-2"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.5 }}
            >
                <h3 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-text-main to-text-secondary tracking-tight">
                    {t.quickTips}
                </h3>
                <div className="flex gap-2">
                    {/* Decorative indicators */}
                    <span className="h-1.5 w-1.5 rounded-full bg-cyan-500/50"></span>
                    <span className="h-1.5 w-3 rounded-full bg-cyan-500"></span>
                    <span className="h-1.5 w-1.5 rounded-full bg-cyan-500/50"></span>
                </div>
            </motion.div>

            <div
                ref={scrollContainerRef}
                className="flex overflow-x-auto gap-5 pb-6 -mx-6 px-6 scrollbar-hide snap-x snap-mandatory perspective-[1000px] scroll-smooth"
            >
                {eyeHealthTips.map((tip, index) => (
                    <motion.div
                        key={tip.id}
                        initial={{ opacity: 0, x: 50, scale: 0.95 }}
                        animate={{ opacity: 1, x: 0, scale: 1 }}
                        transition={{ delay: 0.4 + index * 0.1, type: "spring", stiffness: 100, damping: 15 }}
                        onHoverStart={() => setHoveredTip(tip.id)}
                        onHoverEnd={() => setHoveredTip(null)}
                        onClick={() => setSelectedTip(tip)}
                        className="snap-center shrink-0 w-[280px] sm:w-[300px] bg-surface/40 backdrop-blur-xl rounded-[2rem] p-4 border border-slate-200 dark:border-white/10 shadow-lg hover:shadow-cyan-500/10 flex flex-col gap-4 transition-all duration-300 relative group overflow-hidden cursor-pointer"
                    >
                        {/* Ambient hover glow */}
                        <div className={`absolute inset-0 bg-gradient-to-tr from-cyan-500/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-0`} />

                        <div className="h-40 w-full rounded-2xl bg-surface-highlight overflow-hidden relative z-10">
                            <Image
                                src={tip.image}
                                alt={t[tip.title as keyof typeof t] as string}
                                fill
                                className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>

                            <div className="absolute bottom-3 left-3 flex items-center gap-2">
                                <span className={`text-xs font-bold px-2.5 py-1 ${tip.categoryColor.bg} backdrop-blur-md rounded-xl border ${tip.categoryColor.border} ${tip.categoryColor.text}`}>
                                    {t[tip.category as keyof typeof t] as string}
                                </span>
                            </div>
                        </div>

                        <div className="z-10 px-1 relative">
                            <h4 className="font-bold text-lg mb-1.5 text-text-main group-hover:text-cyan-400 transition-colors duration-300">
                                {t[tip.title as keyof typeof t] as string}
                            </h4>
                            <p className="text-sm text-text-secondary leading-relaxed font-light line-clamp-2">
                                {t[tip.description as keyof typeof t] as string}
                            </p>
                        </div>
                    </motion.div>
                ))}
            </div>

            <AnimatePresence>
                {selectedTip && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setSelectedTip(null)}
                            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]"
                        />
                        <div className="fixed inset-0 flex items-center justify-center z-[110] p-6 pointer-events-none">
                            <motion.div
                                layoutId={`tip-${selectedTip.id}`}
                                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                className="bg-surface border border-slate-200 dark:border-white/10 w-full max-w-sm rounded-[2rem] overflow-hidden shadow-2xl pointer-events-auto"
                            >
                                <div className="relative h-48 w-full">
                                    <Image
                                        src={selectedTip.image}
                                        alt={t[selectedTip.title as keyof typeof t] as string}
                                        fill
                                        className="object-cover"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-surface to-transparent"></div>
                                    <button
                                        onClick={() => setSelectedTip(null)}
                                        className="absolute top-4 right-4 h-8 w-8 bg-black/40 backdrop-blur-md rounded-full flex items-center justify-center text-white/80 hover:text-white transition-colors"
                                    >
                                        <span className="material-symbols-outlined text-sm">close</span>
                                    </button>
                                    <div className="absolute bottom-4 left-6">
                                        <span className={`text-xs font-bold px-3 py-1.5 ${selectedTip.categoryColor.bg} backdrop-blur-md rounded-xl border ${selectedTip.categoryColor.border} ${selectedTip.categoryColor.text}`}>
                                            {t[selectedTip.category as keyof typeof t] as string}
                                        </span>
                                    </div>
                                </div>
                                <div className="p-6 pt-2">
                                    <h4 className="font-bold text-2xl mb-3 text-text-main">
                                        {t[selectedTip.title as keyof typeof t] as string}
                                    </h4>
                                    <p className="text-text-secondary leading-relaxed font-light text-[15px]">
                                        {t[selectedTip.description as keyof typeof t] as string}
                                    </p>

                                    <button
                                        onClick={() => setSelectedTip(null)}
                                        className="mt-6 w-full py-3.5 bg-cyan-500 hover:bg-cyan-600 text-white rounded-2xl font-semibold transition-colors flex justify-center items-center gap-2"
                                    >
                                        Got it <span className="material-symbols-outlined text-sm">check</span>
                                    </button>
                                </div>
                            </motion.div>
                        </div>
                    </>
                )}
            </AnimatePresence>
        </section>
    );
}
