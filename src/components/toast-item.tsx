// components/toast/toast-item.tsx
'use client';

import { useEffect, useState } from 'react';

import { useToastStore } from '@/store/use-toast-store';
import type { ToastItem } from '@/store/use-toast-store';
import * as Toast from '@radix-ui/react-toast';
import { AlertCircle, CheckCircle2, Info, X } from 'lucide-react';

function ToastItem({ toast }: { toast: ToastItem }) {
    const dismiss = useToastStore((s) => s.dismiss);
    const [open, setOpen] = useState(true);

    // Handle dismissing after animation
    useEffect(() => {
        if (!open) {
            const timer = setTimeout(() => {
                dismiss(toast.id);
            }, 300); // Match animation duration
            return () => clearTimeout(timer);
        }
    }, [open, toast.id, dismiss]);

    const icons = {
        success: <CheckCircle2 className="h-5 w-5 text-green-500" />,
        error: <AlertCircle className="h-5 w-5 text-red-500" />,
        info: <Info className="h-5 w-5 text-blue-500" />,
    };

    const variantStyles = {
        success: 'border-green-100 bg-green-50 dark:bg-green-900/10 dark:border-green-900/20',
        error: 'border-red-100 bg-red-50 dark:bg-red-900/10 dark:border-red-900/20',
        info: 'border-blue-100 bg-blue-50 dark:bg-blue-900/10 dark:border-blue-900/20',
    };

    return (
        <Toast.Root
            open={open}
            onOpenChange={setOpen}
            className={`
                group pointer-events-auto relative flex w-full shrink-0 items-center justify-between space-x-4 overflow-hidden rounded-xl border p-4 shadow-lg transition-all
                data-[state=open]:animate-toast-in data-[state=closed]:animate-toast-out data-[swipe=end]:animate-toast-out
                data-[swipe=cancel]:translate-x-0 data-[swipe=end]:translate-x-[var(--radix-toast-swipe-end-x)] data-[swipe=move]:translate-x-[var(--radix-toast-swipe-move-x)] data-[swipe=move]:transition-none
                ${variantStyles[toast.type || 'info']}
            `}
            duration={toast.duration}
        >
            <div className="flex gap-3">
                <div className="shrink-0">{icons[toast.type || 'info']}</div>
                <div className="grid gap-1">
                    {toast.title && (
                        <Toast.Title className="text-sm font-semibold text-foreground leading-none">
                            {toast.title}
                        </Toast.Title>
                    )}
                    <Toast.Description className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                        {toast.message}
                    </Toast.Description>
                </div>
            </div>

            <Toast.Close className="absolute right-2 top-2 rounded-md p-1 text-zinc-400 transition-opacity hover:text-zinc-950 focus:opacity-100 group-hover:opacity-100">
                <X className="h-4 w-4" />
            </Toast.Close>
        </Toast.Root>
    );
}

export default ToastItem;
