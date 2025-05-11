import { ScheduleEntryModel } from "./schedule-model";

export interface ClassScheduleModel {
    id: number;
    name: string;
    hasSchedule: boolean;
    entryCount: number;
}

export interface ScheduleForClassModel {
    classId: number;
    className: string;
    entries: ScheduleEntryModel[];
}