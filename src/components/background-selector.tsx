'use client';

import { useUIStore } from '@/store/use-ui-store';
import { Palette } from 'lucide-react';

import { cn } from '@/utils';

import { Dropdown } from './ui/dropdown';

export type BackgroundType = 'dashed-grid' | 'dots' | 'gradient' | 'solid' | 'none';

const options: { value: BackgroundType; label: string }[] = [
    { value: 'dashed-grid', label: 'Dashed Grid' },
    { value: 'dots', label: 'Dots' },
    { value: 'gradient', label: 'Gradient' },
    { value: 'solid', label: 'Solid Color' },
];

export function BackgroundSelector() {
    const { bgType, setBgType } = useUIStore();

    return (
        <Dropdown
            align="end"
            className="min-w-44"
            id="bg-selector"
            trigger={
                <button
                    className="flex h-9 w-9 items-center justify-center rounded-full border border-border bg-white dark:bg-zinc-950 transition-colors hover:bg-accent"
                    aria-label="Change background"
                >
                    <Palette className="h-4 w-4 text-zinc-500" />
                </button>
            }
        >
            <div className="py-2">
                <div className="px-3 py-2 text-[10px] font-black uppercase tracking-widest text-card-text-muted border-b border-card-border mb-1">
                    Background Style
                </div>
                <div className="flex flex-col gap-0.5">
                    {options.map((opt) => (
                        <button
                            key={opt.value}
                            onClick={() => {
                                setBgType(opt.value);
                            }}
                            className={cn(
                                'flex w-full items-center justify-between px-3 py-2 text-xs font-bold outline-none transition-colors hover:bg-card-bg-secondary',
                                bgType === opt.value ? 'bg-card-bg-secondary text-primary' : 'text-card-text-secondary',
                            )}
                        >
                            <span>{opt.label}</span>
                            {bgType === opt.value && <div className="h-1.5 w-1.5 rounded-full bg-primary" />}
                        </button>
                    ))}
                </div>
            </div>
        </Dropdown>
    );
}

export function DashedGridBackground() {
    return (
        <div
            className="absolute inset-0 z-0 pointer-events-none opacity-50 dark:opacity-20"
            style={{
                backgroundImage: `
                    linear-gradient(to right, #e7e5e4 1px, transparent 1px),
                    linear-gradient(to bottom, #e7e5e4 1px, transparent 1px)
                `,
                backgroundSize: '20px 20px',
                backgroundPosition: '0 0, 0 0',
                maskImage: `
                    repeating-linear-gradient(
                        to right,
                        black 0px,
                        black 3px,
                        transparent 3px,
                        transparent 8px
                    ),
                    repeating-linear-gradient(
                        to bottom,
                        black 0px,
                        black 3px,
                        transparent 3px,
                        transparent 8px
                    )
                `,
                WebkitMaskImage: `
                    repeating-linear-gradient(
                        to right,
                        black 0px,
                        black 3px,
                        transparent 3px,
                        transparent 8px
                    ),
                    repeating-linear-gradient(
                        to bottom,
                        black 0px,
                        black 3px,
                        transparent 3px,
                        transparent 8px
                    )
                `,
                maskComposite: 'intersect',
                WebkitMaskComposite: 'source-in',
            }}
        />
    );
}

export function DotsBackground() {
    return (
        <div
            className="absolute inset-0 z-0 pointer-events-none"
            style={{
                backgroundImage: 'radial-gradient(circle at 1px 1px, var(--dot-color) 1px, transparent 0)',
                backgroundSize: '20px 20px',
            }}
        />
    );
}

export function GradientBackground() {
    return (
        <div
            className="absolute inset-0 z-0 pointer-events-none"
            style={{
                background: `
                    radial-gradient(circle at 0% 0%, rgba(7, 147, 179, 0.15) 0%, transparent 50%),
                    radial-gradient(circle at 100% 0%, rgba(139, 92, 246, 0.15) 0%, transparent 50%),
                    radial-gradient(circle at 100% 100%, rgba(236, 72, 153, 0.15) 0%, transparent 50%),
                    radial-gradient(circle at 0% 100%, rgba(245, 158, 11, 0.12) 0%, transparent 50%),
                    radial-gradient(circle at 50% 50%, rgba(6, 182, 212, 0.08) 0%, transparent 50%),
                    linear-gradient(135deg, var(--gradient-from) 0%, var(--gradient-to) 100%)
                `,
            }}
        />
    );
}

export function SolidBackground() {
    return <div className="absolute inset-0 z-0 bg-zinc-50/50 dark:bg-zinc-900/50" />;
}
