import { Component, Inject, OnInit } from '@angular/core';

import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-delete-confirmation',
  imports: [
    MatButtonModule,
    MatDialogModule
  ],
  templateUrl: './delete-confirmation.component.html',
  styleUrl: './delete-confirmation.component.css'
})

export class DeleteConfirmationComponent implements OnInit {

  message: string | null = null;

  constructor(
    private dialogRef: MatDialogRef<DeleteConfirmationComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { message: string }
  ) { }

  ngOnInit(): void {
    if (this.data) {
      this.message = this.data.message;
    }
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }

  onConfirm(): void {
    this.dialogRef.close(true);
  }
}
