import { createReducer, on } from '@ngrx/store';
import { AsyncRequestState } from '@tempus/client/onboarding-client/shared/data-access';
import { ProjectResource, Timesheet, View } from '@tempus/shared-domain';
import * as ResourceActions from './resource.actions';

export const RESOURCE_INFO_FEATURE_KEY = 'resource';

export interface ResourceState {
	firstName: string | null;
	lastName: string | null;
	email: string | null;
	views: View[] | null;
	resume: Blob | null;
	totalViewsData: number;
	projectResources: ProjectResource[];
	createdTimesheet: null | Timesheet;
	timesheet: null | Timesheet;
}

export const initialState: ResourceState = {
	firstName: null,
	lastName: null,
	email: null,
	views: null,
	resume: null,
	totalViewsData: 0,
	projectResources: [],
	createdTimesheet: null,
	timesheet: null,
};

export const resourceReducer = createReducer(
	initialState,
	on(ResourceActions.getResourceProjects, state => ({ ...state, status: AsyncRequestState.LOADING })),
	on(ResourceActions.getResourceProjectsSuccess, (state, { projectResources }) => ({
		...state,
		projectResources,
	})),
	on(ResourceActions.getResourceProjectsFailure, (state, { error }) => ({
		...state,
		status: AsyncRequestState.ERROR,
		error,
	})),
	on(ResourceActions.getResourceTimesheetbyId, state => ({ ...state, status: AsyncRequestState.LOADING })),
	on(ResourceActions.getResourceTimesheetbyIdSuccess, (state, { timesheet }) => ({
		...state,
		timesheet,
	})),
	on(ResourceActions.getResourceTimesheetbyIdFailure, (state, { error }) => ({
		...state,
		status: AsyncRequestState.ERROR,
		error,
	})),
	on(ResourceActions.updateUserInfo, state => ({ ...state, status: AsyncRequestState.LOADING })),
	on(ResourceActions.updateUserInfoSuccess, (state, { firstName, lastName, email }) => ({
		...state,
		firstName,
		lastName,
		email,
	})),
	on(ResourceActions.updateInfoFailure, (state, { error }) => ({
		...state,
		status: AsyncRequestState.ERROR,
		error,
	})),
	on(ResourceActions.getAllViewsByResourceId, state => ({ ...state, status: AsyncRequestState.LOADING })),
	on(ResourceActions.getAllViewsByResourceIdSuccess, (state, { views, totalViews }) => ({
		...state,
		views,
		totalViewsData: totalViews,
		status: AsyncRequestState.SUCCESS,
		error: null,
	})),
	on(ResourceActions.getAllViewsByResourceIdFailure, (state, { error }) => ({
		...state,
		error,
		status: AsyncRequestState.ERROR,
	})),
	on(ResourceActions.getResourceOriginalResumeById, state => ({ ...state, status: AsyncRequestState.LOADING })),
	on(ResourceActions.getResourceOriginalResumeByIdSuccess, (state, { resume }) => ({
		...state,
		resume,
		status: AsyncRequestState.SUCCESS,
	})),
	on(ResourceActions.getResourceOriginalResumeByIdFailure, (state, { error }) => ({
		...state,
		error,
	})),
	on(ResourceActions.downloadProfileByViewId, state => ({ ...state, status: AsyncRequestState.LOADING })),
	on(ResourceActions.downloadProfileByViewIdSuccess, (state, { resume }) => ({
		...state,
		resume,
		status: AsyncRequestState.SUCCESS,
	})),
	on(ResourceActions.downloadProfileByViewIdFailure, (state, { error }) => ({
		...state,
		error,
	})),
	on(ResourceActions.createTimesheet, state => ({ ...state, status: AsyncRequestState.LOADING })),
	on(ResourceActions.createTimesheetFailure, (state, { error }) => ({
		...state,
		error,
		status: AsyncRequestState.ERROR,
	})),
	on(ResourceActions.createTimesheetSuccess, (state, { timesheet }) => ({
		...state,
		status: AsyncRequestState.SUCCESS,
		createdTimesheet: timesheet,
		error: null,
	})),
);
