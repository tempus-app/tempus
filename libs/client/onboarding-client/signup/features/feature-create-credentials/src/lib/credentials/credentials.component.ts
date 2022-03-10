import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import {
	loadLinkData,
	selectLinkData,
	selectLinkErrorStatus,
	SignupState,
} from '@tempus/client/onboarding-client/signup/data-access';
import { Link } from '@tempus/shared-domain';
import { take, map } from 'rxjs/operators';

@Component({
	selector: 'tempus-credentials',
	templateUrl: './credentials.component.html',
	styleUrls: ['./credentials.component.scss'],
})
export class CredentialsComponent implements OnInit {
	tokenId = '';

	link: Link | undefined;

	errorStatus$ = this.store.select(selectLinkErrorStatus);

	constructor(private route: ActivatedRoute, private store: Store<SignupState>) {}

	ngOnInit() {
		this.store.select(selectLinkData).pipe(
			map(link => {
				if (!link.id) {
					this.store.dispatch(
						loadLinkData({
							linkId: this.route.snapshot.paramMap.get('token') || '',
						}),
					);
					this.link = undefined;
				} else {
					this.link = link;
				}
			}),
		);
	}
}
