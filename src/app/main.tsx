'use client';

import { useEffect, useState, useCallback, useRef } from 'react';

import { AppLayout } from '@/app/app-layout';
import { useAuthStore } from '@/store/use-auth-store';
import { useToastStore } from '@/store/use-toast-store';
import { useUsaintStore } from '@/store/use-usaint-store';
import { useUIStore } from '@/store/use-ui-store';
import { useRouter } from 'next/navigation';
import { RefreshCw } from 'lucide-react';

import { CategoryGradeCard } from '@/components/category-grade-card';
import { ChapelCard } from '@/components/chapel-card';
import { DashboardSkeleton } from '@/components/dashboard-skeleton';
import { GraduationCard } from '@/components/graduation-card';
import { ScholarshipCard } from '@/components/scholarship-card';
import { SemesterGradeCard } from '@/components/semester-grade-card';
import { StudentInfoCard } from '@/components/student-info';
import { TimetableCard } from '@/components/timetable-card';
import { TuitionCard } from '@/components/tuition-card';

import { usaintService } from '@/services';

import { getErrorMessage } from '@/utils/get-error-message';
import { cn } from '@/utils';

export default function Main() {
    const router = useRouter();
    const { appSessionId, isAuthenticated, isHydrated, logout } = useAuthStore();
    const {
        studentInfo,
        tuitionInfo,
        tuitionNotice,
        timetableInfo,
        graduationInfo,
        chapelInfo,
        categoryGrade,
        semesterGrade,
        scholarshipInfo,
    } = useUsaintStore();
    const { bgType } = useUIStore();
    const [isLoading, setIsLoading] = useState(false);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const showToast = useToastStore((s) => s.show);
    const initialFetchDone = useRef(false);

    useEffect(() => {
        if (isHydrated && !isAuthenticated) {
            router.push('/login');
        }
    }, [isAuthenticated, isHydrated, router]);

    const fetchUsaintData = useCallback(async (isManualRefresh = false) => {
        if (!appSessionId || !isAuthenticated) return;

        // If we don't have any data yet, show the main loader
        const hasNoData = !studentInfo && !tuitionInfo && !tuitionNotice && !timetableInfo && !graduationInfo && !chapelInfo && !categoryGrade && !semesterGrade && !scholarshipInfo;
        
        if (isManualRefresh) {
            setIsRefreshing(true);
        } else if (hasNoData) {
            setIsLoading(true);
        }

        try {
            const fetchTasks = [
                usaintService.callStudentInfoApi({ appSessionId }),
                usaintService.callTuitionApi({ appSessionId }),
                usaintService.callTuitionNoticeApi({ appSessionId }),
                usaintService.callTimetableApi({ appSessionId }),
                usaintService.callGraduationApi({ appSessionId }),
                usaintService.callCategoryGrade({ appSessionId }),
                usaintService.callSemesterGradeApi({ appSessionId }),
                usaintService.callSemesterGradeOldVersionApi({ appSessionId }),
                usaintService.callChapelApi({ appSessionId }),
                usaintService.callScholarshipApi({ appSessionId }),
            ];
            const apiNames: string[] = [
                'Student Info',
                'Tuition History',
                'Tuition Notice',
                'Timetable',
                'Graduation Audit',
                'Category Grade',
                'Semester Grade',
                'Semester Grade (Old)',
                'Chapel Attendance',
                'Scholarship',
            ];

            // Fetch all selected data in parallel
            const results = await Promise.allSettled(fetchTasks);

            // Check for failures and show toasts
            results.forEach((result, index) => {
                if (result.status === 'rejected') {
                    const error = result.reason;
                    const name = apiNames[index];

                    console.error(`Error fetching ${name}:`, error);

                    if (error?.error === 'Session expired or invalid. Please login again.') {
                        logout();
                        return;
                    }

                    showToast({
                        title: `${name} Failed`,
                        message: getErrorMessage(error, `Failed to fetch ${name}`),
                        type: 'error',
                    });
                }
            });

            if (isManualRefresh) {
                showToast({
                    title: 'Sync Complete',
                    message: 'All data has been updated successfully.',
                    type: 'success',
                });
            }
        } catch (error: any) {
            console.error('Error fetching data:', error);
        } finally {
            setIsLoading(false);
            setIsRefreshing(false);
        }
    }, [appSessionId, isAuthenticated, studentInfo, tuitionInfo, tuitionNotice, timetableInfo, graduationInfo, chapelInfo, categoryGrade, semesterGrade, scholarshipInfo, logout, showToast]);

    // Initial Fetch
    useEffect(() => {
        if (!initialFetchDone.current && isHydrated && isAuthenticated && appSessionId) {
            fetchUsaintData();
            initialFetchDone.current = true;
        }
    }, [isHydrated, isAuthenticated, appSessionId, fetchUsaintData]);

    return (
        <AppLayout
            title="SSU Dashboard"
            subtitle="Manage your academic information in one place."
            showBackgroundSelector
            headerRight={
                isAuthenticated && (
                    <button
                        onClick={() => fetchUsaintData(true)}
                        disabled={isRefreshing || isLoading}
                        className="flex h-10 items-center gap-2 rounded-xl border border-border bg-white dark:bg-zinc-950 px-4 text-sm font-black text-zinc-900 dark:text-zinc-50 transition-all hover:bg-accent disabled:opacity-50"
                    >
                        <RefreshCw className={cn("h-4 w-4", isRefreshing && "animate-spin")} />
                        <span>{isRefreshing ? 'Syncing...' : 'Sync Now'}</span>
                    </button>
                )
            }
        >
            {!isHydrated ? (
                <DashboardSkeleton />
            ) : isAuthenticated ? (
                isLoading ? (
                    <DashboardSkeleton />
                ) : (
                    <div className="flex flex-col gap-6">
                        {/* Left Column (Student Info + Tuition): Takes 2/5 width */}
                        <div className="flex gap-6  flex-col lg:flex-row">
                            <div className="flex flex-col gap-6 lg:max-w-100">
                                {studentInfo && <StudentInfoCard data={studentInfo} />}
                                <ChapelCard data={chapelInfo} studentId={studentInfo?.studentId} />
                            </div>
                            {/* Right Column (Graduation Audit): Takes 3/5 width */}
                            <div className="flex-1 lg:min-w-150">
                                <TimetableCard data={timetableInfo} className="h-full" />
                            </div>
                        </div>

                        <div className="flex gap-6 flex-col lg:flex-row">
                            <div className={'flex-1 lg:min-w-150'}>
                                {graduationInfo && <GraduationCard data={graduationInfo} />}
                            </div>
                            <div className="gap-6 w-full flex-1 flex flex-col">
                                {tuitionInfo && (
                                    <TuitionCard data={tuitionInfo} noticeData={tuitionNotice ?? undefined} />
                                )}
                            </div>
                        </div>

                        {categoryGrade && <CategoryGradeCard data={categoryGrade} />}
                        <div className="flex flex-col lg:flex-row gap-6 items-stretch">
                            <div className="flex-1">
                                {semesterGrade && <SemesterGradeCard data={semesterGrade} className="h-full" />}
                            </div>
                            <div className="flex-1">
                                {scholarshipInfo && <ScholarshipCard data={scholarshipInfo} className="h-full" />}
                            </div>
                        </div>
                    </div>
                )
            ) : (
                <div className="flex h-48 flex-col items-center justify-center gap-4 rounded-2xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950">
                    <p className="text-zinc-500 text-center px-4">Please login to access student info.</p>
                    <a
                        href="/login"
                        className="inline-flex h-10 items-center justify-center rounded-md bg-zinc-900 px-8 text-sm font-medium text-zinc-50 transition-colors hover:bg-zinc-900/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-zinc-950 disabled:pointer-events-none disabled:opacity-50 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-50/90 dark:focus-visible:ring-zinc-300"
                    >
                        Login
                    </a>
                </div>
            )}
        </AppLayout>
    );
}
