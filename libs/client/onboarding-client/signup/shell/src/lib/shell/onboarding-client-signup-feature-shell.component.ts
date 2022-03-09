import { Component } from '@angular/core';
import { Router, Event, NavigationEnd } from '@angular/router';

@Component({
	selector: 'tempus-signup-shell',
	templateUrl: './onboarding-client-signup-feature-shell.component.html',
	styleUrls: ['./onboarding-client-signup-feature-shell.component.scss'],
})
export class SignupShellComponent {
	steps = ['Upload Resume', 'My Information 1', 'My Information 2', 'My Information 3', 'Review'];

	links = ['uploadresume', 'myinfoone', 'myinfotwo', 'myinfothree', 'review'];

	isDisabled = false;

	stepperIndex = 0;

	navigateToStep(stepIndex: number) {
		this.stepperIndex = stepIndex;
		this.router.navigateByUrl(`token/${this.links[this.stepperIndex]}`);
	}

	constructor(private router: Router) {
		this.router.events.subscribe((event: Event) => {
			if (event instanceof NavigationEnd) {
				for (let i = 0; i < this.links.length; i += 1) {
					if (event.url.includes(this.links[i])) {
						this.stepperIndex = i;
					}
				}
			}
		});
	}
}
