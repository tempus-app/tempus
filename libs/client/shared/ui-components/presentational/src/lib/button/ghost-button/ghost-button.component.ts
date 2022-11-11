import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
	selector: 'tempus-ghost-button',
	templateUrl: './ghost-button.component.html',
	styleUrls: ['./ghost-button.component.scss'],
})
export class GhostButtonComponent {
	@Output() buttonClick = new EventEmitter<boolean>();

	@Input() disabled = false;

	@Input() label = '';

	@Input() icon = '';

	buttonClicked(value: boolean) {
		this.buttonClick.emit(value);
	}
}
