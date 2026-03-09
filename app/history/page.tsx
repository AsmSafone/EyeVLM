'use client';

import Link from 'next/link';
import BottomNav from '@/components/BottomNav';
import { useLanguage } from '@/app/context/LanguageContext';
import { useState, useMemo } from 'react';

// Hardcoded data types for history
type RiskLevel = 'high' | 'moderate' | 'low';

interface HistoryItem {
  id: string;
  titleKey: 'diabeticRetinopathy' | 'glaucomaSuspect' | 'healthyRetina' | 'routineCheckup' | 'macularDegeneration';
  date: string;
  monthYear: 'october2023' | 'september2023' | 'august2023';
  risk: RiskLevel;
  icon: string;
}

const mockHistoryData: HistoryItem[] = [
  { id: '2049', titleKey: 'diabeticRetinopathy', date: 'Oct 12, 2023', monthYear: 'october2023', risk: 'high', icon: 'visibility' },
  { id: '2048', titleKey: 'glaucomaSuspect', date: 'Oct 05, 2023', monthYear: 'october2023', risk: 'moderate', icon: 'ophthalmology' },
  { id: '2047', titleKey: 'healthyRetina', date: 'Sep 28, 2023', monthYear: 'september2023', risk: 'low', icon: 'check_circle' },
  { id: '2046', titleKey: 'routineCheckup', date: 'Sep 15, 2023', monthYear: 'september2023', risk: 'low', icon: 'check_circle' },
  { id: '2045', titleKey: 'macularDegeneration', date: 'Aug 10, 2023', monthYear: 'august2023', risk: 'moderate', icon: 'blur_on' },
];

