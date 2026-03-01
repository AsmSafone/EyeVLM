'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useLanguage } from '@/app/context/LanguageContext';
import CustomSelect from '@/components/CustomSelect';

export default function PatientInfo() {
  const { t } = useLanguage();

  const [gender, setGender] = useState('');
  const [diseaseName, setDiseaseName] = useState('');
  const [severity, setSeverity] = useState('');

  const genderOptions = [
    { value: 'male', label: t.male },
    { value: 'female', label: t.female }
  ];

  const diseaseOptions = [
    { value: 'cataracts', label: t.cataracts },
    { value: 'pterygium', label: t.pterygium },
    { value: 'conjunctivitis', label: t.conjunctivitis },
    { value: 'keratitis', label: t.keratitis },
    { value: 'uveitis', label: t.uveitis },
    { value: 'ptosis', label: t.ptosis },
    { value: 'others', label: t.others }
  ];

  const severityOptions = [
    { value: 'mild', label: t.mild },
    { value: 'moderate', label: t.moderate },
    { value: 'severe', label: t.severe }
  ];

  return (
    <div className="bg-background font-sans text-text-main min-h-screen flex flex-col relative overflow-hidden transition-colors duration-300">
      {/* Decorative Background - Dark Mode Only */}
      <div className="absolute inset-0 z-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-cyan-900/20 via-slate-950 to-slate-950 pointer-events-none opacity-0 dark:opacity-100 transition-opacity duration-300"></div>

      {/* Top Navigation */}
      <div className="sticky top-0 z-50 flex items-center bg-surface/80 backdrop-blur-xl p-4 pb-2 justify-between border-b border-slate-200 dark:border-white/5 transition-colors duration-300">
        <Link href="/scan" className="text-text-main flex size-12 shrink-0 items-center justify-center rounded-full hover:bg-surface-highlight transition-colors border border-transparent hover:border-slate-200 dark:hover:border-white/10">
          <span className="material-symbols-outlined text-2xl">arrow_back</span>
        </Link>
        <h2 className="text-text-main text-lg font-bold leading-tight tracking-wide flex-1 text-center shadow-black drop-shadow-sm">{t.newPatientScan}</h2>
        <Link href="/dashboard" className="flex h-12 items-center justify-end px-2">
          <span className="text-text-secondary hover:text-text-main transition-colors text-base font-bold leading-normal tracking-wide shrink-0">{t.cancel}</span>
        </Link>
      </div>

      {/* Progress */}
      <div className="flex flex-col gap-3 px-6 py-4 relative z-10">
        <div className="flex gap-6 justify-between items-end">
          <p className="text-text-secondary text-sm font-medium leading-normal uppercase tracking-wider">{t.step1of3}</p>
          <p className="text-primary text-sm font-bold leading-normal uppercase tracking-wider">{t.patientDetails}</p>
        </div>
        <div className="rounded-full bg-surface-highlight h-1.5 w-full overflow-hidden border border-slate-200 dark:border-white/5">
          <div className="h-full bg-primary rounded-full transition-all duration-300 shadow-[0_0_10px_rgba(6,182,212,0.5)]" style={{ width: '33%' }}></div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col px-6 pb-32 overflow-y-auto relative z-10">
        <h1 className="text-text-main tracking-tight text-[32px] font-bold leading-tight text-left pb-3 pt-4">{t.patientInformation}</h1>
        <p className="text-text-secondary text-base font-normal leading-normal pb-8">{t.enterDetails}</p>

        {/* Form Fields */}
        <div className="flex flex-col gap-6">
          {/* Name Input */}
          <label className="flex flex-col w-full group">
            <span className="text-text-secondary text-sm font-bold uppercase tracking-wider pb-2 ml-1 group-focus-within:text-primary transition-colors">{t.patientName}</span>
            <div className="relative">
              <input
                className="w-full rounded-2xl border border-slate-200 dark:border-white/10 bg-surface/50 text-text-main h-14 pl-4 pr-4 placeholder:text-text-secondary/50 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary/50 transition-all text-lg shadow-inner"
                placeholder="John Doe"
                defaultValue=""
              />
            </div>
          </label>

          {/* Age & Gender Grid */}
          <div className="grid grid-cols-2 gap-4">
            {/* Age */}
            <label className="flex flex-col w-full group">
              <span className="text-text-secondary text-sm font-bold uppercase tracking-wider pb-2 ml-1 group-focus-within:text-primary transition-colors">{t.age}</span>
              <div className="relative">
                <input
                  type="number"
                  min="0"
                  max="120"
                  className="w-full rounded-2xl border border-slate-200 dark:border-white/10 bg-surface/50 text-text-main h-14 pl-4 pr-4 placeholder:text-text-secondary/50 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary/50 transition-all text-lg shadow-inner"
                  placeholder="30"
                />
              </div>
            </label>

            {/* Gender */}
            <label className="flex flex-col w-full group">
              <span className="text-text-secondary text-sm font-bold uppercase tracking-wider pb-2 ml-1 group-focus-within:text-primary transition-colors">{t.gender}</span>
              <CustomSelect
                options={genderOptions}
                value={gender}
                onChange={setGender}
                placeholder={t.select}
              />
            </label>
          </div>

          {/* Disease Name & Severity Grid */}
          <div className="grid grid-cols-2 gap-4 mt-2">
            {/* Disease Name */}
            <label className="flex flex-col w-full group">
              <span className="text-text-secondary text-sm font-bold uppercase tracking-wider pb-2 ml-1 group-focus-within:text-primary transition-colors">{t.diseaseName}</span>
              <CustomSelect
                options={diseaseOptions}
                value={diseaseName}
                onChange={setDiseaseName}
                placeholder={t.select}
                className="z-40"
              />
            </label>

            {/* Severity Level */}
            <label className="flex flex-col w-full group">
              <span className="text-text-secondary text-sm font-bold uppercase tracking-wider pb-2 ml-1 group-focus-within:text-primary transition-colors">{t.severityLevel}</span>
              <CustomSelect
                options={severityOptions}
                value={severity}
                onChange={setSeverity}
                placeholder={t.select}
                className="z-30"
              />
            </label>
          </div>

          {/* Medical Conditions */}
          <div className="flex flex-col gap-4 pt-4">
            <span className="text-text-main text-lg font-bold leading-normal tracking-tight">{t.medicalHistory}</span>

            {/* Diabetes Toggle */}
            <div className="flex items-center justify-between p-4 bg-surface/40 backdrop-blur-md rounded-2xl border border-slate-200 dark:border-white/5 shadow-sm hover:border-slate-300 dark:hover:border-white/10 transition-colors">
              <div className="flex items-center gap-4">
                <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-blue-500/10 text-blue-500 dark:text-blue-400 border border-blue-500/20">
                  <span className="material-symbols-outlined">water_drop</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-text-main text-base font-bold">{t.diabetes}</span>
                  <span className="text-text-secondary text-xs">{t.type1or2}</span>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" value="" className="sr-only peer" />
                <div className="w-14 h-7 bg-slate-300 dark:bg-slate-700 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary/50 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-primary"></div>
              </label>
            </div>

            {/* Hypertension Toggle */}
            <div className="flex items-center justify-between p-4 bg-surface/40 backdrop-blur-md rounded-2xl border border-slate-200 dark:border-white/5 shadow-sm hover:border-slate-300 dark:hover:border-white/10 transition-colors">
              <div className="flex items-center gap-4">
                <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-red-500/10 text-red-500 dark:text-red-400 border border-red-500/20">
                  <span className="material-symbols-outlined">cardiology</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-text-main text-base font-bold">{t.hypertension}</span>
                  <span className="text-text-secondary text-xs">{t.highBloodPressure}</span>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" value="" className="sr-only peer" defaultChecked />
                <div className="w-14 h-7 bg-slate-300 dark:bg-slate-700 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary/50 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-primary"></div>
              </label>
            </div>

          </div>

          {/* Duration of Symptoms */}
          <div className="flex flex-col gap-4 pt-4">
            <span className="text-text-main text-lg font-bold leading-normal tracking-tight">{t.durationOfSymptoms}</span>
            <div className="grid grid-cols-3 gap-3">
              <label className="cursor-pointer group">
                <input type="radio" name="duration" className="peer sr-only" />
                <div className="rounded-2xl border border-slate-200 dark:border-white/10 bg-surface/50 p-4 text-center hover:bg-surface-highlight peer-checked:border-primary peer-checked:bg-primary/10 peer-checked:text-primary transition-all h-full flex flex-col items-center justify-center gap-1 shadow-sm">
                  <span className="text-xs font-medium text-text-secondary group-hover:text-text-main peer-checked:text-primary/80">{t.lessThan}</span>
                  <span className="text-lg font-bold text-text-main peer-checked:text-primary">{t.oneWeek}</span>
                </div>
              </label>
              <label className="cursor-pointer group">
                <input type="radio" name="duration" className="peer sr-only" defaultChecked />
                <div className="rounded-2xl border border-slate-200 dark:border-white/10 bg-surface/50 p-4 text-center hover:bg-surface-highlight peer-checked:border-primary peer-checked:bg-primary/10 peer-checked:text-primary transition-all h-full flex flex-col items-center justify-center gap-1 shadow-sm">
                  <span className="text-xs font-medium text-text-secondary group-hover:text-text-main peer-checked:text-primary/80">{t.oneToFour}</span>
                  <span className="text-lg font-bold text-text-main peer-checked:text-primary">{t.weeks}</span>
                </div>
              </label>
              <label className="cursor-pointer group">
                <input type="radio" name="duration" className="peer sr-only" />
                <div className="rounded-2xl border border-slate-200 dark:border-white/10 bg-surface/50 p-4 text-center hover:bg-surface-highlight peer-checked:border-primary peer-checked:bg-primary/10 peer-checked:text-primary transition-all h-full flex flex-col items-center justify-center gap-1 shadow-sm">
                  <span className="text-xs font-medium text-text-secondary group-hover:text-text-main peer-checked:text-primary/80">{t.moreThan}</span>
                  <span className="text-lg font-bold text-text-main peer-checked:text-primary">{t.oneMonth}</span>
                </div>
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Action Bar */}
      <div className="fixed bottom-0 w-full bg-surface/90 backdrop-blur-xl border-t border-slate-200 dark:border-white/5 p-4 pb-8 safe-area-pb z-50 transition-colors duration-300">
        <Link href="/scan/symptoms" className="w-full h-14 bg-primary hover:bg-primary-dark text-white rounded-2xl text-lg font-bold shadow-[0_0_20px_rgba(6,182,212,0.3)] transition-all active:scale-[0.98] flex items-center justify-center gap-2 hover:shadow-[0_0_30px_rgba(6,182,212,0.5)]">
          {t.nextStep}
          <span className="material-symbols-outlined">arrow_forward</span>
        </Link>
      </div>
    </div>
  );
}
