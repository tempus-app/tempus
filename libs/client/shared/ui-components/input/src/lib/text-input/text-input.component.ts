import { Component, Input, Injector, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { InputType } from './text-input-enum';

@Component({
	selector: 'tempus-text-input',
	templateUrl: './text-input.component.html',
	styleUrls: ['./text-input.component.scss'],
	providers: [
		{
			provide: NG_VALUE_ACCESSOR,
			useExisting: forwardRef(() => TextInputComponent),
			multi: true,
		},
	],
})
export class TextInputComponent implements ControlValueAccessor {
	@Input() placeholder = '';

	@Input() cssClass = 'secondary';

	@Input() id = '';

	@Input() inputType: InputType = InputType.TEXT;

	val = '';

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
