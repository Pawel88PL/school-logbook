import { CommonModule } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, AbstractControl, ValidationErrors } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

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
  selector: 'app-user-add',
  imports: [
    CommonModule,

    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatSelectModule,

    RouterModule,
    ReactiveFormsModule
  ],
  templateUrl: './user-add.component.html',
  styleUrl: './user-add.component.css'
})

export class UserAddComponent implements OnInit {
  @ViewChild('autoFocusInput') autoFocusInput!: ElementRef;

  errorMessage: string | null = null;
  isLoading: boolean = false;
  hidePassword: boolean = true;
  userAddForm!: FormGroup;
  successMessage: string = 'Dodano nowego użytkownika';

  roles: Role[] = [
    { id: 1, name: 'Administrator', displayName: 'Administrator' },
    { id: 2, name: 'SAP FI Consultant', displayName: 'Konsultant SAP FI' },
  ];

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private toastr: ToastrService,
    private userService: UserService
  ) { }

  ngOnInit(): void {
    this.initializeUserAddForm();
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.autoFocusInput.nativeElement.focus();
    }, 0);
  }

  extractErrorMessage(error: any): string {
    // Sprawdzenie, czy obiekt błędu zawiera tablicę w polu 'error'
    if (error && Array.isArray(error.error) && error.error.length > 0 && error.error[0].description) {
      return error.error[0].description; // Zwrócenie opisu błędu
    }
    return 'Wystąpił błąd podczas dodawania użytkownika. Spróbuj ponownie później.';
  }

  initializeUserAddForm(): void {
    this.userAddForm = this.fb.group({
      firstName: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
      lastName: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
      email: ['', [Validators.required, this.strictEmailValidator]],
      password: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(50)]],
      role: ['', Validators.required]
    });
  }

  prepareUserAddModel(): UserAddModel {
    return {
      firstName: this.userAddForm.get('firstName')?.value,
      lastName: this.userAddForm.get('lastName')?.value,
      email: this.userAddForm.get('email')?.value,
      password: this.userAddForm.get('password')?.value,
      role: this.userAddForm.get('role')?.value
    };
  }

  onSubmit(): void {
    if (this.userAddForm.valid) {
      this.isLoading = true;
      const userAddModel = this.prepareUserAddModel();

      this.userService.addUser(userAddModel).subscribe({
        next: () => {
          this.toastr.success(this.successMessage, 'Sukces');
          this.isLoading = false;
          this.router.navigate(['/admin/users']);
        },
        error: error => {
          this.errorMessage = this.extractErrorMessage(error);
          this.toastr.error(this.errorMessage, 'Błąd rejestracji');
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