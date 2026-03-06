import { ApiErrorResponse, UsaintApiRequest, UsaintApiResponse } from '@/types/api';
import { NextResponse } from 'next/server';
import { SapTable, SapWdaClient } from 'usaint-lib';

import { withErrorHandling } from '@/utils/api-handler';
import { getSession } from '@/utils/session';

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

    // 2️⃣ Initialize WDA (Timetable program ID: ZCMW2102)
    const wda = new SapWdaClient('https://ecc.ssu.ac.kr:8443', 'ZCMW2102', storedCookie);

    const initResult = await wda.initialize();

    if (!initResult.isSuccess) {
        return NextResponse.json<ApiErrorResponse>(
            {
                error: 'Failed to initialize timetable session.',
                html: wda.$.html(),
            },
            { status: 401 },
        );
    }

    // 3️⃣ Get the timetable table
    const tableId = 'ZCMW2102.ID_0001:VIW_MAIN.TABLE';
    const table = wda.getControlById<SapTable>(tableId);

    if (!table) {
        console.warn(`Table not found: ${tableId}`);
        return NextResponse.json<UsaintApiResponse<string[][]>>({
            success: true,
            data: [],
        });
    }

    // 4️⃣ Fetch all rows from the table
    const tableData = await table.getAllRows();

    // 5️⃣ Convert to 2D array (headers + rows)
    const timetableArray: string[][] = [];
    
    // Add headers
    if (tableData.headers.length > 0) {
        timetableArray.push(tableData.headers);
    }

    // Add rows, filtering out completely empty ones
    tableData.rows.forEach((row) => {
        const cells = row.cells || [];
        if (cells.length === 0) return;

        const rowData = cells.map((cell: any) => (cell.text || '').trim());
        
        // Only add if the row contains at least one non-empty string
        if (rowData.some((text) => text !== '')) {
            timetableArray.push(rowData);
        }
    });

    return NextResponse.json<UsaintApiResponse<string[][]>>({
        success: true,
        data: timetableArray,
    });
});
