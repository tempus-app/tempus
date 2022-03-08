import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
	selector: 'tempus-dropdown',
	templateUrl: './dropdown.component.html',
	styleUrls: ['./dropdown.component.scss'],
})
export class DropdownComponent {
	@Input() options: string[] = [];

	@Input() cssClass = 'secondary';

	@Input() label = '';

	@Output() optionSelect = new EventEmitter();

	optionSelected(option: string) {
		this.optionSelect.emit(option);
	}
}
