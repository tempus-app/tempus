import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of, switchMap } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { Injectable } from '@angular/core';
import {
	OnboardingClientAuthService,
	OnboardingClientResourceService,
	OnboardingClientViewsService,
} from '../../services';
import {
	getAllViewsByResourceId,
	getResourceInformationById,
	getResourceInformationByIdSuccess,
	getResourceOriginalResumeById,
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
	getResourceInformationByIdFailure,
	getResourceOriginalResumeByIdSuccess,
} from '.';
import { OnboardingClientState } from '../onboardingClient.state';

@Injectable()
export class ResourceEffects {
	constructor(
		private readonly actions$: Actions,
		private sharedStore: Store<OnboardingClientState>,
		private authService: OnboardingClientAuthService,
		private resourceService: OnboardingClientResourceService,
		private viewsService: OnboardingClientViewsService,
	) {}

	getResourceInformationById$ = createEffect(() =>
		this.actions$.pipe(
			ofType(getResourceInformationById),
			switchMap(action =>
				this.resourceService.getResourceInformationById(action.resourceId).pipe(
					map(data => {
						return getResourceInformationByIdSuccess({
							firstName: data.firstName,
							lastName: data.lastName,
							email: data.email,
							phoneNumber: data.phoneNumber,
							city: data.location.city,
							province: data.location.province,
							country: data.location.country,
							linkedInLink: data.linkedInLink,
							githubLink: data.githubLink,
							otherLink: data.otherLink,
							projectResources: data.projectResources,
						});
					}),
					catchError(error => of(getResourceInformationByIdFailure({ error }))),
				),
			),
		),
	);

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
}
