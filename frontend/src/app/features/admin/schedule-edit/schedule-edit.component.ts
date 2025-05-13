import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';

import { MatDialog } from '@angular/material/dialog';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltip } from '@angular/material/tooltip';

import { ScheduleService } from '../../../core/services/schedule.service';
import { ToastrService } from 'ngx-toastr';

import { ScheduleForClassModel } from '../../../core/models/class-schedule-model';
import { ScheduleEntryModel } from '../../../core/models/schedule-model';
import { SubjectWithTeachersModel } from '../../../core/models/subject-teacher.model';
import { ScheduleEntryDialogComponent } from '../schedule-entry-dialog/schedule-entry-dialog.component';

@Component({
  selector: 'app-schedule-edit',
  imports: [
    CommonModule,

    MatProgressSpinnerModule,
    MatTooltip
  ],
  templateUrl: './schedule-edit.component.html',
  styleUrl: './schedule-edit.component.css'
})

export class ScheduleEditComponent implements OnInit {

  classId: number | null = null;
  schedule!: ScheduleForClassModel;
  isLoading = true;
  errorMessage: string = '';

  subjectOptions: SubjectWithTeachersModel[] = [];

  daysOfWeek = [
    { label: 'Poniedziałek', value: 1 },
    { label: 'Wtorek', value: 2 },
    { label: 'Środa', value: 3 },
    { label: 'Czwartek', value: 4 },
    { label: 'Piątek', value: 5 },
  ];

  constructor(
    private activatedRoute: ActivatedRoute,
    private dialog: MatDialog,
    private scheduleService: ScheduleService,
    private toastr: ToastrService

  ) { }

  ngOnInit(): void {
    this.captureURLparameters();
    this.loadSubjectsForClass();
  }

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

  deleteEntry(id: number): void {
    const index = this.schedule.entries.findIndex(e => e.id === id);
    if (index >= 0) {
      this.schedule.entries.splice(index, 1);
      this.toastr.info('Wpis został usunięty (lokalnie)');
    }
  }

  editEntry(entry: ScheduleEntryModel): void {
    this.toastr.info(`Edytuj wpis: ${entry.subjectName} - ${entry.teacherFullName}`);
    // Tu w przyszłości otwierasz modal lub formularz
  }


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

  loadSubjectsForClass(): void {
    if (!this.classId) return;

    this.scheduleService.getSubjectsForClass(this.classId).subscribe({
      next: (subjects) => {
        this.subjectOptions = subjects;
      },
      error: (error) => {
        this.toastr.error('Błąd podczas pobierania przedmiotów z nauczycielami.', 'Błąd');
        console.error(error);
      }
    });
  }

  openAddEntryDialog(day: number): void {
    const dialogRef = this.dialog.open(ScheduleEntryDialogComponent, {
      width: '500px',
      data: {
        dayOfWeek: day,
        classId: this.classId,
        availableSubjects: this.subjectOptions
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const entryToSend: ScheduleEntryModel = {
          id: 0, // backend ustawi id
          classId: this.classId!,
          subjectId: result.subjectId,
          teacherId: result.teacherId,
          dayOfWeek: day,
          startTime: result.startTime + ':00', // backend wymaga formatu HH:mm:ss
        };

        this.scheduleService.addScheduleEntry(entryToSend).subscribe({
          next: (createdEntry) => {
            this.toastr.success('Dodano wpis do planu lekcji', 'Sukces');
            this.schedule.entries.push(createdEntry); // backend dostarczył wszystko
          },
          error: () => {
            this.toastr.error('Błąd podczas dodawania wpisu do planu', 'Błąd');
          }
        });
      }
    });
  }

  trackById(index: number, item: ScheduleEntryModel): number {
    return item.id ? item.id : index;
  }
}