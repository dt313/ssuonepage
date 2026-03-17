import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';

import { ThemeProvider } from '@/components/providers/theme-provider';
import ToastProvider from '@/components/providers/toast-provider';

import { AppLayout } from './app-layout';
import './styles/globals.css';

export const metadata: Metadata = {
    title: {
        template: '%s | SSU Dashboard',
        default: 'SSU Dashboard',
    },
    applicationName: 'SSU Dashboard',
};

const geistSans = Geist({
    variable: '--font-geist-sans',
    subsets: ['latin'],
});

const geistMono = Geist_Mono({
    variable: '--font-geist-mono',
    subsets: ['latin'],
});

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
                <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
                    <AppLayout>
                        {children}
                        <ToastProvider />
                    </AppLayout>
                </ThemeProvider>
            </body>
        </html>
    );
}
