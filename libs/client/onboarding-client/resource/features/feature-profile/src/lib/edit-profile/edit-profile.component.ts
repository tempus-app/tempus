import { Component, EventEmitter, OnDestroy, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { OnboardingClientState, logout } from '@tempus/client/onboarding-client/shared/data-access';
import { Subject } from 'rxjs';
import { ButtonType } from '@tempus/client/shared/ui-components/presentational';
import { UserType } from '@tempus/client/shared/ui-components/persistent';

@Component({
	selector: 'tempus-edit-profile',
	templateUrl: './edit-profile.component.html',
	styleUrls: ['./edit-profile.component.scss'],
})
export class EditProfileComponent implements OnDestroy {
	constructor(private store: Store<OnboardingClientState>, private router: Router, private route: ActivatedRoute) {}

	destroyed$ = new Subject<void>();

	ButtonType = ButtonType;

	@Output()
	openEditView = new EventEmitter();

	ngOnDestroy(): void {
		this.destroyed$.next();
		this.destroyed$.complete();
	}
}
