import { CommonModule } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, AbstractControl, ValidationErrors, FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';

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

import { ClassModel } from '../../../core/models/class-model';
import { Teacher } from '../../../core/models/teacher-model';
import { Student } from '../../../core/models/student-model';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { ClassService } from '../../../core/services/class.service';

@Component({
  selector: 'app-class-edit',
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
  templateUrl: './class-edit.component.html',
  styleUrl: './class-edit.component.css'
})

export class ClassEditComponent implements OnInit {

  @ViewChild('autoFocusInput') autoFocusInput!: ElementRef;

  class: ClassModel | null = null;
  classId: number | null = null;
  classAddForm!: FormGroup;

  errorMessage: string = '';
  isLoading: boolean = true;
  searchTerm: string = '';
  successMessage: string = '';

  filteredStudents: Student[] = [];
  students: Student[] = [];
  selectedStudents: Student[] = [];

  teachers: Teacher[] = [];

  constructor(
    private activatedRoute: ActivatedRoute,
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
    this.captureURLparameters();
    this.getTeachers();
    this.getStudents();
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.autoFocusInput.nativeElement.focus();
    }, 0);
  }

  captureURLparameters(): void {
    this.activatedRoute.params.subscribe(params => {
      this.classId = params['id'];
    });
  }

  filterStudents(): void {
    const term = this.searchTerm.toLowerCase();
    this.filteredStudents = this.students.filter(student =>
      student.firstName.toLowerCase().includes(term) ||
      student.lastName.toLowerCase().includes(term)
    );
  }

  getClassById(id: number): void {
    this.classService.getClassById(id).subscribe({
      next: (classModel: ClassModel) => {
        this.class = classModel;
        this.updateSelectedStudents();
        this.classAddForm.patchValue({
          name: classModel.name,
          homeroomTeacherId: classModel.homeroomTeacherId
        });
        this.filterStudents();
      },
      error: error => {
        this.errorMessage = error.error.message || 'Wystąpił błąd podczas pobierania klasy.';
        this.toastr.error(this.errorMessage, 'Błąd');
        console.error(error);
      }
    }).add(() => {
      this.isLoading = false;
    });
  }

  getStudents(): void {
    this.studentService.getStudents().subscribe({
      next: (data: Student[]) => {
        this.students = data.map(student => ({ ...student, isSelected: false }));
        this.filteredStudents = [...this.students];
        if (this.classId) {
          this.getClassById(this.classId);
        } else {
          this.toastr.warning('Nie podano ID klasy.', 'Uwaga');
        }
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

  onUpdateClass(): void {
    if (this.selectedStudents.length === 0) {
      this.toastr.warning('Nie wybrano żadnego ucznia', 'Uwaga');
      return;
    }

    if (this.classAddForm.valid) {
      this.isLoading = true;
      const classModel = this.prepareClassModel();

      this.classService.updateClass(classModel).subscribe({
        next: (response) => {
          this.successMessage = response.message || 'Klasa została zaktualizowana pomyślnie.';
          this.toastr.success(this.successMessage, 'Sukces');
          this.isLoading = false;
          this.router.navigate(['/admin/classes']);
        },
        error: error => {
          this.errorMessage = error.error.message || 'Wystąpił błąd podczas aktualizacji klasy.';
          this.toastr.error(this.errorMessage, 'Błąd');
          console.error(error);
          this.isLoading = false;
        }
      });
    }
  }

  prepareClassModel(): ClassModel {
    return {
      id: this.classId || 0,
      name: this.classAddForm.get('name')?.value,
      homeroomTeacherId: this.classAddForm.get('homeroomTeacherId')?.value,
      assignedStudentIds: this.selectedStudents.map(student => student.id)
    };
  }

  updateSelectedStudents(): void {
    const assignedIds = this.class?.assignedStudentIds ?? [];
    this.students.forEach(student => {
      student.isSelected = assignedIds.includes(student.id);
    });
    this.selectedStudents = this.students.filter(s => s.isSelected);
  }
}