export interface ClassModel {
    id: number;
    name: string;
    homeroomTeacher?: string;
    homeroomTeacherId: number
    assignedStudentIds: number[];
}

export interface ClassAddModel {
    name: string;
    homeroomTeacherId: number
    assignedStudentIds: number[];
}