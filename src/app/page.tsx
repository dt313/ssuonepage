'use client';

import { useEffect, useState } from 'react';

import { useAuthStore } from '@/store/use-auth-store';

import { ThemeToggleButton } from '@/components/theme-toggle-button';
import { StudentInfoCard } from '@/components/student-info';
import { Loader } from '@/components/ui/loader';

import { usaintService } from '@/services';
import { StudentInfo } from '@/types/api';

export default function Home() {
    const { appSessionId, isAuthenticated } = useAuthStore();
    const [studentInfo, setStudentInfo] = useState<StudentInfo | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const fetchUsaintData = async () => {
            if (!appSessionId || !isAuthenticated) return;

            setIsLoading(true);
            try {
                const res = await usaintService.callStudentInfoApi({ appSessionId });
                if (res.success) {
                    setStudentInfo(res.data);
                }
            } catch (error) {
                console.error('Error fetching student info:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchUsaintData();
    }, [appSessionId, isAuthenticated]);

    return (
        <div className="flex min-h-screen flex-col items-center bg-gray-50 p-4 dark:bg-zinc-900 gap-8 pt-12">
            <div className="fixed top-4 right-4">
                <ThemeToggleButton />
            </div>

            <div className="w-full max-w-2xl flex flex-col gap-8">
                <header className="flex flex-col gap-2">
                    <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
                        SSU Dashboard
                    </h1>
                    <p className="text-zinc-500 dark:text-zinc-400">
                        Manage your academic information in one place.
                    </p>
                </header>

                <main className="flex flex-col gap-8">
                    {isAuthenticated ? (
                        isLoading ? (
                            <div className="flex h-48 items-center justify-center rounded-2xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950">
                                <Loader className="h-8 w-8 text-blue-600" />
                            </div>
                        ) : studentInfo ? (
                            <StudentInfoCard data={studentInfo} />
                        ) : (
                            <div className="flex h-48 items-center justify-center rounded-2xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950">
                                <p className="text-zinc-500">Failed to load student information.</p>
                            </div>
                        )
                    ) : (
                        <div className="flex h-48 flex-col items-center justify-center gap-4 rounded-2xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950">
                            <p className="text-zinc-500 text-center px-4">
                                Please login to access student info.
                            </p>
                            <a 
                                href="/login" 
                                className="inline-flex h-10 items-center justify-center rounded-md bg-zinc-900 px-8 text-sm font-medium text-zinc-50 transition-colors hover:bg-zinc-900/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-zinc-950 disabled:pointer-events-none disabled:opacity-50 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-50/90 dark:focus-visible:ring-zinc-300"
                            >
                                Login
                            </a>
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
}
