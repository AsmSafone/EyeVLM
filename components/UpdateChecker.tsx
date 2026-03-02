'use client';

import { useEffect, useState } from 'react';
import packageJson from '../package.json';

export default function UpdateChecker() {
    const [updateAvailable, setUpdateAvailable] = useState<string | null>(null);
    const [downloadUrl, setDownloadUrl] = useState<string | null>(null);

    useEffect(() => {
        const checkUpdate = async () => {
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
                }
            } catch (error) {
                console.error("Failed to check for updates:", error);
            }
        };

        checkUpdate();
    }, []);

    if (!updateAvailable) return null;

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
                <a
                    href={downloadUrl || "https://github.com/AsmSafone/EyeVLM/releases/latest"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full bg-primary hover:bg-primary-dark text-white font-bold py-3.5 px-6 rounded-2xl transition-colors shadow-[0_4px_15px_rgba(6,182,212,0.3)] active:scale-[0.98] flex items-center justify-center gap-2"
                >
                    <span className="material-symbols-outlined text-lg">download</span>
                    Download Update
                </a>
            </div>
        </div>
    );
}
