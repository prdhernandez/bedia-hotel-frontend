import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { Destination } from '../../models/destination.model';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-destination-form',
  standalone: true,
  templateUrl: './destination-form.html',
  styleUrl: './destination-form.css',
  imports: [
      MatDialogModule,
      MatFormFieldModule,
      MatInputModule,
      MatButtonModule,
      ReactiveFormsModule
  ]
})
export class DestinationFormDialog {
  form: FormGroup;

  constructor(
    private dialogRef: MatDialogRef<DestinationFormDialog>,
    @Inject(MAT_DIALOG_DATA) public data: { destination: Destination | null },
    private fb: FormBuilder
  ) {
    const dest = data.destination || {
      id: null,
      name: '',
      description: '',
      countryCode: '',
      type: ''
    };
    this.form = this.fb.group({
      name: [dest.name, Validators.required],
      description: [dest.description],
      countryCode: [dest.countryCode, Validators.required],
      type: [dest.type, Validators.required]
    });
  }

  save() {
    if (this.form.valid) {
      this.dialogRef.close(this.form.value);
    }
  }

  cancel() {
    this.dialogRef.close(null);
  }
}
