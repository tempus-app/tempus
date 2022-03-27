import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import {
	AsyncRequestState,
	login,
	OnboardingClientState,
	selectAccessToken,
	selectLoginStatus,
} from '@tempus/client/onboarding-client/shared/data-access';
import { decodeJwt } from '@tempus/client/shared/util';
import { RoleType } from '@tempus/shared-domain';
import { Subject, takeUntil } from 'rxjs';

@Component({
	selector: 'tempus-sign-in',
	templateUrl: './sign-in.component.html',
	styleUrls: ['./sign-in.component.scss'],
})
export class SignInComponent implements OnInit, OnDestroy {
	constructor(
		private store: Store<OnboardingClientState>,
		private router: Router,
		private route: ActivatedRoute,
		private fb: FormBuilder,
	) {}

	destroyed$ = new Subject<void>();

	loading = false;

	errorMessage = '';

	loginForm = this.fb.group({
		email: ['', Validators.required],
		password: ['', Validators.required],
	});

	ngOnInit(): void {
		this.store
			.select(selectLoginStatus)
			.pipe(takeUntil(this.destroyed$))
			.subscribe(loginStatus => {
				if (loginStatus.status === AsyncRequestState.LOADING) {
					this.loading = true;
				} else if (loginStatus.status === AsyncRequestState.ERROR) {
					this.loading = false;
					this.errorMessage = loginStatus.error?.message || '';
				} else {
					this.loading = false;
				}
			});
		this.store
			.select(selectAccessToken)
			.pipe(takeUntil(this.destroyed$))
			.subscribe(accessToken => {
				if (accessToken) {
					const { roles } = decodeJwt(accessToken || '');

					if (roles.includes(RoleType.BUSINESS_OWNER)) {
						this.router.navigate(['../owner'], { relativeTo: this.route });
					} else if (roles.includes(RoleType.AVAILABLE_RESOURCE) || roles.includes(RoleType.ASSIGNED_RESOURCE)) {
						this.router.navigate(['../resource'], { relativeTo: this.route });
					} else {
						this.errorMessage = 'No defined roles';
					}
				}
			});
	}

	login() {
		const { email, password } = this.loginForm.value;
		this.store.dispatch(
			login({
				email,
				password,
			}),
		);
	}

	ngOnDestroy() {
		this.destroyed$.next();
		this.destroyed$.complete();
	}
}