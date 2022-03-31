import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
	selector: 'tempus-confirm-resume-upload',
	templateUrl: './confirm-resume-upload.component.html',
	styleUrls: ['./confirm-resume-upload.component.scss'],
})
export class ConfirmResumeUploadComponent {
	@Input()
	file: File | undefined;

	@Output()
	confirmDeleteSelected = new EventEmitter();

	confirmUploadPrefix = 'onboardingSignupUploadResume.confirmUpload.';

	onDeleteSelect() {
		this.confirmDeleteSelected.emit();
	}
}
