// store/use-toast-store.ts
import { create } from 'zustand';

export type ToastType = 'success' | 'error' | 'info';

export interface ToastItem {
    id: string;
    title?: string;
    message: string;
    duration?: number;
    type?: ToastType;
}

interface ToastState {
    toasts: ToastItem[];
    show: (toast: Omit<ToastItem, 'id'>) => void;
    dismiss: (id: string) => void;
}

export const useToastStore = create<ToastState>((set) => ({
    toasts: [],
    show: (toast) =>
        set((state) => ({
            toasts: [
                ...state.toasts,
                {
                    id: crypto.randomUUID(),
                    duration: 3000,
                    type: 'info',
                    ...toast,
                },
            ],
        })),

    dismiss: (id) =>
        set((state) => ({
            toasts: state.toasts.filter((t) => t.id !== id),
        })),
}));
