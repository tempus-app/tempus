import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of, switchMap } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
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
			// eslint-disable-next-line @typescript-eslint/no-unused-vars
			switchMap(_action =>
				this.authService.login('', '').pipe(
					// eslint-disable-next-line @typescript-eslint/no-unused-vars
					map(_data => {
						return testSuccess();
					}),
					catchError(error => of(testFailure({ error }))),
				),
			),
		),
	);
}
