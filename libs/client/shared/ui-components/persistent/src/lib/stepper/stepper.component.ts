import { Component, Input, Output, EventEmitter } from '@angular/core';
import { StepperSelectionEvent, STEPPER_GLOBAL_OPTIONS } from '@angular/cdk/stepper';
import { StepperOrientation } from '@angular/material/stepper';
import { BreakpointObserver } from '@angular/cdk/layout';
import { map, Observable } from 'rxjs';

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

	@Output() stepClicked = new EventEmitter<number>();

	stepperOrientation: Observable<StepperOrientation> | undefined;

	stepClick(value: StepperSelectionEvent) {
		this.stepClicked.emit(value.selectedIndex);
	}

	constructor(breakpointObserver: BreakpointObserver) {
		this.stepperOrientation = breakpointObserver
			.observe('(min-width: 800px)')
			.pipe(map(({ matches }) => (matches ? 'horizontal' : 'vertical')));
	}
}
