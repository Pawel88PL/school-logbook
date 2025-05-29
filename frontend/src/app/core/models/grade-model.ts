export interface GradeCreateModel {
    studentId: number;
    subjectId: number;
    teacherId?: number;
    value: number;
    comment: string;
    createdBy?: string;
}

export interface GradeModel {
    id: number;
    className: string;
    studentId: number;
    studentName: string;
    subjectId: number;
    subjectName: string;
    teacherId: number;
    value: number;
    comment: string;
    date: string;
    createdBy: string;
}
  