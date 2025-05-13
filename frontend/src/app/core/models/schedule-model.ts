export interface ScheduleEntryModel {
    id: number;
    dayOfWeek: number;
    startTime: string;
    classId?: number;
    className?: string;
    subjectId?: number;
    subjectName?: string;
    teacherId?: number;
    teacherFullName?: string;
}