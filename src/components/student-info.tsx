'use client';

import { useState } from 'react';

import { StudentInfo } from '@/types/api';
import { Check, Copy, GraduationCap, User } from 'lucide-react';

import Avatar from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';

import { cn } from '@/utils/cn';

interface StudentInfoProps {
    data: StudentInfo;
    className?: string;
}

export function StudentInfoCard({ data, className }: StudentInfoProps) {
    const {
        name,
        studentId,
        faculty,
        department,
        year,
        semester,
        englishName,
        avatar,
        admissionDate,
        degreeConferralDate,
        degreeName,
    } = data;
    const [copied, setCopied] = useState(false);

    const isGraduated = degreeConferralDate && degreeConferralDate.trim() !== '';

    const initials = name?.slice(0, 2).toUpperCase() || 'ST';

    const handleCopy = () => {
        const info = `
                이름: ${name}
                학번: ${studentId}
                대학(원): ${faculty}
                소속: ${department}
                학년/학기: ${year}학년 ${semester}학기
                영어 이름: ${englishName}
                입학일자: ${admissionDate}
                ${isGraduated ? `학위수여일자: ${degreeConferralDate}` : ''}
                        `.trim();

        navigator.clipboard.writeText(info).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        });
    };

    return (
        <div
            className={cn(
                'w-full flex flex-col bg-white rounded-2xl pb-6 border border-zinc-200 dark:border-zinc-800 dark:bg-zinc-950 shadow-sm transition-all hover:shadow-md',
                className,
            )}
        >
            <div className="flex items-center justify-between border-b border-zinc-100 p-5 dark:border-zinc-900/50">
                <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/10 text-blue-600 dark:bg-blue-500/20 dark:text-amber-400">
                        <User className="h-5.5 w-5.5" />
                    </div>
                    <div>
                        <h3 className="text-lg font-black text-zinc-900 dark:text-zinc-50 tracking-tight">학생 정보</h3>
                        <p className="text-sm text-zinc-400 uppercase tracking-wider">학생의 개인 정보</p>
                    </div>
                </div>
                <Button variant="ghost" size="icon" onClick={handleCopy} className="h-8 w-8">
                    {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                </Button>
            </div>

            <div className="flex items-center justify-between p-4 px-8 pt-6">
                <Avatar
                    className="relative h-24 w-24 mr-4 border-2 border-white dark:border-zinc-900 shadow-sm md:h-32 md:w-32"
                    size={60}
                    fallback={initials}
                    src={avatar}
                />
                <div className="flex flex-col gap-1">
                    <h2 className="text-lg font-black tracking-tight text-zinc-900 dark:text-zinc-50">
                        {name}님, 환영합니다
                    </h2>
                    {isGraduated && (
                        <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-amber-500/10 border border-amber-500/20 w-fit">
                            <GraduationCap className="h-3 w-3 text-amber-600 dark:text-amber-400" />
                            <span className="text-[10px] font-black text-amber-700 dark:text-amber-400 uppercase tracking-tighter">
                                졸업생 (GRADUATED)
                            </span>
                        </div>
                    )}
                </div>
            </div>

            <div className="flex items-center justify-between p-2 px-8">
                <span className="text-sm font-medium text-zinc-500 dark:text-zinc-400">학년/학기</span>
                <p className="text-sm font-semibold text-primary tracking-tight">
                    {year}학년 {semester}학기
                </p>
            </div>

            {data.englishName && (
                <div className="flex items-center justify-between p-2 px-8">
                    <span className="text-sm font-medium text-zinc-500 dark:text-zinc-400">영어 이름</span>
                    <p className="text-sm font-semibold text-primary tracking-tight">{englishName}</p>
                </div>
            )}

            <div className="flex items-center justify-between p-2 px-8">
                <span className="text-sm font-medium text-zinc-500 dark:text-zinc-400">학번</span>
                <p className="text-sm font-semibold text-primary tracking-tight">{studentId}</p>
            </div>

            <div className="flex items-center justify-between p-2 px-8">
                <span className="text-sm font-medium text-zinc-500 dark:text-zinc-400">대학(원)</span>
                <p className="text-sm font-semibold text-primary tracking-tight">{faculty}</p>
            </div>

            <div className="flex items-center justify-between p-2 px-8">
                <span className="text-sm font-medium text-zinc-500 dark:text-zinc-400">소속</span>
                <p className="text-sm font-semibold text-primary tracking-tight">{department}</p>
            </div>

            <div className="flex items-center justify-between p-2 px-8">
                <span className="text-sm font-medium text-zinc-500 dark:text-zinc-400">입학일자</span>
                <p className="text-sm font-semibold text-primary tracking-tight">{admissionDate}</p>
            </div>

            {isGraduated && (
                <>
                    <div className="mx-8 my-2 border-t border-zinc-100 dark:border-zinc-900" />
                    <div className="flex items-center justify-between p-2 px-8">
                        <span className="text-sm font-black text-amber-600 dark:text-amber-400 uppercase tracking-tighter">
                            학위수여일자
                        </span>
                        <p className="text-sm font-black text-amber-600 dark:text-amber-400 tracking-tight">
                            {degreeConferralDate}
                        </p>
                    </div>

                    {degreeName && (
                        <div className="flex items-center justify-between p-2 px-8">
                            <span className="text-sm font-medium text-zinc-500 dark:text-zinc-400">학위명</span>
                            <p className="text-sm font-semibold text-primary tracking-tight">{degreeName}</p>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}
