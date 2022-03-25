import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
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
import { Subscription } from 'rxjs';
import { tap, filter } from 'rxjs/operators';
import { SignupErrorModalComponent } from './error.modal';

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

	linkUsedErr = '';

	linkExpiredErr = '';

	genericLinkErr = '';

	constructor(
		private route: ActivatedRoute,
		private store: Store<SignupState>,
		public dialog: MatDialog,
		private translateService: TranslateService,
	) {
		const { currentLang } = translateService;
		// eslint-disable-next-line no-param-reassign
		translateService.currentLang = '';
		translateService.use(currentLang);
		translateService
			.get([
				'onboardingSignupCredentials.main.linkUsedErr',
				'onboardingSignupCredentials.main.expiredLinkErr',
				'onboardingSignupCredentials.main.linkUsedErr',
			])
			.subscribe(data => {
				this.linkUsedErr = data['onboardingSignupCredentials.main.linkUsedErr'];
				this.linkExpiredErr = data['onboardingSignupCredentials.main.expiredLinkErr'];
				this.genericLinkErr = data['onboardingSignupCredentials.main.linkUsedErr'];
			});
	}

	ngOnDestroy(): void {
		this.errorStatus$?.unsubscribe();
		this.linkData$?.unsubscribe();
	}

	openDialog(errorMessage: string): void {
		this.dialog.open(SignupErrorModalComponent, {
			width: '90%',
			data: { error: errorMessage },
			disableClose: true,
			height: '90%',
		});
	}

	ngOnInit() {
		this.errorStatus$ = this.store.select(selectLinkErrorStatus).subscribe(errStatus => {
			if (errStatus.status === AsyncRequestState.LOADING) {
				this.loading = true;
			} else if (errStatus.status === AsyncRequestState.ERROR) {
				this.openDialog(errStatus.error?.message || this.genericLinkErr);
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
