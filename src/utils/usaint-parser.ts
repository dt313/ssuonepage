import { SapInput, SapWdaClient } from 'usaint-lib';

/**
 * Retrieves the trimmed value of a SAP control by its ID.
 * Falls back to an empty string if the control is not found or an error occurs.
 */
export const getControlValue = (wda: SapWdaClient, id: string): string => {
    try {
        const control = wda.getControlById<SapInput>(id);
        return control.value?.trim() || '';
    } catch (e) {
        console.error(`Failed to get control with ID ${id}:`, e);
        return '';
    }
};
