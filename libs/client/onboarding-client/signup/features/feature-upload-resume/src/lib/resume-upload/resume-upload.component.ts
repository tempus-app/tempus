import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import {
	createResumeUpload,
	selectUploadedResume,
	SignupState,
} from '@tempus/client/onboarding-client/signup/data-access';
import { Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import { take } from 'rxjs';

@Component({
	selector: 'tempus-resume-upload',
	templateUrl: './resume-upload.component.html',
	styleUrls: ['./resume-upload.component.scss'],
})
export class ResumeUploadComponent implements OnInit {
	fileData = new FormControl(null, { validators: [Validators.required] });

	fileType = 'application/pdf,application/msword,.doc,.docx,text/plain';

	fileUploaded = false;

	uploadResumePrefix = 'onboardingSignupUploadResume.resumeUpload.';

	constructor(
		private router: Router,
		private route: ActivatedRoute,
		private store: Store<SignupState>,
		private translateService: TranslateService,
	) {
		const { currentLang } = translateService;
		// eslint-disable-next-line no-param-reassign
		translateService.currentLang = '';
		translateService.use(currentLang);
	}

	ngOnInit(): void {
		this.store
			.select(selectUploadedResume)
			.pipe(take(1))
			.subscribe(data => {
				this.onUpload(data);
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

	onUpload(file: File | null) {
		if (file) {
			this.fileData.patchValue(file);
			this.fileData.markAsDirty();
			this.fileUploaded = true;
		}
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
