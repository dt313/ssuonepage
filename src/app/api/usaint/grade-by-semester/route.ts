import { ApiErrorResponse, SemesterGrade, SemesterGradeInfo, UsaintApiResponse } from '@/types/api';
import { NextResponse } from 'next/server';
import { SapButton, SapTable, SapWdaClient } from 'usaint-lib';

import { withErrorHandling } from '@/utils/api-handler';
import { getSession } from '@/utils/session';
import { getControlValue, getIndexByHeader } from '@/utils/usaint-parser';

const GRADE_IDS = {
    TABLE: 'ZCMB3W0017.ID_0001:VIW_MAIN.TABLE',
    SEARCH_BTN: 'ZCMB3W0017.ID_0001:VIW_MAIN.BTN_SEARCH',
    ACAD_APPLIED: 'ZCMB3W0017.ID_0001:VIW_MAIN.ATTM_CRD1',
    ACAD_EARNED: 'ZCMB3W0017.ID_0001:VIW_MAIN.EARN_CRD1',
    ACAD_SCORE: 'ZCMB3W0017.ID_0001:VIW_MAIN.GT_GPA1',
    ACAD_GPA: 'ZCMB3W0017.ID_0001:VIW_MAIN.CGPA1',
    ACAD_AVG: 'ZCMB3W0017.ID_0001:VIW_MAIN.AVG1',
    ACAD_PF: 'ZCMB3W0017.ID_0001:VIW_MAIN.PF_EARN_CRD',
    PROOF_APPLIED: 'ZCMB3W0017.ID_0001:VIW_MAIN.ATTM_CRD2',
    PROOF_EARNED: 'ZCMB3W0017.ID_0001:VIW_MAIN.EARN_CRD2',
    PROOF_SCORE: 'ZCMB3W0017.ID_0001:VIW_MAIN.GT_GPA2',
    PROOF_GPA: 'ZCMB3W0017.ID_0001:VIW_MAIN.CGPA2',
    PROOF_AVG: 'ZCMB3W0017.ID_0001:VIW_MAIN.AVG2',
    PROOF_PF: 'ZCMB3W0017.ID_0001:VIW_MAIN.T_PF_ERN_CRD1',
} as const;

interface TableCell {
    text: string;
}

interface TableRow {
    cells: TableCell[];
}

async function fetchAllTableRows(wda: SapWdaClient, tableId: string): Promise<TableRow[]> {
    const table = wda.getControlById<SapTable>(tableId);
    if (!table) return [];

    const totalRowCount = table.getTotalRowCount();
    const allRows: TableRow[] = [];
    const seen = new Set<string>();

    const addNewRows = (rows: TableRow[]) => {
        for (const row of rows) {
            const key = row.cells.map((c) => c.text).join('|');
            if (!seen.has(key)) {
                seen.add(key);
                allRows.push(row);
            }
        }
    };

    // Lấy batch đầu tiên
    addNewRows(table.getVisibleRows().rows as TableRow[]);

    // Scroll để lấy các batch tiếp theo
    while (allRows.length < totalRowCount) {
        await table.scrollVertical(allRows.length);

        const freshTable = wda.getControlById<SapTable>(tableId);
        if (!freshTable) break;

        const prevSize = allRows.length;
        addNewRows(freshTable.getVisibleRows().rows as TableRow[]);

        if (allRows.length === prevSize) break; // không có row mới → stop
    }

    return allRows;
}

export const POST = withErrorHandling(async (request: Request) => {
    const { appSessionId } = await request.json();

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

    const wda = new SapWdaClient('https://ecc.ssu.ac.kr:8443', 'ZCMB3W0017', storedCookie);
    const initResult = await wda.initialize();

    if (!initResult.isSuccess) {
        return NextResponse.json<ApiErrorResponse>(
            { error: 'Failed to initialize grade session.', html: wda.$.html() },
            { status: 401 },
        );
    }

    await wda.getControlById<SapButton>(GRADE_IDS.SEARCH_BTN)?.press();

    const table = wda.getControlById<SapTable>(GRADE_IDS.TABLE);
    const headers = table?.getHeaders() || [];
    const allRows = await fetchAllTableRows(wda, GRADE_IDS.TABLE);

    const idx = {
        year: getIndexByHeader(headers, '학년도'),
        semester: getIndexByHeader(headers, '학기'),
        applied: getIndexByHeader(headers, '신청학점'),
        earned: getIndexByHeader(headers, '취득학점'),
        pf: getIndexByHeader(headers, 'P/F학점'),
        gpa: getIndexByHeader(headers, '평점평균'),
        scoreSum: getIndexByHeader(headers, '평점계'),
        avg: getIndexByHeader(headers, '산술평균'),
        semRank: getIndexByHeader(headers, '학기별석차'),
        totalRank: getIndexByHeader(headers, '전체석차'),
        warning: getIndexByHeader(headers, '학사경고여부'),
        counseling: getIndexByHeader(headers, '상담여부'),
        repeat: getIndexByHeader(headers, '유급'),
    };

    const grades: SemesterGrade[] = allRows
        .filter((row) => {
            const offset = headers.length - row.cells.length;
            return (row.cells[idx.year - offset]?.text || '').trim() !== '';
        })
        .map((row) => {
            const offset = headers.length - row.cells.length;
            const get = (i: number) => (row.cells[i - offset]?.text || '').trim();
            return {
                year: get(idx.year),
                semester: get(idx.semester),
                appliedCredits: get(idx.applied),
                earnedCredits: get(idx.earned),
                pfCredits: get(idx.pf),
                gpa: get(idx.gpa),
                scoreSum: get(idx.scoreSum),
                arithmeticAverage: get(idx.avg),
                semesterRank: get(idx.semRank),
                totalRank: get(idx.totalRank),
                academicWarning: get(idx.warning),
                counseling: get(idx.counseling),
                repeat: get(idx.repeat),
            };
        });

    const data: SemesterGradeInfo = {
        grades,
        summary: {
            academicRecord: {
                appliedCredits: getControlValue(wda, GRADE_IDS.ACAD_APPLIED),
                earnedCredits: getControlValue(wda, GRADE_IDS.ACAD_EARNED),
                scoreSum: getControlValue(wda, GRADE_IDS.ACAD_SCORE),
                gpa: getControlValue(wda, GRADE_IDS.ACAD_GPA),
                arithmeticAverage: getControlValue(wda, GRADE_IDS.ACAD_AVG),
                pfCredits: getControlValue(wda, GRADE_IDS.ACAD_PF),
            },
            proof: {
                appliedCredits: getControlValue(wda, GRADE_IDS.PROOF_APPLIED),
                earnedCredits: getControlValue(wda, GRADE_IDS.PROOF_EARNED),
                scoreSum: getControlValue(wda, GRADE_IDS.PROOF_SCORE),
                gpa: getControlValue(wda, GRADE_IDS.PROOF_GPA),
                arithmeticAverage: getControlValue(wda, GRADE_IDS.PROOF_AVG),
                pfCredits: getControlValue(wda, GRADE_IDS.PROOF_PF),
            },
        },
    };

    return NextResponse.json<UsaintApiResponse<SemesterGradeInfo>>({ success: true, data });
});
