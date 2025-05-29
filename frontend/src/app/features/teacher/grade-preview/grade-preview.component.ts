import { AfterViewInit, Component, OnDestroy, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { catchError, combineLatest, debounceTime, distinctUntilChanged, of, startWith, Subscription, switchMap } from 'rxjs';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatPaginator, MatPaginatorIntl, MatPaginatorModule } from '@angular/material/paginator';
import { MatPaginatorIntlPolish } from '../../../shared/classes/mat-paginator-polish';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';

import { ToastrService } from 'ngx-toastr';

import { GradeModel } from '../../../core/models/grade-model';
import { GradeService } from '../../../core/services/grade.service';

@Component({
  selector: 'app-grade-preview',
  imports: [
    CommonModule,
    FormsModule,

    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatPaginatorModule,
    MatProgressSpinnerModule,
    MatSelectModule,
    MatSortModule,
    MatTableModule,

    ReactiveFormsModule,
    RouterModule
  ],
  providers: [
    { provide: MatPaginatorIntl, useClass: MatPaginatorIntlPolish }
  ],
  templateUrl: './grade-preview.component.html',
  styleUrl: './grade-preview.component.css'
})

export class GradePreviewComponent implements AfterViewInit, OnDestroy {

  displayedColumns: string[] = ['index', 'studentName', 'className', 'subjectName', 'value', 'comment', 'date'];
  data: GradeModel[] = [];

  pageIndex: number = 0;
  pageSize: number = 10;
  rowNumber: number = 0;
  totalRecords: number = 0;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort!: MatSort;

  errorMessage: string | null = null;
  isLoadingResults: boolean = true;

  private subscription = new Subscription();

  searchForm!: FormGroup;
  searchQuery: string = '';

  constructor(
    private formBuilder: FormBuilder,
    private gradeService: GradeService,
    private toastr: ToastrService,
  ) { }

  ngOnInit(): void {
    this.initialeSearchForm();
  }

  ngAfterViewInit(): void {
    this.resetPageOnSortChange();
    this.observeTableChanges();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  getRowNumber(index: number): number {
    return (this.paginator?.pageIndex || 0) * this.paginator.pageSize + index + 1;
  }

  private initialeSearchForm() {
    this.searchForm = this.formBuilder.group({
      query: [''],
    });
  }

  private observeTableChanges(): void {
    const query$ = this.searchForm.get('query')!.valueChanges.pipe(
      startWith(this.searchForm.get('query')!.value),
      debounceTime(300),
      distinctUntilChanged()
    );

    const sort$ = this.sort.sortChange.pipe(startWith({}));
    const page$ = this.paginator.page.pipe(startWith({}));

    this.subscription.add(
      combineLatest([query$, sort$, page$])
        .pipe(
          switchMap(([query]) => {

            this.searchQuery = query;

            this.isLoadingResults = true;
            return this.gradeService.getGradesForTeacherPaged({
              pageNumber: this.paginator.pageIndex + 1,
              pageSize: this.paginator.pageSize,
              sortColumn: this.sort.active || 'date',
              sortDirection: this.sort.direction || 'desc',
              searchQuery: query || '',
            }).pipe(
              catchError(error => {
                // Obsługuje błąd z backendu
                this.isLoadingResults = false; // Zatrzymuje ładowanie
                console.error('Error occurred:', error);
                this.toastr.error('Wystąpił problem podczas pobierania danych', 'Błąd');
                return of({ data: [], totalRecords: 0 }); // Możesz zwrócić domyślne dane
              })
            );
          })
        )
        .subscribe((response: any) => {
          this.data = response.data;
          this.totalRecords = response.totalRecords;
          this.isLoadingResults = false;
        })
    );
  }

  private resetPageOnSortChange(): void {
    this.sort.sortChange.subscribe(() => (this.paginator.pageIndex = 0));
  }
}