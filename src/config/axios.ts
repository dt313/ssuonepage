import { API_BASE_URL } from '@/constants';
import { useAuthStore } from '@/store/use-auth-store';
import axios from 'axios';

const instance = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

export const credentialInstance = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true,
});
instance.interceptors.request.use(
    async function (config) {
        const accessToken = useAuthStore.getState().accessToken || '';
        config.headers.Authorization = `Bearer ${accessToken}`;
        return config;
    },

    function (error) {
        console.log(error);
        return Promise.reject(error);
    },
);

instance.interceptors.response.use(
    function (response) {
        return response;
    },
    async function (error) {
        if (!error.response) {
            return Promise.reject(new Error('Network Error'));
        }

        const originalRequest = error.config;
        const errorResponse = error.response.data || {};
        const { status, code } = errorResponse.data || {};

        if (status === 401) {
            if (code === 'TOKEN_EXPIRED') {
                try {
                    const refreshResponse = await credentialInstance.post('/auth/refresh-token');
                    const newAccessToken = refreshResponse?.data.data.access_token || '';
                    useAuthStore.getState().setAccessToken(newAccessToken);
                    originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
                    return instance(originalRequest);
                } catch (refreshError) {
                    useAuthStore.getState().logout();
                    return Promise.reject(refreshError);
                }
            } else {
                return Promise.reject(errorResponse);
            }
        }

        return Promise.reject(errorResponse);
    },
);

export default instance;
