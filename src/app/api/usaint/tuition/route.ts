import { ApiErrorResponse, TuitionInfo, UsaintApiRequest, UsaintApiResponse } from '@/types/api';
import { NextResponse } from 'next/server';
import { SapTable, SapWdaClient } from 'usaint-lib';

import { withErrorHandling } from '@/utils/api-handler';
import { getSession } from '@/utils/session';
import { getIndexByHeader } from '@/utils/usaint-parser';

export const POST = withErrorHandling(async (request: Request) => {
    const { appSessionId }: UsaintApiRequest = await request.json();

    if (!appSessionId) {
        return NextResponse.json<ApiErrorResponse>({ error: 'Missing session ID' }, { status: 400 });
    }

    // 1️⃣ Retrieve the raw SAP cookies from Redis
    const storedCookie = await getSession(appSessionId);

    if (!storedCookie) {
        return NextResponse.json<ApiErrorResponse>(
            { error: 'Session expired or invalid. Please login again.' },
            { status: 401 },
        );
    }

    // 2️⃣ Initialize WDA (Tuition program ID: ZCMW6520n)
    const wda = new SapWdaClient('https://ecc.ssu.ac.kr:8443', 'ZCMW6520n', storedCookie);

    const initResult = await wda.initialize();

    if (!initResult.isSuccess) {
        return NextResponse.json<ApiErrorResponse>(
            {
                error: 'Failed to initialize tuition session.',
                html: wda.$.html(),
            },
            { status: 401 },
        );
    }

    // 3️⃣ Get the tuition table
    const tableId = 'ZCMW6520.ID_0001:VIW_MAIN.TABLE';
    const table = wda.getControlById<SapTable>(tableId);

    if (!table) {
        console.warn(`Table not found: ${tableId}`);
        return NextResponse.json<UsaintApiResponse<TuitionInfo[]>>({
            success: true,
            data: [],
        });
    }

    // 4️⃣ Fetch all rows from the table
    const tableData = await table.getAllRows();
    const headers = tableData.headers || [];

    const yearIdx = getIndexByHeader(headers, '학년도');
    const semesterIdx = getIndexByHeader(headers, '학기');
    const amountIdx = getIndexByHeader(headers, '등록금액');
    const scholarshipIdx = getIndexByHeader(headers, '사전감면');
    const netAmountIdx = getIndexByHeader(headers, '납부금액');

    const tuitionList: TuitionInfo[] = tableData.rows
        .map((row) => {
            const offset = headers.length - row.cells.length;
            const getCellText = (idx: number) => (row.cells[idx - offset]?.text || '').trim();

            return {
                year: getCellText(yearIdx),
                semester: getCellText(semesterIdx),
                amount: getCellText(amountIdx),
                scholarship: getCellText(scholarshipIdx),
                netAmount: getCellText(netAmountIdx),
            };
        })
        .filter((item) => item.year !== '');

    return NextResponse.json<UsaintApiResponse<TuitionInfo[]>>({
        success: true,
        data: tuitionList,
    });
});
