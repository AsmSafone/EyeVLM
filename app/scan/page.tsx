'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import BottomNav from '@/components/BottomNav';
import { useLanguage } from '@/app/context/LanguageContext';
import { Camera } from '@capacitor/camera';
import { Torch } from '@capawesome/capacitor-torch';

export default function Scan() {
  const { t } = useLanguage();
  const router = useRouter();
  const [activeEye, setActiveEye] = useState<'left' | 'right'>('left');
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);

  // Flash, Camera Switch, and Cropping states
  const [facingMode, setFacingMode] = useState<'environment' | 'user'>('environment');
  const [flashEnabled, setFlashEnabled] = useState(false);
  const [imageToCrop, setImageToCrop] = useState<string | null>(null);
  const [isCropping, setIsCropping] = useState(false);
  const [zoomScale, setZoomScale] = useState(1);
  const pinchStartDist = useRef<number | null>(null);
  const pinchStartZoom = useRef<number | null>(null);
  const containerRef = useRef<HTMLElement>(null);

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const startCamera = useCallback(async (mode: 'environment' | 'user') => {
    try {
      // 1. Check native permissions first (Capacitor)
      let permStatus = await Camera.checkPermissions();

      if (permStatus.camera === 'prompt' || permStatus.camera === 'prompt-with-rationale') {
        permStatus = await Camera.requestPermissions();
      }

      if (permStatus.camera === 'denied') {
        throw new Error('Native camera permission denied');
      }

      // 2. Clear old streams
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }

      // 3. Start web stream
      const constraints: MediaStreamConstraints = {
        video: {
          facingMode: mode,
        }
      };

      if (mode === 'user') {
        (constraints.video as MediaTrackConstraints).width = { ideal: 4096 };
        (constraints.video as MediaTrackConstraints).height = { ideal: 4096 };
      }

      const stream = await navigator.mediaDevices.getUserMedia(constraints);

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      streamRef.current = stream;
      setFlashEnabled(false);
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
    startCamera(facingMode);
    return () => {
      stopCamera();
    };
  }, [facingMode, startCamera, stopCamera]);

  const toggleFlash = async () => {
    try {
      if (flashEnabled) {
        await Torch.disable();
        setFlashEnabled(false);
      } else {
        await Torch.enable();
        setFlashEnabled(true);
      }
    } catch (err) {
      console.error("Error toggling flash:", err);
    }
  };

  const switchCamera = () => {
    setFacingMode(prev => prev === 'environment' ? 'user' : 'environment');
  };

  const handleCapture = () => {
    if (videoRef.current && canvasRef.current && containerRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const container = containerRef.current;

      // 1. Calculate actual video dimensions in the DOM vs its intrinsic resolution
      const videoRect = video.getBoundingClientRect();
      const scaleX = video.videoWidth / videoRect.width;
      const scaleY = video.videoHeight / videoRect.height;
      const scaleToUse = Math.min(scaleX, scaleY); // Cover behaviour means min scale to translate DOM to intrinsic

      // 2. DOM dimensions of the overlay circle 
      // The circle has w-72 h-72 which is 288px by 288px. It's perfectly centered in the container.
      const targetSizeDOM = 288;
      const targetXDOM = (container.clientWidth - targetSizeDOM) / 2;
      const targetYDOM = (container.clientHeight - targetSizeDOM) / 2;

      // 3. Map DOM crop square to intrinsic video pixels, accounting for pinch zoom
      // The video object-fit: cover centers the video inside the container.

      const zoomAwareWidth = videoRect.width * zoomScale;
      const zoomAwareHeight = videoRect.height * zoomScale;

      // Calculate offset of the scaled video relative to the container center
      const offsetXDOM = (zoomAwareWidth - container.clientWidth) / 2;
      const offsetYDOM = (zoomAwareHeight - container.clientHeight) / 2;

      // Calculate crop box coordinates on the zoomed virtual DOM plane
      const cropXDOM = targetXDOM + offsetXDOM;
      const cropYDOM = targetYDOM + offsetYDOM;

      // Convert to intrinsic video pixels by dividing by the zoom, and multiplying by natural scale
      const cropX = (cropXDOM / zoomScale) * scaleToUse;
      const cropY = (cropYDOM / zoomScale) * scaleToUse;
      const cropSize = (targetSizeDOM / zoomScale) * scaleToUse;

      // Setup output canvas (2x resolution of the target for high quality)
      canvas.width = cropSize;
      canvas.height = cropSize;

      const context = canvas.getContext('2d');
      if (context) {
        if (facingMode === 'user') {
          context.translate(canvas.width, 0);
          context.scale(-1, 1);
        }

        // Draw only the perfectly cropped square target area
        context.drawImage(
          video,
          cropX, cropY, cropSize, cropSize, // Source square
          0, 0, cropSize, cropSize // Destination square
        );

        const imageDataUrl = canvas.toDataURL('image/jpeg', 1.0);
        setImageToCrop(imageDataUrl);
        setIsCropping(true);
        stopCamera();
      }
    }
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 2) {
      const dx = e.touches[0].clientX - e.touches[1].clientX;
      const dy = e.touches[0].clientY - e.touches[1].clientY;
      pinchStartDist.current = Math.sqrt(dx * dx + dy * dy);
      pinchStartZoom.current = zoomScale;
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (e.touches.length === 2 && pinchStartDist.current && pinchStartZoom.current) {
      const dx = e.touches[0].clientX - e.touches[1].clientX;
      const dy = e.touches[0].clientY - e.touches[1].clientY;
      const dist = Math.sqrt(dx * dx + dy * dy);

      const scaleDiff = dist / pinchStartDist.current;
      let newZoom = pinchStartZoom.current * scaleDiff;

      // Clamp zoom between 1x and 4x
      newZoom = Math.max(1, Math.min(newZoom, 4));
      setZoomScale(newZoom);
    }
  };

  const handleTouchEnd = () => {
    pinchStartDist.current = null;
    pinchStartZoom.current = null;
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
          setImageToCrop(result);
          setIsCropping(true);
          stopCamera();
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleConfirmCrop = () => {
    if (imageToCrop) {
      sessionStorage.setItem('capturedEyeImage', imageToCrop);
      sessionStorage.setItem('activeEye', activeEye);
      router.push('/scan/patient-info');
    }
  };

  const handleCancelCrop = () => {
    setIsCropping(false);
    setImageToCrop(null);
    startCamera(facingMode);
  };

  return (
    <div className="bg-background font-sans antialiased text-text-main h-screen flex flex-col overflow-hidden relative transition-colors duration-300">
      {/* Decorative Background - Dark Mode Only */}
      <div className="absolute inset-0 z-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-slate-950 pointer-events-none opacity-0 dark:opacity-100 transition-opacity duration-300"></div>
      <div className="absolute top-0 left-0 w-full h-full bg-[url(/noise.svg)] opacity-5 pointer-events-none"></div>

      {/* Header */}
      <header className="absolute top-0 left-0 right-0 z-30 flex items-center justify-between px-4 py-4 bg-gradient-to-b from-background/90 dark:from-slate-950/90 to-transparent pt-safe backdrop-blur-[2px] transition-colors duration-300">
        <button onClick={() => router.push('/dashboard')} className="flex items-center justify-center w-10 h-10 rounded-full bg-surface/40 backdrop-blur-md border border-slate-200 dark:border-white/10 hover:bg-surface-highlight transition-colors text-text-main hover:border-primary/30">
          <span className="material-symbols-outlined text-2xl">arrow_back</span>
        </button>
        <h1 className="text-lg font-bold text-text-main tracking-wide drop-shadow-md bg-surface/30 px-3 py-1 rounded-full border border-slate-200 dark:border-white/5 backdrop-blur-sm">{t.captureEyeImage}</h1>
        <button onClick={switchCamera} className="flex items-center justify-center w-10 h-10 rounded-full bg-surface/40 backdrop-blur-md border border-slate-200 dark:border-white/10 hover:bg-surface-highlight transition-colors text-text-main hover:border-primary/30">
          <span className="material-symbols-outlined text-2xl">flip_camera_ios</span>
        </button>
      </header>

      {/* Main Content Area: Viewfinder or Preview */}
      <main
        ref={containerRef}
        className="relative flex-1 flex flex-col w-full bg-black overflow-hidden group/viewfinder"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {isCropping && imageToCrop ? (
          <div className="absolute inset-0 z-[100] bg-black flex flex-col pt-safe h-full">

            {/* Preview Header */}
            <header className="flex items-center justify-between px-6 py-4 bg-slate-950/80 backdrop-blur-sm z-50 shrink-0">
              <button onClick={handleCancelCrop} className="text-white flex items-center gap-1 font-medium bg-white/10 px-3 py-1.5 rounded-full hover:bg-white/20 transition">
                <span className="material-symbols-outlined text-sm">close</span>
              </button>
              <h2 className="text-white text-lg font-bold tracking-wide">Confirm</h2>
              <button onClick={handleConfirmCrop} className="text-white bg-primary flex items-center gap-1 font-medium px-4 py-1.5 rounded-full hover:brightness-110 transition shadow-[0_4px_10px_rgba(6,182,212,0.3)]">
                <span className="material-symbols-outlined text-sm">arrow_forward</span>
              </button>
            </header>

            {/* Read-Only Preview Frame */}
            <div className="relative flex-1 w-full bg-slate-900 flex items-center justify-center shrink overflow-hidden max-h-[60vh] sm:max-h-none p-6">
              <div className="relative w-full max-w-sm aspect-square rounded-[3rem] overflow-hidden shadow-[0_0_50px_rgba(6,182,212,0.15)] ring-1 ring-white/10">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={imageToCrop} alt="Cropped Preview" className="w-full h-full object-cover" />
              </div>
            </div>

            {/* Bottom Controls Area Container */}
            <div className="bg-slate-950 w-full flex flex-col mt-auto z-50 shrink-0 border-t border-white/5 py-8">
              <p className="text-slate-400 text-center text-sm font-medium px-6">
                Ensure the pupil is clearly visible and centered before proceeding.
              </p>
            </div>
          </div>
        ) : (
          <>
            {/* Live Camera Feed */}
            {hasPermission === false ? (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-900 text-white p-6 text-center">
                <span className="material-symbols-outlined text-4xl mb-4 text-red-500">videocam_off</span>
                <p className="text-lg font-bold mb-2">{t.cameraAccessDenied || "Camera Access Denied"}</p>
                <p className="text-sm text-slate-400">{cameraError || "Please enable camera access in your browser settings to use this feature."}</p>
                <button
                  onClick={() => startCamera(facingMode)}
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
                style={{ transform: `scale(${zoomScale}) ${facingMode === 'user' ? 'scaleX(-1)' : ''}` }}
                className={`absolute inset-0 w-full h-full object-cover origin-center transition-transform duration-75`}
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
              <div className="flex h-12 bg-slate-900/80 backdrop-blur-xl rounded-2xl p-1 shadow-lg border border-primary/30 w-full max-w-xs">
                <label className="flex-1 cursor-pointer relative group">
                  <input
                    type="radio"
                    name="eye-side"
                    value="left"
                    className="peer sr-only"
                    checked={activeEye === 'left'}
                    onChange={() => setActiveEye('left')}
                  />
                  <div className="w-full h-full flex items-center justify-center rounded-xl text-sm font-bold tracking-wide text-slate-400 hover:text-slate-200 peer-checked:bg-primary/20 peer-checked:text-primary peer-checked:border peer-checked:border-primary/50 transition-all peer-checked:shadow-[0_0_10px_rgba(6,182,212,0.3)]">
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
                  <div className="w-full h-full flex items-center justify-center rounded-xl text-sm font-bold tracking-wide text-slate-400 hover:text-slate-200 peer-checked:bg-primary/20 peer-checked:text-primary peer-checked:border peer-checked:border-primary/50 transition-all peer-checked:shadow-[0_0_10px_rgba(6,182,212,0.3)]">
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

                {/* Flash Button */}
                <button
                  onClick={toggleFlash}
                  className="flex flex-col items-center justify-center gap-1 group"
                >
                  <div className={`w-12 h-12 rounded-full backdrop-blur-md flex items-center justify-center transition-all border ${flashEnabled ? 'bg-primary/20 border-primary shadow-[0_0_15px_rgba(6,182,212,0.5)] text-primary' : 'bg-surface/50 border-slate-200 dark:border-white/10 text-text-secondary group-hover:border-primary/50 group-hover:text-primary group-hover:shadow-[0_0_15px_rgba(6,182,212,0.3)]'} group-active:bg-surface-highlight`}>
                    <span className="material-symbols-outlined text-2xl">{flashEnabled ? 'flash_on' : 'flash_off'}</span>
                  </div>
                  <span className={`text-[10px] font-bold tracking-wider uppercase transition-colors ${flashEnabled ? 'text-primary' : 'text-text-secondary group-hover:text-primary'}`}>{t.flash}</span>
                </button>
              </div>
            </div>
          </>
        )}
      </main>

      <BottomNav />
    </div>
  );
}
