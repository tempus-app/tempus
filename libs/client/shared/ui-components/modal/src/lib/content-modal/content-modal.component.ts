import { Component, HostListener, Inject, TemplateRef } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ModalService } from '../service/modal.service';

@Component({
	selector: 'tempus-content-modal',
	templateUrl: './content-modal.component.html',
	styleUrls: ['./content-modal.component.scss', '../modal.component.scss'],
})
export class ContentModalComponent {
	/**
	 * @param data modal data
	 * @param mdDialogRef ref to dialog component
	 */
	constructor(
		@Inject(MAT_DIALOG_DATA)
		public data: {
			closeText: string;
			confirmText: string;
			title: string;
			template: TemplateRef<unknown>;
		},
		private mdDialogRef: MatDialogRef<ContentModalComponent>,
		private modalService: ModalService,
	) {}

	public close(value: boolean) {
		this.mdDialogRef.close(value);
	}

	public selectConfirm() {
		// child can subscribe and make changes after listening
		this.modalService.triggerConfirmEvent();
	}

	public selectCancel() {
		this.close(true);
	}

	@HostListener('keydown.esc')
	public onEsc() {
		this.close(false);
	}
}
