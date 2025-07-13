import { SessionProvider } from '@/components/session-provider';
import { ThemeProvider } from '@/components/theme-provider';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import type React from 'react';
import './globals.css';
import { Toaster } from '@/components/ui/sonner';


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
                        <Toaster position='top-right'/>
                        {children}
                    </ThemeProvider>
                </SessionProvider>
            </body>
        </html>
    );
}
