import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of, switchMap } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { OnboardingClientResourceService } from '@tempus/client/onboarding-client/shared/data-access';
import { Store } from '@ngrx/store';
import { Injectable } from '@angular/core';
import { getOriginalResume, getOriginalResumeSuccess, getOriginalResumeFailure } from './viewResource.actions';
import { ViewState } from './viewResource.reducers';

@Injectable()
export class ViewResourceEffects {
	constructor(
		private readonly actions$: Actions,
		private store: Store<ViewState>,
		private resourceService: OnboardingClientResourceService,
	) {}

	getOriginalResume$ = createEffect(() =>
		this.actions$.pipe(
			ofType(getOriginalResume),
			switchMap(input =>
				this.resourceService.getResourceOriginalResumeById(input.resourceId).pipe(
					map(data => {
						return getOriginalResumeSuccess({ resume: data });
					}),
					catchError(error => of(getOriginalResumeFailure({ error }))),
				),
			),
		),
	);
}
