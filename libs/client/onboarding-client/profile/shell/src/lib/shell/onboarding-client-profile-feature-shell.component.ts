import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
	selector: 'tempus-onboarding-client-shell',
	templateUrl: './onboarding-client-profile-feature-shell.component.html',
	styleUrls: ['./onboarding-client-profile-feature-shell.component.scss'],
})
export class ProfileShellComponent {
	constructor(private translateService: TranslateService) {
		const { currentLang } = translateService;
		// eslint-disable-next-line no-param-reassign
		translateService.currentLang = '';
		translateService.use(currentLang);
	}
}
