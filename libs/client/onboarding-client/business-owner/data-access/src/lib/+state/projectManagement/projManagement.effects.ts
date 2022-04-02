import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of, switchMap } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { Injectable } from '@angular/core';
import {
	OnboardingClientProjectService,
	OnboardingClientResourceService,
} from '@tempus/client/onboarding-client/shared/data-access';
import { BusinessOwnerState } from '../businessOwner.state';
import * as ProjManagementActions from './projManagement.actions';

@Injectable()
export class ProjectManagementEffects {
	constructor(
		private readonly actions$: Actions,
		private store: Store<BusinessOwnerState>,
		private resourceService: OnboardingClientResourceService,
		private projectService: OnboardingClientProjectService,
	) {}

	getAllResProjInfo$ = createEffect(() =>
		this.actions$.pipe(
			ofType(ProjManagementActions.getAllResProjInfo),
			switchMap(() =>
				this.resourceService.getResProjClientData().pipe(
					map(data => {
						return ProjManagementActions.getAllResProjInfoSuccess({ projResClientData: data });
					}),
					catchError(error => of(ProjManagementActions.getAllResProjInfoFailure({ error }))),
				),
			),
		),
	);

	getAllProjectsBasic$ = createEffect(() =>
		this.actions$.pipe(
			ofType(ProjManagementActions.getAllProjBasic),
			switchMap(() =>
				this.projectService.getProjectsBasic().pipe(
					map(data => {
						return ProjManagementActions.getAllProjBasicSuccess({ projBasicData: data });
					}),
					catchError(error => of(ProjManagementActions.getAllProjBasicFailure({ error }))),
				),
			),
		),
	);

	getAllClientsBasic$ = createEffect(() =>
		this.actions$.pipe(
			ofType(ProjManagementActions.getAllClientsBasic),
			switchMap(() =>
				this.projectService.getClientsBasic().pipe(
					map(data => {
						return ProjManagementActions.getAllClientsBasicSuccess({ clientBasicData: data });
					}),
					catchError(error => of(ProjManagementActions.getAllClientsBasicFailure({ error }))),
				),
			),
		),
	);
}
