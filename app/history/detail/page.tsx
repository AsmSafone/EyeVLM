'use client';

import { useState, useEffect, useRef, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useLanguage } from '@/app/context/LanguageContext';
import { toPng } from 'html-to-image';
import { jsPDF } from 'jspdf';
import { Capacitor } from '@capacitor/core';
import { Share } from '@capacitor/share';
import { Filesystem, Directory } from '@capacitor/filesystem';
import { PrescriptionReport } from '@/app/components/PrescriptionReport';
import { translations } from '@/app/lib/translations';

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

function getRiskLevel(diseaseName: string, severity: string) {
    if (!diseaseName || diseaseName === 'others') return 'normal';
    if (severity === 'severe') return 'high';
    if (severity === 'moderate') return 'moderate';
    return 'low';
}

function DetailContent() {
    const { t } = useLanguage();
    const searchParams = useSearchParams();
    const id = searchParams.get('id');

    const [entry, setEntry] = useState<ScanHistoryEntry | null>(null);
    const [imageSrc, setImageSrc] = useState<string | null>(null);
    const [notFound, setNotFound] = useState(false);
    const [isExporting, setIsExporting] = useState(false);
    const reportRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!id) { setNotFound(true); return; }
        const raw = localStorage.getItem('scanHistory');
        if (raw) {
            try {
                const history: ScanHistoryEntry[] = JSON.parse(raw);
                const found = history.find(h => h.id === id);
                if (found) {
                    setEntry(found);
                    // Load the full image stored separately
                    const img = localStorage.getItem(`scanImage_${id}`);
                    if (img) setImageSrc(img);
                } else {
                    setNotFound(true);
                }
            } catch {
                setNotFound(true);
            }
        } else {
            setNotFound(true);
        }
    }, [id]);

    const handleDownloadPdf = async () => {
        if (!reportRef.current || !entry) return;
        try {
            setIsExporting(true);
            const element = reportRef.current;
            const imgData = await toPng(element, {
                pixelRatio: 2,
                backgroundColor: '#ffffff',
            });
            const pdfWidth = element.clientWidth;
            const pdfHeight = element.clientHeight;
            const pdf = new jsPDF({
                orientation: pdfWidth > pdfHeight ? 'landscape' : 'portrait',
                unit: 'px',
                format: [pdfWidth, pdfHeight]
            });
            pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
            const fileName = `EyeVLM_Report_${entry.id}.pdf`;
            if (Capacitor.isNativePlatform()) {
                const base64Data = pdf.output('datauristring').split(',')[1];
                try {
                    const result = await Filesystem.writeFile({ path: fileName, data: base64Data, directory: Directory.Cache });
                    await Share.share({ title: 'EyeVLM Screening Report', url: result.uri });
                } catch (e) {
                    console.error('Filesystem error', e);
                    alert('Could not save PDF to device.');
                }
            } else {
                pdf.save(fileName);
            }
        } catch (error) {
            console.error('Failed to generate PDF:', error);
        } finally {
            setIsExporting(false);
        }
    };

    const handleShare = async () => {
        if (!entry) return;
        try {
            const shareData = {
                title: 'EyeVLM Screening Report',
                text: `EyeVLM Screening Report\nID: ${entry.id}\nDisease: ${entry.diseaseName}\nSeverity: ${entry.severity}`,
            };
            if (Capacitor.isNativePlatform()) {
                await Share.share(shareData);
            } else if (navigator.share) {
                await navigator.share(shareData);
            }
        } catch (error) {
            console.error('Error sharing:', error);
        }
    };

    if (notFound) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen p-6 gap-4">
                <span className="material-symbols-outlined text-6xl opacity-30">history_off</span>
                <p className="text-lg font-bold">Scan record not found</p>
                <p className="text-sm text-text-secondary text-center">The record with ID <span className="font-mono">{id}</span> could not be found in your local history.</p>
                <Link href="/history" className="mt-3 px-6 py-2.5 bg-primary text-white rounded-2xl font-bold text-sm">Back to History</Link>
            </div>
        );
    }

    if (!entry) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <span className="material-symbols-outlined animate-spin text-primary text-4xl">autorenew</span>
            </div>
        );
    }

    const risk = getRiskLevel(entry.diseaseName, entry.severity);
    const riskBadgeClass = risk === 'high'
        ? 'bg-red-500/10 border-red-500/20 text-red-500'
        : risk === 'moderate'
            ? 'bg-amber-500/10 border-amber-500/20 text-amber-500'
            : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500';
    const riskIcon = risk === 'high' ? 'warning' : risk === 'moderate' ? 'info' : 'check_circle';
    const riskLabel = risk === 'high' ? t.highRisk : risk === 'moderate' ? t.moderate : t.normal;
    const capitalizedDisease = entry.diseaseName
        ? entry.diseaseName.charAt(0).toUpperCase() + entry.diseaseName.slice(1)
        : 'Unknown';
    const socialHistory = [
        entry.diabetes && 'Diabetes',
        entry.hypertension && 'Hypertension',
        entry.familyHistory && 'Family History of Eye Disease',
    ].filter(Boolean).join(', ') || 'None reported';

    return (
        <div className="relative flex h-full w-full max-w-md flex-col bg-background shadow-2xl z-10 transition-colors duration-300">
            {/* Top App Bar */}
            <header className="flex items-center bg-surface/80 backdrop-blur-xl px-4 py-4 sticky top-0 z-20 shadow-lg border-b border-slate-200 dark:border-white/5 transition-colors duration-300">
                <Link href="/history" className="text-text-main flex size-10 shrink-0 items-center justify-center rounded-full hover:bg-surface-highlight transition border border-transparent hover:border-slate-200 dark:hover:border-white/10">
                    <span className="material-symbols-outlined">arrow_back</span>
                </Link>
                <h1 className="text-text-main text-lg font-bold leading-tight flex-1 text-center pr-10 tracking-wide drop-shadow-md">{t.screeningId}</h1>
            </header>

            {/* Main Content Scrollable Area */}
            <main className="flex-1 overflow-y-auto pb-32">
                {/* Image Area */}
                <div className="px-4 pt-6 mb-8">
                    <div className="relative w-full aspect-square rounded-3xl overflow-hidden bg-surface shadow-2xl border border-slate-200 dark:border-white/10 transition-colors duration-300 flex items-center justify-center">
                        {imageSrc ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={imageSrc} alt="Eye scan" className="w-full h-full object-cover" />
                        ) : (
                            <div className="flex flex-col items-center gap-3 text-text-secondary/40">
                                <span className="material-symbols-outlined text-6xl">ophthalmology</span>
                                <span className="text-xs font-medium tracking-wide uppercase">Eye Scan · {entry.activeEye === 'left' ? t.leftEye : t.rightEye}</span>
                            </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent pointer-events-none"></div>
                        {/* Confidence badge */}
                        <div className="absolute top-4 right-4 bg-surface/60 backdrop-blur-md px-3 py-1.5 rounded-full shadow-lg flex items-center gap-2 border border-primary/30">
                            <span className="material-symbols-outlined text-primary text-[18px]">verified</span>
                            <span className="text-xs font-bold text-text-main tracking-wide">AI {t.confidence}</span>
                        </div>
                    </div>
                    <p className="text-center text-xs text-text-secondary mt-3 font-mono tracking-wide">{t.capturedOn} {entry.date}</p>
                </div>

                {/* Diagnosis Header */}
                <div className="px-6 mb-8">
                    <div className="flex items-start justify-between gap-4">
                        <div>
                            <h2 className="text-2xl font-bold text-text-main leading-tight tracking-tight">{capitalizedDisease}</h2>
                            <p className="text-sm text-text-secondary mt-1 font-medium capitalize">{entry.severity} severity</p>
                        </div>
                        <div className={`flex h-10 shrink-0 items-center justify-center gap-x-2 rounded-xl px-4 border ${riskBadgeClass}`}>
                            <span className="material-symbols-outlined text-[20px]">{riskIcon}</span>
                            <p className="text-xs font-bold uppercase tracking-widest">{riskLabel}</p>
                        </div>
                    </div>
                </div>

                {/* Patient Summary Card */}
                <div className="px-4 mb-6">
                    <div className="bg-surface/40 backdrop-blur-md rounded-3xl p-6 shadow-lg border border-slate-200 dark:border-white/5 transition-colors duration-300">
                        <h3 className="text-xs font-bold uppercase tracking-widest text-text-secondary mb-5 flex items-center gap-2">
                            <span className="material-symbols-outlined text-lg">person</span>
                            {t.patientSummary}
                        </h3>
                        <div className="grid grid-cols-2 gap-y-6 gap-x-4">
                            <div>
                                <p className="text-[10px] text-text-secondary mb-1 uppercase tracking-wider font-bold">{t.patientId}</p>
                                <p className="text-sm font-bold text-text-main font-mono">#{entry.id}</p>
                            </div>
                            <div>
                                <p className="text-[10px] text-text-secondary mb-1 uppercase tracking-wider font-bold">{t.demographics}</p>
                                <p className="text-sm font-bold text-text-main">{entry.age ? `${entry.age} yrs` : '—'}{entry.gender ? `, ${entry.gender}` : ''}</p>
                            </div>
                            {entry.name && (
                                <div>
                                    <p className="text-[10px] text-text-secondary mb-1 uppercase tracking-wider font-bold">{t.patientName}</p>
                                    <p className="text-sm font-bold text-text-main">{entry.name}</p>
                                </div>
                            )}
                            <div>
                                <p className="text-[10px] text-text-secondary mb-1 uppercase tracking-wider font-bold">Eye Side</p>
                                <p className="text-sm font-bold text-text-main">{entry.activeEye === 'left' ? t.leftEye : t.rightEye}</p>
                            </div>
                            <div className="col-span-2">
                                <p className="text-[10px] text-text-secondary mb-1 uppercase tracking-wider font-bold">{t.reportedSymptoms}</p>
                                <p className="text-sm font-medium text-text-secondary">{socialHistory}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* AI Interpretation Card */}
                <div className="px-4 mb-24">
                    <div className="bg-surface/40 backdrop-blur-md rounded-3xl p-6 shadow-lg border border-primary/20 relative overflow-hidden transition-colors duration-300">
                        <div className="absolute top-0 right-0 w-40 h-40 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
                        <h3 className="text-xs font-bold uppercase tracking-widest text-primary mb-4 flex items-center gap-2">
                            <span className="material-symbols-outlined text-lg">auto_awesome</span>
                            {t.aiInterpretation}
                        </h3>
                        <p className="text-sm leading-relaxed text-text-secondary font-medium">
                            Based on the captured eye image and reported symptoms, the AI identified <span className="text-text-main font-bold">{capitalizedDisease}</span> with <span className="text-text-main font-bold capitalize">{entry.severity}</span> severity.
                            <br /><br />
                            <span className="text-text-main">{t.recommendation}</span>
                        </p>
                    </div>
                </div>
            </main>

            {/* Fixed Bottom Action Bar */}
            <div data-html2canvas-ignore="true" className="fixed bottom-0 w-full max-w-md bg-surface/90 backdrop-blur-xl border-t border-slate-200 dark:border-white/5 p-4 pb-8 z-20 transition-colors duration-300">
                <div className="flex gap-4">
                    <button
                        onClick={handleShare}
                        className="flex-1 bg-surface border border-slate-200 dark:border-white/10 hover:bg-surface-highlight text-text-secondary hover:text-text-main font-bold py-4 px-4 rounded-2xl flex items-center justify-center gap-2 transition active:scale-95 shadow-lg"
                    >
                        <span className="material-symbols-outlined text-[20px]">share</span>
                        <span className="text-sm tracking-wide">{t.share}</span>
                    </button>
                    <button
                        onClick={handleDownloadPdf}
                        disabled={isExporting}
                        className="flex-[2] bg-primary hover:bg-primary-dark text-white font-bold py-4 px-4 rounded-2xl flex items-center justify-center gap-2 transition shadow-[0_0_20px_rgba(6,182,212,0.25)] active:scale-95 hover:shadow-[0_0_30px_rgba(6,182,212,0.4)] border border-primary/20 disabled:opacity-70"
                    >
                        {isExporting ? (
                            <span className="material-symbols-outlined animate-spin text-[20px]">autorenew</span>
                        ) : (
                            <span className="material-symbols-outlined text-[20px]">picture_as_pdf</span>
                        )}
                        <span className="text-sm tracking-wide">{t.exportPDF}</span>
                    </button>
                </div>
            </div>

            {/* Hidden PDF Report Template */}
            <div className="fixed -left-[9999px] top-0 pointer-events-none opacity-0">
                <PrescriptionReport
                    ref={reportRef}
                    patientId={entry.id}
                    date={entry.date}
                    disease={capitalizedDisease}
                    severity={entry.severity}
                    confidence={90}
                    activeEye={entry.activeEye}
                    imageSrc=""
                    t={translations.en}
                />
            </div>
        </div>
    );
}

export default function HistoryDetailPage() {
    return (
        <div className="bg-background font-sans antialiased text-text-main h-screen flex justify-center w-full relative overflow-hidden transition-colors duration-300">
            <div className="absolute inset-0 z-0 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-slate-950 pointer-events-none opacity-0 dark:opacity-100 transition-opacity duration-300"></div>
            <Suspense fallback={
                <div className="flex items-center justify-center min-h-screen w-full">
                    <span className="material-symbols-outlined animate-spin text-primary text-4xl">autorenew</span>
                </div>
            }>
                <DetailContent />
            </Suspense>
        </div>
    );
}
