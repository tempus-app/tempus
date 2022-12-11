import { Component, OnDestroy, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import {
	AsyncRequestState,
	logout,
	OnboardingClientState,
	selectAccessToken,
} from '@tempus/client/onboarding-client/shared/data-access';
import {
	loadLinkData,
	resetCreateResourceState,
	resetLinkState,
	selectLinkData,
	selectLinkErrorStatus,
	selectResourceStatus,
	setResourceLinkId,
	SignupState,
} from '@tempus/client/onboarding-client/signup/data-access';
import { Link, StatusType } from '@tempus/shared-domain';

import { CustomModalType, ModalService, ModalType } from '@tempus/client/shared/ui-components/modal';

import { Subject, Subscription } from 'rxjs';
import { tap, filter, take, takeUntil } from 'rxjs/operators';

@Component({
	selector: 'tempus-credentials',
	templateUrl: './credentials.component.html',
	styleUrls: ['./credentials.component.scss'],
})
export class CredentialsComponent implements OnInit, OnDestroy {
	tokenId = '';

	link: Link | undefined;

	loading = false;

	$destroyed = new Subject<void>();

	errorStatus$?: Subscription;

	linkData$?: Subscription;

	resourceStatus$?: Subscription;

	@ViewChild('testTemplate')
	testTemplate!: TemplateRef<unknown>;

	linkErrors: {
		linkUsedErr: string;
		expiredLinkErr: string;
		genericLinkErr: string;
		contact: string;
		modalTitle: string;
		modalConfirmText: string;
	} = {
		linkUsedErr: '',
		expiredLinkErr: '',
		genericLinkErr: '',
		contact: '',
		modalTitle: '',
		modalConfirmText: '',
	};

	adminCreationModal: {
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

	constructor(
		private router: Router,
		private route: ActivatedRoute,
		private store: Store<SignupState>,
		private sharedStore: Store<OnboardingClientState>,
		public modalService: ModalService,
		private translateService: TranslateService,
	) {
		const { currentLang } = translateService;
		// eslint-disable-next-line no-param-reassign
		translateService.currentLang = '';
		translateService.use(currentLang);
		translateService.get('onboardingSignupCredentials.main.linkErrors').subscribe(data => {
			this.linkErrors = data;
		});
		translateService.get('onboardingSignupCredentials.main.adminCreationModal').subscribe(data => {
			this.adminCreationModal = data;
		});
	}

	private static generateErrorMessage(errorMessage: string, contact: string) {
		return `${errorMessage}.\n${contact}`;
	}

	ngOnDestroy(): void {
		this.$destroyed.next();
		this.$destroyed.complete();
	}

	openDialog(data: { title: string; confirmText: string; message: string }, key: string): void {
		this.modalService.open(
			{
				title: data.title,
				confirmText: data.confirmText,
				message: data.message,
				modalType: key === 'successModal' ? ModalType.INFO : ModalType.ERROR,
				closable: false,
				id: key,
			},
			CustomModalType.INFO,
		);
		this.modalService.confirmEventSubject.subscribe(() => {
			this.router.navigate(['../../../signin'], { relativeTo: this.route });
			this.modalService.close();
			this.modalService.confirmEventSubject.unsubscribe();
		});
	}

	ngOnInit() {
		this.sharedStore
			.select(selectAccessToken)
			.pipe(take(1))
			.subscribe(token => {
				if (token) {
					this.sharedStore.dispatch(logout({ redirect: false }));
				}
			});
		this.store
			.select(selectResourceStatus)
			.pipe(takeUntil(this.$destroyed))
			.subscribe(reqStatusData => {
				if (reqStatusData.status === AsyncRequestState.LOADING) {
					this.loading = true;
				} else if (reqStatusData.status === AsyncRequestState.SUCCESS) {
					this.openDialog(this.adminCreationModal.successModal, 'successModal');
					this.loading = false;
					this.$destroyed.next();
					this.$destroyed.complete();
					this.store.dispatch(resetLinkState());
					this.store.dispatch(resetCreateResourceState());
				} else if (reqStatusData.status === AsyncRequestState.ERROR) {
					this.loading = false;
					this.openDialog(this.adminCreationModal.errorModal, 'errorModal');
				} else {
					this.loading = false;
				}
			});
		this.store
			.select(selectLinkErrorStatus)
			.pipe(takeUntil(this.$destroyed))
			.subscribe(errStatus => {
				if (errStatus.status === AsyncRequestState.LOADING) {
					this.loading = true;
				} else if (errStatus.status === AsyncRequestState.ERROR) {
					const errMsg = CredentialsComponent.generateErrorMessage(
						errStatus.error?.message || this.linkErrors.genericLinkErr,
						this.linkErrors.contact,
					);
					this.openDialog(
						{ title: this.linkErrors.modalTitle, confirmText: this.linkErrors.modalConfirmText, message: errMsg },
						'errorModal',
					);
					this.loading = false;
				} else {
					this.loading = false;
				}
			});
		this.store
			.select(selectLinkData)
			.pipe(
				takeUntil(this.$destroyed),
				tap(link => {
					if (link?.id) {
						if (link?.status === StatusType.ACTIVE) {
							this.link = link;
							this.store.dispatch(setResourceLinkId({ linkId: link.id }));
						} else if (link?.status === StatusType.COMPLETED) {
							this.openDialog(
								{
									title: this.linkErrors.modalTitle,
									confirmText: this.linkErrors.modalConfirmText,
									message: this.linkErrors.linkUsedErr,
								},
								'errorModal',
							);
						} else if (link?.status === StatusType.INACTIVE) {
							this.openDialog(
								{
									title: this.linkErrors.modalTitle,
									confirmText: this.linkErrors.modalConfirmText,
									message: this.linkErrors.expiredLinkErr,
								},
								'errorModal',
							);
						}
					}
				}),
				filter(link => !link?.id),
				tap(_ => {
					this.store.dispatch(
						loadLinkData({
							linkToken: this.route.parent?.parent?.snapshot.paramMap.get('token') || '',
						}),
					);
				}),
			)
			.subscribe();
	}
}
