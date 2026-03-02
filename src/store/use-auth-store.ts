import { create } from 'zustand';

interface User {
    id: string;
    name: string;
    email: string;
    picture?: string;
}

interface AuthState {
    user: User | null;
    isAuthenticated: boolean;
    accessToken?: string;
    setAccessToken: (accessToken: string) => void;
    login: (user: User, accessToken: string) => void;
    logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
    user: null,
    isAuthenticated: false,
    accessToken: '',
    setAccessToken: (accessToken: string) => set({ accessToken }),
    login: (user: User, accessToken: string) => {
        set({ user, isAuthenticated: true, accessToken });
    },
    logout: () => set({ user: null, isAuthenticated: false, accessToken: '' }),
}));
