export interface LessonForAttendanceModel {
    scheduleId: number;
    subjectName: string;
    className: string;
    startTime: string;
}

export interface StudentForAttendanceModel {
    fullName: string;
    status?: string;
}