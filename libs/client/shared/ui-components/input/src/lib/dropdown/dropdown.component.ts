import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
	selector: 'tempus-dropdown',
	templateUrl: './dropdown.component.html',
	styleUrls: ['./dropdown.component.scss'],
})
export class DropdownComponent {
	@Input() options: string[] | null = null;

	@Input() optionsWithKeys: { val: string; id: unknown }[] | null = null;

	@Input() optionsWithId: { val: string; id: number }[] | null = null;

	@Input() cssClass = 'secondary';

	@Input() label = '';

	@Input() control: FormControl = new FormControl();

	@Output() optionSelect = new EventEmitter();

	optionSelected(option?: string | number | unknown) {
		this.optionSelect.emit(option ? <string>option : undefined);
	}
}
