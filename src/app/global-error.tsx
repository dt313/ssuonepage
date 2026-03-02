'use client';

import { useEffect } from 'react';

import { Geist, Geist_Mono } from 'next/font/google';

import { ThemeProvider } from '@/components/providers/theme-provider';
import { Button } from '@/components/ui/button';

import './styles/globals.css';

const geistSans = Geist({
    variable: '--font-geist-sans',
    subsets: ['latin'],
});

const geistMono = Geist_Mono({
    variable: '--font-geist-mono',
    subsets: ['latin'],
});

export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
    useEffect(() => {
        console.error('Global Error caught:', error);
    }, [error]);

    return (
        <html lang="en" suppressHydrationWarning>
            <body className={`${geistSans.variable} ${geistMono.variable} font-sans antialiased`}>
                <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
                    <div className="flex h-screen w-full flex-col items-center justify-center bg-background text-foreground p-4">
                        <div className="flex max-w-md flex-col items-center gap-8 text-center">
                            <div className="space-y-4">
                                <div className="flex justify-center">
                                    <div className="rounded-full bg-primary/10 p-6">
                                        <svg
                                            className="h-16 w-16 text-primary"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                            strokeWidth={1.5}
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                                            />
                                        </svg>
                                    </div>
                                </div>
                                <h1 className="text-4xl font-bold tracking-tight">Something went wrong!</h1>
                                <p className="text-lg text-zinc-500 dark:text-zinc-400">
                                    An unexpected error occurred at the root of the application. We have been notified
                                    and are working to fix the issue.
                                </p>
                            </div>

                            <div className="flex w-full flex-col gap-3 sm:flex-row">
                                <Button
                                    onClick={() => reset()}
                                    size="lg"
                                    className="w-full sm:flex-1 py-6 font-semibold"
                                >
                                    Try again
                                </Button>
                                <Button
                                    variant="outline"
                                    size="lg"
                                    className="w-full sm:flex-1 py-6 font-semibold"
                                    onClick={() => (window.location.href = '/')}
                                >
                                    Back to Home
                                </Button>
                            </div>

                            {error.digest && (
                                <div className="rounded-lg border border-border bg-accent/50 p-3">
                                    <p className="text-xs text-zinc-500 dark:text-zinc-400">
                                        Error Reference:{' '}
                                        <span className="font-mono font-bold text-primary">{error.digest}</span>
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </ThemeProvider>
            </body>
        </html>
    );
}
