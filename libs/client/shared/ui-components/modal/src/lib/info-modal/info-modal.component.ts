import { Component, HostListener, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ModalType } from './modal-type.enum';

@Component({
	selector: 'tempus-info-modal',
	templateUrl: './info-modal.component.html',
	styleUrls: ['./info-modal.component.scss'],
})
export class InfoModalComponent {
	constructor(
		@Inject(MAT_DIALOG_DATA)
		public data: {
			closeText: string;
			message: string;
			title: string;
			modalType: ModalType;
		},
		private mdDialogRef: MatDialogRef<InfoModalComponent>,
	) {}

	public close(value: boolean) {
		this.mdDialogRef.close(value);
	}

	public selectConfirm() {
		this.close(true);
	}

	@HostListener('keydown.esc')
	public onEsc() {
		this.close(false);
	}
}
