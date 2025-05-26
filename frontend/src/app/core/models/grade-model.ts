export interface GradeCreateModel {
    studentId: number;
    subjectId: number;
    teacherId: number;
    value: number;
    description: string;
    createdBy: string;
}

export interface GradeModel {
    id: number;
    studentId: number;
    subjectId: number;
    teacherId: number;
    value: number;
    description: string;
    createdAt: string;
    createdBy: string;
}
  