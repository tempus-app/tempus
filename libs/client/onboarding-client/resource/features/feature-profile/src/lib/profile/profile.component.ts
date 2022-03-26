import { Component, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { OnboardingClientState, logout } from '@tempus/client/onboarding-client/shared/data-access';
import { Subject } from 'rxjs';

@Component({
	selector: 'tempus-profile',
	templateUrl: './profile.component.html',
	styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnDestroy {
	constructor(private store: Store<OnboardingClientState>, private router: Router, private route: ActivatedRoute) {}

	destroyed$ = new Subject<void>();

	logout() {
		this.store.dispatch(logout());
		this.router.navigateByUrl('signin');
	}

	ngOnDestroy(): void {
		this.destroyed$.next();
		this.destroyed$.complete();
	}
}
