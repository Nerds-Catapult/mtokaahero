import { CookieConsentBanner } from '@/components/cookie-consent-banner';
import { SessionProvider } from '@/components/session-provider';
import { ThemeProvider } from '@/components/theme-provider';
import { Toaster } from '@/components/ui/sonner';
import { ConsentProvider } from '@/hooks/use-consent';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import type React from 'react';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
    title: 'MtokaaHero - Automotive Marketplace',
    description: 'Connect with trusted automotive professionals',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en">
            <body>
                <SessionProvider>
                    <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
                        <ConsentProvider>
                            <Toaster position="top-right" />
                            {children}
                            <CookieConsentBanner />
                        </ConsentProvider>
                    </ThemeProvider>
                </SessionProvider>
            </body>
        </html>
    );
}
