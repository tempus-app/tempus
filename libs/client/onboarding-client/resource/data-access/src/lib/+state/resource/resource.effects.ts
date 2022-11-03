import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of, switchMap } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { Injectable } from '@angular/core';
import {
	OnboardingClientAuthService,
	OnboardingClientResourceService,
	OnboardingClientViewsService,
} from '@tempus/client/onboarding-client/shared/data-access';
import { getAllViewsByResourceId, updateInfoFailure, updateUserInfo, updateUserInfoSuccess } from './resource.actions';
import { getAllViewsByResourceIdFailure, getAllViewsByResourceIdSuccess } from '.';
import { TempusResourceState } from '..';

@Injectable()
export class ResourceEffects {
	constructor(
		private readonly actions$: Actions,
		private store: Store<TempusResourceState>,
		private authService: OnboardingClientAuthService,
		private resourceService: OnboardingClientResourceService,
		private viewsService: OnboardingClientViewsService,
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

	getAllViews$ = createEffect(() =>
		this.actions$.pipe(
			ofType(getAllViewsByResourceId),
			switchMap(data =>
				this.viewsService.getViewsByResourceId(data.resourceId).pipe(
					map(views => {
						return getAllViewsByResourceIdSuccess({ views });
					}),
					catchError(error => of(getAllViewsByResourceIdFailure({ error }))),
				),
			),
		),
	);
}
