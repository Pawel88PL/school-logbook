import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { JwtService } from '../../../core/auth/jwt.service';
import { ScheduleService } from '../../../core/services/schedule.service';
import { ToastrService } from 'ngx-toastr';

import { TeacherScheduleEntry } from '../../../core/models/teacher-schedule-model';
import { daysOfWeek, DaysOfWeek } from '../../../core/models/day-of-week-model';

@Component({
  selector: 'app-teacher-schedule',
  imports: [
    CommonModule,
    MatCardModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './teacher-schedule.component.html',
  styleUrl: './teacher-schedule.component.css'
})

export class TeacherScheduleComponent implements OnInit {

  isLoading: boolean = true;
  errorMessage: string = '';
  schedule: TeacherScheduleEntry[] = [];
  userId: string | null = null;

  daysOfWeek: DaysOfWeek[] = daysOfWeek;

  constructor(
    private jwtService: JwtService,
    private scheduleService: ScheduleService,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
    this.userId = this.jwtService.getUserId();
    if (this.userId) {
      this.loadSchedule(this.userId);
    }
  }

  loadSchedule(userId: string): void {
    this.isLoading = true;

    this.scheduleService.getScheduleForTeacher(userId).subscribe({
      next: (data) => {
        this.schedule = data;
        this.isLoading = false;
      },
      error: (err) => {
        this.errorMessage = err.error.message || 'Wystąpił błąd podczas pobierania planu lekcji';
        this.toastr.error(this.errorMessage, 'Błąd');
        this.isLoading = false;
      }
    });
  }

  getEntriesForDay(day: number): TeacherScheduleEntry[] {
    return this.schedule.filter(entry => entry.dayOfWeek === day);
  }
}