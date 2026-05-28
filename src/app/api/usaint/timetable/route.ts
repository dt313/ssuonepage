import { ApiErrorResponse, UsaintApiRequest, UsaintApiResponse } from '@/types/api';
import { NextResponse } from 'next/server';
import { SapButton, SapComboBox, SapTable, SapTableCellData, SapWdaClient } from 'usaint-lib';

import { withErrorHandling } from '@/utils/api-handler';
import { getSession } from '@/utils/session';
import { getIndexByHeader } from '@/utils/usaint-parser';

type Header = string | { text: string };

const CONTROL_IDS = {
    YEAR_SELECT: 'ZCMW_PERIOD_RE.ID_D8FB9BECD84FD622F5EAED9E0BE35D27:VIW_MAIN.PERYR',
    SEMESTER_SELECT: 'ZCMW_PERIOD_RE.ID_D8FB9BECD84FD622F5EAED9E0BE35D27:VIW_MAIN.PERID',
    PREV_SEMESTER_BUTTON: 'ZCMW_PERIOD_RE.ID_D8FB9BECD84FD622F5EAED9E0BE35D27:VIW_MAIN.BUTTON_PREV',
    NEXT_SEMESTER_BUTTON: 'ZCMW_PERIOD_RE.ID_D8FB9BECD84FD622F5EAED9E0BE35D27:VIW_MAIN.BUTTON_NEXT',
} as const;

const SUMMER_SEMESTER_CODE = '091';
const WINTER_SEMESTER_CODE = '093';

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

    // await writeFile('./debug-timetable.html', wda.$.html(), 'utf-8');

    if (!initResult.isSuccess) {
        return NextResponse.json<ApiErrorResponse>(
            {
                error: 'Failed to initialize timetable session.',
                html: wda.$.html(),
            },
            { status: 401 },
        );
    }

    const semesterSelector = wda.getControlById<SapComboBox>(CONTROL_IDS.SEMESTER_SELECT);
    let currentSemester = '';
    if (semesterSelector) {
        currentSemester = semesterSelector.selectedKey;

        if (currentSemester === SUMMER_SEMESTER_CODE || currentSemester === WINTER_SEMESTER_CODE) {
            const prevButton = wda.getControlById<SapButton>(CONTROL_IDS.PREV_SEMESTER_BUTTON);
            if (prevButton) await prevButton?.press();
        }
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
    let headers = (tableData.headers || []).map((h: Header) => (typeof h === 'string' ? h : h?.text || ''));
    let rows = tableData.rows.map((row) => {
        const cells = row.cells || [];
        return cells.map((cell: SapTableCellData) => (cell.text || '').trim());
    });

    // 6️⃣ Filter out the Saturday ('토') column if it is empty
    const satIdx = getIndexByHeader(headers, '토');
    if (satIdx !== -1) {
        const isSatEmpty = rows.every((row) => !row[satIdx] || row[satIdx].trim() === '');
        if (isSatEmpty) {
            headers = headers.filter((_, idx) => idx !== satIdx);
            rows = rows.map((row) => row.filter((_, idx) => idx !== satIdx));
        }
    }

    // 7️⃣ Trim leading and trailing empty rows
    const isRowEmpty = (row: string[]) => row.length === 0 || row.slice(1).every((cell) => !cell || cell.trim() === '');

    while (rows.length > 0 && isRowEmpty(rows[0])) {
        rows = rows.slice(1);
    }
    while (rows.length > 0 && isRowEmpty(rows[rows.length - 1])) {
        rows = rows.slice(0, -1);
    }

    // 8️⃣ Final assembly
    const timetableArray: string[][] = [headers, ...rows];

    return NextResponse.json<UsaintApiResponse<string[][]>>({
        success: true,
        data: timetableArray,
    });
});
