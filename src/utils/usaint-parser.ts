import { SapWdaClient } from 'usaint-lib';

/**
 * Finds the index of a column by its header name.
 * Handles both string headers and object headers with a 'text' property.
 * Prioritizes exact matches to avoid confusion with overlapping names.
 */
export const getIndexByHeader = (headers: any[], name: string) => {
    // Try exact match first
    const exactIdx = headers.findIndex((h: any) => {
        const text = (typeof h === 'string' ? h : h?.text || '').trim();
        return text === name;
    });
    if (exactIdx !== -1) return exactIdx;

    // Fallback to substring match
    return headers.findIndex((h: any) => {
        const text = (typeof h === 'string' ? h : h?.text || '').trim();
        return text?.includes(name);
    });
};

/**
 * Retrieves the trimmed value or text of a SAP control by its ID.
 */

export const getControlValue = (wda: SapWdaClient, id: string): string => {
    try {
        const control = wda.getControlById<any>(id);
        if (!control) return '';

        // Try value first (for SapInput), then text (for SapTextView/SapLabel)
        const val = control.value || control.text || '';
        return val.trim();
    } catch (e) {
        console.error(`Failed to get control with ID ${id}:`, e);
        return '';
    }
};

/**
 * Parses a timetable cell string into structured subject, time, and location info.
 */
export const parseTimetableCell = (text: string) => {
    if (!text || text.trim() === '') return null;

    // Regex to find time pattern (e.g., 09:00-10:15)
    const timeRegex = /(\d{2}:\d{2}-\d{2}:\d{2})/;
    const parts = text.split(timeRegex);

    if (parts.length >= 3) {
        return {
            subject: parts[0].trim(),
            time: parts[1].trim(),
            location: parts[2].trim(),
        };
    }

    return { subject: text, time: '', location: '' };
};
