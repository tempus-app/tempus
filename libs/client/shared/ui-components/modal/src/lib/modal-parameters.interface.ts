import { TemplateRef } from '@angular/core';
import { ModalType } from './info-modal/modal-type.enum';

export interface Modal {
	title: string;
	closable: boolean;
	confirmText: string;
	message?: string;
	modalType?: ModalType;
	closeText?: string;
	template?: TemplateRef<unknown>;
}

export interface InfoModal extends Modal {
	message: string;
	modalType: ModalType;
	closeText?: string;
}

export interface ContentModal extends Modal {
	closeText: string;
	template: TemplateRef<unknown>;
}
