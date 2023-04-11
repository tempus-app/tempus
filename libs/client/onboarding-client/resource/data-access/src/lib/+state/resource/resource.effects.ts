import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of, switchMap } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { Injectable } from '@angular/core';
import {
	OnboardingClientAuthService,
	OnboardingClientResourceService,
	OnboardingClientViewsService,
	OnboardingClientTimesheetsService,
} from '@tempus/client/onboarding-client/shared/data-access';
import {
	createTimesheet,
	createTimesheetFailure,
	createTimesheetSuccess,
	getAllViewsByResourceId,
	getResourceOriginalResumeById,
	getResourceProjects,
	getResourceProjectsFailure,
	getResourceProjectsSuccess,
	getResourceTimesheetbyId,
	getResourceTimesheetbyIdSuccess,
	getResourceTimesheetbyIdFailure,
	updateInfoFailure,
	updateUserInfo,
	updateUserInfoSuccess,
} from './resource.actions';
import {
	downloadProfileByViewId,
	downloadProfileByViewIdFailure,
	downloadProfileByViewIdSuccess,
	getAllViewsByResourceIdFailure,
	getAllViewsByResourceIdSuccess,
	getResourceOriginalResumeByIdSuccess,
} from '.';
import { TempusResourceState } from '..';

@Injectable()
export class ResourceEffects {
	constructor(
		private readonly actions$: Actions,
		private store: Store<TempusResourceState>,
		private authService: OnboardingClientAuthService,
		private resourceService: OnboardingClientResourceService,
		private viewsService: OnboardingClientViewsService,
		private timesheetService: OnboardingClientTimesheetsService,
	) {}

	getResourceProjects$ = createEffect(() =>
		this.actions$.pipe(
			ofType(getResourceProjects),
			switchMap(() =>
				this.resourceService.getResourceInformation().pipe(
					map(res => {
						return getResourceProjectsSuccess({ projectResources: res.projectResources });
					}),
					catchError(error => of(getResourceProjectsFailure({ error }))),
				),
			),
		),
	);

	getResourceTimesheet$ = createEffect(() =>
		this.actions$.pipe(
			ofType(getResourceTimesheetbyId),
			switchMap(action =>
				this.timesheetService.getTimesheetById(action.timesheetId).pipe(
					map(timesheet => {
						return getResourceTimesheetbyIdSuccess({ timesheet: timesheet });
					}),
					catchError(error => of(getResourceTimesheetbyIdFailure({ error }))),
				),
			),
		),
	)

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
				this.viewsService.getViewsByResourceId(data.resourceId, data.pageNum, data.pageSize).pipe(
					map(res => {
						return getAllViewsByResourceIdSuccess({ views: res.views, totalViews: res.totalViews });
					}),
					catchError(error => of(getAllViewsByResourceIdFailure({ error }))),
				),
			),
		),
	);

	getResourceOriginalResume$ = createEffect(() =>
		this.actions$.pipe(
			ofType(getResourceOriginalResumeById),
			switchMap(data =>
				this.resourceService.getResourceOriginalResumeById(data.resourceId).pipe(
					map(res => {
						return getResourceOriginalResumeByIdSuccess({ resume: res });
					}),
					catchError(error => of(getAllViewsByResourceIdFailure({ error }))),
				),
			),
		),
	);

	downloadProfile$ = createEffect(() =>
		this.actions$.pipe(
			ofType(downloadProfileByViewId),
			switchMap(data =>
				this.resourceService.downloadProfile(data.viewId).pipe(
					map(res => {
						return downloadProfileByViewIdSuccess({ resume: res });
					}),
					catchError(error => of(downloadProfileByViewIdFailure({ error }))),
				),
			),
		),
	);

	createTimesheet$ = createEffect(() =>
		this.actions$.pipe(
			ofType(createTimesheet),
			switchMap(data =>
				this.timesheetService.createTimesheet(data.createTimesheetDto).pipe(
					map(createdTimesheet => {
						return createTimesheetSuccess({ timesheet: createdTimesheet });
					}),
					catchError(error => of(createTimesheetFailure({ error }))),
				),
			),
		),
	);
}
