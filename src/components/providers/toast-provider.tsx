// components/toast/toast-provider.tsx
'use client';

import { useToastStore } from '@/store/use-toast-store';
import * as Toast from '@radix-ui/react-toast';

import ToastItem from '../toast-item';

function ToastProvider() {
    const toasts = useToastStore((s) => s.toasts);

    return (
        <Toast.Provider swipeDirection="right">
            {toasts.map((toast) => (
                <ToastItem key={toast.id} toast={toast} />
            ))}
            <Toast.Viewport
                className="fixed bottom-0 right-0 z-[100] 
            flex max-h-screen w-full flex-col gap-2 p-4 md:max-w-[420px]"
            />
        </Toast.Provider>
    );
}

export default ToastProvider;
