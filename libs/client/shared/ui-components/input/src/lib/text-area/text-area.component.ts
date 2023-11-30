import { Component, Input } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
	selector: 'tempus-text-area',
	templateUrl: './text-area.component.html',
	styleUrls: ['./text-area.component.scss'],
})
export class TextAreaComponent {
	@Input() cssClass = 'secondary';

	@Input() placeholder = '';

	@Input() showLabel = false;

	@Input() disabled = false;

	@Input() control: FormControl = new FormControl();
}
