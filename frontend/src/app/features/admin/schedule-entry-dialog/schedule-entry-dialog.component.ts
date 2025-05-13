import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';

import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';

import { SubjectWithTeachersModel } from '../../../core/models/subject-teacher.model';
import { ScheduleEntryModel } from '../../../core/models/schedule-model';
import { Teacher } from '../../../core/models/teacher-model';

@Component({
  selector: 'app-schedule-entry-dialog',
  imports: [
    CommonModule,
    FormsModule,

    MatCardModule,
    MatCheckboxModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatSelectModule,

    ReactiveFormsModule
  ],
  templateUrl: './schedule-entry-dialog.component.html',
  styleUrl: './schedule-entry-dialog.component.css'
})

export class ScheduleEntryDialogComponent {

  entryForm!: FormGroup;
  filteredTeachers: Teacher[] = [];

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<ScheduleEntryDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: {
      classId: number,
      dayOfWeek: number,
      availableSubjects: SubjectWithTeachersModel[]
    }
  ) { }

  ngOnInit(): void {
    this.initializeForm();

    // Obsługa dynamicznego filtrowania nauczycieli po zmianie przedmiotu
    this.entryForm.get('subjectId')?.valueChanges.subscribe(subjectId => {
      const selected = this.data.availableSubjects.find(s => s.subjectId === subjectId);
      this.filteredTeachers = selected?.teachers ?? [];
      this.entryForm.get('teacherId')?.setValue(null); // reset wyboru nauczyciela
    });
  }

  initializeForm(): void {
    this.entryForm = this.fb.group({
      subjectId: [null, Validators.required],
      teacherId: [null, Validators.required],
      startTime: ['', Validators.required] // w formacie "HH:mm"
    });
  }

  onCancel(): void {
    this.dialogRef.close(null);
  }

  onSave(): void {
    if (this.entryForm.invalid) return;

    const formValue = this.entryForm.value;

    const subject = this.data.availableSubjects.find(s => s.subjectId === formValue.subjectId);
    const teacher = this.filteredTeachers.find(t => t.id === formValue.teacherId);

    const newEntry: ScheduleEntryModel = {
      id: 0, // może być 0 jeśli to nowy wpis
      subjectId: subject!.subjectId,
      subjectName: subject!.subjectName,
      teacherId: teacher!.id,
      teacherFullName: `${teacher!.firstName} ${teacher!.lastName}`,
      startTime: formValue.startTime,
      dayOfWeek: this.data.dayOfWeek
    };

    this.dialogRef.close(newEntry);
  }

}
