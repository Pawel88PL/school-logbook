import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatCardModule } from '@angular/material/card';

import { JwtService } from '../../../core/auth/jwt.service';
import { ScheduleService } from '../../../core/services/schedule.service';
import { ToastrService } from 'ngx-toastr';

import { TeacherScheduleEntry } from '../../../core/models/teacher-schedule-model';

@Component({
  selector: 'app-teacher-schedule',
  imports: [
    CommonModule,
    MatCardModule
  ],
  templateUrl: './teacher-schedule.component.html',
  styleUrl: './teacher-schedule.component.css'
})

export class TeacherScheduleComponent implements OnInit {

  isLoading: boolean = true;
  errorMessage: string = '';
  schedule: TeacherScheduleEntry[] = [];
  userId: string | null = null;

  daysOfWeek = [
    { label: 'Poniedziałek', value: 1 },
    { label: 'Wtorek', value: 2 },
    { label: 'Środa', value: 3 },
    { label: 'Czwartek', value: 4 },
    { label: 'Piątek', value: 5 },
  ];

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