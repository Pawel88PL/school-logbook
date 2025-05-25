import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AttendanceService } from '../../../core/services/attendance.service';
import { LessonForAttendanceModel, StudentForAttendanceModel } from '../../../core/models/attendance-model';

@Component({
  selector: 'app-teacher-attendance',
  imports: [
    CommonModule
  ],
  templateUrl: './teacher-attendance.component.html',
  styleUrl: './teacher-attendance.component.css'
})

export class TeacherAttendanceComponent implements OnInit {

  todayLessons: LessonForAttendanceModel[] = [];
  selectedScheduleId: number | null = null;
  selectedLessonInfo: string = '';
  students: StudentForAttendanceModel[] = [];

  constructor(
    private attendanceService: AttendanceService
  ) { }

  ngOnInit(): void {
    this.getTodayLessonsForTeacher();
  }

  getTodayLessonsForTeacher(): void {
    this.attendanceService.getTodayLessonsForTeacher().subscribe({
      next: (data) => {
        this.todayLessons = data;
      },
      error: (error) => {
        console.error('Error fetching today\'s lessons:', error);
      }
    });
  }

  onLessonClick(scheduleId: number, subjectName: string, className: string): void {
    this.selectedScheduleId = scheduleId;
    this.selectedLessonInfo = `${subjectName} – ${className}`;
    this.attendanceService.getStudentsForSchedule(scheduleId).subscribe({
      next: (students) => {
        this.students = students;
      },
      error: (err) => {
        console.error('Błąd podczas pobierania uczniów:', err);
      }
    });
  }
}