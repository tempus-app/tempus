import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Component, EventEmitter, Input, OnDestroy, Output } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { takeUntil } from 'rxjs/operators';

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

	onDeleteSelect() {
		this.confirmDeleteSelected.emit();
	}
}
