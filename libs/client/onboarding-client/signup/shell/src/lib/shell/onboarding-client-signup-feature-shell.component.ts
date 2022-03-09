import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
	selector: 'tempus-signup-shell',
	templateUrl: './onboarding-client-signup-feature-shell.component.html',
	styleUrls: ['./onboarding-client-signup-feature-shell.component.scss'],
})
export class SignupShellComponent {
	steps = ['Upload Resume', 'My Information 1', 'My Information 2', 'My Information 3', 'Review'];

	links = ['uploadresume', 'myinfoone', 'myinfotwo', 'myinfothree', 'review'];

	stepperIndex = 0;

	nextStep() {
		this.stepperIndex += 1;
		this.router.navigateByUrl(`token/${this.links[this.stepperIndex]}`);
	}

	backStep() {
		this.stepperIndex -= 1;
		this.router.navigateByUrl(`token/${this.links[this.stepperIndex]}`);
	}

	navigateToStep(stepIndex: number) {
		this.stepperIndex = stepIndex;
		this.router.navigateByUrl(`token/${this.links[this.stepperIndex]}`);
	}

	constructor(private router: Router) {}
}
