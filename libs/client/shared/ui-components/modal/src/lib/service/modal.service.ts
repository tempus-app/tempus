import { Injectable } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { map, Observable, of, Subject, take } from 'rxjs';

import { ContentModalComponent } from '../content-modal/content-modal.component';
import { InfoModalComponent } from '../info-modal/info-modal.component';
import { Modal } from '../modal-parameters.interface';
import { CustomModalType } from './custom-modal-type.enum';

@Injectable()
export class ModalService {
	constructor(private dialog: MatDialog) {}

	dialogRef: MatDialogRef<InfoModalComponent | ContentModalComponent> | undefined;

	confirmEventSubject = new Subject();

	public open(options: Modal, type: CustomModalType) {
		if (type === CustomModalType.INFO) {
			this.dialogRef = this.dialog.open(InfoModalComponent, {
				data: {
					title: options.title,
					message: options.message,
					closeText: options.closeText,
					confirmText: options.confirmText,
					modalType: options.modalType,
					closable: options.closable,
				},
				minWidth: '50%',
				maxWidth: '65%',
				height: 'auto',
				autoFocus: false,
				disableClose: !options.closable,
			});
		} else {
			this.dialogRef = this.dialog.open(ContentModalComponent, {
				data: {
					title: options.title,
					confirmText: options.confirmText,
					closeText: options.closeText,
					template: options.template,
					closable: options.closable,
				},
				minWidth: '50%',
				maxWidth: '70%',
				height: 'auto',
				autoFocus: false,
				disableClose: !options.closable,
			});
		}
	}

	public close() {
		this.dialogRef?.componentInstance.close(true);
	}

	public triggerConfirmEvent() {
		this.confirmEventSubject.next(this.dialogRef);
	}

	public closed(): Observable<unknown> {
		if (this.dialogRef) {
			return this.dialogRef?.afterClosed().pipe(
				take(1),
				map(res => {
					return res;
				}),
			);
		}
		return of();
	}
}
