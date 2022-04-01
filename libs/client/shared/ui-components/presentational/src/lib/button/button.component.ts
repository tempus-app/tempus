import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { take } from 'rxjs';
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

	@Input() label = '';

	@Input() icon = '';

	@Input() color = 'primary';

	buttonTypeLabels = {
		[ButtonType.EDIT]: '',
		[ButtonType.FILTER]: '',
		[ButtonType.INVITE]: '',
		[ButtonType.DOWNLOAD_VIEW]: '',
		[ButtonType.CREATE_NEW_VIEW]: '',
	};

	constructor(private translateService: TranslateService) {
		if (this.label === '') {
			translateService
				.get('button.placeholder')
				.pipe(take(1))
				.subscribe(data => this.setLabel(data));
		}
	}

	setLabel(data: string) {
		this.label = data;
	}

	setButtonType() {
		this.label = this.buttonType !== undefined ? this.buttonTypeLabels[this.buttonType] : this.label;
		// eslint-disable-next-line default-case
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
		this.translateService
			.get('button')
			.pipe(take(1))
			.subscribe(data => {
				this.buttonTypeLabels['create new view'] = data.createNewView;
				this.buttonTypeLabels['download view'] = data.edit;
				this.buttonTypeLabels.filter = data.filter;
				this.buttonTypeLabels.invite = data.invite;
				this.buttonTypeLabels.edit = data.edit;
				this.setButtonType();
			});
	}

	buttonClicked(value: boolean) {
		this.buttonClick.emit(value);
	}
}
