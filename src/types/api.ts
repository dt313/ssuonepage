export interface UsaintLoginRequest {
    studentId: string;
    password: string;
}

export interface UsaintLoginResponse {
    message: string;
    appSessionId: string;
}

export interface UsaintApiRequest {
    appSessionId: string;
}
export interface StudentInfo {
    studentId: string;
    name: string;
    status: string;
    faculty: string;
    department: string;
    class: string;
    year: string;
    semester: string;
    englishName: string;
    hanjaName: string;
}

export interface TuitionInfo {
    year: string;
    semester: string;
    amount: string;
    scholarship: string;
    netAmount: string;
}

export interface UsaintApiResponse<T = Record<string, never>> {
    success: boolean;
    data: T;
}

export interface ApiErrorResponse {
    error: string;
    html?: string;
}
