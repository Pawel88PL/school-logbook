import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';

import { GradeService } from '../../../core/services/grade.service';
import { ToastrService } from 'ngx-toastr';

import { Student } from '../../../core/models/student-model';
import { SubjectWithClass } from '../../../core/models/subject-class-model';

@Component({
  selector: 'app-grade-assign',
  imports: [
    CommonModule,
    FormsModule,

    MatFormFieldModule,
    MatInputModule,
    MatProgressSpinnerModule,
    MatSelectModule,
    ReactiveFormsModule
  ],
  templateUrl: './grade-assign.component.html',
  styleUrl: './grade-assign.component.css'
})

export class GradeAssignComponent implements OnInit {

  subjects: SubjectWithClass[] = [];
  students: Student[] = [];

  form: FormGroup;
  isLoading: boolean = false;

  constructor(
    private fb: FormBuilder,
    private gradeService: GradeService,
    private router: Router,
    private toastr: ToastrService
  ) {
    this.form = this.fb.group({
      selectedSubject: [null, Validators.required], // ← zamiast subjectId
      studentId: ['', Validators.required],
      gradeValue: ['', [Validators.required, Validators.min(1), Validators.max(6)]],
      comment: ['']
    });
  }

  ngOnInit(): void {
    this.loadSubjects();
  }

  loadSubjects(): void {
    this.isLoading = true;
    this.gradeService.getSubjectsForCurrentTeacher().subscribe({
      next: (subjects: SubjectWithClass[]) => {
        this.subjects = subjects;
        this.isLoading = false;
      },
      error: () => {
        this.toastr.error('Błąd podczas pobierania przedmiotów');
        this.isLoading = false;
      }
    });
  }

  onSubjectChange(): void {
    const selected = this.form.value.selectedSubject;
    if (!selected) return;

    this.isLoading = true;
    const { subjectId, classId } = selected;
    this.students = [];

    this.gradeService.getStudentsForSubjectAndClass(subjectId, classId).subscribe({
      next: (students) => {
        this.students = students,
          this.isLoading = false;
      },
      error: () => {
        this.toastr.error('Błąd podczas pobierania uczniów')
        this.isLoading = false;
      }
    });
  }

  assignGrade(): void {
    if (this.form.invalid) return;

    this.isLoading = true;

    const selected = this.form.value.selectedSubject;

    const payload = {
      subjectId: selected.subjectId,
      classId: selected.classId,
      studentId: this.form.value.studentId,
      value: this.form.value.gradeValue,
      comment: this.form.value.comment
    };

    this.gradeService.addGrade(payload).subscribe({
      next: (response) => {
        const formattedDate = new Date(response.date).toLocaleDateString('pl-PL');
        const commentPart = response.comment ? ` – ${response.comment}` : '';

        this.toastr.success(
          `Wystawiono ocenę: ${response.value}${commentPart} (${formattedDate}), przedmiot: ${response.subjectName}, uczeń: ${response.studentName}.`,
          'Sukces',
          { timeOut: 5000 }
        );

        this.router.navigate(['/teacher/grade-preview']);
        this.isLoading = false;
      },
      error: () => {
        this.toastr.error('Wystąpił błąd podczas wystawiania oceny');
        this.isLoading = false;
      }
    });
  }
}