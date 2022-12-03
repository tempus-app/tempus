import { Component, Inject, NgZone } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { BehaviorSubject } from 'rxjs';
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
		private ngZone: NgZone,
	) {}

	public $confirmDisabled = new BehaviorSubject<boolean>(false);

	public close(value: boolean) {
		this.ngZone.run(() => {
			this.mdDialogRef.close(value);
		});
	}

	public selectClose() {
		if (this.data.closable) {
			this.close(true);
			this.modalService.close();
		}
	}

	public selectConfirm() {
		// child can subscribe and make changes after listening
		if (!this.$confirmDisabled.value) {
			this.modalService.triggerConfirmEvent();
		}
	}
}
