import { Component, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { OnboardingClientState, logout } from '@tempus/client/onboarding-client/shared/data-access';
import { Subject } from 'rxjs';

@Component({
	selector: 'tempus-manage-resources',
	templateUrl: './manage-resources.component.html',
	styleUrls: ['./manage-resources.component.scss'],
})
export class ManageResourcesComponent implements OnDestroy {
	constructor(private store: Store<OnboardingClientState>, private router: Router) {}

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
