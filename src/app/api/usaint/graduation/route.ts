import { ApiErrorResponse, GraduationCategory, GraduationInfo, UsaintApiRequest, UsaintApiResponse } from '@/types/api';
import { NextResponse } from 'next/server';
import { SapButton, SapTable, SapWdaClient } from 'usaint-lib';

import { withErrorHandling } from '@/utils/api-handler';
import { getSession } from '@/utils/session';
import { getControlValue } from '@/utils/usaint-parser';

const CONTROL_IDS = {
    GRAD_CREDITS: 'ZCMW8015.ID_0001:MAIN.TC01_GR_CPOP',
    RECOGNIZED_CREDITS: 'ZCMW8015.ID_0001:MAIN.TC01_COMP_CPOP',
    AUDIT_RESULT: 'ZCMW8015.ID_0001:MAIN.TC01_AUDIT_RESULT_T',
    AUDIT_DATE: 'ZCMW8015.ID_0001:MAIN.TC01_AUDIT_DAT',
    DETAIL_BUTTON: 'ZCMW8015.ID_0001:MAIN.BTN_DTL',
    TABLE: 'ZCMW8015.ID_0001:MAIN.TABLE',
};

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

    // 2️⃣ Initialize WDA (Graduation program ID: ZCMW8015)
    const wda = new SapWdaClient('https://ecc.ssu.ac.kr:8443', 'ZCMW8015', storedCookie);

    const initResult = await wda.initialize();

    if (!initResult.isSuccess) {
        return NextResponse.json<ApiErrorResponse>(
            {
                error: 'Failed to initialize graduation session.',
                html: wda.$.html(),
            },
            { status: 401 },
        );
    }

    // 3️⃣ Extract header info
    const graduationCredits = getControlValue(wda, CONTROL_IDS.GRAD_CREDITS);
    const recognizedCredits = getControlValue(wda, CONTROL_IDS.RECOGNIZED_CREDITS);
    const graduationResult = getControlValue(wda, CONTROL_IDS.AUDIT_RESULT);
    const graduationAuditDate = getControlValue(wda, CONTROL_IDS.AUDIT_DATE);

    // 4️⃣ Press the detail button to ensure table is loaded/updated
    const detailButton = wda.getControlById<SapButton>(CONTROL_IDS.DETAIL_BUTTON);
    if (detailButton) {
        await detailButton.press();
    }

    // 5️⃣ Get and parse the graduation categories table
    const table = wda.getControlById<SapTable>(CONTROL_IDS.TABLE);
    let categories: GraduationCategory[] = [];

    if (table) {
        const tableData = await table.getAllRows();
        let currentDomain = '';

        categories = tableData.rows.map((row) => {
            let domain, requirement, referenceValue, calculatedValue, difference, result, subjects;

            if (row.cells.length === 7) {
                // Row includes the Domain column
                domain = (row.cells[0]?.text || '').trim();
                currentDomain = domain;
                requirement = (row.cells[1]?.text || '').trim();
                referenceValue = (row.cells[2]?.text || '').trim();
                calculatedValue = (row.cells[3]?.text || '').trim();
                difference = (row.cells[4]?.text || '').trim();
                result = (row.cells[5]?.text || '').trim();
                subjects = (row.cells[6]?.text || '').trim();
            } else {
                // Row skips the Domain column due to rowspan
                domain = currentDomain;
                requirement = (row.cells[0]?.text || '').trim();
                referenceValue = (row.cells[1]?.text || '').trim();
                calculatedValue = (row.cells[2]?.text || '').trim();
                difference = (row.cells[3]?.text || '').trim();
                result = (row.cells[4]?.text || '').trim();
                subjects = (row.cells[5]?.text || '').trim();
            }

            return {
                domain,
                requirement,
                referenceValue,
                calculatedValue,
                difference,
                result,
                subjects,
            };
        });
    }

    const graduationInfo: GraduationInfo = {
        graduationCredits,
        recognizedCredits,
        graduationResult,
        graduationAuditDate,
        categories,
    };

    return NextResponse.json<UsaintApiResponse<GraduationInfo>>({
        success: true,
        data: graduationInfo,
    });
});
