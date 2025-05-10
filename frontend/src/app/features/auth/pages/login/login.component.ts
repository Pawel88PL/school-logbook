import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

import { AuthService } from '../../../../core/auth/auth.service';
import { ToastrService } from 'ngx-toastr';

import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-login',
  imports: [
    CommonModule,

    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,

    RouterModule,
    ReactiveFormsModule,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})

export class LoginComponent implements OnInit {

  errorMessage: string | null = null;
  hidePassword: boolean = true;
  isInLogginProcess: boolean = false;
  loginForm!: FormGroup;

  // Referencja do pola input dla userName
  @ViewChild('emailInput') emailInput!: ElementRef<HTMLInputElement>;

  constructor(
    private authService: AuthService,
    private formBuilder: FormBuilder,
    private router: Router,
    private toastr: ToastrService,
  ) { }

  ngOnInit(): void {
    this.initialeLoginForm();
  }

  initialeLoginForm() {
    this.loginForm = this.formBuilder.group({
      username: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    })
  }

  onSubmit() {
    if (this.loginForm.invalid) {
      this.toastr.warning('Wypełnij wszystkie pola formularza.', 'Błąd logowania');
      return;
    }

    if (this.loginForm.valid) {
      this.isInLogginProcess = true;
      const loginData = this.loginForm.value;
      this.authService.login(loginData.username, loginData.password).subscribe({
        next: () => {
          this.errorMessage = null;
          // Przekierowanie odbywa się w auth.service po pomyślnym zalogowaniu
        },
        error: (message) => {
          this.isInLogginProcess = false;
          this.toastr.error(message, 'Błąd logowania');
        }
      });
    }
  }

  togglePasswordVisibility(state: boolean): void {
    this.hidePassword = !state;
  }
}