import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

@Component({
	selector: 'tempus-button',
	templateUrl: './button.component.html',
	styleUrls: ['./button.component.scss'],
})
export class ButtonComponent implements OnInit {
	@Input() type = '';

	@Input() label = 'placeholder';

	@Input() icon = '';

	@Input() color = 'primary';

	setButtonType() {
		this.label = this.type !== '' ? this.type : this.label;
		switch (this.type) {
			case 'edit': {
				this.icon = 'edit';
				break;
			}
			case 'filter': {
				this.icon = 'filter_alt';
				break;
			}
			case 'invite': {
				this.icon = 'mail_outline';
				break;
			}
			case 'download view': {
				this.icon = 'cloud_download';
				break;
			}
			case 'create new view': {
				this.icon = 'add';
				break;
			}
		}
	}

	ngOnInit(): void {
		this.setButtonType();
	}
}
