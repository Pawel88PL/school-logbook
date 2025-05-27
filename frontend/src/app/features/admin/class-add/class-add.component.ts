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

import { StudentService } from '../../../core/services/student.service';
import { TeacherService } from '../../../core/services/teacher.service';
import { ToastrService } from 'ngx-toastr';

import { ClassAddModel } from '../../../core/models/class-model';
import { Teacher } from '../../../core/models/teacher-model';
import { Student } from '../../../core/models/student-model';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { ClassService } from '../../../core/services/class.service';

@Component({
  selector: 'app-class-add',
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
  templateUrl: './class-add.component.html',
  styleUrl: './class-add.component.css'
})
export class ClassAddComponent implements OnInit {

  @ViewChild('autoFocusInput') autoFocusInput!: ElementRef;

  classAddForm!: FormGroup;

  errorMessage: string = '';
  isLoading: boolean = true;
  searchTerm: string = '';
  successMessage: string = 'Dodano nową klasę.';

  filteredStudents: Student[] = [];
  students: Student[] = [];
  selectedStudents: Student[] = [];

  teachers: Teacher[] = [];

  constructor(
    private classService: ClassService,
    private fb: FormBuilder,
    private router: Router,
    private sanitizer: DomSanitizer,
    private studentService: StudentService,
    private teacherService: TeacherService,
    private toastr: ToastrService,
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

  filterStudents(): void {
    const term = this.searchTerm.toLowerCase();
    this.filteredStudents = this.students.filter(student =>
      student.firstName.toLowerCase().includes(term) ||
      student.lastName.toLowerCase().includes(term)
    );
  }

  getStudents(): void {
    this.studentService.getStudents().subscribe({
      next: (data: Student[]) => {
        this.students = data.map(student => ({ ...student, isSelected: false }));
        this.filteredStudents = [...this.students];
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
    });
  }

  highlight(text: string): SafeHtml {
    if (!this.searchTerm) {
      return this.sanitizer.bypassSecurityTrustHtml(text);
    }
    const regex = new RegExp(`(${this.searchTerm})`, 'gi');
    const highlighted = text.replace(regex, '<span class="highlight" style="background-color: orange;">$1</span>');
    return this.sanitizer.bypassSecurityTrustHtml(highlighted);
  }

  initializeClassAddForm(): void {
    this.classAddForm = this.fb.group({
      name: ['', [Validators.required, Validators.maxLength(5)]],
      homeroomTeacherId: ['', [Validators.required]]
    });
  }

  prepareClassAddModel(): ClassAddModel {
    return {
      name: this.classAddForm.get('name')?.value,
      homeroomTeacherId: this.classAddForm.get('homeroomTeacherId')?.value,
      assignedStudentIds: this.selectedStudents.map(student => student.id)
    };
  }

  onStudentChange(student: Student): void {
    if (student.isSelected) {
      // Jeśli uczeń jest zaznaczony, dodaj do wybranych
      if (!this.selectedStudents.some(p => p.id === student.id)) {
        this.selectedStudents.push(student);
        this.selectedStudents.sort((a, b) => a.lastName.localeCompare(b.lastName));
      }
    } else {
      // Jeśli uczeń jest odznaczony, usuń z wybranych
      this.selectedStudents = this.selectedStudents.filter(p => p.id !== student.id);
    }
  }

  onSubmit(): void {
    if (this.classAddForm.valid) {
      this.isLoading = true;
      const newClass = this.prepareClassAddModel();

      this.classService.addClass(newClass).subscribe({
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