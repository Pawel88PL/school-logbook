import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { catchError, combineLatest, debounceTime, distinctUntilChanged, of, startWith, Subscription, switchMap } from 'rxjs';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { MatCardModule } from '@angular/material/card';
import { MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatPaginator, MatPaginatorIntl, MatPaginatorModule } from '@angular/material/paginator';
import { MatPaginatorIntlPolish } from '../../../shared/classes/mat-paginator-polish';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatTooltip } from '@angular/material/tooltip';

import { JwtService } from '../../../core/auth/jwt.service';
import { ToastrService } from 'ngx-toastr';
import { UserService } from '../../../core/services/user.service';

import { Role, User } from '../../../core/models/user-model';
import { DeleteConfirmationComponent } from '../../../shared/components/delete-confirmation/delete-confirmation.component';

@Component({
  selector: 'app-user-list',
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
    MatTooltip,

    ReactiveFormsModule,
    RouterModule
  ],
  providers: [
    { provide: MatPaginatorIntl, useClass: MatPaginatorIntlPolish }
  ],
  templateUrl: './user-list.component.html',
  styleUrl: './user-list.component.css'
})

export class UserListComponent implements OnInit, AfterViewInit, OnDestroy {

  displayedColumns: string[] = ['index', 'firstName', 'lastName', 'role', 'email', 'lastSuccessfulLogin', 'actions'];
  data: User[] = [];

  pageIndex: number = 0;
  pageSize: number = 10;
  rowNumber: number = 0;
  totalRecords: number = 0;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort!: MatSort;

  errorMessage: string | null = null;
  isLoadingResults: boolean = true;

  roles: Role[] = [];

  private subscription = new Subscription();

  searchForm!: FormGroup;
  searchQuery: string = '';

  constructor(
    private dialog: MatDialog,
    private formBuilder: FormBuilder,
    private jwtService: JwtService,
    private userService: UserService,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
    this.initialeSearchForm();
    this.getRoles();
  }

  ngAfterViewInit(): void {
    this.resetPageOnSortChange();
    this.observeTableChanges();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  private deleteUser(userId: string) {
    if (userId === this.jwtService.getUserId()) {
      this.toastr.error('Nie możesz usunąć swojego konta', 'Błąd');
      return;
    }
    this.isLoadingResults = true;
    this.userService.deleteUser(userId).subscribe({
      next: () => {
        this.toastr.success('Użytkownik został usunięty', 'Sukces');
        this.refreshTable();
      },
      error: (error) => {
        this.toastr.error('Wystąpił błąd podczas usuwania użytkownika', 'Błąd');
        console.error(error);
        this.isLoadingResults = false;
      }
    });
  }

  private getRoles(): void {
    this.userService.getRoles().subscribe({
      next: (response) => {
        this.roles = response.map((role: Role) => ({
          name: role.name,
          displayName: this.translateRoleDisplayName(role.name || '')
        }));
      },
      error: (error) => {
        this.toastr.error(error.error.message, 'Błąd');
        console.error(error);
      }
    });
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
            return this.userService.getUsersPaged({
              pageNumber: this.paginator.pageIndex + 1,
              pageSize: this.paginator.pageSize,
              sortColumn: this.sort.active || 'role',
              sortDirection: this.sort.direction || 'asc',
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

  onDeleteUser(userId: string): void {
    if (userId === this.jwtService.getUserId()) {
      this.toastr.error('Nie możesz usunąć swojego konta', 'Błąd');
      return;
    }

    let message = 'Czy na pewno chcesz usunąć tego użytkownika?';

    const dialogRef = this.dialog.open(DeleteConfirmationComponent, {
      width: '400px',
      height: '180px',
      data: { message: message }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.deleteUser(userId);
      }
    });
  }

  private refreshTable(): void {
    const query = this.searchForm.get('query')!.value || '';
    this.isLoadingResults = true;

    this.userService.getUsersPaged({
      pageNumber: this.paginator.pageIndex + 1,
      pageSize: this.paginator.pageSize,
      sortColumn: this.sort.active || 'role',
      sortDirection: this.sort.direction || 'asc',
      searchQuery: query
    }).subscribe({
      next: (response) => {
        this.data = response.data;
        this.totalRecords = response.totalRecords;
        this.isLoadingResults = false;
      },
      error: (error) => {
        this.toastr.error('Wystąpił problem podczas odświeżania danych', 'Błąd');
        console.error(error);
        this.isLoadingResults = false;
      }
    });
  }

  private resetPageOnSortChange(): void {
    this.sort.sortChange.subscribe(() => (this.paginator.pageIndex = 0));
  }

  private translateRoleDisplayName(displayName: string): string {
    switch (displayName) {
      case 'Administrator':
        return 'Administrator';
      case 'Teacher':
        return 'Nauczyciel';
      case 'Student':
        return 'Uczeń';
      default:
        return displayName; // Fallback, jeśli nie rozpoznano roli
    }
  }
}