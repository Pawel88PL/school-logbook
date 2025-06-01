export interface AttendancePreviewModel {
    date: string;
    subjectName: string;
    teacherName: string;
    status: string;
}
  
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
    status?: number;
}
  