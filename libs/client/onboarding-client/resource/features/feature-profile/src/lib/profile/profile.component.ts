import { Component, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { OnboardingClientState, logout } from '@tempus/client/onboarding-client/shared/data-access';
import { Subject } from 'rxjs';
import { ButtonType } from '@tempus/client/shared/ui-components/presentational';
import { UserType } from '@tempus/client/shared/ui-components/persistent';

@Component({
	selector: 'tempus-profile',
	templateUrl: './profile.component.html',
	styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnDestroy {
	constructor(private store: Store<OnboardingClientState>, private router: Router, private route: ActivatedRoute) {}

	destroyed$ = new Subject<void>();

	ButtonType = ButtonType;
    UserType = UserType;

    selectedTab(tab: string) {
        if (tab == 'logout') {
            console.log('click');
            this.logout();
        }
    }

	logout() {
		this.store.dispatch(logout());
		this.router.navigateByUrl('signin');
	}

	ngOnDestroy(): void {
		this.destroyed$.next();
		this.destroyed$.complete();
	}
}
