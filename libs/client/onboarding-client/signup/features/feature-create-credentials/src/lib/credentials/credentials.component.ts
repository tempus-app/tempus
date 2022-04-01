import { Component, OnDestroy, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import { AsyncRequestState } from '@tempus/client/onboarding-client/shared/data-access';
import {
	loadLinkData,
	selectLinkData,
	selectLinkErrorStatus,
	setResourceLinkId,
	SignupState,
} from '@tempus/client/onboarding-client/signup/data-access';
import { Link, StatusType } from '@tempus/shared-domain';
// eslint-disable-next-line @nrwl/nx/enforce-module-boundaries
import { ModalType } from 'libs/client/shared/ui-components/modal/src/lib/info-modal/modal-type.enum';
// eslint-disable-next-line @nrwl/nx/enforce-module-boundaries
import { CustomModalType } from 'libs/client/shared/ui-components/modal/src/lib/service/custom-modal-type.enum';
// eslint-disable-next-line @nrwl/nx/enforce-module-boundaries
import { ModalService } from 'libs/client/shared/ui-components/modal/src/lib/service/modal.service';

import { Subscription } from 'rxjs';
import { tap, filter } from 'rxjs/operators';

@Component({
	selector: 'tempus-credentials',
	templateUrl: './credentials.component.html',
	styleUrls: ['./credentials.component.scss'],
})
export class CredentialsComponent implements OnInit, OnDestroy {
	tokenId = '';

	link: Link | undefined;

	loading = false;

	errorStatus$?: Subscription;

	linkData$?: Subscription;

	@ViewChild('testTemplate')
	testTemplate!: TemplateRef<unknown>;

	linkUsedErr = '';

	linkExpiredErr = '';

	genericLinkErr = '';

	contact = '';

	modalTitle = '';

	modalConfirmText = '';

	constructor(
		private route: ActivatedRoute,
		private store: Store<SignupState>,
		public modalService: ModalService,
		private translateService: TranslateService,
	) {
		const { currentLang } = translateService;
		// eslint-disable-next-line no-param-reassign
		translateService.currentLang = '';
		translateService.use(currentLang);
		translateService.get('onboardingSignupCredentials.main.linkErrors').subscribe(data => {
			this.linkUsedErr = data.linkUsedErr;
			this.linkExpiredErr = data.expiredLinkErr;
			this.genericLinkErr = data.genericLinkErr;
			this.contact = data.contact;
			this.modalTitle = data.modalTitle;
			this.modalConfirmText = data.modalConfirmText;
		});
	}

	private static generateErrorMessage(errorMessage: string, contact: string) {
		return `${errorMessage}.\n${contact}`;
	}

	ngOnDestroy(): void {
		this.errorStatus$?.unsubscribe();
		this.linkData$?.unsubscribe();
	}

	openDialog(errorMessage: string): void {
		this.modalService.open(
			{
				title: this.modalTitle,
				confirmText: this.modalConfirmText,
				message: errorMessage,
				modalType: ModalType.ERROR,
				closable: false,
			},
			CustomModalType.INFO,
		);
		this.modalService.confirmEventSubject.subscribe(() => {
			// TODO:  redirect
			this.modalService.confirmEventSubject.unsubscribe();
		});
	}

	ngOnInit() {
		this.errorStatus$ = this.store.select(selectLinkErrorStatus).subscribe(errStatus => {
			if (errStatus.status === AsyncRequestState.LOADING) {
				this.loading = true;
			} else if (errStatus.status === AsyncRequestState.ERROR) {
				this.openDialog(
					CredentialsComponent.generateErrorMessage(errStatus.error?.message || this.genericLinkErr, this.contact),
				);
				this.loading = false;
			} else {
				this.loading = false;
			}
		});
		this.linkData$ = this.store
			.select(selectLinkData)
			.pipe(
				tap(link => {
					if (link?.id) {
						if (link?.status === StatusType.ACTIVE) {
							this.link = link;
							this.store.dispatch(setResourceLinkId({ linkId: link.id }));
						} else if (link?.status === StatusType.COMPLETED) {
							this.openDialog(this.linkUsedErr);
						} else if (link?.status === StatusType.INACTIVE) {
							this.openDialog(this.linkExpiredErr);
						}
					}
				}),
				filter(link => !link?.id),
				// eslint-disable-next-line @typescript-eslint/no-unused-vars
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
