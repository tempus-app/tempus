import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of, switchMap } from 'rxjs';
import { map, catchError, tap } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { OnboardingClientState } from '../onboardingClient.state';
import { login, loginFailure, loginSuccess, logout, logoutFailure, logoutSuccess } from './auth.actions';
import { OnboardingClientAuthService } from '../../services';

@Injectable()
export class AuthEffects {
	constructor(
		private readonly actions$: Actions,
		private store: Store<OnboardingClientState>,
		private authService: OnboardingClientAuthService,
		private router: Router,
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
			switchMap(_ =>
				this.authService.logout().pipe(
					map(_ => {
						this.authService.resetSessionStorage();
						this.router.navigateByUrl('/signin');
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
