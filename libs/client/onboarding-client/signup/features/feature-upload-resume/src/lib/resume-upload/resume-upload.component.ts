import { Component } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { createResumeUpload, SignupState } from '@tempus/client/onboarding-client/signup/data-access';
import { Store } from '@ngrx/store';

@Component({
	selector: 'tempus-resume-upload',
	templateUrl: './resume-upload.component.html',
	styleUrls: ['./resume-upload.component.scss'],
})
export class ResumeUploadComponent {
	fileData = new FormControl(null, { validators: [Validators.required] });

	fileType = 'application/pdf,application/msword,.doc,.docx,text/plain';

	fileUploaded = false;

	constructor(private router: Router, private route: ActivatedRoute, private store: Store<SignupState>) {}


	ngOnDestroy(): void {
		this.destroyed$.next();
		this.destroyed$.complete();
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

	nextStep() {
		this.fileData?.markAllAsTouched();
		if (this.fileData.valid) {
			this.store.dispatch(
				createResumeUpload({
					resume: this.fileData.value,
				}),
			);
			this.router.navigate(['../myinfoone'], { relativeTo: this.route });
		}
	}
}
