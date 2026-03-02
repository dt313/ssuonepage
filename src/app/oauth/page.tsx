'use client';
import { Suspense, useEffect } from 'react';

import { API_BASE_URL } from '@/constants';
import { useAuthStore } from '@/store/use-auth-store';
import axios from 'axios';
import { useRouter, useSearchParams } from 'next/navigation';

import { AuthLoading } from '@/components/auth/auth-loading';

function OAuth2() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const token = searchParams.get('token');
    const login = useAuthStore((state) => state.login);

    useEffect(() => {
        if (token) {
            const fetchAPI = async () => {
                try {
                    const res = await axios.get(`${API_BASE_URL}/users/me`, {
                        headers: {
                            Authorization: `Bearer ${token}`,
                            'Content-Type': 'application/json',
                        },
                    });

                    if (res.data) {
                        login(res.data.data, token);
                        console.log('User logged in:', res.data);
                    }
                    router.push('/feed');
                } catch (error) {
                    console.error('Failed to fetch user info:', error);
                    router.push('/');
                }
            };

            fetchAPI();
        } else {
            router.push('/');
        }
    }, [token, router, login]);

    return <AuthLoading />;
}

function OAuth2Wrap() {
    return (
        <Suspense fallback={<AuthLoading />}>
            <OAuth2 />
        </Suspense>
    );
}

export default OAuth2Wrap;
