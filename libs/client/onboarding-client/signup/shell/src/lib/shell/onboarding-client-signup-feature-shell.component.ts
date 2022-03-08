import { Component } from '@angular/core';

@Component({
	selector: 'tempus-signup-shell',
	templateUrl: './onboarding-client-signup-feature-shell.component.html',
	styleUrls: ['./onboarding-client-signup-feature-shell.component.scss'],
})
export class SignupShellComponent {
	steps = ['Upload Resume', 'My Information', 'Review'];

	stepperIndex = 0;

	incrementStep() {
		this.stepperIndex += 1;
	}

	decrementStep() {
		this.stepperIndex -= 1;
	}
}
