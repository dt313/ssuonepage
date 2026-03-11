import { SapWdaClient } from 'usaint-lib';

/**
 * Retrieves the trimmed value or text of a SAP control by its ID.
 * Falls back to an empty string if the control is not found or an error occurs.
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
