import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ButtonType } from './button-type-enum';

@Component({
	selector: 'tempus-button',
	templateUrl: './button.component.html',
	styleUrls: ['./button.component.scss'],
})
export class ButtonComponent implements OnInit {
	@Output() buttonClick = new EventEmitter<boolean>();

	@Input() disabled = false;

	@Input() buttonType?: ButtonType = undefined;

	@Input() label = 'placeholder';

	@Input() icon = '';

	@Input() color = 'primary';

	setButtonType() {
		this.label = this.buttonType !== undefined ? this.buttonType : this.label;
		switch (this.buttonType) {
			case ButtonType.EDIT: {
				this.icon = 'edit';
				break;
			}
			case ButtonType.FILTER: {
				this.icon = 'filter_alt';
				break;
			}
			case ButtonType.INVITE: {
				this.icon = 'mail_outline';
				break;
			}
			case ButtonType.DOWNLOAD_VIEW: {
				this.icon = 'cloud_download';
				break;
			}
			case ButtonType.CREATE_NEW_VIEW: {
				this.icon = 'add';
				break;
			}
			default: {
				this.icon = '';
				break;
			}
		}
	}

	ngOnInit(): void {
		this.setButtonType();
	}

	buttonClicked(value: boolean) {
		this.buttonClick.emit(value);
	}
}
