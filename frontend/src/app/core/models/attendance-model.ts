export interface LessonForAttendanceModel {
    scheduleId: number;
    subjectName: string;
    className: string;
    startTime: string;
    hasAttendance: boolean;
}

export interface StudentForAttendanceModel {
    studentId: number;
    fullName: string;
    status?: number
}
  