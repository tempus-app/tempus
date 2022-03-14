import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { AsyncRequestState } from '@tempus/client/onboarding-client/shared/data-access';
import {
	loadLinkData,
	selectLinkData,
	selectLinkErrorStatus,
	SignupState,
} from '@tempus/client/onboarding-client/signup/data-access';
import { Link, StatusType } from '@tempus/shared-domain';
import { Subscription } from 'rxjs';
import { tap, switchMap, map, filter, withLatestFrom } from 'rxjs/operators';
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

	constructor(private route: ActivatedRoute, private store: Store<SignupState>, public dialog: MatDialog) {}

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
				this.openDialog(errStatus.error.message);
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
						} else if (link?.status === StatusType.COMPLETED) {
							this.openDialog('Link has already been used');
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
