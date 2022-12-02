import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import {
	AsyncRequestState,
	forgotPassword,
	OnboardingClientState,
	selectAuthStatus,
} from '@tempus/client/onboarding-client/shared/data-access';
import { ModalService, ModalType, CustomModalType } from '@tempus/client/shared/ui-components/modal';
import { skip, Subject, takeUntil } from 'rxjs';

@Component({
	selector: 'tempus-forgot-password',
	templateUrl: './forgot-password.component.html',
	styleUrls: ['./forgot-password.component.scss'],
})
export class ForgotPasswordComponent implements OnInit {
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
		translateService.get(`${this.forgotPasswordPrefix}modal`).subscribe(data => {
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

	forgotPasswordPrefix = 'onboardingClient.forgotPassword.';

	$destroyed = new Subject<void>();

	forgotPasswordForm = this.fb.group({
		email: ['', [Validators.required, Validators.email]],
	});

	ngOnInit(): void {
		this.modalService.confirmEventSubject.pipe(takeUntil(this.$destroyed)).subscribe(() => {
			this.modalService.close();
		});
	}

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

	forgotPassword() {
		if (this.forgotPasswordForm.valid) {
			const email = this.forgotPasswordForm.get('email')?.value;
			this.store.dispatch(
				forgotPassword({
					email,
				}),
			);

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
		//
	}
}
