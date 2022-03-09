import { Component, Input } from '@angular/core';
import { FormControl } from '@angular/forms';
import { InputType } from './text-input-enum';

@Component({
	selector: 'tempus-text-input',
	templateUrl: './text-input.component.html',
	styleUrls: ['./text-input.component.scss'],
})
export class TextInputComponent {
	@Input() placeholder = '';

	@Input() cssClass = 'secondary';

	@Input() id = '';

	@Input() inputType: InputType = InputType.TEXT;

	@Input() formControlName: FormControl = new FormControl();
}
