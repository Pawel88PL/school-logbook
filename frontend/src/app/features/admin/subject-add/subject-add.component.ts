import { CommonModule } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule, FormArray } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltip } from '@angular/material/tooltip';

import { ClassService } from '../../../core/services/class.service';
import { TeacherService } from '../../../core/services/teacher.service';
import { ToastrService } from 'ngx-toastr';

import { Teacher } from '../../../core/models/teacher-model';
import { SubjectService } from '../../../core/services/subject.service';
import { ClassModel } from '../../../core/models/class-model';
import { forkJoin } from 'rxjs';

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
    MatTooltip,

    RouterModule,
    ReactiveFormsModule
  ],
  templateUrl: './subject-add.component.html',
  styleUrl: './subject-add.component.css'
})

export class SubjectAddComponent implements OnInit {

  @ViewChild('autoFocusInput') autoFocusInput!: ElementRef;

  subjectForm!: FormGroup;

  errorMessage: string = '';
  isLoading: boolean = true;
  successMessage: string = '';

  classes: ClassModel[] = [];
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
    this.initializeSubjectForm();
    this.loadInitialData();
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.autoFocusInput.nativeElement.focus();
    }, 0);
  }

  get assignments(): FormArray {
    return this.subjectForm.get('assignments') as FormArray;
  }

  addAssignment(): void {
    this.assignments.push(
      this.fb.group({
        classId: [null, Validators.required],
        teacherId: [null, Validators.required]
      })
    );
  }

  loadInitialData(): void {
    this.isLoading = true;

    forkJoin({
      classes: this.classService.getClasses(),
      teachers: this.teacherService.getTeachers()
    }).subscribe({
      next: ({ classes, teachers }) => {
        this.classes = classes;
        this.teachers = teachers;

        this.addAssignment();
      },
      error: (error) => {
        this.errorMessage = 'Błąd podczas ładowania danych początkowych.';
        this.toastr.error(this.errorMessage, 'Błąd');
        console.error(error);
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }

  initializeSubjectForm(): void {
    this.subjectForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(20)]],
      assignments: this.fb.array([])
    });
  }

  onSubmit(): void {
    if (this.subjectForm.invalid) {
      this.toastr.warning('Uzupełnij wszystkie wymagane pola', 'Uwaga');
      return;
    }

    if (this.subjectForm.valid) {
      this.isLoading = true;
      const subjectData = this.subjectForm.value;

      this.subjectService.addSubject(subjectData).subscribe({
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

  removeAssignment(index: number): void {
    this.assignments.removeAt(index);
  }
}