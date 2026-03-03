import type { Metadata } from 'next';
import { Lexend } from 'next/font/google';
import './globals.css';
import 'material-symbols/outlined.css';
import { LanguageProvider } from '@/app/context/LanguageContext';
import { ThemeProvider } from '@/app/context/ThemeContext';
import UpdateChecker from '@/components/UpdateChecker';
import AppConfig from '@/components/AppConfig';

const lexend = Lexend({
  subsets: ['latin'],
  variable: '--font-lexend',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'EyeVLM',
  description: 'AI-Powered Eye Disease Screening',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${lexend.variable}`}>
      <head>
      </head>
      <body className="font-sans antialiased bg-background text-text-main transition-colors duration-300">
        <ThemeProvider>
          <LanguageProvider>
            <AppConfig>
              <UpdateChecker />
              {children}
            </AppConfig>
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
