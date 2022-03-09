import { Component, Input, Output, EventEmitter, forwardRef } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
	selector: 'tempus-dropdown',
	templateUrl: './dropdown.component.html',
	styleUrls: ['./dropdown.component.scss'],
})
export class DropdownComponent {
	@Input() options: string[] = [];

	@Input() cssClass = 'secondary';

	@Input() label = '';

	@Input() control: FormControl = new FormControl();

	@Output() optionSelect = new EventEmitter();

	optionSelected(option: string) {
		this.optionSelect.emit(option);
	}
}
