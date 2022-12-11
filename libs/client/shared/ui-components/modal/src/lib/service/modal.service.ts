import { Injectable } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { finalize, map, Observable, of, Subject, take } from 'rxjs';

import { ContentModalComponent } from '../content-modal/content-modal.component';
import { InfoModalComponent } from '../info-modal/info-modal.component';
import { ContentModal, Modal } from '../modal-parameters.interface';
import { CustomModalType } from './custom-modal-type.enum';

@Injectable()
export class ModalService {
	constructor(private dialog: MatDialog, private router: Router) {}

	dialogRef: MatDialogRef<InfoModalComponent | ContentModalComponent> | undefined;

	confirmEventSubject = new Subject<string>();

	public open(options: Modal, type: CustomModalType) {
		if (type === CustomModalType.INFO) {
			if (!this.dialogRef) {
				this.dialogRef = this.dialog.open(InfoModalComponent, {
					data: {
						title: options.title,
						message: options.message,
						closeText: options.closeText,
						confirmText: options.confirmText,
						modalType: options.modalType,
						closable: options.closable,
						id: options.id,
					},
					panelClass: 'responsive-modal',
					autoFocus: false,
					disableClose: !options.closable,
					closeOnNavigation: true,
				});
			}

			this.router.events.subscribe(() => {
				this.dialogRef?.close();
			});
		} else {
			const contentModalOptions = options as ContentModal;
			if (!this.dialogRef) {
				this.dialogRef = this.dialog.open(ContentModalComponent, {
					data: {
						title: contentModalOptions.title,
						confirmText: contentModalOptions.confirmText,
						closeText: contentModalOptions.closeText,
						template: contentModalOptions.template,
						closable: contentModalOptions.closable,
						subtitle: contentModalOptions.subtitle,
						id: contentModalOptions.id,
					},
					panelClass: 'responsive-modal',
					autoFocus: false,
					disableClose: !options.closable,
					closeOnNavigation: true,
				});
			}
			this.router.events.subscribe(() => {
				this.dialogRef?.close();
			});
		}
	}

	public close() {
		this.dialogRef?.componentInstance.close(true);
		this.dialogRef = undefined; // reset it
	}

	public confirmDisabled() {
		return this.dialogRef?.componentInstance.$confirmDisabled;
	}

	public triggerConfirmEvent() {
		this.confirmEventSubject.next(this.dialogRef?.componentInstance.data.id || '');
	}

	public closed(): Observable<unknown> {
		if (this.dialogRef) {
			return this.dialogRef?.afterClosed().pipe(
				take(1),
				map(res => {
					return res;
				}),
				finalize(() => {
					this.dialogRef = undefined;
				}),
			);
		}
		return of();
	}
}
