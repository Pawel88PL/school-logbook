import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatTooltip } from '@angular/material/tooltip';

import { ScheduleService } from '../../../core/services/schedule.service';
import { ToastrService } from 'ngx-toastr';

import { ClassScheduleModel } from '../../../core/models/class-schedule-model';

@Component({
  selector: 'app-schedule-list',
  imports: [
    CommonModule,
    FormsModule,

    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatProgressSpinnerModule,
    MatSortModule,
    MatTableModule,
    MatTooltip,

    ReactiveFormsModule,
    RouterModule
  ],
  templateUrl: './schedule-list.component.html',
  styleUrl: './schedule-list.component.css'
})

export class ScheduleListComponent implements OnInit {

  displayedColumns: string[] = ['index', 'name', 'entryCount', 'actions'];
  rowNumber: number = 0;

  dataSource = new MatTableDataSource<ClassScheduleModel>([]);

  errorMessage: string | null = null;
  isLoading: boolean = true;

  constructor(
    private scheduleService: ScheduleService,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
    this.loadSchedule();
  }

  loadSchedule(): void {
    this.scheduleService.getClassesWithSchedule().subscribe({
      next: (response) => {
        this.dataSource.data = response;
        this.isLoading = false;
      },
      error: (error) => {
        this.errorMessage = error.error.message ?? 'Wystąpił błąd podczas pobierania danych';
        this.toastr.error(this.errorMessage!, 'Błąd');
        console.error(error);
        this.isLoading = false;
      }
    });
  }
}