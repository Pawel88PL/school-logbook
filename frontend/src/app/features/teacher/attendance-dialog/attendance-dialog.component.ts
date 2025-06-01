import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatSelectModule } from '@angular/material/select';

import { StudentForAttendanceModel } from '../../../core/models/attendance-model';

import { AttendanceService } from '../../../core/services/attendance.service';
import { ToastrService } from 'ngx-toastr';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-attendance-dialog',
  imports: [
    CommonModule,
    FormsModule,
    MatDialogModule,
    MatSelectModule
  ],
  templateUrl: './attendance-dialog.component.html',
  styleUrl: './attendance-dialog.component.css'
})

export class AttendanceDialogComponent {

  students: StudentForAttendanceModel[] = [];

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: {
      lessonInfo: string,
      students: StudentForAttendanceModel[],
      scheduleId: number
    },
    private dialogRef: MatDialogRef<AttendanceDialogComponent>,
    private attendanceService: AttendanceService,
    private toastr: ToastrService

  ) {
    this.students = data.students;
    console.log('Schedule ID:', data.scheduleId);
  }

  close(): void {
    this.dialogRef.close();
  }

  saveAttendance(): void {
    const hasIncomplete = this.students.some(s => s.status === null || s.status === undefined);

    if (hasIncomplete) {
      this.toastr.warning('Dla wszystkich uczniów musi być wybrany status obecności.', 'Uwaga');
      return;
    }
    
    const payload = this.students.map(s => ({
      studentId: s.studentId,
      status: s.status
    }));

    console.log('Saving attendance for schedule ID:', this.data.scheduleId);
    console.log('Attendance payload:', payload);

    this.attendanceService.saveAttendance(this.data.scheduleId, payload).subscribe({
      next: () => {
        this.toastr.success('Obecność zapisana', 'Sukces');
        this.dialogRef.close(true);
      },
      error: () => {
        this.toastr.error('Błąd podczas zapisu obecności', 'Błąd');
      }
    });
  }
}