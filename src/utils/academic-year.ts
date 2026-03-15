export const getCurrentYear = () => new Date().getFullYear();

/**
 * Returns the current semester code.
 * In typical university calendars:
 * - 1st Semester (090): March to August (Months 2 to 7)
 * - 2nd Semester (092): September to February (Months 8 to 11, 0, 1)
 */
export const getCurrentSemester = () => {
    const month = new Date().getMonth();
    // March is 2, August is 7
    if (month >= 2 && month <= 7) {
        return '090';
    }
    return '092';
};

export const getAdmissionYear = (studentId?: string) => {
    const currentYear = getCurrentYear();
    return studentId && studentId.length >= 4 ? parseInt(studentId.substring(0, 4)) : currentYear - 4;
};

export const getAcademicYears = (studentId?: string) => {
    const currentYear = getCurrentYear();
    const admissionYear = getAdmissionYear(studentId);
    const years = [];
    for (let y = currentYear; y >= admissionYear; y--) {
        years.push(y.toString());
    }
    return years;
};

export const getAcademicSemesters = () => [
    { label: '1학기', value: '090' },
    { label: '2학기', value: '092' },
];
