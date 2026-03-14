'use client';

import Link from 'next/link';
import BottomNav from '@/components/BottomNav';
import { useLanguage } from '@/app/context/LanguageContext';
import { useState, useMemo, useEffect } from 'react';

type RiskLevel = 'high' | 'moderate' | 'low' | 'normal';

interface ScanHistoryEntry {
  id: string;
  date: string;
  timestamp: number;
  name: string;
  age: string;
  gender: string;
  activeEye: 'left' | 'right';
  diseaseName: string;
  severity: string;
  diabetes: boolean;
  hypertension: boolean;
  familyHistory: boolean;
}

function getRiskLevel(diseaseName: string, severity: string): RiskLevel {
  if (!diseaseName || diseaseName === 'others') return 'normal';
  if (severity === 'severe') return 'high';
  if (severity === 'moderate') return 'moderate';
  return 'low';
}

function getDiseaseIcon(diseaseName: string): string {
  switch (diseaseName) {
    case 'cataracts': return 'blur_on';
    case 'glaucoma': return 'visibility_off';
    case 'pterygium': return 'swipe_up_alt';
    case 'conjunctivitis': return 'remove_red_eye';
    case 'keratitis': return 'ophthalmology';
    case 'uveitis': return 'visibility';
    case 'ptosis': return 'eyelashes';
    default: return 'check_circle';
  }
}

function groupByMonth(entries: ScanHistoryEntry[]) {
  const groups: Record<string, ScanHistoryEntry[]> = {};
  entries.forEach(entry => {
    const d = new Date(entry.timestamp);
    const key = `${d.toLocaleString('en-US', { month: 'long' })} ${d.getFullYear()}`;
    if (!groups[key]) groups[key] = [];
    groups[key].push(entry);
  });
  return groups;
}

