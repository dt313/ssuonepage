'use client';

import { cn } from '@/utils/cn';

interface TimetableCardProps {
    data: string[][];
    className?: string;
}

export function TimetableCard({ data, className }: TimetableCardProps) {
    if (!data || data.length === 0) return null;

    const headers = data[0];
    const rows = data.slice(1);

    return (
        <div
            className={cn(
                'w-full overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm transition-all hover:shadow-md dark:border-zinc-800 dark:bg-zinc-950',
                className,
            )}
        >
            <div className="border-b border-zinc-200 p-6 dark:border-zinc-800">
                <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-50">Weekly Timetable</h3>
            </div>
            <div className="overflow-x-auto p-6">
                <table className="w-full text-left text-xs sm:text-sm">
                    <thead>
                        <tr className="border-b border-zinc-100 dark:border-zinc-900">
                            {headers.map((header, idx) => (
                                <th key={idx} className="pb-3 font-semibold text-zinc-500 whitespace-nowrap">
                                    {header}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-100 dark:divide-zinc-900">
                        {rows.map((row, rowIdx) => (
                            <tr key={rowIdx}>
                                {row.map((cell, cellIdx) => (
                                    <td key={cellIdx} className="py-3 pr-2 text-zinc-900 dark:text-zinc-50 whitespace-nowrap">
                                        {cell}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
