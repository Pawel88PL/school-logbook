import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';

import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { ScheduleService } from '../../../core/services/schedule.service';
import { ToastrService } from 'ngx-toastr';

import { ScheduleForClassModel } from '../../../core/models/class-schedule-model';
import { ScheduleEntryModel } from '../../../core/models/schedule-model';

@Component({
  selector: 'app-schedule-edit',
  imports: [
    CommonModule,

    MatProgressSpinnerModule
  ],
  templateUrl: './schedule-edit.component.html',
  styleUrl: './schedule-edit.component.css'
})

export class ScheduleEditComponent implements OnInit {

  classId: number | null = null;
  schedule!: ScheduleForClassModel;
  isLoading = true;
  errorMessage: string = '';

  daysOfWeek = [
    { label: 'Poniedziałek', value: 1 },
    { label: 'Wtorek', value: 2 },
    { label: 'Środa', value: 3 },
    { label: 'Czwartek', value: 4 },
    { label: 'Piątek', value: 5 },
  ];

  constructor(
    private activatedRoute: ActivatedRoute,
    private scheduleService: ScheduleService,
    private toastr: ToastrService

  ) { }

  ngOnInit(): void {
    this.captureURLparameters();
  }

  addEntry(day: number): void {}

  captureURLparameters(): void {
    this.activatedRoute.params.subscribe(params => {
      this.classId = params['id'];
      if (this.classId) {
        this.loadSchedule(this.classId);
      } else {
        this.errorMessage = 'Nieprawidłowy identyfikator klasy.';
        this.toastr.error(this.errorMessage, 'Błąd');
        this.isLoading = false;
      }
    });
  }

  deleteEntry(id: number): void {}

  editEntry(entry: ScheduleEntryModel): void {}

  getEntriesForDay(day: number): ScheduleEntryModel[] {
    return this.schedule?.entries.filter(e => e.dayOfWeek === day) || [];
  }

  loadSchedule(id: number): void {
    this.isLoading = true;

    this.scheduleService.getScheduleForClass(id).subscribe({
      next: (data) => {
        this.schedule = data;
        this.isLoading = false;
      },
      error: (error) => {
        this.errorMessage = error.error.message || 'Wystąpił błąd podczas ładowania planu lekcji.';
        this.toastr.error(this.errorMessage, 'Błąd');
        this.isLoading = false;
      }
    });
  }

}