export default function History() {
  const { t } = useLanguage();
  const [history, setHistory] = useState<ScanHistoryEntry[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<RiskLevel | 'all'>('all');

  useEffect(() => {
    const raw = localStorage.getItem('scanHistory');
    if (raw) {
      try {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setHistory(JSON.parse(raw));
      } catch {
        setHistory([]);
      }
    }
  }, []);

  const handleClearHistory = () => {
    if (confirm('Are you sure you want to delete all scan history?')) {
      localStorage.removeItem('scanHistory');
      setHistory([]);
    }
  };

  const filteredData = useMemo(() => {
    return history.filter((item) => {
      const matchesSearch =
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.diseaseName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.date.toLowerCase().includes(searchQuery.toLowerCase());

      const risk = getRiskLevel(item.diseaseName, item.severity);
      const matchesFilter = activeFilter === 'all' || risk === activeFilter;
      return matchesSearch && matchesFilter;
    });
  }, [history, searchQuery, activeFilter]);

  const groupedData = useMemo(() => groupByMonth(filteredData), [filteredData]);
  const monthKeys = Object.keys(groupedData);

  const toggleFilter = () => {
    setActiveFilter(prev => {
      if (prev === 'all') return 'high';
      if (prev === 'high') return 'moderate';
      if (prev === 'moderate') return 'low';
      if (prev === 'low') return 'normal';
      return 'all';
    });
  };

  const getRiskColors = (risk: RiskLevel) => {
    if (risk === 'high') return 'bg-red-500/10 text-red-500 border-red-500/20 hover:bg-red-500/20 shadow-[0_0_10px_rgba(239,68,68,0.1)]';
    if (risk === 'moderate') return 'bg-amber-500/10 text-amber-500 border-amber-500/20 hover:bg-amber-500/20 shadow-[0_0_10px_rgba(245,158,11,0.1)]';
    return 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20 hover:bg-emerald-500/20 shadow-[0_0_10px_rgba(16,185,129,0.1)]';
  };

  const getRiskLabel = (risk: RiskLevel) => {
    if (risk === 'high') return t.highRisk;
    if (risk === 'moderate') return t.moderate;
    return t.normal;
  };

  const getRiskBorder = (risk: RiskLevel) => {
    if (risk === 'high') return 'hover:border-red-500/30 hover:shadow-[0_0_15px_rgba(239,68,68,0.1)]';
    if (risk === 'moderate') return 'hover:border-amber-500/30 hover:shadow-[0_0_15px_rgba(245,158,11,0.1)]';
    return 'hover:border-emerald-500/30 hover:shadow-[0_0_15px_rgba(16,185,129,0.1)]';
  };

  return (
    <div className="bg-background font-sans min-h-screen flex justify-center text-text-main antialiased relative overflow-clip transition-colors duration-300">
      {/* Decorative Background */}
      <div className="absolute inset-0 z-0 bg-[radial-gradient(circle_at_top_left,_var(--tw-gradient-stops))] from-blue-900/20 via-slate-950 to-slate-950 pointer-events-none opacity-0 dark:opacity-100 transition-opacity duration-300"></div>

      <div className="relative flex flex-col w-full max-w-md min-h-screen z-10 transition-colors duration-300">
        {/* Header */}
        <div className="sticky top-0 z-20 bg-surface/80 backdrop-blur-xl px-4 pb-4 pt-6 border-b border-slate-200 dark:border-white/5 transition-colors duration-300">
          <div className="flex items-center justify-between mb-4">
            <Link href="/dashboard" className="flex size-10 items-center justify-center rounded-full hover:bg-surface-highlight transition-colors text-text-main border border-transparent hover:border-slate-200 dark:hover:border-white/10">
              <span className="material-symbols-outlined text-2xl">arrow_back</span>
            </Link>
            <h1 className="text-xl font-bold leading-tight flex-1 text-center tracking-wide text-text-main">{t.screeningHistory}</h1>
            {history.length > 0 && (
              <button onClick={handleClearHistory} className="flex size-10 items-center justify-center rounded-full hover:bg-red-500/10 transition-colors text-text-secondary hover:text-red-500 border border-transparent hover:border-red-500/20">
                <span className="material-symbols-outlined text-xl">delete_sweep</span>
              </button>
            )}
            {history.length === 0 && <div className="size-10" />}
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
                {activeFilter === 'high' ? 'warning' : activeFilter === 'moderate' ? 'info' : activeFilter === 'low' || activeFilter === 'normal' ? 'check_circle' : 'filter_list'}
              </span>
            </button>
          </div>

          {activeFilter !== 'all' && (
            <div className="mt-3 flex">
              <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary border border-primary/20">
                Filter: {activeFilter === 'high' ? 'High Risk' : activeFilter === 'moderate' ? 'Moderate' : 'Low / Normal'}
                <button onClick={() => setActiveFilter('all')} className="ml-1 hover:text-primary-dark cursor-pointer">
                  <span className="material-symbols-outlined text-[14px]">close</span>
                </button>
              </span>
            </div>
          )}
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto px-4 pb-24 pt-4 space-y-6">
          {history.length === 0 ? (
            <div className="flex flex-col items-center justify-center pt-20 text-text-secondary gap-3">
              <span className="material-symbols-outlined text-6xl opacity-30">history</span>
              <p className="text-lg font-bold text-text-secondary/70">No scans yet</p>
              <p className="text-sm text-text-secondary/50 text-center">Complete a scan to see your history here.</p>
              <Link href="/scan" className="mt-4 px-6 py-2.5 bg-primary text-white rounded-2xl font-bold text-sm shadow-[0_0_15px_rgba(6,182,212,0.3)] hover:bg-primary-dark transition-colors">
                Start a Scan
              </Link>
            </div>
          ) : filteredData.length === 0 ? (
            <div className="flex flex-col items-center justify-center pt-20 text-text-secondary">
              <span className="material-symbols-outlined text-5xl mb-3 opacity-50">search_off</span>
              <p>No results found.</p>
            </div>
          ) : (
            <>
              {monthKeys.map((monthKey) => {
                const items = groupedData[monthKey];
                if (!items || items.length === 0) return null;
                return (
                  <div key={monthKey}>
                    <h2 className="mb-3 px-1 text-xs font-bold uppercase tracking-widest text-primary/70">{monthKey}</h2>
                    <div className="flex flex-col gap-3">
                      {items.map((item) => {
                        const risk = getRiskLevel(item.diseaseName, item.severity);
                        return (
                          <Link key={item.id} href={`/history/detail?id=${item.id}`} className={`group flex cursor-pointer items-center justify-between gap-4 rounded-2xl bg-surface/40 p-4 border border-slate-200 dark:border-white/5 hover:bg-surface/60 transition-all ${getRiskBorder(risk)}`}>
                            <div className="flex items-center gap-4">
                              <div className={`flex size-12 shrink-0 items-center justify-center rounded-xl border group-hover:scale-105 transition-transform ${getRiskColors(risk)}`}>
                                <span className="material-symbols-outlined">{getDiseaseIcon(item.diseaseName)}</span>
                              </div>
                              <div className="flex flex-col">
                                <h3 className="font-bold text-text-main group-hover:text-primary transition-colors line-clamp-1">
                                  {item.name || (item.diseaseName && (t as any)[item.diseaseName]) || item.diseaseName || 'Unknown'} &middot; {item.activeEye === 'left' ? t.leftEye : t.rightEye}
                                </h3>
                                <div className="flex items-center gap-2 mt-1">
                                  <span className="text-xs font-medium text-text-secondary font-mono">{item.date}</span>
                                  <span className="size-1 rounded-full bg-slate-300 dark:bg-slate-700"></span>
                                  <span className={`inline-flex items-center rounded-md px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide border ${getRiskColors(risk)}`}>
                                    {getRiskLabel(risk)}
                                  </span>
                                </div>
                                <span className="text-[10px] font-mono text-text-secondary/50 mt-0.5">{item.id}</span>
                              </div>
                            </div>
                            <span className={`material-symbols-outlined transition-colors shrink-0 ${risk === 'high' ? 'text-text-secondary group-hover:text-red-400' : risk === 'moderate' ? 'text-text-secondary group-hover:text-amber-400' : 'text-text-secondary group-hover:text-emerald-400'}`}>chevron_right</span>
                          </Link>
                        );
                      })}
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
