export interface ClassModel {
    id: number;
    name: string;
    homeroomTeacher: string;
    assignedStudentIds: string[];
}

export interface ClassAddModel {
    name: string;
    homeroomTeacherId: string
    assignedStudentIds: number[];
}