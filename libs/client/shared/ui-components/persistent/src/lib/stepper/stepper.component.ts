import { Component, Input } from '@angular/core';
import { STEPPER_GLOBAL_OPTIONS } from '@angular/cdk/stepper';

@Component({
	selector: 'tempus-stepper',
	templateUrl: './stepper.component.html',
	styleUrls: ['./stepper.component.scss'],
	providers: [
		{
			provide: STEPPER_GLOBAL_OPTIONS,
			useValue: { displayDefaultIndicatorType: false },
		},
	],
})
export class StepperComponent {
	@Input() steps: Array<string> = [];

	@Input() color = 'primary';

	@Input() inputedIndex = 0;
}
