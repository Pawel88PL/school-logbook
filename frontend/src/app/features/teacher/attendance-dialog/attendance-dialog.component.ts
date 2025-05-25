import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { StudentForAttendanceModel } from '../../../core/models/attendance-model';

@Component({
  selector: 'app-attendance-dialog',
  imports: [
    CommonModule,
    MatDialogModule
  ],
  templateUrl: './attendance-dialog.component.html',
  styleUrl: './attendance-dialog.component.css'
})

export class AttendanceDialogComponent {

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { lessonInfo: string, students: StudentForAttendanceModel[] },
    private dialogRef: MatDialogRef<AttendanceDialogComponent>
  ) { }

  close(): void {
    this.dialogRef.close();
  }
}