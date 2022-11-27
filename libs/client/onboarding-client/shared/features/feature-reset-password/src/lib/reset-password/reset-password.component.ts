import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import {
	AsyncRequestState,
	OnboardingClientState,
	selectAuthStatus,
	resetPassword,
} from '@tempus/client/onboarding-client/shared/data-access';
import { InputType } from '@tempus/client/shared/ui-components/input';
import { CustomModalType, ModalService, ModalType } from '@tempus/client/shared/ui-components/modal';
// eslint-disable-next-line @nrwl/nx/enforce-module-boundaries
import { validatePasswords } from 'libs/client/onboarding-client/signup/features/feature-create-credentials/src/lib/sign-up/sign-up.validators';
import { skip, Subject, takeUntil } from 'rxjs';

@Component({
	selector: 'tempus-reset-password',
	templateUrl: './reset-password.component.html',
	styleUrls: ['./reset-password.component.scss'],
})
export class ResetPasswordComponent implements OnInit {
	constructor(
		private fb: FormBuilder,
		private store: Store<OnboardingClientState>,
		public modalService: ModalService,
		public route: ActivatedRoute,
		public router: Router,
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

	openDialog(data: { title: string; confirmText: string; message: string }, key: string): void {
		this.modalService.open(
			{
				title: data.title,
				confirmText: data.confirmText,
				message: data.message,
				modalType: key === 'successModal' ? ModalType.INFO : ModalType.ERROR,
				closable: true,
				id: key,
			},
			CustomModalType.INFO,
		);
	}

	resetPassword() {
		const email = this.resetPasswordForm.get('email')?.value;
		const password = this.resetPasswordForm.get('password')?.value;
		this.store.dispatch(resetPassword({ email, password, token: this.route.snapshot.paramMap.get('token') || '' }));

		this.store
			.select(selectAuthStatus)
			.pipe(skip(1), takeUntil(this.$destroyed))
			.subscribe(reqStatusData => {
				if (reqStatusData.status === AsyncRequestState.SUCCESS) {
					this.openDialog(this.modalText.successModal, 'successModal');
				} else if (reqStatusData.status === AsyncRequestState.ERROR) {
					this.modalText.errorModal.message =
						reqStatusData.error?.message || this.modalText.errorModal.message;
					this.openDialog(this.modalText.errorModal, 'errorModal');
				}
			});
	}

	ngOnInit(): void {
		this.modalService.confirmEventSubject.pipe(takeUntil(this.$destroyed)).subscribe(modalId => {
			if (modalId === 'successModal') {
				this.router.navigate(['../../signin'], { relativeTo: this.route });
				this.modalService.close();
				this.modalService.confirmEventSubject.unsubscribe();
			}
			this.modalService.close();
		});
	}
}
