import { Teacher } from "./teacher-model";

export interface SubjectWithTeachersModel {
    subjectId: number;
    subjectName: string;
    teachers: Teacher[];
}