'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useLanguage } from '@/app/context/LanguageContext';

export default function Analysis() {
  const router = useRouter();
  const { t } = useLanguage();
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const hasSubmittedRef = useRef(false);

  useEffect(() => {
    const storedImage = sessionStorage.getItem('capturedEyeImage');
    const activeEye = sessionStorage.getItem('activeEye');
    const patientInfoStr = sessionStorage.getItem('patientInfo');
    const symptomAnswersStr = sessionStorage.getItem('symptomAnswers');

    if (storedImage) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setImageSrc(storedImage);
    }

    const patientInfo = patientInfoStr ? JSON.parse(patientInfoStr) : null;
    const symptomAnswers = symptomAnswersStr ? JSON.parse(symptomAnswersStr) : {};

    const submitData = async () => {
      try {
        const formData = new FormData();
        const uniqueHash = Math.random().toString(36).substring(2, 7).toUpperCase();
        const eyeSuffix = activeEye === 'right' ? 'R' : 'L';
        const patientId = `EYE-${uniqueHash}-${eyeSuffix}`;
        sessionStorage.setItem('patientId', patientId);

        // Generate confidence score here so it can be persisted
        const generatedConfidence = Math.floor(Math.random() * (99 - 85 + 1) + 85);
        sessionStorage.setItem('generatedConfidence', generatedConfidence.toString());

        // Save to history in localStorage
        const historyEntry = {
          id: patientId,
          date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
          timestamp: Date.now(),
          name: patientInfo?.name || '',
          age: patientInfo?.age || '',
          gender: patientInfo?.gender || '',
          activeEye: activeEye || 'left',
          diseaseName: patientInfo?.diseaseName || 'others',
          severity: patientInfo?.severity || 'mild',
          diabetes: patientInfo?.diabetes || false,
          hypertension: patientInfo?.hypertension || false,
          familyHistory: patientInfo?.familyHistory || false,
          confidence: generatedConfidence,
        };
        // Store image separately by ID to avoid bloating the history list
        if (storedImage) {
          localStorage.setItem(`scanImage_${patientId}`, storedImage);
        }
        const prevHistoryStr = localStorage.getItem('scanHistory');
        const prevHistory = prevHistoryStr ? JSON.parse(prevHistoryStr) : [];
        prevHistory.unshift(historyEntry); // newest first
        localStorage.setItem('scanHistory', JSON.stringify(prevHistory.slice(0, 50))); // keep last 50

        formData.append("Patient_ID", patientId);
        formData.append("Patient_Name", patientInfo?.name || "");
        formData.append("Age", patientInfo?.age || "0");
        formData.append("Gender", patientInfo?.gender === "male" ? "0" : "1");
        formData.append("Eye_Side", activeEye === "left" ? "0" : "1");

        // Symptom mapping according to the questions list
        formData.append("Vision_Blurred_Gradual", symptomAnswers[1] === "Yes" ? "1" : "0");
        formData.append("Vision_Halos_Night", symptomAnswers[2] === "Yes" ? "1" : "0");
        formData.append("Vision_Sudden_Loss", symptomAnswers[4] === "Yes" ? "1" : "0");
        formData.append("Vision_Colors_Faded", symptomAnswers[5] === "Yes" ? "1" : "0");
        formData.append("Vision_Night_Blindness", symptomAnswers[16] === "Yes" ? "1" : "0");

        formData.append("Symptom_Eye_Dryness", symptomAnswers[17] === "Yes" ? "1" : "0");
        formData.append("Symptom_Gritty_Sensation", symptomAnswers[6] === "Yes" ? "1" : "0");
        formData.append("Symptom_Deep_Eye_Pain", symptomAnswers[7] === "Yes" ? "1" : "0");
        formData.append("Symptom_Photophobia", symptomAnswers[8] === "Yes" ? "1" : "0");
        formData.append("Symptom_Surface_Pain", symptomAnswers[9] === "Yes" ? "1" : "0");

        formData.append("Sign_Redness", symptomAnswers[10] === "Yes" ? "1" : "0");
        formData.append("Sign_Fleshy_Growth", symptomAnswers[11] === "Yes" ? "1" : "0");
        formData.append("Sign_Eye_Discharge", symptomAnswers[12] === "Yes" ? "1" : "0");
        formData.append("Sign_Cornea_White_Spot", symptomAnswers[13] === "Yes" ? "1" : "0");
        formData.append("Sign_Drooping_Eyelid", symptomAnswers[3] === "Yes" ? "1" : "0");

        formData.append("History_Diabetes", patientInfo?.diabetes ? "1" : "0");
        formData.append("History_Hypertension", patientInfo?.hypertension ? "1" : "0");
        formData.append("History_Autoimmune_Disease", symptomAnswers[15] === "Yes" ? "1" : "0");
        formData.append("History_Contact_Lens", symptomAnswers[14] === "Yes" ? "1" : "0");
        formData.append("History_Family_Eye_Disease", patientInfo?.familyHistory ? "1" : "0");

        formData.append("Symptom_Duration_Days", patientInfo?.durationDays?.toString() || "0");

        let diagnosisLabel = patientInfo?.diseaseName || "Normal";
        if (diagnosisLabel && diagnosisLabel !== "Normal") {
          diagnosisLabel = diagnosisLabel.charAt(0).toUpperCase() + diagnosisLabel.slice(1);
        }
        formData.append("Diagnosis_Label", diagnosisLabel);

        let severityNum = "0";
        if (patientInfo?.severity === 'mild') severityNum = "1";
        if (patientInfo?.severity === 'moderate') severityNum = "2";
        if (patientInfo?.severity === 'severe') severityNum = "3";
        formData.append("Severity_Level", severityNum);

        // Convert base64 dataURL to Blob
        if (storedImage && storedImage.startsWith('data:image')) {
          const res = await fetch(storedImage);
          const blob = await res.blob();
          const imgFilename = `${patientId}_${diagnosisLabel.toUpperCase()}.jpg`;
          formData.append("Image_Path", blob, imgFilename);
        }

        // We aren't awaiting the response here so it doesn't block UI navigation,
        // but it will fire off the submission while the user sees the analysis UI.
        console.log("Submitting webhook...");

        const saveOffline = () => {
          console.log("Device offline or submission failed. Saving to localStorage.");
          const pendingSyncsStr = localStorage.getItem('offlinePendingSyncs');
          const pendingSyncs = pendingSyncsStr ? JSON.parse(pendingSyncsStr) : [];
          pendingSyncs.push({
            patientId,
            patientInfo,
            symptomAnswers,
            activeEye,
            imageSrc: storedImage // Save the base64 string
          });
          localStorage.setItem('offlinePendingSyncs', JSON.stringify(pendingSyncs));
        };

        if (navigator.onLine) {
          fetch("https://n8n.vps.safone.dev/webhook/eyevlm-data", {
            method: "POST",
            body: formData,
          }).then(response => {
            console.log("Webhook response status:", response.status);
            if (!response.ok) {
              saveOffline();
            }
          }).catch(err => {
            console.error("Webhook submission error:", err);
            saveOffline();
          });
        } else {
          saveOffline();
        }

      } catch (error) {
        console.error("Error preparing form data:", error);
      }
    };

    if (!hasSubmittedRef.current) {
      hasSubmittedRef.current = true;
      submitData();
    }

    // Navigate to results page after analysis dummy timer
    const timer = setTimeout(() => {
      router.replace('/scan/results');
    }, 4500); // slightly longer to ensure requests have time to leave

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="bg-background min-h-screen flex flex-col justify-between overflow-x-hidden text-text-main relative overflow-hidden transition-colors duration-300">
      {/* Decorative Background - Dark Mode Only */}
      <div className="absolute inset-0 z-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-slate-950 pointer-events-none opacity-0 dark:opacity-100 transition-opacity duration-300"></div>


      {/* Top Navigation */}
      <div className="flex items-center p-4 pb-2 justify-between w-full relative z-20">
        <Link href="/scan/symptoms" className="flex size-12 shrink-0 items-center justify-center rounded-full hover:bg-surface-highlight transition-colors text-text-main">
          <span className="material-symbols-outlined" style={{ fontSize: '24px' }}>arrow_back</span>
        </Link>
        <h2 className="text-lg font-bold leading-tight tracking-wide flex-1 text-center pr-12 text-text-main drop-shadow-md">{t.analysisInProgress}</h2>
      </div>

      {/* Main Content Area */}
      <div className="flex flex-col flex-grow items-center justify-center px-6 py-6 w-full max-w-md mx-auto relative z-10">
        {/* Central Visualization */}
        <div className="relative flex flex-col items-center justify-center mb-10 w-full">
          {/* Pulsing Rings Effect (Static Representation) */}
          <div className="absolute w-64 h-64 rounded-full border border-primary/20 bg-primary/5 transform scale-125 animate-pulse shadow-[0_0_50px_rgba(6,182,212,0.1)]"></div>
          <div className="absolute w-52 h-52 rounded-full border border-primary/30 bg-primary/10 transform scale-110 animate-pulse delay-75 shadow-[0_0_30px_rgba(6,182,212,0.15)]"></div>

          {/* Central Image Container */}
          <div className="relative z-10 w-40 h-40 rounded-full bg-surface shadow-2xl flex items-center justify-center border-2 border-primary/50 overflow-hidden">
            {/* Eye Scanning Graphic Overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/30 to-transparent w-full h-full z-20 animate-[scan-vertical_2s_ease-in-out_infinite]"></div>
            <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-primary shadow-[0_0_15px_rgba(34,211,238,0.8)] z-30 w-full animate-[scan-line_2s_ease-in-out_infinite]"></div>

            {/* User's Eye Image */}
            <div
              className="w-full h-full bg-cover bg-center opacity-80"
              style={{ backgroundImage: `url("${imageSrc || 'https://lh3.googleusercontent.com/aida-public/AB6AXuCJIAB4Lg62y0dGmLErDDZhvi5Z2MjwpGX5ZSgVTmJURWguoxOuqiMu1-cFGRIYh6XRlnmJPIC33iwLVpbUYiFs0tal7H9imJEN6I3o-qnq3PZGov5ihWczjehJkiv0xV0nfbG-neGiGShJ-GnxQS-Xn0fhYwrysQf9JU2ADO4y6DA3py868mgPiHhqfAlpzmSKJVYvRKovMwPXkYXV65xH3zkICQ8r3gw4Rvwt9eeUR7LjIWnuPjXcONYSb7tADSb4UF9d355TcZk'}")` }}
            ></div>
          </div>

          {/* Status Icons */}
          <div className="absolute -bottom-6 bg-surface/80 backdrop-blur-md px-5 py-2 rounded-full shadow-[0_0_20px_rgba(0,0,0,0.5)] border border-primary/30 flex items-center gap-2 z-20">
            <span className="material-symbols-outlined text-primary text-sm animate-spin">sync</span>
            <span className="text-xs font-bold text-primary tracking-wide uppercase">{t.aiProcessing}</span>
          </div>
        </div>

        {/* Text Content */}
        <div className="flex flex-col items-center gap-3 text-center w-full mt-6">
          <h1 className="text-2xl font-bold leading-tight tracking-tight text-text-main drop-shadow-sm">{t.analyzingEye}</h1>
          <p className="text-text-secondary text-sm font-normal leading-relaxed max-w-[280px]">
            {t.waitProcessing}
          </p>
        </div>
      </div>

      {/* Bottom Status Area */}
      <div className="w-full px-6 pb-10 max-w-md mx-auto relative z-10">
        {/* Progress Indicator */}
        <div className="flex flex-col gap-3">
          <div className="flex justify-between items-end mb-1">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-primary" style={{ fontSize: '20px' }}>smart_toy</span>
              <p className="text-text-main text-sm font-bold tracking-wide">{t.eyevlmEngine}</p>
            </div>
            <span className="text-primary font-bold text-sm">65%</span>
          </div>
          <div className="w-full h-2 bg-surface-highlight rounded-full overflow-hidden border border-slate-200 dark:border-white/5">
            <div className="bg-primary h-full rounded-full w-[65%] shadow-[0_0_15px_rgba(6,182,212,0.6)] animate-[progress_2s_ease-out_forwards]"></div>
          </div>
          <div className="flex justify-between items-start mt-1">
            <p className="text-text-secondary text-xs font-medium uppercase tracking-wider">{t.scanningRetinal}</p>
            <p className="text-text-secondary text-xs font-medium uppercase tracking-wider">{t.secRemaining}</p>
          </div>
        </div>

        {/* Info Card */}
        <div className="mt-8 bg-surface/50 backdrop-blur-md rounded-2xl p-5 border border-primary/20 flex items-start gap-4 shadow-lg">
          <div className="p-2 bg-primary/10 rounded-lg border border-primary/20 shrink-0">
            <span className="material-symbols-outlined text-primary text-[20px]">lightbulb</span>
          </div>
          <div className="flex flex-col gap-1">
            <p className="text-xs font-bold text-primary uppercase tracking-wider mb-1">{t.didYouKnow}</p>
            <p className="text-xs text-text-secondary leading-relaxed font-medium">
              {t.didYouKnowDesc}
            </p>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes scan-vertical {
          0%, 100% { transform: translateY(-100%); opacity: 0; }
          50% { transform: translateY(0); opacity: 1; }
        }
        @keyframes scan-line {
          0%, 100% { top: 0%; opacity: 0; }
          50% { top: 50%; opacity: 1; }
          100% { top: 100%; opacity: 0; }
        }
      `}</style>
    </div>
  );
}
