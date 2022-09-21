import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
	selector: 'tempus-onboarding-client-shell',
	templateUrl: './onboarding-client-shell.component.html',
	styleUrls: ['./onboarding-client-shell.component.scss'],
})
export class OnboardingClientShellComponent {
	constructor(private translateService: TranslateService) {
		const { currentLang } = translateService;
		// eslint-disable-next-line no-param-reassign
		translateService.currentLang = '';
		translateService.use(currentLang);
	}
}
