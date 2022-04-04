import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of, switchMap } from 'rxjs';
import { map, catchError, withLatestFrom } from 'rxjs/operators';
import { OnboaringClientResourceProfileService } from '@tempus/client/onboarding-client/shared/data-access';
import { Store } from '@ngrx/store';
import { Injectable } from '@angular/core';
import { viewResource, viewResourceSuccess, viewResourceFailure } from './viewResource.actions';
import { SignupState } from '../signup.state';
import { selectResourceData } from './createResource.selectors';

@Injectable()
export class ResourceEffects {
	constructor(
		private readonly actions$: Actions,
		private store: Store<SignupState>,
		private resourceService: OnboaringClientResourceProfileService,
	) {}

	viewResource$ = createEffect(() =>
		this.actions$.pipe(
			ofType(viewResource),
			withLatestFrom(this.store.select(selectResourceData)),
			switchMap(([action, createResourceData]) =>
				this.resourceService.getView(createResourceData).pipe(
					map(() => viewResourceSuccess()),
					catchError(error => of(viewResourceFailure({ error }))),
				),
			),
		),
	);
}
