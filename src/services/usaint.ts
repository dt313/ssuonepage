import { StudentInfo, TuitionInfo, UsaintApiRequest, UsaintApiResponse } from '@/types/api';
import axios, { isAxiosError } from 'axios';

export const callStudentInfoApi = async (data: UsaintApiRequest): Promise<UsaintApiResponse<StudentInfo>> => {
    try {
        const response = await axios.post<UsaintApiResponse<StudentInfo>>('/api/usaint/info', data);
        return response.data;
    } catch (error) {
        console.error('Error calling u-SAINT API:', error);
        if (isAxiosError(error)) {
            throw error.response?.data || error;
        }
        throw error;
    }
};

export const callTuitionApi = async (data: UsaintApiRequest): Promise<UsaintApiResponse<TuitionInfo[]>> => {
    try {
        const response = await axios.post<UsaintApiResponse<TuitionInfo[]>>('/api/usaint/tuition', data);
        return response.data;
    } catch (error) {
        console.error('Error calling u-SAINT Tuition API:', error);
        if (isAxiosError(error)) {
            throw error.response?.data || error;
        }
        throw error;
    }
};
