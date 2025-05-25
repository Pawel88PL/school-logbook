import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { AttendanceService } from '../../../core/services/attendance.service';
import { LessonForAttendanceModel, StudentForAttendanceModel } from '../../../core/models/attendance-model';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { AttendanceDialogComponent } from '../attendance-dialog/attendance-dialog.component';

@Component({
  selector: 'app-teacher-attendance',
  imports: [
    CommonModule,
    MatCardModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './teacher-attendance.component.html',
  styleUrl: './teacher-attendance.component.css'
})

export class TeacherAttendanceComponent implements OnInit {

  isLoading: boolean = true;

  todayLessons: LessonForAttendanceModel[] = [];
  selectedScheduleId: number | null = null;
  selectedLessonInfo: string = '';
  students: StudentForAttendanceModel[] = [];

  constructor(
    private attendanceService: AttendanceService,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.getTodayLessonsForTeacher();
  }

  getTodayLessonsForTeacher(): void {
    this.attendanceService.getTodayLessonsForTeacher().subscribe({
      next: (data) => {
        this.todayLessons = data;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error fetching today\'s lessons:', error);
        this.isLoading = false;
      }
    });
  }

  onLessonClick(scheduleId: number, subjectName: string, className: string): void {
    const lessonInfo = `${subjectName} – ${className}`;
    this.attendanceService.getStudentsForSchedule(scheduleId).subscribe({
      next: (students) => {
        this.dialog.open(AttendanceDialogComponent, {
          width: '600px',
          data: {
            lessonInfo,
            students
          }
        });
      },
      error: (err) => {
        console.error('Błąd podczas pobierania uczniów:', err);
      }
    });
  }
}