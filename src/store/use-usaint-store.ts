import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { GraduationInfo, StudentInfo, TuitionInfo } from '@/types/api';

interface UsaintState {
    studentInfo: StudentInfo | null;
    tuitionInfo: TuitionInfo[] | null;
    timetableInfo: string[][] | null;
    graduationInfo: GraduationInfo | null;
    
    setStudentInfo: (info: StudentInfo | null) => void;
    setTuitionInfo: (info: TuitionInfo[] | null) => void;
    setTimetableInfo: (info: string[][] | null) => void;
    setGraduationInfo: (info: GraduationInfo | null) => void;
    
    clearUsaintData: () => void;
}

export const useUsaintStore = create<UsaintState>()(
    persist(
        (set) => ({
            studentInfo: null,
            tuitionInfo: null,
            timetableInfo: null,
            graduationInfo: null,

            setStudentInfo: (studentInfo) => set({ studentInfo }),
            setTuitionInfo: (tuitionInfo) => set({ tuitionInfo }),
            setTimetableInfo: (timetableInfo) => set({ timetableInfo }),
            setGraduationInfo: (graduationInfo) => set({ graduationInfo }),

            clearUsaintData: () => set({
                studentInfo: null,
                tuitionInfo: null,
                timetableInfo: null,
                graduationInfo: null,
            }),
        }),
        {
            name: 'usaint-storage',
            storage: createJSONStorage(() => localStorage),
        },
    ),
);
