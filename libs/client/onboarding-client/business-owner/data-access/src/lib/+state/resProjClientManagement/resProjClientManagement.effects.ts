import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of, switchMap } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { Injectable } from '@angular/core';
import {
	OnboardingClientLinkService,
	OnboardingClientProjectService,
	OnboardingClientResourceService,
	OnboardingClientViewsService,
} from '@tempus/client/onboarding-client/shared/data-access';
import { BusinessOwnerState } from '../businessOwner.state';
import * as ProjManagementActions from './resProjClientManagement.actions';

@Injectable()
export class ResourceProjectClientManagementEffects {
	constructor(
		private readonly actions$: Actions,
		private store: Store<BusinessOwnerState>,
		private resourceService: OnboardingClientResourceService,
		private projectService: OnboardingClientProjectService,
		private viewsService: OnboardingClientViewsService,
		private linkService: OnboardingClientLinkService,
	) {}

	getAllResProjInfo$ = createEffect(() =>
		this.actions$.pipe(
			ofType(ProjManagementActions.getAllResProjInfo),
			switchMap(paginationData =>
				this.resourceService.getResProjClientData(paginationData).pipe(
					map(data => {
						return ProjManagementActions.getAllResProjInfoSuccess({
							projResClientData: data.userProjClientData,
							totalItems: data.totalItems,
						});
					}),
					catchError(error => of(ProjManagementActions.getAllResProjInfoFailure({ error }))),
				),
			),
		),
	);

	getAllClients$ = createEffect(() =>
		this.actions$.pipe(
			ofType(ProjManagementActions.getAllClients),
			switchMap(() =>
				this.projectService.getClients().pipe(
					map(data => {
						return ProjManagementActions.getAllClientsSuccess({ clientData: data });
					}),
					catchError(error => of(ProjManagementActions.getAllClientsBasicFailure({ error }))),
				),
			),
		),
	);

	getAllResourcesBasic$ = createEffect(() =>
		this.actions$.pipe(
			ofType(ProjManagementActions.getAllResourceInfoBasic),
			switchMap(() =>
				this.resourceService.getResourceBasicInformation().pipe(
					map(data => {
						return ProjManagementActions.getAllResourceInfoBasicSuccess({ resourceBasicData: data });
					}),
					catchError(error => of(ProjManagementActions.getAllResourceInfoBasicFailure({ error }))),
				),
			),
		),
	);

	getAllSearchableTerms$ = createEffect(() =>
		this.actions$.pipe(
			ofType(ProjManagementActions.getAllSearchableTerms),
			switchMap(() =>
				this.resourceService.getAllSearchableTerms().pipe(
					map(data => {
						return ProjManagementActions.getAllSearchableTermsSuccess({ searchableTerms: data });
					}),
					catchError(error => of(ProjManagementActions.getAllResourceInfoBasicFailure({ error }))),
				),
			),
		),
	);

	ceateLink$ = createEffect(() =>
		this.actions$.pipe(
			ofType(ProjManagementActions.createLink),
			switchMap(data =>
				this.linkService.createLink(data.createLinkDto).pipe(
					map(() => {
						return ProjManagementActions.createLinkSuccess();
					}),
					catchError(error => of(ProjManagementActions.createLinkFailure({ error }))),
				),
			),
		),
	);

	createClient$ = createEffect(() =>
		this.actions$.pipe(
			ofType(ProjManagementActions.createClient),
			switchMap(data =>
				this.projectService.createClient(data.createClientDto).pipe(
					map(createdClient => {
						return ProjManagementActions.createClientSuccess({ client: createdClient });
					}),
					catchError(error => of(ProjManagementActions.createClientFailure({ error }))),
				),
			),
		),
	);

	createProject$ = createEffect(() =>
		this.actions$.pipe(
			ofType(ProjManagementActions.createProject),
			switchMap(data =>
				this.projectService.createProject(data.createProjectDto).pipe(
					map(createdProject => {
						return ProjManagementActions.createProjectSuccess({ project: createdProject });
					}),
					catchError(error => of(ProjManagementActions.createProjectFailure({ error }))),
				),
			),
		),
	);

	assignResourceToProject$ = createEffect(() =>
		this.actions$.pipe(
			ofType(ProjManagementActions.createResourceProjectAssignment),
			switchMap(data =>
				this.projectService.assignResourceToProject(data.projectId, data.resourceId, data.assignProjectDto).pipe(
					map(() => {
						return ProjManagementActions.createResourceProjectAssignmentSuccess();
					}),
					catchError(error => of(ProjManagementActions.createResourceProjectAssignmentFailure({ error }))),
				),
			),
		),
	);

	getAllPendingApprovals$ = createEffect(() =>
		this.actions$.pipe(
			ofType(ProjManagementActions.getAllViewsByStatus),
			switchMap(data =>
				this.viewsService.getViewsByStatus(data.status, data.pageNum, data.pageSize).pipe(
					map(res => {
						return ProjManagementActions.getAllViewsByStatusSuccess({
							views: res.views,
							totalPendingApprovals: res.totalPendingApprovals,
						});
					}),
					catchError(error => of(ProjManagementActions.getAllViewsByStatusFailure({ error }))),
				),
			),
		),
	);
}
