export function getErrorMessage(error: unknown, defaultMessage: string = 'An unknown error occurred'): string {
    if (!error) return defaultMessage;

    // string
    if (typeof error === 'string') {
        return error;
    }

    // native Error
    if (error instanceof Error) {
        return error.message;
    }

    // object (API / custom error)
    if (typeof error === 'object' && error !== null) {
        const obj = error as Record<string, unknown>;

        // Case: ErrorResponse từ backend
        if (obj.success === false && typeof obj.error === 'object' && obj.error !== null) {
            const errObj = obj.error as Record<string, unknown>;

            if (Array.isArray(errObj.details) && errObj.details[0] && typeof errObj.details[0].message === 'string') {
                return errObj.details[0].message;
            }

            if (typeof errObj.message === 'string') {
                return errObj.message;
            }
        }

        // Case: object có message ở root
        if (typeof obj.message === 'string') {
            return obj.message;
        }

        // Case: object có error là string
        if (typeof obj.error === 'string') {
            return obj.error;
        }
    }

    return defaultMessage;
}
