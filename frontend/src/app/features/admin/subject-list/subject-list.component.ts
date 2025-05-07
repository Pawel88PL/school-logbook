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

import { SubjectService } from '../../../core/services/subject.service';
import { ToastrService } from 'ngx-toastr';

import { DeleteConfirmationComponent } from '../../../shared/components/delete-confirmation/delete-confirmation.component';

@Component({
  selector: 'app-subject-list',
  imports: [
    CommonModule,

    MatPaginatorModule,
    MatProgressSpinnerModule,
    MatSortModule,
    MatTableModule,
    MatTooltip,

    RouterModule
  ],
  providers: [
    { provide: MatPaginatorIntl, useClass: MatPaginatorIntlPolish }
  ],
  templateUrl: './subject-list.component.html',
  styleUrl: './subject-list.component.css'
})
export class SubjectListComponent implements OnInit {

  displayedColumns: string[] = ['index', 'name', 'createdAt', 'updatedAt', 'assignmentsDto', 'actions'];
  dataSource = new MatTableDataSource<any>([]);
  pageIndex: number = 0;
  pageSize: number = 10;
  rowNumber: number = 0;
  totalRecords: number = 0;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort!: MatSort;

  errorMessage: string | null = null;
  isLoading: boolean = true;
  isSortInitialized: boolean = false;

  constructor(
    private dialog: MatDialog,
    private subjectService: SubjectService,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
    this.loadSubjects(0, this.pageSize);
  }

  // deleteSubject(id: number) {
  //   this.isLoading = true;
  //   this.subjectService.deleteClass(id).subscribe({
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

  initializeSort() {
    if (!this.isSortInitialized) {
      setTimeout(() => {
        this.dataSource.sort = this.sort;
        this.sort.sortChange.subscribe((event) => this.onSortChange(event));
      }, 500);
      this.isSortInitialized = true;
    }
  }

  loadSubjects(pageIndex: number, pageSize: number, sortColumn?: string, sortDirection?: string): void {
    const params = {
      pageNumber: pageIndex + 1,
      pageSize: pageSize,
      sortColumn: sortColumn || 'name',
      sortDirection: sortDirection || 'asc'
    };

    this.subjectService.getSubjectPaged(params).subscribe({
      next: (response) => {
        this.dataSource.data = response.data;
        this.totalRecords = response.totalRecords;
        this.initializeSort();
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

  onDeleteSubject(id: number): void {
    let message = 'Czy na pewno chcesz usunąć wybrany przedmiot?';

    const dialogRef = this.dialog.open(DeleteConfirmationComponent, {
      width: '400px',
      height: '180px',
      data: { message: message }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // this.deleteClass(id);
      }
    });
  }

  onPageChange(event: any): void {
    this.loadSubjects(event.pageIndex, event.pageSize);
    this.rowNumber = event.pageIndex * event.pageSize;
  }

  onSortChange(event: any): void {
    this.loadSubjects(this.paginator.pageIndex, this.paginator.pageSize, event.active, event.direction);
  }
}