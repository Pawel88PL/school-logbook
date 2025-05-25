export interface LessonForAttendanceModel {
    scheduleId: number;
    subjectName: string;
    className: string;
    startTime: string;
}

export interface StudentForAttendanceModel {
    studentId: number;
    fullName: string;
    status?: number
}
  