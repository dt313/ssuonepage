'use client';

import { GraduationInfo } from '@/types/api';
import { cn } from '@/utils/cn';

interface GraduationCardProps {
    data: GraduationInfo;
    className?: string;
}

export function GraduationCard({ data, className }: GraduationCardProps) {
    const { graduationCredits, recognizedCredits, graduationResult, graduationAuditDate, categories } = data;

    return (
        <div
            className={cn(
                'w-full overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm transition-all hover:shadow-md dark:border-zinc-800 dark:bg-zinc-950',
                className,
            )}
        >
            <div className="border-b border-zinc-200 p-6 dark:border-zinc-800">
                <div className="flex items-center justify-between">
                    <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-50">Graduation Audit</h3>
                    <span className="text-xs text-zinc-500">Last updated: {graduationAuditDate}</span>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-4 p-6 sm:grid-cols-3">
                <div className="rounded-xl bg-zinc-50 p-4 dark:bg-zinc-900">
                    <p className="text-xs font-medium text-zinc-500 uppercase">Requirement</p>
                    <p className="mt-1 text-lg font-bold text-zinc-900 dark:text-zinc-50">{graduationCredits}</p>
                </div>
                <div className="rounded-xl bg-zinc-50 p-4 dark:bg-zinc-900">
                    <p className="text-xs font-medium text-zinc-500 uppercase">Recognized</p>
                    <p className="mt-1 text-lg font-bold text-zinc-900 dark:text-zinc-50">{recognizedCredits}</p>
                </div>
                <div className="rounded-xl bg-primary/10 p-4 dark:bg-primary/20">
                    <p className="text-xs font-medium text-primary uppercase">Result</p>
                    <p className="mt-1 text-lg font-bold text-primary">{graduationResult}</p>
                </div>
            </div>

            <div className="overflow-x-auto px-6 pb-6">
                <table className="w-full text-left text-sm">
                    <thead>
                        <tr className="border-b border-zinc-100 dark:border-zinc-900 text-xs text-zinc-500 uppercase">
                            <th className="pb-3 font-semibold">Category</th>
                            <th className="pb-3 font-semibold">Req.</th>
                            <th className="pb-3 font-semibold">Earned</th>
                            <th className="pb-3 text-right font-semibold">Result</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-100 dark:divide-zinc-900">
                        {categories.map((cat, idx) => (
                            <tr key={idx} className="group">
                                <td className="py-3 pr-2">
                                    <p className="font-medium text-zinc-900 dark:text-zinc-50">{cat.requirement}</p>
                                    <p className="text-xs text-zinc-500">{cat.domain}</p>
                                </td>
                                <td className="py-3 text-zinc-600 dark:text-zinc-400">{cat.referenceValue}</td>
                                <td className="py-3 text-zinc-600 dark:text-zinc-400">{cat.calculatedValue}</td>
                                <td className="py-3 text-right">
                                    <span className={cn(
                                        "inline-flex rounded-full px-2 py-0.5 text-xs font-medium",
                                        cat.result.includes('Pass') || cat.result.includes('P') || cat.result.includes('합격') 
                                            ? "bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-300"
                                            : "bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300"
                                    )}>
                                        {cat.result}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
