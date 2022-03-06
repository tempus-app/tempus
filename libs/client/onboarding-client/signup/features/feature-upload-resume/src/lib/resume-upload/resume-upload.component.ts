import { Component } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { FormControl, Validators } from '@angular/forms';

@Component({
	selector: 'tempus-resume-upload',
	templateUrl: './resume-upload.component.html',
	styleUrls: ['./resume-upload.component.scss'],
})
export class ResumeUploadComponent {
	fileData = new FormControl(null, { validators: [Validators.required] });

	fileType = 'application/pdf,application/msword,.doc,.docx,text/plain';

	fileUploaded = false;

	destroyed = new Subject<void>();

	rows = '10';

	constructor(breakpointObserver: BreakpointObserver) {
		breakpointObserver
			.observe([Breakpoints.XSmall, Breakpoints.Small, Breakpoints.Medium, Breakpoints.Large, Breakpoints.XLarge])
			.pipe(takeUntil(this.destroyed))
			.subscribe(result => {
				for (const query of Object.keys(result.breakpoints)) {
					if (result.breakpoints[query]) {
						if (query === Breakpoints.XSmall || query === Breakpoints.Small) {
							this.rows = '12';
						} else {
							this.rows = '10';
						}
					}
				}
			});
	}

	onChange(event: Event) {
		const input = event.currentTarget as HTMLInputElement;
		const { files } = input;
		if (files) {
			const firstFile = files.item(0);
			if (firstFile) {
				this.onUpload(firstFile);
				input.value = ''; // allows onchange to trigger for same file
			}
		}
	}

	onUpload(file: File) {
		this.fileData.patchValue(file);
		this.fileData.markAsDirty();
		this.fileUploaded = true;
	}

	onDelete() {
		this.fileData.setValue(null);
		this.fileData.markAsDirty();

		this.fileUploaded = false;
	}
}
