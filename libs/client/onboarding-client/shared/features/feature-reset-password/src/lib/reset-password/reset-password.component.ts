import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import { OnboardingClientState } from '@tempus/client/onboarding-client/shared/data-access';
import { InputType } from '@tempus/client/shared/ui-components/input';
import { ModalService } from '@tempus/client/shared/ui-components/modal';
// eslint-disable-next-line @nrwl/nx/enforce-module-boundaries
import { validatePasswords } from 'libs/client/onboarding-client/signup/features/feature-create-credentials/src/lib/sign-up/sign-up.validators';
import { Subject } from 'rxjs';

@Component({
	selector: 'tempus-reset-password',
	templateUrl: './reset-password.component.html',
	styleUrls: ['./reset-password.component.scss'],
})
export class ResetPasswordComponent {
	constructor(
		private fb: FormBuilder,
		private store: Store<OnboardingClientState>,
		public modalService: ModalService,
		public translateService: TranslateService,
	) {
		const { currentLang } = translateService;

		// eslint-disable-next-line no-param-reassign
		translateService.currentLang = '';
		translateService.use(currentLang);
		translateService.get(`${this.resetPasswordPrefix}modal`).subscribe(data => {
			this.modalText = data;
		});
	}

	modalText: {
		successModal: {
			title: string;
			confirmText: string;
			message: string;
		};
		errorModal: {
			title: string;
			confirmText: string;
			message: string;
		};
	} = {
		successModal: {
			title: '',
			confirmText: '',
			message: '',
		},
		errorModal: {
			title: '',
			confirmText: '',
			message: '',
		},
	};

	InputType = InputType;

	resetPasswordPrefix = 'onboardingClient.resetPassword.';

	$destroyed = new Subject<void>();

	resetPasswordForm = this.fb.group(
		{
			email: ['', [Validators.required, Validators.email]],

			password: [
				'',
				[
					Validators.required,
					Validators.pattern(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[$@$!%*#?&])[A-Za-z\d$@$!%*#_?&]{8,}$/),
				],
			],
			confirmPassword: ['', Validators.required],
		},
		{ validators: validatePasswords },
	);
}
