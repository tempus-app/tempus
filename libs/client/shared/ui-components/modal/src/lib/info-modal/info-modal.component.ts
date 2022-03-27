import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { InfoModal } from '../modal-parameters.interface';
import { ModalService } from '../service/modal.service';

@Component({
	selector: 'tempus-info-modal',
	templateUrl: './info-modal.component.html',
	styleUrls: ['./info-modal.component.scss', '../modal.component.scss'],
})
export class InfoModalComponent {
	constructor(
		@Inject(MAT_DIALOG_DATA)
		public data: InfoModal,
		private mdDialogRef: MatDialogRef<InfoModalComponent>,
		private modalService: ModalService,
	) {}

	public close(value: boolean) {
		this.mdDialogRef.close(value);
	}

	public selectClose() {
		if (this.data.closable) {
			this.close(true);
		}
	}

	public selectConfirm() {
		// child can subscribe and make changes after listening
		this.modalService.triggerConfirmEvent();
	}
}
