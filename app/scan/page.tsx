'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/app/context/LanguageContext';
import Cropper, { ReactCropperElement } from 'react-cropper';
import 'cropperjs/dist/cropper.css';
import { CameraPreview, CameraPreviewFlashMode } from '@capacitor-community/camera-preview';
import { Capacitor } from '@capacitor/core';

export default function Scan() {
  const { t } = useLanguage();
  const router = useRouter();
  const [activeEye, setActiveEye] = useState<'left' | 'right'>('left');
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);

  // Flash, Camera Switch, and Cropping states
  const [facingMode, setFacingMode] = useState<'environment' | 'user'>('user');
  const [flashEnabled, setFlashEnabled] = useState(false);
  const [imageToCrop, setImageToCrop] = useState<string | null>(null);
  const [isCropping, setIsCropping] = useState(false);
  const [aspect, setAspect] = useState<number | undefined>(1);
  const [dragModeCrop, setDragModeCrop] = useState(true);
  const [isNative, setIsNative] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsNative(Capacitor.isNativePlatform());
  }, []);

  useEffect(() => {
    if (isNative && !isCropping && hasPermission) {
      document.documentElement.classList.add('camera-active');
    } else {
      document.documentElement.classList.remove('camera-active');
    }
    return () => {
      document.documentElement.classList.remove('camera-active');
    };
  }, [isNative, isCropping, hasPermission]);



  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const cropperRef = useRef<ReactCropperElement>(null);

  const cameraOperatingRef = useRef(false);

  const startCamera = useCallback(async (mode: 'environment' | 'user') => {
    if (cameraOperatingRef.current) return;
    try {
      if (Capacitor.isNativePlatform()) {
        const platform = Capacitor.getPlatform();
        if (platform === 'android' || platform === 'ios') {
          cameraOperatingRef.current = true;
          // Add a delay to ensure the previous camera (if any) was fully stopped
          // Native APIs sometimes take a moment to release the hardware.
          await new Promise(resolve => setTimeout(resolve, 500));

          await CameraPreview.start({
            position: mode === 'environment' ? 'rear' : 'front',
            toBack: true,
            enableZoom: true,
            disableAudio: true,
            width: window.innerWidth,
            height: window.innerHeight,
          } as any);
          setFlashEnabled(false);
          setHasPermission(true);
          setCameraError(null);
          cameraOperatingRef.current = false;
          return;
        }
      }

      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }

      let stream: MediaStream;
      try {
        // Try exact constraint first (better for mobile web)
        stream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: { exact: mode === 'user' ? 'user' : 'environment' },
            width: { ideal: 1920 },
            height: { ideal: 1080 }
          }
        });
      } catch (e) {
        // Fallback to loose constraint if exact fails (e.g. desktop webcams)
        stream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: mode === 'user' ? 'user' : 'environment',
            width: { ideal: 1920 },
            height: { ideal: 1080 }
          }
        });
      }

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      streamRef.current = stream;
      setFlashEnabled(false);
      setHasPermission(true);
      setCameraError(null);
    } catch (err) {
      cameraOperatingRef.current = false;
      console.error("Error accessing camera:", err);
      if (err instanceof Error && err.message === 'camera already started') {
        return;
      }
      setHasPermission(false);
      setCameraError('Camera access denied or not available.');
    }
  }, []);

  const stopCamera = useCallback(async () => {
    if (Capacitor.isNativePlatform()) {
      try {
        cameraOperatingRef.current = true;
        await CameraPreview.setFlashMode({ flashMode: 'off' }).catch(() => {});
        await CameraPreview.stop();
      } catch (e) {
        console.error("Error stopping native components:", e);
      } finally {
        cameraOperatingRef.current = false;
      }
    }

    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
  }, []);

  // Handle initialization and component unmount
  useEffect(() => {
    let mounted = true;
    
    const initCamera = async () => {
      if (mounted) {
        await startCamera(facingMode);
      }
    };
    
    initCamera();
    
    return () => {
      mounted = false;
      stopCamera();
    };
  }, [facingMode, startCamera, stopCamera]);

  const toggleFlash = async () => {
    if (Capacitor.isNativePlatform()) {
      try {
        const newMode: CameraPreviewFlashMode = flashEnabled ? 'off' : 'torch';
        // Note: the plugin API might expect an object based on typings, but the docs mention string. 
        // According to definitions.d.ts, setFlashMode(options: { flashMode: CameraPreviewFlashMode | string }): Promise<void>;
        await CameraPreview.setFlashMode({ flashMode: newMode } as any);
        setFlashEnabled(!flashEnabled);
      } catch (err) {
        console.error("Error toggling native flash", err);
      }
      return;
    }

    if (streamRef.current) {
      const track = streamRef.current.getVideoTracks()[0];
      if (track) {
        try {
          const capabilities = track.getCapabilities ? track.getCapabilities() : {} as any;
          if (capabilities.torch) {
            await track.applyConstraints({
              advanced: [{ torch: !flashEnabled } as any]
            });
            setFlashEnabled(!flashEnabled);
          } else {
            console.log("Torch not supported");
          }
        } catch (err) {
          console.error("Error toggling flash:", err);
        }
      }
    }
  };

  const switchCamera = () => {
    setFacingMode(prev => prev === 'environment' ? 'user' : 'environment');
  };


  const handleCapture = async () => {
    if (cameraOperatingRef.current) return;
    
    if (Capacitor.isNativePlatform()) {
      try {
        cameraOperatingRef.current = true;
        const result = await CameraPreview.captureSample({ quality: 100 });
        setImageToCrop(`data:image/jpeg;base64,${result.value}`);
        setIsCropping(true);
        cameraOperatingRef.current = false;
        await stopCamera();
      } catch (err) {
        console.error("Error capturing native image:", err);
        cameraOperatingRef.current = false;
      }
      return;
    }

    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;

      const size = Math.min(video.videoWidth, video.videoHeight);
      canvas.width = size;
      canvas.height = size;

      const xOffset = (video.videoWidth - size) / 2;
      const yOffset = (video.videoHeight - size) / 2;

      const context = canvas.getContext('2d');
      if (context) {
        if (facingMode === 'user') {
          context.translate(canvas.width, 0);
          context.scale(-1, 1);
        }
        context.imageSmoothingEnabled = true;
        context.imageSmoothingQuality = 'high';

        context.drawImage(video, xOffset, yOffset, size, size, 0, 0, size, size);
        const imageDataUrl = canvas.toDataURL('image/jpeg', 1.0);
        setImageToCrop(imageDataUrl);
        setIsCropping(true);
        stopCamera();
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
          setImageToCrop(result);
          setIsCropping(true);
          stopCamera();
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleConfirmCrop = () => {
    const cropper = cropperRef.current?.cropper;
    if (cropper) {
      const croppedImage = cropper.getCroppedCanvas()?.toDataURL('image/jpeg', 0.9);
      if (croppedImage) {
        sessionStorage.setItem('capturedEyeImage', croppedImage);
        sessionStorage.setItem('activeEye', activeEye);
        router.push('/scan/patient-info');
      }
    }
  };

  const handleCancelCrop = () => {
    setIsCropping(false);
    setImageToCrop(null);
    startCamera(facingMode);
  };

  return (
    <div className={`font-sans antialiased h-screen flex flex-col overflow-hidden relative transition-colors duration-300 ${isNative && !isCropping ? 'bg-transparent text-white' : 'bg-background text-text-main'}`}>
      {/* Decorative Background - Dark Mode Only */}
      {(!isNative || isCropping) && (
        <div className="absolute inset-0 z-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-slate-950 pointer-events-none opacity-0 dark:opacity-100 transition-opacity duration-300"></div>
      )}


      {/* Header */}
      <header className={`absolute top-0 left-0 right-0 z-30 flex items-center justify-between px-4 py-4 pt-safe backdrop-blur-[2px] transition-colors duration-300 ${isNative && !isCropping ? 'bg-transparent' : 'bg-gradient-to-b from-background/90 dark:from-slate-950/90 to-transparent'}`}>
        <button onClick={() => router.push('/dashboard')} className="flex items-center justify-center w-10 h-10 rounded-full bg-surface/40 backdrop-blur-md border border-slate-200 dark:border-white/10 hover:bg-surface-highlight transition-colors text-text-main hover:border-primary/30">
          <span className="material-symbols-outlined text-2xl">arrow_back</span>
        </button>
        <h1 className="text-lg font-bold text-text-main tracking-wide drop-shadow-md bg-surface/30 px-3 py-1 rounded-full border border-slate-200 dark:border-white/5 backdrop-blur-sm">{t.captureEyeImage}</h1>
        <button onClick={switchCamera} className="flex items-center justify-center w-10 h-10 rounded-full bg-surface/40 backdrop-blur-md border border-slate-200 dark:border-white/10 hover:bg-surface-highlight transition-colors text-text-main hover:border-primary/30">
          <span className="material-symbols-outlined text-2xl">flip_camera_ios</span>
        </button>
      </header>

      <main className={`relative flex-1 flex flex-col w-full overflow-hidden group/viewfinder ${isNative && !isCropping ? 'bg-transparent' : 'bg-black'}`}>
        {isCropping && imageToCrop ? (
          <div className="absolute inset-0 z-[100] flex flex-col bg-background transition-colors duration-300">

            {/* Top Header */}
            <header className="flex items-center justify-between px-4 py-3 shrink-0 border-b border-slate-200 dark:border-white/5 bg-surface/80 backdrop-blur-xl transition-colors duration-300" style={{ paddingTop: 'max(env(safe-area-inset-top), 16px)' }}>
              <button
                onClick={handleCancelCrop}
                className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-surface hover:bg-surface-highlight border border-slate-200 dark:border-white/10 transition-all text-text-secondary hover:text-text-main text-sm font-semibold active:scale-95"
              >
                <span className="material-symbols-outlined text-base">close</span>
              </button>

              <div className="flex flex-col items-center">
                <h1 className="text-text-main font-bold text-base tracking-wide">Crop Image</h1>
                <p className="text-text-secondary text-xs font-medium">Drag to adjust</p>
              </div>

              <button
                onClick={handleConfirmCrop}
                className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 transition-all text-white text-sm font-bold shadow-[0_0_20px_rgba(6,182,212,0.4)] hover:shadow-[0_0_30px_rgba(6,182,212,0.6)] active:scale-95"
              >
                <span className="material-symbols-outlined text-base">check</span>
              </button>
            </header>

            {/* Cropper Area */}
            <div className="relative flex-1 flex items-center justify-center overflow-hidden bg-surface-highlight transition-colors duration-300">
              {/* Ambient glow */}
              <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-primary/10 rounded-full blur-[80px]"></div>
              </div>
              <Cropper
                src={imageToCrop ?? undefined}
                style={{ height: '100%', width: '100%' }}
                aspectRatio={aspect}
                guides={true}
                ref={cropperRef}
                viewMode={1}
                minCropBoxHeight={80}
                minCropBoxWidth={80}
                background={false}
                responsive={true}
                autoCropArea={0.85}
                checkOrientation={false}
              />
            </div>

            {/* Bottom Controls */}
            <div className="shrink-0 border-t border-slate-200 dark:border-white/5 bg-surface/95 backdrop-blur-xl transition-colors duration-300">

              {/* Aspect Ratio Selector */}
              <div className="px-4 pt-4 pb-2">
                <p className="text-text-secondary text-[10px] font-bold uppercase tracking-widest mb-3 text-center">Aspect Ratio</p>
                <div className="flex items-center justify-around gap-2 overflow-x-auto hide-scrollbar">
                  {[
                    { label: 'Free', value: NaN, w: 'w-6', h: 'h-5' },
                    { label: 'Square', value: 1, w: 'w-5', h: 'h-5' },
                    { label: '3:2', value: 3 / 2, w: 'w-6', h: 'h-4' },
                    { label: '4:3', value: 4 / 3, w: 'w-6', h: 'h-[18px]' },
                    { label: '16:9', value: 16 / 9, w: 'w-7', h: 'h-4' },
                  ].map((ratio) => {
                    const isActive = isNaN(ratio.value) ? aspect === undefined : aspect === ratio.value;
                    return (
                      <button
                        key={ratio.label}
                        onClick={() => {
                          const val = isNaN(ratio.value) ? undefined : ratio.value;
                          setAspect(val);
                          cropperRef.current?.cropper?.setAspectRatio(ratio.value);
                        }}
                        className={`flex flex-col items-center gap-2 px-3 py-2 rounded-2xl transition-all shrink-0 ${isActive
                          ? 'bg-primary/10 border border-primary/40'
                          : 'border border-transparent hover:border-slate-200 dark:hover:border-white/10'
                          }`}
                      >
                        <div className={`${ratio.w} ${ratio.h} rounded-sm border-2 transition-colors ${isActive ? 'border-primary' : 'border-slate-300 dark:border-slate-600'
                          }`}></div>
                        <span className={`text-[11px] font-semibold transition-colors ${isActive ? 'text-primary' : 'text-text-secondary'
                          }`}>{ratio.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Divider */}
              <div className="h-px bg-slate-200 dark:bg-white/5 mx-4 my-1"></div>

              {/* Tool Actions */}
              <div className="flex items-center justify-around px-4 py-3" style={{ paddingBottom: 'max(env(safe-area-inset-bottom), 16px)' }}>
                {/* Rotate Left */}
                <button onClick={() => cropperRef.current?.cropper.rotate(-90)} className="flex flex-col items-center gap-1.5 group">
                  <div className="w-11 h-11 rounded-2xl bg-surface hover:bg-surface-highlight border border-slate-200 dark:border-white/10 flex items-center justify-center transition-all active:scale-90 group-hover:border-primary/30 text-text-secondary group-hover:text-primary">
                    <span className="material-symbols-outlined text-xl">rotate_left</span>
                  </div>
                  <span className="text-[10px] text-text-secondary font-medium">Rotate L</span>
                </button>

                {/* Rotate Right */}
                <button onClick={() => cropperRef.current?.cropper.rotate(90)} className="flex flex-col items-center gap-1.5 group">
                  <div className="w-11 h-11 rounded-2xl bg-surface hover:bg-surface-highlight border border-slate-200 dark:border-white/10 flex items-center justify-center transition-all active:scale-90 group-hover:border-primary/30 text-text-secondary group-hover:text-primary">
                    <span className="material-symbols-outlined text-xl">rotate_right</span>
                  </div>
                  <span className="text-[10px] text-text-secondary font-medium">Rotate R</span>
                </button>

                {/* Flip Horizontal */}
                <button
                  onClick={() => {
                    const cd = cropperRef.current?.cropper.getData();
                    cropperRef.current?.cropper.scaleX(cd ? (cd.scaleX || 1) * -1 : -1);
                  }}
                  className="flex flex-col items-center gap-1.5 group"
                >
                  <div className="w-11 h-11 rounded-2xl bg-surface hover:bg-surface-highlight border border-slate-200 dark:border-white/10 flex items-center justify-center transition-all active:scale-90 group-hover:border-primary/30 text-text-secondary group-hover:text-primary">
                    <span className="material-symbols-outlined text-xl">flip</span>
                  </div>
                  <span className="text-[10px] text-text-secondary font-medium">Flip</span>
                </button>

                {/* Crop / Move Toggle */}
                <button
                  onClick={() => {
                    if (cropperRef.current?.cropper) {
                      const cropper = cropperRef.current.cropper;
                      setDragModeCrop(prev => {
                        const next = !prev;
                        cropper.setDragMode(next ? 'crop' : 'move');
                        return next;
                      });
                    }
                  }}
                  className="flex flex-col items-center gap-1.5 group"
                >
                  <div className={`w-11 h-11 rounded-2xl border flex items-center justify-center transition-all active:scale-90 ${dragModeCrop
                    ? 'bg-primary/10 border-primary/40 text-primary'
                    : 'bg-surface border-slate-200 dark:border-white/10 text-text-secondary hover:bg-surface-highlight hover:border-primary/30 hover:text-primary'
                    }`}>
                    <span className="material-symbols-outlined text-xl">{dragModeCrop ? 'crop' : 'pan_tool'}</span>
                  </div>
                  <span className={`text-[10px] font-medium ${dragModeCrop ? 'text-primary' : 'text-text-secondary'}`}>
                    {dragModeCrop ? 'Crop' : 'Move'}
                  </span>
                </button>

                {/* Reset */}
                <button onClick={() => cropperRef.current?.cropper.reset()} className="flex flex-col items-center gap-1.5 group">
                  <div className="w-11 h-11 rounded-2xl bg-surface hover:bg-surface-highlight border border-slate-200 dark:border-white/10 flex items-center justify-center transition-all active:scale-90 group-hover:border-primary/30 text-text-secondary group-hover:text-primary">
                    <span className="material-symbols-outlined text-xl">restart_alt</span>
                  </div>
                  <span className="text-[10px] text-text-secondary font-medium">Reset</span>
                </button>
              </div>
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
              !isNative && (
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className={`absolute inset-0 w-full h-full object-cover ${facingMode === 'user' ? 'scale-x-[-1]' : ''}`}
                />
              )
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
            <div className={`mt-auto relative z-20 w-full pb-28 pt-12 px-6 flex flex-col items-center justify-end transition-colors duration-300 ${isNative && !isCropping ? 'bg-gradient-to-t from-black/70 via-black/30 to-transparent' : 'bg-gradient-to-t from-background via-background/90 dark:from-slate-950 dark:via-slate-950/90 to-transparent'}`}>
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
        )
        }
      </main >
    </div >
  );
}
