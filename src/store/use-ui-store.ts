import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import { BackgroundType } from '@/components/background-selector';

interface UIState {
    bgType: BackgroundType;
    setBgType: (bgType: BackgroundType) => void;
    isHydrated: boolean;
    setHydrated: () => void;
    blurEffect: boolean;
    setBlurEffect: (blurEffect: boolean) => void;
}

export const useUIStore = create<UIState>()(
    persist(
        (set) => ({
            bgType: 'solid',
            setBgType: (bgType: BackgroundType) => set({ bgType }),
            isHydrated: false,
            setHydrated: () => set({ isHydrated: true }),
            blurEffect: false,
            setBlurEffect: (blurEffect: boolean) => set({ blurEffect }),
        }),
        {
            name: 'ui-storage',
            storage: createJSONStorage(() => localStorage),
            onRehydrateStorage: () => (state) => {
                state?.setHydrated();
            },
            partialize: (state) => ({
                bgType: state.bgType,
                blurEffect: state.blurEffect,
            }),
        },
    ),
);
