import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

import { GradeService } from '../../../core/services/grade.service';
import { ToastrService } from 'ngx-toastr';

import { Student } from '../../../core/models/student-model';
import { SubjectWithTeachersModel } from '../../../core/models/subject-teacher.model';

@Component({
  selector: 'app-grade-assign',
  imports: [
    CommonModule,
    FormsModule,

    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    ReactiveFormsModule
  ],
  templateUrl: './grade-assign.component.html',
  styleUrl: './grade-assign.component.css'
})

export class GradeAssignComponent implements OnInit {

  subjects: SubjectWithTeachersModel[] = [];
  students: Student[] = [];

  form: FormGroup;
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private gradeService: GradeService,
    private toastr: ToastrService
  ) {
    this.form = this.fb.group({
      subjectId: ['', Validators.required],
      studentId: ['', Validators.required],
      gradeValue: ['', [Validators.required, Validators.min(1), Validators.max(6)]],
      description: ['']
    });
  }

  ngOnInit(): void {
    this.loadSubjects();
  }

  loadSubjects(): void {
    this.gradeService.getSubjectsForCurrentTeacher().subscribe({
      next: (subjects) => this.subjects = subjects,
      error: () => this.toastr.error('Błąd podczas pobierania przedmiotów')
    });
  }

  onSubjectChange(): void {
    const subjectId = this.form.value.subjectId;
    if (!subjectId) return;

    this.gradeService.getStudentsForSubject(subjectId).subscribe({
      next: (students) => this.students = students,
      error: () => this.toastr.error('Błąd podczas pobierania uczniów')
    });
  }

  assignGrade(): void {
    if (this.form.invalid) return;

    this.isLoading = true;

    this.gradeService.addGrade(this.form.value).subscribe({
      next: () => {
        this.toastr.success('Ocena została wystawiona');
        this.form.reset();
        this.isLoading = false;
      },
      error: () => {
        this.toastr.error('Wystąpił błąd podczas wystawiania oceny');
        this.isLoading = false;
      }
    });
  }
}