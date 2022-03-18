import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of, switchMap } from 'rxjs';
import { map, catchError, withLatestFrom, tap } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { Injectable } from '@angular/core';
import { OnboardingClientAuthService } from '@tempus/client/onboarding-client/shared/data-access';
import { ProfileState } from '../profile.state';
import { login, loginFailure, loginSuccess, logout } from './auth.actions';

@Injectable()
export class AuthEffects {
	constructor(
		private readonly actions$: Actions,
		private store: Store<ProfileState>,
		private authService: OnboardingClientAuthService,
	) {}

	login$ = createEffect(() =>
		this.actions$.pipe(
			ofType(login),
			switchMap(action =>
				this.authService.login(action.password, action.email).pipe(
					map(data => loginSuccess({ accessToken: data.accessToken, loggedInUserId: data.user.id })),
					catchError(error => of(loginFailure({ error }))),
				),
			),
		),
	);

	logout$ = createEffect(
		() =>
			this.actions$.pipe(
				ofType(logout),
				tap(_ => this.authService.logout()),
			),
		{ dispatch: false },
	);
}
