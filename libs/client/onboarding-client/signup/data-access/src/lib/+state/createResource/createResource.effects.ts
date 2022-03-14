import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of, switchMap } from 'rxjs';
import { map, catchError, withLatestFrom } from 'rxjs/operators';
import { OnboardingClientResourceService } from '@tempus/client/onboarding-client/shared/data-access';
import { Store } from '@ngrx/store';
import { Injectable } from '@angular/core';
import { createResource, createResourceFailure, createResourceSuccess } from './createResource.actions';
import { SignupState } from '../signup.state';
import { selectResourceData } from './createResource.selectors';

@Injectable()
export class ResourceEffects {
	constructor(
		private readonly actions$: Actions,
		private store: Store<SignupState>,
		private resourceService: OnboardingClientResourceService,
	) {}

	createResource$ = createEffect(() =>
		this.actions$.pipe(
			ofType(createResource),
			withLatestFrom(this.store.select(selectResourceData)),
			switchMap(([action, createResourceData]) =>
				this.resourceService.createResource(createResourceData).pipe(
					map(() => createResourceSuccess()),
					catchError(error => of(createResourceFailure({ error }))),
				),
			),
		),
	);
}
