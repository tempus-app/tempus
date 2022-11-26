import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of, switchMap } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { OnboardingClientState } from '../onboardingClient.state';
import {
	forgotPassword,
	forgotPasswordFailure,
	forgotPasswordSuccess,
	login,
	loginFailure,
	loginSuccess,
	logout,
	logoutFailure,
	logoutSuccess,
} from './auth.actions';
import { OnboardingClientAuthService, OnboardingClientResourceService } from '../../services';

@Injectable()
export class AuthEffects {
	constructor(
		private readonly actions$: Actions,
		private store: Store<OnboardingClientState>,
		private authService: OnboardingClientAuthService,
		private router: Router,
		private resourceService: OnboardingClientResourceService,
	) {}

	login$ = createEffect(() =>
		this.actions$.pipe(
			ofType(login),
			switchMap(action =>
				this.authService.login(action.password, action.email).pipe(
					map(data => {
						return loginSuccess({
							accessToken: data.accessToken,
							refreshToken: data.refreshToken,
							loggedInUserId: data.user.id,
							firstName: data.user.firstName,
							lastName: data.user.lastName,
							email: data.user.email,
						});
					}),
					catchError(error => of(loginFailure({ error }))),
				),
			),
		),
	);

	logout$ = createEffect(() =>
		this.actions$.pipe(
			ofType(logout),
			switchMap(options =>
				this.authService.logout().pipe(
					// eslint-disable-next-line @typescript-eslint/no-unused-vars
					map(_ => {
						this.authService.resetSessionStorage();
						if (options.redirect) {
							this.router.navigateByUrl('/signin');
						}
						return logoutSuccess();
					}),
					catchError(error => {
						return of(logoutFailure(error));
					}),
				),
			),
		),
	);

	forgotPassword$ = createEffect(() =>
		this.actions$.pipe(
			ofType(forgotPassword),
			switchMap(options =>
				this.authService.forgotPassword(options.email).pipe(
					map(() => {
						return forgotPasswordSuccess();
					}),
					catchError(error => {
						return of(forgotPasswordFailure(error));
					}),
				),
			),
		),
	);
}
