import { ApiErrorResponse, ScholarshipInfo, UsaintApiRequest, UsaintApiResponse } from '@/types/api';
import { NextResponse } from 'next/server';
import { SapTable, SapWdaClient } from 'usaint-lib';

import { withErrorHandling } from '@/utils/api-handler';
import { getSession } from '@/utils/session';
import { getIndexByHeader } from '@/utils/usaint-parser';

const SCHOLARSHIP_IDS = {
    TABLE: 'ZCMW7530.ID_0001:VIW_MAIN.TABLE_2',
};

export const POST = withErrorHandling(async (request: Request) => {
    const { appSessionId }: UsaintApiRequest = await request.json();

    if (!appSessionId) {
        return NextResponse.json<ApiErrorResponse>({ error: 'Missing session ID' }, { status: 400 });
    }

    const storedCookie = await getSession(appSessionId);
    if (!storedCookie) {
        return NextResponse.json<ApiErrorResponse>(
            { error: 'Session expired or invalid. Please login again.' },
            { status: 401 },
        );
    }

    const wda = new SapWdaClient('https://ecc.ssu.ac.kr:8443', 'ZCMW7530', storedCookie);

    const initResult = await wda.initialize();

    if (!initResult.isSuccess) {
        return NextResponse.json<ApiErrorResponse>(
            {
                error: 'Failed to initialize Scholarship session.',
                html: wda.$.html(),
            },
            { status: 401 },
        );
    }

    const table = wda.getControlById<SapTable>(SCHOLARSHIP_IDS.TABLE);
    const scholarships: ScholarshipInfo[] = [];

    if (table) {
        const tableData = await table.getAllRows();
        const headers = tableData.headers || [];

        const yearIdx = getIndexByHeader(headers, '학년');
        const semesterIdx = getIndexByHeader(headers, '학기');
        const typeIdx = getIndexByHeader(headers, '지급방법');
        const nameIdx = getIndexByHeader(headers, '장학금명');
        const statusIdx = getIndexByHeader(headers, '처리상태');
        const processDateIdx = getIndexByHeader(headers, '처리일자');
        const amountIdx = getIndexByHeader(headers, '선발금액');
        const actualAmountIdx = getIndexByHeader(headers, '실수혜금액');
        const rejectReasonIdx = getIndexByHeader(headers, '탈락사유');

        scholarships.push(
            ...tableData.rows.map((row) => ({
                year: (row.cells[yearIdx]?.text || '').trim(),
                semester: (row.cells[semesterIdx]?.text || '').trim(),
                type: (row.cells[typeIdx]?.text || '').trim(),
                name: (row.cells[nameIdx]?.text || '').trim(),
                status: (row.cells[statusIdx]?.text || '').trim(),
                rejectReason: (row.cells[rejectReasonIdx]?.text || '').trim(),
                amount: (row.cells[amountIdx]?.text || '').trim(),
                actualAmount: (row.cells[actualAmountIdx]?.text || '').trim(),
                processDate: (row.cells[processDateIdx]?.text || '').trim(),
            })),
        );
    }

    return NextResponse.json<UsaintApiResponse<ScholarshipInfo[]>>({
        success: true,
        data: scholarships,
    });
});
