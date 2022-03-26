import { Injectable, TemplateRef } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { map, Observable, of, Subject, take } from 'rxjs';

import { ContentModalComponent } from '../content-modal/content-modal.component';
import { InfoModalComponent } from '../info-modal/info-modal.component';
import { ModalType } from '../info-modal/modal-type.enum';
import { CustomModalType } from './custom-modal-type.enum';

interface ModalParameters {
	title: string;
	closeText?: string;
	message?: string;
	confirmText: string;
	modalType?: ModalType;
	template?: TemplateRef<unknown>;
}
@Injectable()
export class ModalService {
	constructor(private dialog: MatDialog) {}

	dialogRef: MatDialogRef<InfoModalComponent | ContentModalComponent> | undefined;

	confirmEventSubject = new Subject();

	public open(options: ModalParameters, type: CustomModalType) {
		if (type === CustomModalType.INFO) {
			this.dialogRef = this.dialog.open(InfoModalComponent, {
				data: {
					title: options.title,
					message: options.message,
					closeText: options.closeText,
					confirmText: options.confirmText,
					modalType: options.modalType,
				},
				minWidth: '50%',
				autoFocus: false,
			});
		} else {
			this.dialogRef = this.dialog.open(ContentModalComponent, {
				data: {
					title: options.title,
					confirmText: options.confirmText,
					closeText: options.closeText,
					template: options.template,
				},
				minWidth: '50%',
				autoFocus: false,
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
