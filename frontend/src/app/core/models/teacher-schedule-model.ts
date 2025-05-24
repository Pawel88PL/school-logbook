import { ScheduleEntryModel } from "./schedule-model";

export interface TeacherScheduleEntry {
    id: number;
    className: string;
    subjectName: string;
    dayOfWeek: number;
    startTime: string;
}