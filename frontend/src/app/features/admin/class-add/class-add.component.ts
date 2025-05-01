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
import { Role, UserAddModel } from '../../../core/models/user-model';
import { ClassAddModel } from '../../../core/models/class-model';

@Component({
  selector: 'app-class-add',
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
  templateUrl: './class-add.component.html',
  styleUrl: './class-add.component.css'
})
export class ClassAddComponent implements OnInit {

  @ViewChild('autoFocusInput') autoFocusInput!: ElementRef;

  errorMessage: string = '';
  isLoading: boolean = false;
  classAddForm!: FormGroup;
  successMessage: string = 'Dodano nową klasę.';

  students: any[] = [];
  selectedStudents: any[] = [];

  teachers: any[] = [];

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private toastr: ToastrService,
    private userService: UserService
  ) { }

  ngOnInit(): void {
    this.initializeClassAddForm();
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.autoFocusInput.nativeElement.focus();
    }, 0);
  }

  initializeClassAddForm(): void {
    this.classAddForm = this.fb.group({
      name: ['', [Validators.required, Validators.maxLength(5)]],
      homeroomTeacherId: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]]
    });
  }

  prepareClassAddModel(): ClassAddModel {
    return {
      name: this.classAddForm.get('name')?.value,
      homeroomTeacherId: this.classAddForm.get('homeroomTeacherId')?.value,
      assignedStudentIds: this.selectedStudents.map(student => student.id)
    };
  }

  onSubmit(): void {
    if (this.classAddForm.valid) {
      this.isLoading = true;
      const newClass = this.prepareClassAddModel();

      // this.userService.addUser(userAddModel).subscribe({
      //   next: () => {
      //     this.toastr.success(this.successMessage, 'Sukces');
      //     this.isLoading = false;
      //     this.router.navigate(['/admin/users']);
      //   },
      //   error: error => {
      //     this.errorMessage = error.error.message || 'Wystąpił błąd podczas dodawania nowej klasy.';
      //     this.toastr.error(this.errorMessage, 'Błąd');
      //     console.error(error);
      //     this.isLoading = false;
      //   }
      // });
    }
  }
}