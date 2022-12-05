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
	approveOrDenyRevision,
	approveOrDenyRevisionSuccess,
	createResourceView,
	createResourceViewFailure,
	createResourceViewSuccess,
	getAllViewsByResourceId,
	getResourceInformation,
	getResourceInformationById,
	getResourceInformationByIdSuccess,
	getResourceInformationFailure,
	getResourceOriginalResumeById,
	updateInfoFailure,
	updateUserInfo,
	updateUserInfoSuccess,
} from './resource.actions';
import {
	approveOrDenyRevisionFailure,
	downloadProfileByViewId,
	downloadProfileByViewIdFailure,
	downloadProfileByViewIdSuccess,
	editResourceView,
	editResourceViewFailure,
	editResourceViewSuccess,
	getAllViewsByResourceIdFailure,
	getAllViewsByResourceIdSuccess,
	getResourceInformationByIdFailure,
	getResourceInformationSuccess,
	getResourceOriginalResumeByIdSuccess,
	getViewById,
	getViewByIdFailure,
	getViewByIdSuccess,
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

	getResourceInformation$ = createEffect(() =>
		this.actions$.pipe(
			ofType(getResourceInformation),
			switchMap(() =>
				this.resourceService.getResourceInformation().pipe(
					map(data => {
						return getResourceInformationSuccess({
							userId: data.id,
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
					catchError(error => of(getResourceInformationFailure({ error }))),
				),
			),
		),
	);

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

	getViewById$ = createEffect(() =>
		this.actions$.pipe(
			ofType(getViewById),
			switchMap(data =>
				this.viewsService.getViewById(data.viewId).pipe(
					map(res => {
						return getViewByIdSuccess({ view: res });
					}),
					catchError(error => of(getViewByIdFailure({ error }))),
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

	editResourceView$ = createEffect(() =>
		this.actions$.pipe(
			ofType(editResourceView),
			switchMap(data =>
				this.viewsService.editResourceView(data.viewId, data.newView).pipe(
					map(res => {
						return editResourceViewSuccess({ revision: res });
					}),
					catchError(error => of(editResourceViewFailure({ error }))),
				),
			),
		),
	);

	createResourceView$ = createEffect(() =>
		this.actions$.pipe(
			ofType(createResourceView),
			switchMap(data =>
				this.viewsService.createSecondaryView(data.resourceId, data.newView).pipe(
					map(res => {
						return createResourceViewSuccess({ view: res });
					}),
					catchError(error => of(createResourceViewFailure({ error }))),
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

	approveOrDeny$ = createEffect(() =>
		this.actions$.pipe(
			ofType(approveOrDenyRevision),
			switchMap(data =>
				this.viewsService.approveOrDenyRevision(data.viewId, data.comment, data.approval).pipe(
					map(res => {
						return approveOrDenyRevisionSuccess({ approveOrDeny: res });
					}),
					catchError(error => of(approveOrDenyRevisionFailure({ error }))),
				),
			),
		),
	);
}
