import { createReducer, on } from '@ngrx/store';
import { ProjectResource, View } from '@tempus/shared-domain';
import { AsyncRequestState } from '../../enum';
import * as ResourceActions from './resource.actions';

export const RESOURCE_INFO_FEATURE_KEY = 'resource';

export interface ResourceState {
	userId: number;
	firstName: string | null;
	lastName: string | null;
	email: string | null;
	phoneNumber: string | null;
	views: View[] | null;
	resume: Blob | null;
	totalViewsData: number;
	city: string | null;
	province: string | null;
	country: string | null;
	linkedInLink: string | null;
	githubLink: string | null;
	otherLink: string | null;
	projectResources: ProjectResource[] | null;
	error: Error | null;
}

export const initialState: ResourceState = {
	userId: 0,
	firstName: null,
	lastName: null,
	email: null,
	phoneNumber: null,
	views: null,
	resume: null,
	totalViewsData: 0,
	city: null,
	province: null,
	country: null,
	linkedInLink: null,
	githubLink: null,
	otherLink: null,
	projectResources: null,
	error: null,
};

export const resourceReducer = createReducer(
	initialState,
	// getResourceInformation
	on(ResourceActions.getResourceInformation, state => ({ ...state, status: AsyncRequestState.LOADING })),
	on(
		ResourceActions.getResourceInformationSuccess,
		(
			state,
			{
				userId,
				firstName,
				lastName,
				email,
				city,
				province,
				country,
				phoneNumber,
				linkedInLink,
				githubLink,
				otherLink,
				projectResources,
			},
		) => ({
			...state,
			userId,
			firstName,
			lastName,
			email,
			city,
			province,
			country,
			phoneNumber,
			linkedInLink,
			githubLink,
			otherLink,
			projectResources,
		}),
	),
	on(ResourceActions.getResourceInformationFailure, (state, { error }) => ({
		...state,
		status: AsyncRequestState.ERROR,
		error,
	})),
	// getResourceInformationById
	on(ResourceActions.getResourceInformationById, state => ({ ...state, status: AsyncRequestState.LOADING })),
	on(
		ResourceActions.getResourceInformationByIdSuccess,
		(
			state,
			{
				firstName,
				lastName,
				email,
				city,
				province,
				country,
				phoneNumber,
				linkedInLink,
				githubLink,
				otherLink,
				projectResources,
			},
		) => ({
			...state,
			firstName,
			lastName,
			email,
			city,
			province,
			country,
			phoneNumber,
			linkedInLink,
			githubLink,
			otherLink,
			projectResources,
		}),
	),
	on(ResourceActions.getResourceInformationByIdFailure, (state, { error }) => ({
		...state,
		status: AsyncRequestState.ERROR,
		error,
	})),

	// updateUserInformation
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
	// getAllViewsByResourceId
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
	// getResourceOriginalResumeById
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
	// downloadProfileByViewId
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
);
