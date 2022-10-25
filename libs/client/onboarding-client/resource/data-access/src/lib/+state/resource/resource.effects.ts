import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of, switchMap } from 'rxjs';
import { map, catchError, tap } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { Injectable } from '@angular/core';
import {
	OnboardingClientAuthService,
	OnboardingClientResourceService,
} from '@tempus/client/onboarding-client/shared/data-access';
import { updateInfoFailure, updateUserInfo, updateUserInfoSuccess } from './resource.actions';
import { ResourceState } from './resource.reducers';

@Injectable()
export class TestEffects {
	constructor(
		private readonly actions$: Actions,
		private store: Store<ResourceState>,
		private authService: OnboardingClientAuthService,
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
}
