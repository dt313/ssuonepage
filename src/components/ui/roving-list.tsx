'use client';

import { ReactNode } from 'react';

import * as RovingFocus from '@radix-ui/react-roving-focus';

import { cn } from '@/utils';

type RovingListProps = {
    children: ReactNode;
    className?: string;
    orientation?: 'vertical' | 'horizontal';
    loop?: boolean;
};

export function RovingList({ children, className, orientation = 'vertical', loop = true }: RovingListProps) {
    return (
        <RovingFocus.Root orientation={orientation} loop={loop} className={cn('flex flex-col gap-1', className)}>
            {children}
        </RovingFocus.Root>
    );
}
