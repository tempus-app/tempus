import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of, switchMap } from 'rxjs';
import { map, catchError, withLatestFrom } from 'rxjs/operators';
import { OnboardingClientResourceService } from '@tempus/client/onboarding-client/shared/data-access';
import { Store } from '@ngrx/store';
import { Injectable } from '@angular/core';
import {
	createResource,
	createResourceFailure,
	createResourceSuccess,
	saveResume,
	saveResumeFailure,
	saveResumeSuccess,
} from './createResource.actions';
import { SignupState } from '../signup.state';
import { selectResourceData, selectUploadedResume } from './createResource.selectors';

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
			// eslint-disable-next-line @typescript-eslint/no-unused-vars
			switchMap(([action, createResourceData]) =>
				this.resourceService
					.createResource(action.createResourceDto ? action.createResourceDto : createResourceData)
					.pipe(
						map(data => createResourceSuccess({ resourceId: data.id })),
						catchError(error => of(createResourceFailure({ error }))),
					),
			),
		),
	);

	saveResume$ = createEffect(() =>
		this.actions$.pipe(
			ofType(saveResume),
			withLatestFrom(this.store.select(selectUploadedResume)),
			switchMap(([action, file]) =>
				this.resourceService.saveResume(action.resourceId, file).pipe(
					map(() => saveResumeSuccess()),
					catchError(error => of(saveResumeFailure({ error }))),
				),
			),
		),
	);
}
