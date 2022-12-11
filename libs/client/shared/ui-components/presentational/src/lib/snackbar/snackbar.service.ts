import { Injectable, NgZone } from '@angular/core';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';

@Injectable()
export class SnackbarService {
	constructor(private snackBar: MatSnackBar, private zone: NgZone) {}

	duration = 3000;

	horizontalPosition: MatSnackBarHorizontalPosition = 'center';

	verticalPosition: MatSnackBarVerticalPosition = 'top';

	public open(message: string): void {
		this.zone.run(() => {
			this.snackBar.open(message, '✖️', {
				horizontalPosition: this.horizontalPosition,
				verticalPosition: this.verticalPosition,
				duration: this.duration,
				panelClass: 'success-snackbar',
			});
		});
	}
}
