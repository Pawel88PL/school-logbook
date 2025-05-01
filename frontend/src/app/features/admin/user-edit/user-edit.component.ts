import { CommonModule } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, AbstractControl, ValidationErrors } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';

import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';

import { ToastrService } from 'ngx-toastr';

import { UserService } from '../../../core/services/user.service';
import { Role, UpdateUserModel, UserAddModel } from '../../../core/models/user-model';

@Component({
  selector: 'app-user-edit',
  imports: [CommonModule,

    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatSelectModule,

    RouterModule,
    ReactiveFormsModule],
  templateUrl: './user-edit.component.html',
  styleUrl: './user-edit.component.css'
})
export class UserEditComponent implements OnInit {

  @ViewChild('autoFocusInput') autoFocusInput!: ElementRef;

  errorMessage: string = '';
  isLoading: boolean = true;
  hidePassword: boolean = true;
  successMessage: string = 'Zaktualizowano użytkownika';
  updateForm!: FormGroup;
  userId: string | null = null;

  roles: Role[] = [];

  constructor(
    private activatedRoute: ActivatedRoute,
    private fb: FormBuilder,
    private router: Router,
    private toastr: ToastrService,
    private userService: UserService
  ) { }

  ngOnInit(): void {
    this.captureURLparameters();
    this.initializeForm();
    this.getRoles();
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.autoFocusInput.nativeElement.focus();
    }, 0);
  }

  captureURLparameters(): void {
    this.activatedRoute.params.subscribe(params => {
      this.userId = params['id'];
      if (this.userId) {
        this.getUserById(this.userId);
      } else {
        this.toastr.warning('Nie podano ID użytkownika.', 'Uwaga');
      }
    });
  }

  getUserById(userId: string): void {
    this.userService.getUserById(userId).subscribe({
      next: (user) => {
        this.patchFormValues(user);
        this.isLoading = false;
      },
      error: (error) => {
        this.errorMessage = this.extractErrorMessage(error);
        this.toastr.error(this.errorMessage, 'Błąd pobierania danych użytkownika');
        console.error(error);
        this.isLoading = false;
      }
    });
  }

  translateRoleDisplayName(role: Role): Role {
    switch (role.name) {
      case 'Administrator':
        role.displayName = 'Administrator';
        break;
      case 'Teacher':
        role.displayName = 'Nauczyciel';
        break;
      case 'Student':
        role.displayName = 'Uczeń';
        break;
    }
    return role;
  }

  getRoles(): void {
    this.userService.getRoles().subscribe({
      next: (response) => {
        this.roles = response.map((role: Role) => this.translateRoleDisplayName(role));
      },
      error: (error) => {
        this.errorMessage = error.error.message;
        this.toastr.error(this.errorMessage, 'Błąd');
        console.error(error);
      }
    });
  }

  extractErrorMessage(error: any): string {
    // Sprawdzenie, czy obiekt błędu zawiera tablicę w polu 'error'
    if (error && Array.isArray(error.error) && error.error.length > 0 && error.error[0].description) {
      return error.error[0].description; // Zwrócenie opisu błędu
    }
    return 'Wystąpił błąd podczas dodawania użytkownika. Spróbuj ponownie później.';
  }

  initializeForm(): void {
    this.updateForm = this.fb.group({
      firstName: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
      lastName: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
      email: ['', [Validators.required, this.strictEmailValidator]],
      password: ['', [Validators.minLength(6), Validators.maxLength(50)]]
    });
  }

  patchFormValues(user: any): void {
    this.updateForm.get('firstName')?.setValue(user.firstName);
    this.updateForm.get('lastName')?.setValue(user.lastName);
    this.updateForm.get('email')?.setValue(user.email);
  }

  prepareUserModel(): UpdateUserModel {
    return {
      id: this.userId ?? '',
      firstName: this.updateForm.get('firstName')?.value,
      lastName: this.updateForm.get('lastName')?.value,
      email: this.updateForm.get('email')?.value,
      newPassword: this.updateForm.get('password')?.value,
    };
  }

  onSubmit(): void {
    if (this.updateForm.valid) {
      this.isLoading = true;
      const user = this.prepareUserModel();

      this.userService.updateUser(user).subscribe({
        next: () => {
          this.toastr.success(this.successMessage, 'Sukces');
          this.isLoading = false;
          this.router.navigate(['/admin/users']);
        },
        error: error => {
          this.errorMessage = this.extractErrorMessage(error);
          this.toastr.error(this.errorMessage, 'Błąd edycji');
          console.error(error);
          this.isLoading = false;
        }
      });
    }
  }

  strictEmailValidator(control: AbstractControl): ValidationErrors | null {
    const email = control.value;
    if (!email) return null;

    // Przykładowy wzorzec wymagający:
    // - część przed '@' bez spacji
    // - '@'
    // - część domenową z kropką i co najmniej dwoma znakami po kropce
    // np. "pawel@firma.com", "anna.kowalska@test.co.uk", etc.
    const strictEmailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

    return strictEmailPattern.test(email) ? null : { invalidEmail: true };
  }

  togglePasswordVisibility(state: boolean): void {
    this.hidePassword = !state;
  }
}