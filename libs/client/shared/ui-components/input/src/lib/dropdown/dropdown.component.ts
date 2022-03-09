import { Component, Input, Output, EventEmitter, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
	selector: 'tempus-dropdown',
	templateUrl: './dropdown.component.html',
	styleUrls: ['./dropdown.component.scss'],
	providers: [
		{
			provide: NG_VALUE_ACCESSOR,
			useExisting: forwardRef(() => DropdownComponent),
			multi: true,
		},
	],
})
export class DropdownComponent implements ControlValueAccessor {
	@Input() options: string[] = [];

	@Input() cssClass = 'secondary';

	@Input() label = '';

	@Output() optionSelect = new EventEmitter();

	val = '';

	optionSelected(option: string) {
		this.optionSelect.emit(option);
	}

	onChange: any = () => {};

	onTouch: any = () => {};

	set value(val: string | undefined) {
		if (val !== undefined && this.val !== val) {
			this.val = val;
			this.onChange(val);
			this.onTouch(val);
		}
	}

	writeValue(value: any) {
		this.value = value;
	}

	registerOnChange(fn: any) {
		this.onChange = fn;
	}

	registerOnTouched(fn: any) {
		this.onTouch = fn;
	}
}
