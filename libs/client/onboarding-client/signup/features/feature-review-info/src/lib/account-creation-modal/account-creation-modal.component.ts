import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import { TempusResourceState } from '@tempus/client/onboarding-client/resource/data-access';
import { selectCreatedAzureAccount } from '@tempus/client/onboarding-client/signup/data-access';
import { take } from 'rxjs';

@Component({
	selector: 'tempus-account-creation-modal',
	templateUrl: './account-creation-modal.component.html',
	styleUrls: ['./account-creation-modal.component.scss'],
})
export class AccountCreationModalComponent implements OnInit {
	constructor(private resourceStore: Store<TempusResourceState>, private translateService: TranslateService) {
		const { currentLang } = translateService;
		// eslint-disable-next-line no-param-reassign
		translateService.currentLang = '';
		translateService.use(currentLang);
	}

	calEmail = '';

	tempPassword = '';

	prefix = `onboardingClientSignupReview.modal.azureModal.`;

	ngOnInit(): void {
		this.resourceStore
			.select(selectCreatedAzureAccount)
			.pipe(take(1))
			.subscribe(data => {
				this.calEmail = data.calEmail ? data.calEmail : '';
				this.tempPassword = data.temporaryPassword ? data.temporaryPassword : '';
			});
	}
}
