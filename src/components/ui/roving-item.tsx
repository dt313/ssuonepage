'use client';

import { ReactNode } from 'react';

import * as RovingFocus from '@radix-ui/react-roving-focus';

import { cn } from '@/utils';

export function RovingRoot({
    children,
    className,
    orientation = 'vertical',
    loop = true,
}: {
    children: ReactNode;
    className?: string;
    orientation?: 'vertical' | 'horizontal';
    loop?: boolean;
}) {
    return (
        <RovingFocus.Root orientation={orientation} loop={loop} className={cn('flex flex-col gap-1', className)}>
            {children}
        </RovingFocus.Root>
    );
}

export function RovingItem({ children }: { children: ReactNode }) {
    return (
        <RovingFocus.Item asChild focusable>
            {children}
        </RovingFocus.Item>
    );
}