export default function History() {
  const { t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<RiskLevel | 'all'>('all');

  // Filter the data based on search query and active filter
  const filteredData = useMemo(() => {
    return mockHistoryData.filter((item) => {
      const translatedTitle = t[item.titleKey] as string;
      const matchesSearch = translatedTitle.toLowerCase().includes(searchQuery.toLowerCase()) || item.date.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesFilter = activeFilter === 'all' || item.risk === activeFilter;
      return matchesSearch && matchesFilter;
    });
  }, [searchQuery, activeFilter, t]);

  // Group by monthYear
  const groupedData = useMemo(() => {
    const groups: Record<string, HistoryItem[]> = {
      october2023: [],
      september2023: [],
      august2023: []
    };
    filteredData.forEach(item => {
      groups[item.monthYear].push(item);
    });
    return groups;
  }, [filteredData]);

  const toggleFilter = () => {
    // Cycle through: all -> high -> moderate -> low -> all
    setActiveFilter(prev => {
      if (prev === 'all') return 'high';
      if (prev === 'high') return 'moderate';
      if (prev === 'moderate') return 'low';
      return 'all';
    });
  };

  const getRiskColors = (risk: RiskLevel) => {
    if (risk === 'high') return 'bg-red-500/10 text-red-500 border-red-500/20 group-hover:bg-red-500/20 shadow-[0_0_10px_rgba(239,68,68,0.1)]';
    if (risk === 'moderate') return 'bg-amber-500/10 text-amber-500 border-amber-500/20 group-hover:bg-amber-500/20 shadow-[0_0_10px_rgba(245,158,11,0.1)]';
    return 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20 group-hover:bg-emerald-500/20 shadow-[0_0_10px_rgba(16,185,129,0.1)]';
  };

  const getRiskLabel = (risk: RiskLevel) => {
    if (risk === 'high') return t.highRisk;
    if (risk === 'moderate') return t.moderate;
    return t.normal;
  };

  return (
    <div className="bg-background font-sans min-h-screen flex justify-center text-text-main antialiased relative overflow-clip transition-colors duration-300">
      {/* Decorative Background - Dark Mode Only */}
      <div className="absolute inset-0 z-0 bg-[radial-gradient(circle_at_top_left,_var(--tw-gradient-stops))] from-blue-900/20 via-slate-950 to-slate-950 pointer-events-none opacity-0 dark:opacity-100 transition-opacity duration-300"></div>

      <div className="relative flex h-full w-full max-w-md flex-col bg-background shadow-2xl min-h-screen z-10 transition-colors duration-300">
        {/* Header */}
        <div className="sticky top-0 z-20 bg-surface/80 backdrop-blur-xl px-4 pb-4 pt-6 border-b border-slate-200 dark:border-white/5 transition-colors duration-300">
          <div className="flex items-center justify-between mb-4">
            <Link href="/dashboard" className="flex size-10 items-center justify-center rounded-full hover:bg-surface-highlight transition-colors text-text-main border border-transparent hover:border-slate-200 dark:hover:border-white/10">
              <span className="material-symbols-outlined text-2xl">arrow_back</span>
            </Link>
            <h1 className="text-xl font-bold leading-tight flex-1 text-center pr-10 tracking-wide text-text-main">{t.screeningHistory}</h1>
          </div>
          <div className="flex gap-3">
            <div className="relative flex-1 group">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-text-secondary group-focus-within:text-primary transition-colors">
                <span className="material-symbols-outlined">search</span>
              </div>
              <input
                className="block w-full rounded-xl border border-slate-200 dark:border-white/10 bg-surface/50 py-3 pl-10 pr-4 text-text-main placeholder:text-text-secondary/50 focus:ring-1 focus:ring-primary focus:border-primary/50 transition-all sm:text-sm sm:leading-6 shadow-inner"
                placeholder={t.searchPlaceholder}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <button
              onClick={toggleFilter}
              className={`flex size-12 shrink-0 items-center justify-center rounded-xl border bg-surface/50 transition-all ${activeFilter !== 'all'
                ? 'border-primary text-primary bg-primary/10'
                : 'border-slate-200 dark:border-white/10 text-text-secondary hover:text-primary hover:border-primary/30 hover:bg-surface-highlight'
                }`}
            >
              <span className="material-symbols-outlined">
                {activeFilter === 'high' ? 'warning' : activeFilter === 'moderate' ? 'info' : activeFilter === 'low' ? 'check_circle' : 'filter_list'}
              </span>
            </button>
          </div>

          {/* Active Filter Pill */}
          {activeFilter !== 'all' && (
            <div className="mt-3 flex">
              <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary border border-primary/20">
                Filter: {activeFilter === 'high' ? 'High Risk' : activeFilter === 'moderate' ? 'Moderate Risk' : 'Low Risk'}
                <button onClick={() => setActiveFilter('all')} className="ml-1 hover:text-primary-dark cursor-pointer">
                  <span className="material-symbols-outlined text-[14px]">close</span>
                </button>
              </span>
            </div>
          )}
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto px-4 pb-24 pt-4 space-y-6">
          {filteredData.length === 0 ? (
            <div className="flex flex-col items-center justify-center pt-20 text-text-secondary">
              <span className="material-symbols-outlined text-5xl mb-3 opacity-50">search_off</span>
              <p>No results found.</p>
            </div>
          ) : (
            <>
              {/* Render dynamic groups */}
              {['october2023', 'september2023', 'august2023'].map((monthKey) => {
                const items = groupedData[monthKey as keyof typeof groupedData];
                if (items.length === 0) return null;

                return (
                  <div key={monthKey}>
                    <h2 className="mb-3 px-1 text-xs font-bold uppercase tracking-widest text-primary/70">{t[monthKey as keyof typeof t]}</h2>
                    <div className="flex flex-col gap-3">
                      {items.map((item) => (
                        <Link key={item.id} href={item.id === '2049' ? `/history/${item.id}` : '#'} className={`group flex cursor-pointer items-center justify-between gap-4 rounded-2xl bg-surface/40 p-4 border border-slate-200 dark:border-white/5 hover:bg-surface/60 transition-all ${item.risk === 'high' ? 'hover:border-red-500/30 hover:shadow-[0_0_15px_rgba(239,68,68,0.1)]' :
                          item.risk === 'moderate' ? 'hover:border-amber-500/30 hover:shadow-[0_0_15px_rgba(245,158,11,0.1)]' :
                            'hover:border-emerald-500/30 hover:shadow-[0_0_15px_rgba(16,185,129,0.1)]'
                          }`}>
                          <div className="flex items-center gap-4">
                            <div className={`flex size-12 shrink-0 items-center justify-center rounded-xl border group-hover:scale-105 transition-transform ${item.risk === 'high' ? 'bg-red-500/10 text-red-500 border-red-500/20' :
                              item.risk === 'moderate' ? 'bg-amber-500/10 text-amber-500 border-amber-500/20' :
                                'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'
                              }`}>
                              <span className="material-symbols-outlined">{item.icon}</span>
                            </div>
                            <div className="flex flex-col">
                              <h3 className="font-bold text-text-main group-hover:text-primary transition-colors line-clamp-1">{t[item.titleKey as keyof typeof t]}</h3>
                              <div className="flex items-center gap-2 mt-1">
                                <span className="text-xs font-medium text-text-secondary font-mono">{item.date}</span>
                                <span className="size-1 rounded-full bg-slate-300 dark:bg-slate-700"></span>
                                <span className={`inline-flex items-center rounded-md px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide border ${getRiskColors(item.risk)}`}>
                                  {getRiskLabel(item.risk)}
                                </span>
                              </div>
                            </div>
                          </div>
                          <span className={`material-symbols-outlined transition-colors ${item.risk === 'high' ? 'text-text-secondary group-hover:text-red-400' :
                            item.risk === 'moderate' ? 'text-text-secondary group-hover:text-amber-400' :
                              'text-text-secondary group-hover:text-emerald-400'
                            }`}>chevron_right</span>
                        </Link>
                      ))}
                    </div>
                  </div>
                );
              })}
            </>
          )}
        </div>


        <BottomNav />
      </div>
    </div>
  );
}
