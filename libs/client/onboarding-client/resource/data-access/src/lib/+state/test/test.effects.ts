import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of, switchMap } from 'rxjs';
import { map, catchError, tap } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { Injectable } from '@angular/core';
import { OnboardingClientAuthService } from '@tempus/client/onboarding-client/shared/data-access';
import { ResourceState } from '../resource.state';
import { test, testFailure, testSuccess } from './test.actions';

@Injectable()
export class TestEffects {
	constructor(
		private readonly actions$: Actions,
		private store: Store<ResourceState>,
		private authService: OnboardingClientAuthService,
	) {}

	login$ = createEffect(() =>
		this.actions$.pipe(
			ofType(test),
			switchMap(action =>
				this.authService.login('', '').pipe(
					map(data => {
						return testSuccess();
					}),
					catchError(error => of(testFailure({ error }))),
				),
			),
		),
	);
}
