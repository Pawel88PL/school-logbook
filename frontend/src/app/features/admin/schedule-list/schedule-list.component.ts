import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { MatCardModule } from '@angular/material/card';
import { MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatPaginator, MatPaginatorIntl, MatPaginatorModule } from '@angular/material/paginator';
import { MatPaginatorIntlPolish } from '../../../shared/classes/mat-paginator-polish';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatTooltip } from '@angular/material/tooltip';

import { ToastrService } from 'ngx-toastr';

import { DeleteConfirmationComponent } from '../../../shared/components/delete-confirmation/delete-confirmation.component';
import { ClassService } from '../../../core/services/class.service';
import { ScheduleService } from '../../../core/services/schedule.service';

@Component({
  selector: 'app-schedule-list',
  imports: [
    CommonModule,
    FormsModule,

    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatPaginatorModule,
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

  displayedColumns: string[] = ['index', 'name', 'studentCount', 'actions'];
  pageIndex: number = 0;
  pageSize: number = 10;
  rowNumber: number = 0;
  totalRecords: number = 0;

  dataSource = new MatTableDataSource<any>([]);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort!: MatSort;

  errorMessage: string | null = null;
  isLoading: boolean = true;
  isSortInitialized: boolean = false;

  constructor(
    private dialog: MatDialog,
    private scheduleService: ScheduleService,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
    this.loadSchedule();
  }

  // deleteClass(id: number) {
  //   this.isLoading = true;
  //   this.classService.deleteClass(id).subscribe({
  //     next: () => {
  //       this.toastr.success('Klasa została usunięta', 'Sukces');
  //       this.loadClasses(this.paginator.pageIndex, this.paginator.pageSize);
  //     },
  //     error: (error) => {
  //       this.toastr.error('Wystąpił błąd podczas usuwania klasy', 'Błąd');
  //       console.error(error);
  //       this.isLoading = false;
  //     }
  //   });
  // }

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

  onDeleteClass(id: number): void {
    let message = 'Czy na pewno chcesz usunąć wybraną klasę?';

    const dialogRef = this.dialog.open(DeleteConfirmationComponent, {
      width: '400px',
      height: '180px',
      data: { message: message }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        //this.deleteClass(id);
      }
    });
  }
}