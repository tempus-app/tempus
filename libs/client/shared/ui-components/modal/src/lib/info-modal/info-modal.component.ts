import { Component, HostListener, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ModalService } from '../service/modal.service';
import { ModalType } from './modal-type.enum';

@Component({
	selector: 'tempus-info-modal',
	templateUrl: './info-modal.component.html',
	styleUrls: ['./info-modal.component.scss', '../modal.component.scss'],
})
export class InfoModalComponent {
	constructor(
		@Inject(MAT_DIALOG_DATA)
		public data: {
			confirmText: string;
			closeText?: string;
			message: string;
			title: string;
			modalType: ModalType;
		},
		private mdDialogRef: MatDialogRef<InfoModalComponent>,
		private modalService: ModalService,
	) {}

	public close(value: boolean) {
		this.mdDialogRef.close(value);
	}

	public selectClose() {
		this.close(true);
	}

	public selectConfirm() {
		// child can subscribe and make changes after listening
		this.modalService.triggerConfirmEvent();
	}

	@HostListener('keydown.esc')
	public onEsc() {
		this.close(false);
	}
}
