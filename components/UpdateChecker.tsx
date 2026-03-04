'use client';

import { useEffect, useState } from 'react';
import { Capacitor } from '@capacitor/core';
import { Filesystem, Directory } from '@capacitor/filesystem';
import { FileOpener } from '@capacitor-community/file-opener';
import { Toast } from '@capacitor/toast';
import packageJson from '../package.json';

export default function UpdateChecker() {
    const [updateAvailable, setUpdateAvailable] = useState<string | null>(null);
    const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
    const [apkUrl, setApkUrl] = useState<string | null>(null);
    const [isDownloading, setIsDownloading] = useState(false);

    useEffect(() => {
        const checkUpdate = async () => {
            if (Capacitor.getPlatform() === 'web') return;

            try {
                const response = await fetch('https://api.github.com/repos/AsmSafone/EyeVLM/releases/latest');
                if (!response.ok) return;

                const data = await response.json();
                const latestVersion = data.tag_name?.replace(/^v/, '');
                const currentVersion = packageJson.version;

                if (latestVersion && latestVersion !== currentVersion) {
                    // If the Github tag version diverges from the current local package.json version, block the app.
                    setUpdateAvailable(data.tag_name);
                    setDownloadUrl(data.html_url);
                    const apkAsset = data.assets?.find((a: any) => a.name.endsWith('.apk'));
                    if (apkAsset) setApkUrl(apkAsset.browser_download_url);
                }
            } catch (error) {
                console.error("Failed to check for updates:", error);
            }
        };

        checkUpdate();
    }, []);

    if (!updateAvailable) return null;

    const handleUpdateClick = async (e: React.MouseEvent) => {
        e.preventDefault();

        // If not Android or no direct APK found, fallback to opening browser
        if (Capacitor.getPlatform() !== 'android' || !apkUrl) {
            window.open(downloadUrl || "https://github.com/AsmSafone/EyeVLM/releases/latest", '_blank');
            return;
        }

        setIsDownloading(true);
        try {
            await Toast.show({ text: 'Downloading update, please wait...', duration: 'long' });

            const result = await Filesystem.downloadFile({
                url: apkUrl,
                path: 'eyevlm-update.apk',
                directory: Directory.Cache
            });

            await Toast.show({ text: 'Download complete. Starting install...', duration: 'short' });

            await FileOpener.open({
                filePath: result.path || '',
                contentType: 'application/vnd.android.package-archive',
                openWithDefault: true
            });
        } catch (error) {
            console.error("Download failed:", error);
            await Toast.show({ text: 'Update failed. Opening browser.', duration: 'short' });
            window.open(downloadUrl || "https://github.com/AsmSafone/EyeVLM/releases/latest", '_blank');
        } finally {
            setIsDownloading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[9999] bg-background/80 backdrop-blur-md flex items-center justify-center p-6">
            <div className="bg-surface border border-primary/20 rounded-3xl p-8 max-w-sm w-full shadow-2xl flex flex-col items-center text-center relative overflow-hidden">
                {/* Decorative background glow */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-32 bg-primary/10 blur-[50px] pointer-events-none"></div>

                <span className="material-symbols-outlined text-6xl text-primary mb-4 animate-[bounce_2s_infinite]">system_update</span>
                <h2 className="text-2xl font-bold text-text-main mb-2 tracking-tight">Update Required</h2>
                <p className="text-text-secondary mb-8 leading-relaxed">
                    A new version <span className="font-bold text-text-main">{updateAvailable}</span> of EyeVLM is available. You must update to continue using the app.
                </p>
                <button
                    onClick={handleUpdateClick}
                    disabled={isDownloading}
                    className={`w-full bg-primary hover:bg-primary-dark text-white font-bold py-3.5 px-6 rounded-2xl transition-colors shadow-[0_4px_15px_rgba(6,182,212,0.3)] active:scale-[0.98] flex items-center justify-center gap-2 ${isDownloading ? 'opacity-70 cursor-not-allowed' : ''}`}
                >
                    {isDownloading ? (
                        <svg className="animate-spin h-5 w-5 text-white mr-1" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                        </svg>
                    ) : (
                        <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                        </svg>
                    )}
                    {isDownloading ? "Downloading..." : "Download Update"}
                </button>
            </div>
        </div>
    );
}
