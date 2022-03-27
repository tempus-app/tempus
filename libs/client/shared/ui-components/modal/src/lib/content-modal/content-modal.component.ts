import { Component, HostListener, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ContentModal } from '../modal-parameters.interface';
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
		public data: ContentModal,
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
		if (this.data.closable) {
			this.close(true);
		}
	}

	@HostListener('keydown.esc')
	public onEsc() {
		if (this.data.closable) {
			this.close(true);
		}
	}
}
