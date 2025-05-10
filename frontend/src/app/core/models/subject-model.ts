export interface AssignmentModel {
    classId: number;
    teacherId: number;
}

export interface SubjectModel {
    id: number;
    name: string;
    assignments: AssignmentModel[];
}

export interface SubjectAddModel {
    name: string;
}