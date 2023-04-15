import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of, switchMap } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { decodeJwt } from '@tempus/client/shared/util';
import { RoleType } from '@tempus/shared-domain';
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
	resetPassword,
	resetPasswordFailure,
	resetPasswordSuccess,
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
						const { roles } = decodeJwt(data.accessToken);
						const rolesTyped: RoleType[] = roles.map(role => RoleType[role as keyof typeof RoleType]);
						return loginSuccess({
							// loggedInUserId: data.loggedInUserId,
							accessToken: data.accessToken,
							refreshToken: data.refreshToken,
							firstName: data.user.firstName,
							lastName: data.user.lastName,
							email: data.user.email,
							roles: rolesTyped,
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
					map(() => {
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
						return of(forgotPasswordFailure({ error }));
					}),
				),
			),
		),
	);

	resetPassword$ = createEffect(() =>
		this.actions$.pipe(
			ofType(resetPassword),
			switchMap(data =>
				this.authService
					.resetPassword({ email: data.email, token: data.token, newPassword: data.password })
					.pipe(
						map(() => {
							return resetPasswordSuccess();
						}),
						catchError(error => {
							return of(resetPasswordFailure({ error }));
						}),
					),
			),
		),
	);
}
