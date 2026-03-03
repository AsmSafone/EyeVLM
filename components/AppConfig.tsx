'use client';

import { useEffect } from 'react';
import { App as CapacitorApp } from '@capacitor/app';
import { useRouter, usePathname } from 'next/navigation';

import { Toast } from '@capacitor/toast';

export default function AppConfig({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        let listener: any = null;
        let backPressCount = 0;
        let lastBackPressTime = 0;

        const setupListener = async () => {
            try {
                listener = await CapacitorApp.addListener('backButton', async () => {
                    // Check if we are on a top-level route
                    const rootPaths = ['/', '/dashboard', '/login', '/onboarding'];
                    if (rootPaths.includes(pathname || '')) {
                        const currentTime = new Date().getTime();
                        if (currentTime - lastBackPressTime < 2000) {
                            CapacitorApp.exitApp();
                        } else {
                            backPressCount++;
                            lastBackPressTime = currentTime;
                            await Toast.show({
                                text: 'Press back again to exit',
                                duration: 'short',
                            });
                        }
                    } else {
                        router.back();
                    }
                });
            } catch (e) {
                // Not running in Capacitor Environment (e.g., standard web browser)
                console.log("Not in Capacitor environment, skipping native back button listener.");
            }
        };

        setupListener();

        return () => {
            if (listener) {
                listener.remove();
            }
        };
    }, [pathname, router]);

    return <>{children}</>;
}
