import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of, switchMap } from 'rxjs';
import { map, catchError, tap } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { OnboardingClientState } from '../onboardingClient.state';
import {
	login,
	loginFailure,
	loginSuccess,
	logout,
	logoutFailure,
	logoutSuccess,
	updateInfoFailure,
	updateUserInfo,
	updateUserInfoSuccess,
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

	updateInfo$ = createEffect(() =>
		this.actions$.pipe(
			ofType(updateUserInfo),
			switchMap(action =>
				this.resourceService.editResourcePersonalInformation(action.updatedPersonalInformation).pipe(
					map(data => {
						return updateUserInfoSuccess({
							firstName: data.firstName,
							lastName: data.lastName,
							email: data.email,
						});
					}),
					catchError(error => of(updateInfoFailure({ error }))),
				),
			),
		),
	);

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
}
