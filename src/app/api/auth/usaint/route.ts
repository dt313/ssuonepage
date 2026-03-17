import { ApiErrorResponse, UsaintLoginRequest, UsaintLoginResponse } from '@/types/api';
import { NextResponse } from 'next/server';
import { SapSsoClient } from 'usaint-lib';

import { withErrorHandling } from '@/utils/api-handler';
import { createSession } from '@/utils/session';

export const POST = withErrorHandling(async (request: Request) => {
    const { studentId, password }: UsaintLoginRequest = await request.json();

    if (!studentId || !password) {
        return NextResponse.json<ApiErrorResponse>({ error: 'Student ID and password are required' }, { status: 400 });
    }

    try {
        const ssoClient = new SapSsoClient();
        const sessionString = await ssoClient.login(studentId, password);

        // Check if we got valid cookies
        if (!sessionString || !sessionString.includes('MYSAPSSO2')) {
            console.log(`Login failed for ${studentId}: No valid session cookies returned`);
            return NextResponse.json<ApiErrorResponse>({ error: 'Invalid student ID or password' }, { status: 401 });
        }

        // Store the sensitive cookies in Redis and get a non-sensitive UUID
        const appSessionId = await createSession(sessionString);

        return NextResponse.json<UsaintLoginResponse>({
            message: 'Login successful',
            appSessionId: appSessionId,
        });
    } catch (error) {
        console.error(`Login error for ${studentId}:`, error);
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        return NextResponse.json<ApiErrorResponse>(
            { error: errorMessage || 'Login failed. Please check your student ID and password.' },
            { status: 401 },
        );
    }
});
