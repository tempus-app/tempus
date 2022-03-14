import { Component, Input } from '@angular/core';

@Component({
	selector: 'tempus-spinner',
	templateUrl: './spinner.component.html',
	styleUrls: ['./spinner.component.scss'],
})
export class SpinnerComponent {
	@Input() showSpinner = false;
}
