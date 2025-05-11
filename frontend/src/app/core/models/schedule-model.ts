export interface ScheduleEntryModel {
    id: number;
    dayOfWeek: number;
    startTime: string;
    subjectId: number;
    subjectName: string;
    teacherId: number;
    teacherFullName: string;
}