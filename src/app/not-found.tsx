'use client';
import { useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';

export default function NotFound() {
    const router = useRouter();
    return (
        <div className="flex h-screen w-full flex-col items-center justify-center bg-background text-foreground p-4">
            <div className="flex max-w-md flex-col items-center gap-8 text-center">
                <div className="space-y-4">
                    <div className="flex justify-center">
                        <div className="rounded-full bg-primary/10 p-6">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth={1.5}
                                stroke="currentColor"
                                className="h-16 w-16 text-primary"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 5.25h.008v.008H12v-.008Z"
                                />
                            </svg>
                        </div>
                    </div>
                    <h1 className="text-4xl font-bold tracking-tight">Page Not Found</h1>
                    <p className="text-lg text-zinc-500 dark:text-zinc-400">
                        The page you are looking for does not exist or has been moved.
                    </p>
                </div>

                <div className="flex w-full flex-col gap-3 sm:flex-row">
                    <Button
                        size="lg"
                        className="w-full sm:flex-1 py-6 font-semibold"
                        onClick={() => router.push('/feed')}
                    >
                        Go to Feed
                    </Button>
                </div>
            </div>
        </div>
    );
}
