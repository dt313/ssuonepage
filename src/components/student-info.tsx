'use client';

import { StudentInfo } from '@/types/api';
import Avatar from '@/components/ui/avatar';
import { cn } from '@/utils/cn';

interface StudentInfoProps {
    data: StudentInfo;
    className?: string;
}

export function StudentInfoCard({ data, className }: StudentInfoProps) {
    const {
        name,
        studentId,
        status,
        faculty,
        department,
        class: studentClass,
        year,
        semester,
        englishName,
    } = data;

    const initials = name?.slice(0, 2).toUpperCase() || 'ST';

    return (
        <div
            className={cn(
                'w-full max-w-2xl overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm transition-all hover:shadow-md dark:border-zinc-800 dark:bg-zinc-950',
                className,
            )}
        >
            <div className="relative h-24 bg-gradient-to-r from-blue-600 to-indigo-600 p-6 sm:h-32">
                <div className="absolute -bottom-10 left-6 sm:-bottom-12">
                    <Avatar
                        className="border-4 border-white dark:border-zinc-950 shadow-lg"
                        size={80}
                        fallback={initials}
                    />
                </div>
            </div>

            <div className="px-6 pt-12 pb-6 sm:pt-16 sm:pb-8">
                <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
                    <div>
                        <h2 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
                            {name}
                            <span className="ml-2 text-sm font-normal text-zinc-500 dark:text-zinc-400">
                                ({englishName})
                            </span>
                        </h2>
                        <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
                            {studentId} • {status}
                        </p>
                    </div>
                    <div className="inline-flex items-center rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-semibold text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
                        {year}년 {semester}
                    </div>
                </div>

                <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2">
                    <div className="space-y-1">
                        <p className="text-xs font-medium uppercase tracking-wider text-zinc-500 dark:text-zinc-500">
                            Faculty
                        </p>
                        <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">
                            {faculty}
                        </p>
                    </div>
                    <div className="space-y-1">
                        <p className="text-xs font-medium uppercase tracking-wider text-zinc-500 dark:text-zinc-500">
                            Department
                        </p>
                        <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">
                            {department}
                        </p>
                    </div>
                    <div className="space-y-1">
                        <p className="text-xs font-medium uppercase tracking-wider text-zinc-500 dark:text-zinc-500">
                            Class
                        </p>
                        <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">
                            {studentClass}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
