'use client';

import { StudentInfo } from '@/types/api';

import Avatar from '@/components/ui/avatar';

import { cn } from '@/utils/cn';

interface StudentInfoProps {
    data: StudentInfo;
    className?: string;
}

export function StudentInfoCard({ data, className }: StudentInfoProps) {
    const { name, studentId, faculty, department, year, semester, englishName, avatar } = data;

    const initials = name?.slice(0, 2).toUpperCase() || 'ST';

    return (
        <div
            className={cn(
                'relative w-full flex flex-col py-2 bg-white rounded-2xl border border-zinc-200 dark:border-zinc-800 dark:bg-zinc-950 shadow-sm transition-all hover:shadow-md',
                className,
            )}
        >
            <div className="flex items-center justify-between p-4 px-8">
                <Avatar
                    className="relative h-24 w-24 border-2 border-white dark:border-zinc-900 shadow-sm md:h-32 md:w-32"
                    size={60}
                    fallback={initials}
                    src={avatar}
                />
                <h2 className="text-lg font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
                    {name}님, 환영합니다
                </h2>
            </div>

            <div className="flex items-center justify-between p-2 px-8">
                <span className="text-sm font-medium text-zinc-500 dark:text-zinc-400"> Current Term</span>
                <p className="text-md text-primary tracking-tight">
                    {year}학년 {semester}학기
                </p>
            </div>

            <div className="flex items-center justify-between p-2 px-8">
                <span className="text-sm font-medium text-zinc-500 dark:text-zinc-400"> English Name</span>
                <p className="text-md text-primary tracking-tight">{englishName}</p>
            </div>

            <div className="flex items-center justify-between p-2 px-8">
                <span className="text-sm font-medium text-zinc-500 dark:text-zinc-400"> Student ID </span>
                <p className="text-md text-primary tracking-tight">{studentId}</p>
            </div>

            <div className="flex items-center justify-between p-2 px-8">
                <span className="text-sm font-medium text-zinc-500 dark:text-zinc-400"> Faculty </span>
                <p className="text-md text-primary tracking-tight">{faculty}</p>
            </div>

            <div className="flex items-center justify-between p-2 px-8">
                <span className="text-sm font-medium text-zinc-500 dark:text-zinc-400"> Department </span>
                <p className="text-md text-primary tracking-tight">{department}</p>
            </div>
        </div>
    );
}
