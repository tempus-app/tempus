import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

export interface DialogData {
	error: string;
}

@Component({
	selector: 'tempus-credentials-error-modal',
	templateUrl: 'credentials-error-modal.html',
})
export class SignupErrorModalComponent {
	constructor(
		public dialogRef: MatDialogRef<SignupErrorModalComponent>,
		@Inject(MAT_DIALOG_DATA) public data: DialogData,
	) {}

	onNoClick(): void {
		// this.dialogRef.close();
	}
}
