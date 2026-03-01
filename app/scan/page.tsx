'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import BottomNav from '@/components/BottomNav';
import { useLanguage } from '@/app/context/LanguageContext';

export default function Scan() {
  const { t } = useLanguage();
  const router = useRouter();
  const [activeEye, setActiveEye] = useState<'left' | 'right'>('left');
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const startCamera = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          facingMode: 'environment',
          width: { ideal: 1920 },
          height: { ideal: 1080 }
        } 
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      streamRef.current = stream;
      setHasPermission(true);
      setCameraError(null);
    } catch (err) {
      console.error("Error accessing camera:", err);
      setHasPermission(false);
      setCameraError('Camera access denied or not available.');
    }
  }, []);

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
  }, []);

  useEffect(() => {
    startCamera();
    return () => {
      stopCamera();
    };
  }, [startCamera, stopCamera]);

  const handleCapture = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      
      // Set canvas dimensions to match video
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      const context = canvas.getContext('2d');
      if (context) {
        // Draw video frame to canvas
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        
        // Convert to data URL
        const imageDataUrl = canvas.toDataURL('image/jpeg', 0.9);
        
        // Save to session storage (or context in a real app)
        sessionStorage.setItem('capturedEyeImage', imageDataUrl);
        sessionStorage.setItem('activeEye', activeEye);
        
        // Navigate to next step
        router.push('/scan/patient-info');
      }
    }
  };

  const handleGalleryClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        if (result) {
          sessionStorage.setItem('capturedEyeImage', result);
          sessionStorage.setItem('activeEye', activeEye);
          router.push('/scan/patient-info');
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="bg-background font-sans antialiased text-text-main h-screen flex flex-col overflow-hidden relative transition-colors duration-300">
      {/* Decorative Background - Dark Mode Only */}
      <div className="absolute inset-0 z-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-slate-950 pointer-events-none opacity-0 dark:opacity-100 transition-opacity duration-300"></div>
      <div className="absolute top-0 left-0 w-full h-full bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-5 pointer-events-none"></div>

      {/* Header */}
      <header className="absolute top-0 left-0 right-0 z-30 flex items-center justify-between px-4 py-4 bg-gradient-to-b from-background/90 dark:from-slate-950/90 to-transparent pt-safe backdrop-blur-[2px] transition-colors duration-300">
        <button onClick={() => router.push('/dashboard')} className="flex items-center justify-center w-10 h-10 rounded-full bg-surface/40 backdrop-blur-md border border-slate-200 dark:border-white/10 hover:bg-surface-highlight transition-colors text-text-main hover:border-primary/30">
          <span className="material-symbols-outlined text-2xl">arrow_back</span>
        </button>
        <h1 className="text-lg font-bold text-text-main tracking-wide drop-shadow-md bg-surface/30 px-3 py-1 rounded-full border border-slate-200 dark:border-white/5 backdrop-blur-sm">{t.captureEyeImage}</h1>
        <button className="flex items-center justify-center w-10 h-10 rounded-full bg-surface/40 backdrop-blur-md border border-slate-200 dark:border-white/10 hover:bg-surface-highlight transition-colors text-text-main hover:border-primary/30">
          <span className="material-symbols-outlined text-2xl">help</span>
        </button>
      </header>

      {/* Main Content Area: Viewfinder */}
      <main className="relative flex-1 flex flex-col w-full bg-black overflow-hidden group/viewfinder">
        {/* Live Camera Feed */}
        {hasPermission === false ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-900 text-white p-6 text-center">
            <span className="material-symbols-outlined text-4xl mb-4 text-red-500">videocam_off</span>
            <p className="text-lg font-bold mb-2">{t.cameraAccessDenied || "Camera Access Denied"}</p>
            <p className="text-sm text-slate-400">{cameraError || "Please enable camera access in your browser settings to use this feature."}</p>
            <button 
              onClick={startCamera}
              className="mt-6 px-6 py-2 bg-primary text-white rounded-full font-bold hover:bg-primary-dark transition-colors"
            >
              Retry
            </button>
          </div>
        ) : (
          <video 
            ref={videoRef}
            autoPlay 
            playsInline 
            muted 
            className="absolute inset-0 w-full h-full object-cover"
          />
        )}
        
        {/* Hidden Canvas for capture */}
        <canvas ref={canvasRef} className="hidden" />
        
        {/* Hidden File Input for Gallery */}
        <input 
          type="file" 
          ref={fileInputRef} 
          accept="image/*" 
          className="hidden" 
          onChange={handleFileChange} 
        />
        
        {/* Grid Overlay */}
        <div className="absolute inset-0 z-0 opacity-20 pointer-events-none" 
             style={{ backgroundImage: 'linear-gradient(rgba(6, 182, 212, 0.2) 1px, transparent 1px), linear-gradient(90deg, rgba(6, 182, 212, 0.2) 1px, transparent 1px)', backgroundSize: '40px 40px' }}>
        </div>
        
        {/* Vignette Effect */}
        <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,transparent_30%,rgba(2,6,23,0.8)_100%)]"></div>

        {/* Eye Selection Toggle (Floating at top) */}
        <div className="relative z-20 w-full px-4 pt-20 flex justify-center">
          <div className="flex h-12 bg-surface/60 backdrop-blur-xl rounded-2xl p-1 shadow-lg border border-primary/20 w-full max-w-xs">
            <label className="flex-1 cursor-pointer relative group">
              <input 
                type="radio" 
                name="eye-side" 
                value="left" 
                className="peer sr-only" 
                checked={activeEye === 'left'}
                onChange={() => setActiveEye('left')}
              />
              <div className="w-full h-full flex items-center justify-center rounded-xl text-sm font-bold tracking-wide text-text-secondary peer-checked:bg-primary/20 peer-checked:text-primary peer-checked:border peer-checked:border-primary/50 transition-all peer-checked:shadow-[0_0_10px_rgba(6,182,212,0.2)]">
                {t.leftEye}
              </div>
            </label>
            <label className="flex-1 cursor-pointer relative group">
              <input 
                type="radio" 
                name="eye-side" 
                value="right" 
                className="peer sr-only" 
                checked={activeEye === 'right'}
                onChange={() => setActiveEye('right')}
              />
              <div className="w-full h-full flex items-center justify-center rounded-xl text-sm font-bold tracking-wide text-text-secondary peer-checked:bg-primary/20 peer-checked:text-primary peer-checked:border peer-checked:border-primary/50 transition-all peer-checked:shadow-[0_0_10px_rgba(6,182,212,0.2)]">
                {t.rightEye}
              </div>
            </label>
          </div>
        </div>

        {/* Alignment Overlay */}
        <div className="absolute inset-0 pointer-events-none flex flex-col items-center justify-center z-10">
          {/* The dark overlay around the clear circle */}
          <div className="absolute inset-0 shadow-[0_0_0_9999px_rgba(2,6,23,0.85)] opacity-100"></div>
          
          {/* The clear circle guide (Target area) */}
          <div className="relative w-72 h-72 rounded-full border border-primary/30 box-content z-10 flex items-center justify-center shadow-[0_0_50px_rgba(6,182,212,0.1)_inset]">
            {/* Animated scanning ring */}
            <div className="absolute inset-0 rounded-full border-2 border-primary/50 border-t-transparent animate-[spin_4s_linear_infinite] shadow-[0_0_15px_rgba(6,182,212,0.3)]"></div>
            <div className="absolute inset-0 rounded-full border-2 border-primary/30 border-b-transparent animate-[spin_4s_linear_infinite_reverse]"></div>
            
            {/* Crosshair center */}
            <div className="w-8 h-8 text-primary/80 opacity-80 relative">
              <div className="absolute top-1/2 left-0 w-full h-0.5 bg-primary/50 -translate-y-1/2 shadow-[0_0_5px_rgba(6,182,212,0.8)]"></div>
              <div className="absolute top-0 left-1/2 h-full w-0.5 bg-primary/50 -translate-x-1/2 shadow-[0_0_5px_rgba(6,182,212,0.8)]"></div>
            </div>
            
            {/* Dynamic Quality Indicator (Simulated) */}
            <div className="absolute -bottom-20 bg-surface/80 backdrop-blur-md px-4 py-2 rounded-full border border-primary/30 flex items-center gap-2 shadow-[0_0_15px_rgba(34,211,238,0.2)]">
              <span className="material-symbols-outlined text-primary text-lg animate-pulse">check_circle</span>
              <span className="text-primary-dark dark:text-cyan-100 text-sm font-bold tracking-wide uppercase">{t.imageQualityGood}</span>
            </div>
          </div>
        </div>

        {/* Bottom Controls Area (Floating over camera) */}
        <div className="mt-auto relative z-20 w-full pb-28 pt-12 px-6 flex flex-col items-center justify-end bg-gradient-to-t from-background via-background/90 dark:from-slate-950 dark:via-slate-950/90 to-transparent transition-colors duration-300">
          <p className="text-text-main/90 text-sm font-medium text-center mb-8 drop-shadow-md tracking-wide bg-surface/60 backdrop-blur-md px-4 py-1.5 rounded-full border border-primary/20">
            {t.alignPupil}
          </p>
          
          <div className="w-full flex items-center justify-between max-w-sm px-4">
            {/* Gallery Button */}
            <button 
              onClick={handleGalleryClick}
              className="flex flex-col items-center justify-center gap-1 group"
            >
              <div className="w-12 h-12 rounded-full bg-surface/50 backdrop-blur-md flex items-center justify-center group-active:bg-surface-highlight transition-all border border-slate-200 dark:border-white/10 group-hover:border-primary/50 group-hover:text-primary text-text-secondary group-hover:shadow-[0_0_15px_rgba(6,182,212,0.3)]">
                <span className="material-symbols-outlined text-2xl">photo_library</span>
              </div>
              <span className="text-[10px] text-text-secondary font-bold tracking-wider uppercase group-hover:text-primary transition-colors">{t.gallery}</span>
            </button>

            {/* Capture Button */}
            <button 
              onClick={handleCapture}
              className="w-20 h-20 rounded-full border-2 border-slate-200 dark:border-white/20 flex items-center justify-center relative group active:scale-95 transition-transform"
            >
              <div className="absolute inset-0 rounded-full border-2 border-primary/50 animate-pulse shadow-[0_0_20px_rgba(6,182,212,0.4)]"></div>
              <div className="w-16 h-16 bg-white rounded-full group-hover:bg-cyan-50 transition-colors shadow-[0_0_30px_rgba(255,255,255,0.5)] border-4 border-slate-900 dark:border-slate-900"></div>
            </button>

            {/* Flash/Settings Button */}
            <button className="flex flex-col items-center justify-center gap-1 group">
              <div className="w-12 h-12 rounded-full bg-surface/50 backdrop-blur-md flex items-center justify-center group-active:bg-surface-highlight transition-all border border-slate-200 dark:border-white/10 group-hover:border-primary/50 group-hover:text-primary text-text-secondary group-hover:shadow-[0_0_15px_rgba(6,182,212,0.3)]">
                <span className="material-symbols-outlined text-2xl">flash_on</span>
              </div>
              <span className="text-[10px] text-text-secondary font-bold tracking-wider uppercase group-hover:text-primary transition-colors">{t.flash}</span>
            </button>
          </div>
        </div>
      </main>

      <BottomNav />
    </div>
  );
}
