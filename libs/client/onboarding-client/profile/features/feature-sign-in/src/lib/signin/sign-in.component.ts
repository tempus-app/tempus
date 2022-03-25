import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import {
	login,
	ProfileState,
	selectAccessToken,
	selectLoginStatus,
} from '@tempus/client/onboarding-client/profile/data-access';
import { AsyncRequestState } from '@tempus/client/onboarding-client/shared/data-access';
import { Subject, takeUntil } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';

@Component({
	selector: 'tempus-sign-in',
	templateUrl: './sign-in.component.html',
	styleUrls: ['./sign-in.component.scss'],
})
export class SignInComponent implements OnInit, OnDestroy {
	constructor(
		private store: Store<ProfileState>,
		private router: Router,
		private route: ActivatedRoute,
		private fb: FormBuilder,
		private translateService: TranslateService,
	) {
		const { currentLang } = translateService;
		// eslint-disable-next-line no-param-reassign
		translateService.currentLang = '';
		translateService.use(currentLang);
	}

	signInPrefix = 'onboardingProfileSignin.';

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
					this.router.navigate(['../'], { relativeTo: this.route });
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
