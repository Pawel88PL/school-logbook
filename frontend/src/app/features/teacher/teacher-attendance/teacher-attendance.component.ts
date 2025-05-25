import { Component, OnInit } from '@angular/core';
import { AttendanceService } from '../../../core/services/attendance.service';

@Component({
  selector: 'app-teacher-attendance',
  imports: [],
  templateUrl: './teacher-attendance.component.html',
  styleUrl: './teacher-attendance.component.css'
})

export class TeacherAttendanceComponent implements OnInit {

  constructor(
    private attendanceService: AttendanceService
  ) { }

  ngOnInit(): void {
    this.getTodayLessonsForTeacher();
  }

  getTodayLessonsForTeacher(): void {
    this.attendanceService.getTodayLessonsForTeacher().subscribe({
      next: (data) => {
        console.log('Today\'s lessons:', data);
      },
      error: (error) => {
        console.error('Error fetching today\'s lessons:', error);
      }
    });
  }
}
