import { CommonModule } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';

import { ClassService } from '../../../core/services/class.service';
import { TeacherService } from '../../../core/services/teacher.service';
import { ToastrService } from 'ngx-toastr';

import { SubjectAddModel } from '../../../core/models/subject-model';
import { Teacher } from '../../../core/models/teacher-model';
import { SubjectService } from '../../../core/services/subject.service';

@Component({
  selector: 'app-subject-add',
  imports: [
    CommonModule,
    FormsModule,

    MatCardModule,
    MatCheckboxModule,
    MatFormFieldModule,
    MatInputModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatSelectModule,

    RouterModule,
    ReactiveFormsModule
  ],
  templateUrl: './subject-add.component.html',
  styleUrl: './subject-add.component.css'
})

export class SubjectAddComponent implements OnInit {

  @ViewChild('autoFocusInput') autoFocusInput!: ElementRef;

  subjectAddForm!: FormGroup;

  errorMessage: string = '';
  isLoading: boolean = true;
  searchTerm: string = '';
  successMessage: string = '';

  teachers: Teacher[] = [];

  constructor(
    private classService: ClassService,
    private fb: FormBuilder,
    private router: Router,
    private subjectService: SubjectService,
    private teacherService: TeacherService,
    private toastr: ToastrService,
  ) { }

  ngOnInit(): void {
    this.initializeSubjectAddForm();
    this.getTeachers();
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.autoFocusInput.nativeElement.focus();
    }, 0);
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

  initializeSubjectAddForm(): void {
    this.subjectAddForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(20)]],
    });
  }

  prepareSubjectAddModel(): SubjectAddModel {
    return {
      name: this.subjectAddForm.get('name')?.value,
    };
  }

  onSubmit(): void {
    if (this.subjectAddForm.valid) {
      this.isLoading = true;
      const newSubject = this.prepareSubjectAddModel();

      this.subjectService.addSubject(newSubject).subscribe({
        next: () => {
          this.toastr.success(this.successMessage, 'Sukces');
          this.isLoading = false;
          this.router.navigate(['/admin/classes']);
        },
        error: error => {
          this.errorMessage = error.error.message || 'Wystąpił błąd podczas dodawania nowej klasy.';
          this.toastr.error(this.errorMessage, 'Błąd');
          console.error(error);
          this.isLoading = false;
        }
      });
    }
  }
}