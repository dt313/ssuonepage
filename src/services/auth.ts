import instance, { credentialInstance } from '@/config/axios';

import { getErrorMessage } from '@/utils';

type LoginData = {
    email: string;
    password: string;
};

type RegisterData = {
    name: string;
    email: string;
    password: string;
};

export const authWithGoogle = async () => {
    try {
        const response = await instance.get('/auth/google');
        return response.data;
    } catch (error) {
        console.log(error);
    }
};

export const login = async (data: LoginData) => {
    try {
        const response = await instance.post('/auth/login', data);
        return response.data;
    } catch (error) {
        console.error('Error logging in:', error);
        throw error;
    }
};

export const register = async (data: RegisterData) => {
    try {
        const response = await instance.post('/auth/register', data);
        return response.data;
    } catch (error) {
        console.error('Error registering:', error);
        throw error;
    }
};

export const getMe = async () => {
    try {
        const response = await instance.get('/users/me');
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const logout = async () => {
    try {
        const response = await instance.post('/auth/logout');
        return response.data;
    } catch (error) {
        console.log(error);
    }
};

export const refreshToken = async () => {
    try {
        const response = await credentialInstance.post('/auth/refresh-token');
        return response.data;
    } catch (error) {
        console.log(error);
    }
};
