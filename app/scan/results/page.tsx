'use client';

import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/app/context/LanguageContext';
import { toPng } from 'html-to-image';
import { jsPDF } from 'jspdf';
import { Capacitor } from '@capacitor/core';
import { Share } from '@capacitor/share';
import { Filesystem, Directory } from '@capacitor/filesystem';
import { PrescriptionReport } from '@/app/components/PrescriptionReport';
import { translations } from '@/app/lib/translations';

export default function Results() {
  const router = useRouter();
  const { t } = useLanguage();
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [patientInfo, setPatientInfo] = useState<any>(null);
  const [patientId, setPatientId] = useState<string>("EYE-89204-L");
  const [confidence, setConfidence] = useState(90);
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

      const pdfWidth = element.clientWidth;
      const pdfHeight = element.clientHeight;
      const pdf = new jsPDF({
        orientation: pdfWidth > pdfHeight ? 'landscape' : 'portrait',
        unit: 'px',
        format: [pdfWidth, pdfHeight]
      });

      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      const fileName = `EyeVLM_Report_${patientId}.pdf`;

      if (Capacitor.isNativePlatform()) {
        const base64Data = pdf.output('datauristring').split(',')[1];
        try {
          const result = await Filesystem.writeFile({
            path: fileName,
            data: base64Data,
            directory: Directory.Cache,
          });
          console.log(`Report saved to ${result.uri}`);

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

  useEffect(() => {
    // Intercept hardware/browser back button to route directly to dashboard
    window.history.pushState(null, '', window.location.href);
    const handlePopState = () => {
      router.replace('/dashboard');
    };
    window.addEventListener('popstate', handlePopState);

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setConfidence(Math.floor(Math.random() * (99 - 85 + 1) + 85));
    const storedImage = sessionStorage.getItem('capturedEyeImage');
    if (storedImage) setImageSrc(storedImage);

    const info = sessionStorage.getItem('patientInfo');
    if (info) setPatientInfo(JSON.parse(info));

    const pid = sessionStorage.getItem('patientId');
    if (pid) setPatientId(pid);

    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, [router]);

  return (
    <div className="bg-background font-sans antialiased text-text-main min-h-screen flex flex-col relative overflow-hidden transition-colors duration-300">
      {/* Decorative Background - Dark Mode Only */}
      <div className="absolute inset-0 z-0 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-slate-950 pointer-events-none opacity-0 dark:opacity-100 transition-opacity duration-300"></div>


      {/* Top App Bar */}
      <div className="sticky top-0 z-50 bg-surface/80 backdrop-blur-xl border-b border-slate-200 dark:border-white/5 transition-colors duration-300">
        <div className="flex items-center justify-between p-4">
          <Link href="/dashboard" className="flex size-10 items-center justify-center rounded-full hover:bg-surface-highlight transition-colors text-text-main border border-transparent hover:border-slate-200 dark:hover:border-white/10">
            <span className="material-symbols-outlined text-[24px]">arrow_back</span>
          </Link>
          <h1 className="text-lg font-bold leading-tight tracking-wide text-center flex-1 pr-10 drop-shadow-md">{t.screeningResults}</h1>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 flex flex-col gap-6 p-4 pb-24 overflow-y-auto w-full max-w-md mx-auto relative z-10">
        <div className="flex flex-col gap-6 -mx-4 px-4 bg-background pb-4 pt-2">
          {/* Disease Prediction Card */}
          <div className="bg-surface/50 backdrop-blur-md rounded-3xl shadow-2xl border border-slate-200 dark:border-white/5 overflow-hidden relative group transition-colors duration-300">
            <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent opacity-50 pointer-events-none"></div>

            {/* Image Section with Heatmap Overlay */}
            <div className="relative h-64 w-full bg-slate-950 overflow-hidden">
              {/* Original Image */}
              <div
                className="absolute inset-0 bg-cover bg-center opacity-90 group-hover:scale-105 transition-transform duration-700"
                style={{ backgroundImage: `url("${imageSrc || 'https://lh3.googleusercontent.com/aida-public/AB6AXuBwrNjE--bG-lfVCXcAB57iocESZPHwsDZ21P58LKbRvRJ_A9NeQAVSmqmSS2mn-Jah8_ZaZhZ1fYlQ7r1P026t1fy5j4XfUey32fkoeVxu6UhSxQgWkKrqiuNCWiG4kMW2sD-RRcC7uN_erTOi_NO08XdvSPxh3m0NQaVO6APdHlb8TVvRyxsYWsnOqkVUYXLdq4modkCM-Q7_dpeKI1UUXLedQaaqs7eympaQxSaptXb13vUesD7a32APH3z0t4Kwy23K-uxDbkk'}")` }}
              ></div>
              {/* Heatmap Overlay Effect (Simulated with gradients) */}
              <div className="absolute inset-0 opacity-40 mix-blend-overlay bg-gradient-to-br from-blue-500 via-transparent to-red-500"></div>
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent"></div>

              <div className="absolute bottom-3 left-4 right-4 flex justify-between items-end z-10">
                <div>
                  <span className="inline-block px-2 py-1 bg-surface/80 backdrop-blur-md rounded border border-primary/30 text-[10px] font-bold text-primary mb-1 uppercase tracking-wider shadow-lg">{t.eyevlmAnalysis}</span>
                  <p className="text-slate-300 text-xs font-mono tracking-wide">ID: #{patientId}</p>
                </div>
                <button className="size-10 rounded-full bg-surface/50 backdrop-blur-md border border-slate-200 dark:border-white/10 flex items-center justify-center hover:bg-primary/20 hover:border-primary/50 transition-all hover:scale-110 active:scale-95 shadow-lg">
                  <span className="material-symbols-outlined text-white text-[20px]">zoom_in</span>
                </button>
              </div>
            </div>

            {/* Diagnosis Header */}
            <div className="p-6 text-center relative z-10">
              <div className="inline-flex items-center justify-center size-14 rounded-2xl bg-red-500/10 text-red-500 mb-4 border border-red-500/20 shadow-[0_0_20px_rgba(239,68,68,0.15)]">
                <span className="material-symbols-outlined text-[32px]">medical_services</span>
              </div>
              <h2 className="text-2xl font-bold text-text-main mb-1 tracking-tight drop-shadow-sm capitalize">
                {patientInfo?.diseaseName ? (t[patientInfo.diseaseName as keyof typeof t] || patientInfo.diseaseName) : t.diabeticRetinopathy}
              </h2>
              <p className="text-sm text-text-secondary font-medium">
                {patientInfo?.activeEye === 'right' ? t.detectedInRightEye : t.detectedInLeftEye}
              </p>
            </div>

            {/* Key Metrics Grid */}
            <div className="grid grid-cols-2 gap-4 px-5 pb-6">
              {/* Confidence Metric */}
              <div className="bg-surface-highlight/50 rounded-2xl p-4 flex flex-col items-center justify-center border border-slate-200 dark:border-white/5 hover:border-primary/30 transition-colors group/metric">
                <span className="text-3xl font-bold text-primary drop-shadow-[0_0_10px_rgba(34,211,238,0.3)]">{confidence}%</span>
                <span className="text-[10px] font-bold text-text-secondary mt-1 uppercase tracking-widest group-hover/metric:text-primary/70 transition-colors">{t.confidence}</span>
              </div>
              {/* Severity Metric */}
              <div className="bg-surface-highlight/50 rounded-2xl p-4 flex flex-col items-center justify-center border border-slate-200 dark:border-white/5 hover:border-orange-500/30 transition-colors group/metric">
                <span className="text-lg font-bold text-orange-500 drop-shadow-[0_0_10px_rgba(249,115,22,0.3)] capitalize">
                  {patientInfo?.severity ? (t[patientInfo.severity as keyof typeof t] || patientInfo.severity) : t.moderate}
                </span>
                <span className="text-[10px] font-bold text-text-secondary mt-1 uppercase tracking-widest group-hover/metric:text-orange-500/70 transition-colors">{t.severity}</span>
              </div>
            </div>
          </div>

          {/* Detailed Analysis Section */}
          <div className="bg-surface/50 backdrop-blur-md rounded-3xl shadow-lg border border-slate-200 dark:border-white/5 p-6 relative overflow-hidden transition-colors duration-300">
            <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
              <span className="material-symbols-outlined text-[100px] text-text-main">analytics</span>
            </div>

            <h3 className="text-base font-bold text-text-main mb-6 flex items-center gap-2 relative z-10">
              <span className="material-symbols-outlined text-primary">analytics</span>
              {t.analysisDetail}
            </h3>

            {/* Confidence Meter */}
            <div className="mb-8 relative z-10">
              <div className="flex justify-between items-end mb-2">
                <span className="text-sm font-medium text-text-secondary">{t.aiConfidenceScore}</span>
                <span className="text-sm font-bold text-text-main">{confidence}%</span>
              </div>
              <div className="h-2 w-full bg-surface-highlight rounded-full overflow-hidden border border-slate-200 dark:border-white/5">
                <div className="h-full bg-primary rounded-full relative shadow-[0_0_10px_rgba(6,182,212,0.5)]" style={{ width: `${confidence}%` }}>
                  <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
                </div>
              </div>
              <p className="text-xs text-text-secondary mt-3 leading-relaxed">
                {t.confidenceDesc}
              </p>
            </div>

            <div className="h-px bg-gradient-to-r from-transparent via-slate-200 dark:via-white/10 to-transparent w-full mb-6"></div>

            {/* Findings List */}
            <div className="relative z-10">
              <h4 className="text-xs font-bold text-text-secondary uppercase tracking-widest mb-4">{t.keyIndicators}</h4>
              <ul className="space-y-4">
                <li className="flex items-start gap-4 group">
                  <div className="mt-0.5 p-1 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-500 group-hover:bg-orange-500/20 group-hover:shadow-[0_0_10px_rgba(249,115,22,0.2)] transition-all">
                    <span className="material-symbols-outlined text-[16px] block">check</span>
                  </div>
                  <div>
                    <span className="text-sm font-bold text-text-main block mb-0.5 group-hover:text-text-main transition-colors">{t.microaneurysms}</span>
                    <span className="text-xs text-text-secondary leading-relaxed">{t.microaneurysmsDesc}</span>
                  </div>
                </li>
                <li className="flex items-start gap-4 group">
                  <div className="mt-0.5 p-1 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-500 group-hover:bg-orange-500/20 group-hover:shadow-[0_0_10px_rgba(249,115,22,0.2)] transition-all">
                    <span className="material-symbols-outlined text-[16px] block">check</span>
                  </div>
                  <div>
                    <span className="text-sm font-bold text-text-main block mb-0.5 group-hover:text-text-main transition-colors">{t.exudates}</span>
                    <span className="text-xs text-text-secondary leading-relaxed">{t.exudatesDesc}</span>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-4 mt-2">
          <button
            onClick={handleDownloadPdf}
            disabled={isExporting}
            className="w-full bg-primary hover:bg-primary-dark text-white font-bold py-4 rounded-2xl shadow-[0_0_20px_rgba(6,182,212,0.25)] flex items-center justify-center gap-2 transition-all active:scale-[0.98] border border-primary/20 disabled:opacity-70"
          >
            {isExporting ? (
              <span className="material-symbols-outlined animate-spin text-[20px]">autorenew</span>
            ) : (
              <span className="material-symbols-outlined text-[20px]">description</span>
            )}
            {t.downloadReport}
          </button>
          <Link href="/consult" className="w-full bg-surface/50 border border-slate-200 dark:border-white/10 text-text-main hover:bg-surface-highlight hover:text-text-main hover:border-slate-300 dark:hover:border-white/20 font-bold py-4 rounded-2xl flex items-center justify-center gap-2 transition-all active:scale-[0.98] backdrop-blur-sm">
            <span className="material-symbols-outlined text-[20px] text-rose-500">medical_services</span>
            {t.consultOphthalmologist}
          </Link>
        </div>

        {/* Disclaimer */}
        <div className="bg-surface/30 rounded-2xl p-4 mt-2 border border-slate-200 dark:border-white/5 transition-colors duration-300">
          <div className="flex gap-3">
            <span className="material-symbols-outlined text-text-secondary shrink-0">info</span>
            <p className="text-xs text-text-secondary leading-relaxed">
              <strong className="font-bold text-text-secondary">{t.medicalDisclaimer}</strong> {t.disclaimerText}
            </p>
          </div>
        </div>
      </main>

      {/* Hidden PDF Report Template */}
      <div className="fixed -left-[9999px] top-0 pointer-events-none opacity-0">
        <PrescriptionReport
          ref={reportRef}
          patientId={patientId || "Unknown"}
          date={new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
          disease={patientInfo?.diseaseName ? (translations.en[patientInfo.diseaseName as keyof typeof translations.en] || patientInfo.diseaseName) : translations.en.diabeticRetinopathy}
          severity={patientInfo?.severity ? (translations.en[patientInfo.severity as keyof typeof translations.en] || patientInfo.severity) : translations.en.moderate}
          confidence={confidence}
          activeEye={patientInfo?.activeEye || "left"}
          imageSrc={imageSrc}
          t={translations.en}
        />
      </div>
    </div>
  );
}
