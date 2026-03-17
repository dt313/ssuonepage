import { ApiErrorResponse, SemesterGrade, SemesterGradeInfo, UsaintApiResponse } from '@/types/api';
import { NextResponse } from 'next/server';
import { SapButton, SapTable, SapWdaClient } from 'usaint-lib';

import { withErrorHandling } from '@/utils/api-handler';
import { getSession } from '@/utils/session';
import { getControlValue, getIndexByHeader } from '@/utils/usaint-parser';

const GRADE_IDS = {
    TABLE: 'ZCMB3W0017.ID_0001:VIW_MAIN.TABLE',
    SEARCH_BTN: 'ZCMB3W0017.ID_0001:VIW_MAIN.BTN_SEARCH',
    // Academic Record Summary (학적부)
    ACAD_APPLIED: 'ZCMB3W0017.ID_0001:VIW_MAIN.ATTM_CRD1',
    ACAD_EARNED: 'ZCMB3W0017.ID_0001:VIW_MAIN.EARN_CRD1',
    ACAD_SCORE_SUM: 'ZCMB3W0017.ID_0001:VIW_MAIN.GT_GPA1',
    ACAD_GPA: 'ZCMB3W0017.ID_0001:VIW_MAIN.CGPA1',
    ACAD_AVG: 'ZCMB3W0017.ID_0001:VIW_MAIN.AVG1',
    ACAD_PF: 'ZCMB3W0017.ID_0001:VIW_MAIN.PF_EARN_CRD',
    // Proof Summary (증명)
    PROOF_APPLIED: 'ZCMB3W0017.ID_0001:VIW_MAIN.ATTM_CRD2',
    PROOF_EARNED: 'ZCMB3W0017.ID_0001:VIW_MAIN.EARN_CRD2',
    PROOF_SCORE_SUM: 'ZCMB3W0017.ID_0001:VIW_MAIN.GT_GPA2',
    PROOF_GPA: 'ZCMB3W0017.ID_0001:VIW_MAIN.CGPA2',
    PROOF_AVG: 'ZCMB3W0017.ID_0001:VIW_MAIN.AVG2',
    PROOF_PF: 'ZCMB3W0017.ID_0001:VIW_MAIN.T_PF_ERN_CRD1',
};

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
            {
                error: 'Failed to initialize grade session.',
                html: wda.$.html(),
            },
            { status: 401 },
        );
    }

    // Press search button to ensure data is loaded
    const searchBtn = wda.getControlById<SapButton>(GRADE_IDS.SEARCH_BTN);
    if (searchBtn) {
        await searchBtn.press();
    }

    // Extract table data
    const table = wda.getControlById<SapTable>(GRADE_IDS.TABLE);
    let grades: SemesterGrade[] = [];

    if (table) {
        const tableData = await table.getAllRows();
        const headers = tableData.headers || [];

        const yearIdx = getIndexByHeader(headers, '학년도');
        const semesterIdx = getIndexByHeader(headers, '학기');
        const appliedIdx = getIndexByHeader(headers, '신청학점');
        const earnedIdx = getIndexByHeader(headers, '취득학점');
        const pfIdx = getIndexByHeader(headers, 'P/F학점');
        const gpaIdx = getIndexByHeader(headers, '평점평균');
        const scoreSumIdx = getIndexByHeader(headers, '평점계');
        const avgIdx = getIndexByHeader(headers, '산술평균');
        const semesterRankIdx = getIndexByHeader(headers, '학기별석차');
        const totalRankIdx = getIndexByHeader(headers, '전체석차');
        const warningIdx = getIndexByHeader(headers, '학사경고여부');
        const counselingIdx = getIndexByHeader(headers, '상담여부');
        const repeatIdx = getIndexByHeader(headers, '유급');

        grades = tableData.rows.map((row) => {
            // Calculate offset if headers length is different from cells length
            // Typically happens when there is a 'Title' or 'Selection' column header that has no data cell
            const offset = headers.length - row.cells.length;
            const getCellText = (idx: number) => (row.cells[idx - offset]?.text || '').trim();

            return {
                year: getCellText(yearIdx),
                semester: getCellText(semesterIdx),
                appliedCredits: getCellText(appliedIdx),
                earnedCredits: getCellText(earnedIdx),
                pfCredits: getCellText(pfIdx),
                gpa: getCellText(gpaIdx),
                scoreSum: getCellText(scoreSumIdx),
                arithmeticAverage: getCellText(avgIdx),
                semesterRank: getCellText(semesterRankIdx),
                totalRank: getCellText(totalRankIdx),
                academicWarning: getCellText(warningIdx),
                counseling: getCellText(counselingIdx),
                repeat: getCellText(repeatIdx),
            };
        });
    }

    // Extract summary information
    const data: SemesterGradeInfo = {
        grades,
        summary: {
            academicRecord: {
                appliedCredits: getControlValue(wda, GRADE_IDS.ACAD_APPLIED),
                earnedCredits: getControlValue(wda, GRADE_IDS.ACAD_EARNED),
                scoreSum: getControlValue(wda, GRADE_IDS.ACAD_SCORE_SUM),
                gpa: getControlValue(wda, GRADE_IDS.ACAD_GPA),
                arithmeticAverage: getControlValue(wda, GRADE_IDS.ACAD_AVG),
                pfCredits: getControlValue(wda, GRADE_IDS.ACAD_PF),
            },
            proof: {
                appliedCredits: getControlValue(wda, GRADE_IDS.PROOF_APPLIED),
                earnedCredits: getControlValue(wda, GRADE_IDS.PROOF_EARNED),
                scoreSum: getControlValue(wda, GRADE_IDS.PROOF_SCORE_SUM),
                gpa: getControlValue(wda, GRADE_IDS.PROOF_GPA),
                arithmeticAverage: getControlValue(wda, GRADE_IDS.PROOF_AVG),
                pfCredits: getControlValue(wda, GRADE_IDS.PROOF_PF),
            },
        },
    };

    return NextResponse.json<UsaintApiResponse<SemesterGradeInfo>>({
        success: true,
        data,
    });
});
