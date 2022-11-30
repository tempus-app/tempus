import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of, switchMap } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { Injectable } from '@angular/core';
import { OnboardingClientResourceService } from '@tempus/client/onboarding-client/shared/data-access';
import { BusinessOwnerState } from '../businessOwner.state';
import * as AdminManagementActions from './adminManagement.actions';

@Injectable()
export class AdminManagementEffects {
	constructor(
		private readonly actions$: Actions,
		private store: Store<BusinessOwnerState>,
		private resourceService: OnboardingClientResourceService,
	) {}

	getAllAdmin$ = createEffect(() =>
		this.actions$.pipe(
			ofType(AdminManagementActions.getAllAdmin),
			switchMap(paginationData =>
				this.resourceService.getAllAdmin(paginationData).pipe(
					map(data => {
						return AdminManagementActions.getAllAdminSuccess({
							userData: data.userData,
							totalItems: data.totalItems,
						});
					}),
					catchError(error => of(AdminManagementActions.getAllAdminFailure({ error }))),
				),
			),
		),
	);
}
