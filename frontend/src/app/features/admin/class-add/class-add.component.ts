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

import { StudentService } from '../../../core/services/student.service';
import { TeacherService } from '../../../core/services/teacher.service';
import { ToastrService } from 'ngx-toastr';
import { UserService } from '../../../core/services/user.service';

import { ClassAddModel } from '../../../core/models/class-model';
import { Teacher } from '../../../core/models/teacher-model';
import { Student } from '../../../core/models/student-model';

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
  isLoading: boolean = true;
  classAddForm!: FormGroup;
  successMessage: string = 'Dodano nową klasę.';

  students: Student[] = [];
  selectedStudents: Student[] = [];

  teachers: Teacher[] = [];

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private studentService: StudentService,
    private teacherService: TeacherService,
    private toastr: ToastrService,
    private userService: UserService
  ) { }

  ngOnInit(): void {
    this.initializeClassAddForm();
    this.getStudents();
    this.getTeachers();
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.autoFocusInput.nativeElement.focus();
    }, 0);
  }

  getStudents(): void {
    this.studentService.getStudents().subscribe({
      next: (students: Student[]) => {
        this.students = students;
      },
      error: error => {
        this.errorMessage = error.error.message || 'Wystąpił błąd podczas pobierania uczniów.';
        this.toastr.error(this.errorMessage, 'Błąd');
        console.error(error);
      }
    }).add(() => {
      this.isLoading = false;
    });
  }

  getTeachers(): void {
    this.teacherService.getTeachers().subscribe({
      next: (teachers: Teacher[]) => {
        this.teachers = teachers;
      },
      error: error => {
        this.errorMessage = error.error.message || 'Wystąpił błąd podczas pobierania nauczycieli.';
        this.toastr.error(this.errorMessage, 'Błąd');
        console.error(error);
      }
    }).add(() => {
      this.isLoading = false;
    });
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