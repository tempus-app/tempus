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

	@Input() disabled: boolean | null = false;

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
		[ButtonType.UPDATE_STATUS]: '',
	};

	constructor(private translateService: TranslateService) {}

	setButtonType() {
		this.translateService.get('button').subscribe(data => {
			this.buttonTypeLabels['create new view'] = data.createNewView;
			this.buttonTypeLabels['download view'] = data.edit;
			this.buttonTypeLabels.filter = data.filter;
			this.buttonTypeLabels.invite = data.invite;
			this.buttonTypeLabels.edit = data.edit;
			this.buttonTypeLabels['update status'] = data.updateStatus;

			this.label = this.buttonType !== undefined ? this.buttonTypeLabels[this.buttonType] : this.label;
			// eslint-disable-next-line default-case
			if (this.buttonType) {
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
						this.icon = 'download';
						break;
					}
					case ButtonType.CREATE_NEW_VIEW: {
						this.icon = 'add';
						break;
					}
					case ButtonType.UPDATE_STATUS: {
						this.icon = 'update';
						break;
					}
					default: {
						this.icon = '';
						break;
					}
				}
			}
		});
	}

	setButtonPlaceholderLabel = () => {
		if (this.label === '') {
			this.translateService
				.get('button.placeholder')
				.pipe(take(1))
				.subscribe(data => {
					this.label = data;
				});
		}
	};

	ngOnInit(): void {
		this.translateService
			.get('button')
			.pipe(take(1))
			.subscribe(_ => {
				this.setButtonType();
			});
		if (this.label === '') {
			this.translateService
				.get('button.placeholder')
				.pipe(take(1))
				.subscribe(() => this.setButtonPlaceholderLabel());
		}
	}

	buttonClicked(value: boolean) {
		this.buttonClick.emit(value);
	}
}
