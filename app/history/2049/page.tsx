'use client';

import { useState, useRef } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/app/context/LanguageContext';
import { toPng } from 'html-to-image';
import { jsPDF } from 'jspdf';
import { Capacitor } from '@capacitor/core';
import { Share } from '@capacitor/share';
import { Filesystem, Directory } from '@capacitor/filesystem';
import { PrescriptionReport } from '@/app/components/PrescriptionReport';
import { translations } from '@/app/lib/translations';

export default function DetailedReport() {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState<'original' | 'heatmap'>('original');
  const [isExporting, setIsExporting] = useState(false);
  const reportRef = useRef<HTMLDivElement>(null);

  const handleDownloadPdf = async () => {
    if (!reportRef.current) return;
    try {
      setIsExporting(true);
      const element = reportRef.current;
      const imgData = await toPng(element, {
        pixelRatio: 2,
        backgroundColor: document.documentElement.classList.contains('dark') ? '#0f172a' : '#ffffff',
      });

      // Instead of relying on a <canvas> dimensions, use a fixed A4 aspect ratio or client rect
      const pdfWidth = element.clientWidth;
      const pdfHeight = element.clientHeight;
      const pdf = new jsPDF({
        orientation: pdfWidth > pdfHeight ? 'landscape' : 'portrait',
        unit: 'px',
        format: [pdfWidth, pdfHeight]
      });

      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      const fileName = `EyeVLM_Report_8834_B.pdf`;

      if (Capacitor.isNativePlatform()) {
        const base64Data = pdf.output('datauristring').split(',')[1];
        try {
          const result = await Filesystem.writeFile({
            path: fileName,
            data: base64Data,
            directory: Directory.Cache,
          });
          console.log(`Report saved to ${result.uri}`);

          // Optionally share it right away natively
          await Share.share({
            title: 'EyeVLM Screening Report',
            url: result.uri,
          });
        } catch (e) {
          console.error("Filesystem error", e);
          alert("Could not save PDF to device.");
        }
      } else {
        pdf.save(fileName);
      }
    } catch (error) {
      console.error("Failed to generate PDF:", error);
    } finally {
      setIsExporting(false);
    }
  };

  const handleShare = async () => {
    try {
      const shareData = {
        title: 'EyeVLM Screening Report',
        text: `EyeVLM Screening Report for Patient ID: 8834-B\nDisease: Diabetic Retinopathy (Proliferative Stage)\nConfidence: 98%`,
      };

      if (Capacitor.isNativePlatform()) {
        await Share.share(shareData);
      } else if (navigator.share) {
        await navigator.share(shareData);
      } else {
        alert("Sharing is not supported on this browser/device.");
      }
    } catch (error) {
      console.error("Error sharing:", error);
    }
  };

  return (
    <div className="bg-background font-sans antialiased text-text-main min-h-screen flex justify-center w-full relative overflow-hidden transition-colors duration-300">
      {/* Decorative Background - Dark Mode Only */}
      <div className="absolute inset-0 z-0 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-slate-950 pointer-events-none opacity-0 dark:opacity-100 transition-opacity duration-300"></div>


      <div className="relative flex h-full w-full max-w-md flex-col bg-background shadow-2xl overflow-hidden pb-24 z-10 transition-colors duration-300">
        {/* Top App Bar */}
        <header className="flex items-center bg-surface/80 backdrop-blur-xl px-4 py-4 sticky top-0 z-20 shadow-lg border-b border-slate-200 dark:border-white/5 transition-colors duration-300">
          <Link href="/history" className="text-text-main flex size-10 shrink-0 items-center justify-center rounded-full hover:bg-surface-highlight transition border border-transparent hover:border-slate-200 dark:hover:border-white/10">
            <span className="material-symbols-outlined">arrow_back</span>
          </Link>
          <h1 className="text-text-main text-lg font-bold leading-tight flex-1 text-center pr-10 tracking-wide drop-shadow-md">{t.screeningId}</h1>
          <div className="absolute right-4 flex items-center">
            <button className="text-text-secondary hover:text-text-main flex size-10 shrink-0 items-center justify-center rounded-full hover:bg-surface-highlight transition">
              <span className="material-symbols-outlined">more_vert</span>
            </button>
          </div>
        </header>

        {/* Main Content Scrollable Area */}
        <main className="flex-1 overflow-y-auto">
          {/* Tab Switcher */}
          <div className="bg-surface/80 backdrop-blur-md pt-2 pb-0 px-6 rounded-b-3xl shadow-lg mb-6 border-b border-slate-200 dark:border-white/5 z-10 relative transition-colors duration-300">
            <div className="flex border-b border-slate-200 dark:border-white/5">
              <button
                onClick={() => setActiveTab('original')}
                className={`flex-1 pb-3 pt-2 font-bold text-sm tracking-widest uppercase text-center border-b-[3px] transition-all ${activeTab === 'original' ? 'text-primary border-primary shadow-[0_4px_10px_-4px_rgba(6,182,212,0.5)]' : 'text-text-secondary border-transparent hover:text-text-main'}`}
              >
                {t.original}
              </button>
              <button
                onClick={() => setActiveTab('heatmap')}
                className={`flex-1 pb-3 pt-2 font-bold text-sm tracking-widest uppercase text-center border-b-[3px] transition-all ${activeTab === 'heatmap' ? 'text-primary border-primary shadow-[0_4px_10px_-4px_rgba(6,182,212,0.5)]' : 'text-text-secondary border-transparent hover:text-text-main'}`}
              >
                {t.aiHeatmap}
              </button>
            </div>
          </div>

          {/* Image Area */}
          <div className="px-4 mb-8">
            <div className="relative w-full aspect-square rounded-3xl overflow-hidden bg-surface shadow-2xl border border-slate-200 dark:border-white/10 group transition-colors duration-300">
              <div
                className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105 opacity-90"
                style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuBRBZM5uzi3SDFMShD26k-qzbC3M1h4059G74A-QXq6nZcdkr66Q5aCuKVrn5bc9UVul8PzVMuNIGyO3gOuyPowu-OL7wezBDNLx1TYgEYes3rCvOAGi9ispB8EXntON5HkwNpap9uEbysoGsO9F6YQkqTDq9REvYupNQnH-ycIATx3AKRk_Rv-qqYA7vqeWohI1j8oqdBWH2CLWL90iksViPCVEe9aiI-q4pBdGkzl26y9CfCXN4AGXNtj0tjVDiZt-oUFLJO7HBA")' }}
              ></div>

              {/* Heatmap Overlay */}
              <div
                className={`absolute inset-0 bg-gradient-to-br from-red-500/40 via-transparent to-blue-500/20 mix-blend-overlay transition-opacity duration-500 ${activeTab === 'heatmap' ? 'opacity-100' : 'opacity-0'}`}
              ></div>
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-60 pointer-events-none"></div>

              {/* Live Confidence Badge overlay */}
              <div className="absolute top-4 right-4 bg-surface/60 backdrop-blur-md px-3 py-1.5 rounded-full shadow-lg flex items-center gap-2 border border-primary/30">
                <span className="material-symbols-outlined text-primary text-[18px] drop-shadow-[0_0_5px_rgba(34,211,238,0.8)]">verified</span>
                <span className="text-xs font-bold text-text-main tracking-wide">98% {t.confidence}</span>
              </div>
            </div>
            <p className="text-center text-xs text-text-secondary mt-3 font-mono tracking-wide">{t.capturedOn}</p>
          </div>

          {/* Diagnosis Header */}
          <div className="px-6 mb-8">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold text-text-main leading-tight tracking-tight drop-shadow-sm">{t.diabeticRetinopathy}</h2>
                <p className="text-sm text-text-secondary mt-1 font-medium">{t.proliferativeStage}</p>
              </div>
              <div className="flex h-10 shrink-0 items-center justify-center gap-x-2 rounded-xl bg-red-500/10 px-4 border border-red-500/20 shadow-[0_0_15px_rgba(239,68,68,0.15)]">
                <span className="material-symbols-outlined text-red-500 text-[20px]">warning</span>
                <p className="text-red-500 text-xs font-bold uppercase tracking-widest">{t.highRisk}</p>
              </div>
            </div>
          </div>

          {/* Patient Summary Card */}
          <div className="px-4 mb-6">
            <div className="bg-surface/40 backdrop-blur-md rounded-3xl p-6 shadow-lg border border-slate-200 dark:border-white/5 relative overflow-hidden transition-colors duration-300">
              <h3 className="text-xs font-bold uppercase tracking-widest text-text-secondary mb-5 flex items-center gap-2">
                <span className="material-symbols-outlined text-lg">person</span>
                {t.patientSummary}
              </h3>
              <div className="grid grid-cols-2 gap-y-6 gap-x-4">
                <div>
                  <p className="text-[10px] text-text-secondary mb-1 uppercase tracking-wider font-bold">{t.patientId}</p>
                  <p className="text-sm font-bold text-text-main font-mono">#8834-B</p>
                </div>
                <div>
                  <p className="text-[10px] text-text-secondary mb-1 uppercase tracking-wider font-bold">{t.demographics}</p>
                  <p className="text-sm font-bold text-text-main">58 yrs, {t.male}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-[10px] text-text-secondary mb-1 uppercase tracking-wider font-bold">{t.reportedSymptoms}</p>
                  <p className="text-sm font-medium text-text-secondary">{t.symptomsList}</p>
                </div>
              </div>
            </div>
          </div>

          {/* AI Interpretation Card */}
          <div className="px-4 mb-24">
            <div className="bg-surface/40 backdrop-blur-md rounded-3xl p-6 shadow-lg border border-primary/20 relative overflow-hidden transition-colors duration-300">
              {/* Decorative subtle gradient */}
              <div className="absolute top-0 right-0 w-40 h-40 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>

              <h3 className="text-xs font-bold uppercase tracking-widest text-primary mb-4 flex items-center gap-2">
                <span className="material-symbols-outlined text-lg">auto_awesome</span>
                {t.aiInterpretation}
              </h3>
              <p className="text-sm leading-relaxed text-text-secondary font-medium">
                {t.interpretationText}
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
      </div>

      {/* Hidden PDF Report Template */}
      <div className="fixed -left-[9999px] top-0 pointer-events-none opacity-0">
        <PrescriptionReport
          ref={reportRef}
          patientId="8834-B"
          date="Oct 24, 2023"
          disease={translations.en.diabeticRetinopathy}
          severity={translations.en.proliferativeStage}
          confidence={98}
          activeEye="right"
          imageSrc="https://lh3.googleusercontent.com/aida-public/AB6AXuBRBZM5uzi3SDFMShD26k-qzbC3M1h4059G74A-QXq6nZcdkr66Q5aCuKVrn5bc9UVul8PzVMuNIGyO3gOuyPowu-OL7wezBDNLx1TYgEYes3rCvOAGi9ispB8EXntON5HkwNpap9uEbysoGsO9F6YQkqTDq9REvYupNQnH-ycIATx3AKRk_Rv-qqYA7vqeWohI1j8oqdBWH2CLWL90iksViPCVEe9aiI-q4pBdGkzl26y9CfCXN4AGXNtj0tjVDiZt-oUFLJO7HBA"
          t={translations.en}
        />
      </div>
    </div>
  );
}
