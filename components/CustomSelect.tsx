'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Option {
    value: string;
    label: string;
}

interface CustomSelectProps {
    options: Option[];
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    className?: string;
}

export default function CustomSelect({ options, value, onChange, placeholder = 'Select', className = '' }: CustomSelectProps) {
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    const selectedOption = options.find((opt) => opt.value === value);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div className={`relative ${className}`} ref={containerRef}>
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center justify-between rounded-2xl border border-slate-200 dark:border-white/10 bg-surface/50 text-text-main h-14 pl-4 pr-4 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary/50 transition-all text-sm sm:text-lg cursor-pointer shadow-inner"
            >
                <span className={selectedOption ? 'text-text-main' : 'text-text-secondary/80'}>
                    {selectedOption ? selectedOption.label : placeholder}
                </span>
                <span className={`material-symbols-outlined text-text-secondary transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}>
                    expand_more
                </span>
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
                        transition={{ duration: 0.2, ease: 'easeOut' }}
                        className="absolute z-50 w-full mt-2 rounded-2xl border border-slate-200 dark:border-white/10 bg-surface/95 backdrop-blur-xl shadow-xl overflow-hidden"
                    >
                        <div className="max-h-60 overflow-y-auto custom-scrollbar py-2">
                            {options.map((option) => (
                                <button
                                    key={option.value}
                                    type="button"
                                    onClick={() => {
                                        onChange(option.value);
                                        setIsOpen(false);
                                    }}
                                    className={`w-full text-left px-4 py-3 hover:bg-surface-highlight transition-colors flex items-center justify-between group ${value === option.value ? 'bg-primary/10 text-primary font-medium' : 'text-text-main'
                                        }`}
                                >
                                    <span className="group-hover:text-primary transition-colors">{option.label}</span>
                                    {value === option.value && (
                                        <span className="material-symbols-outlined text-xl">check</span>
                                    )}
                                </button>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
