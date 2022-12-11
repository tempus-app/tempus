import { createReducer, on } from '@ngrx/store';
import { ApproveViewDto } from '@tempus/api/shared/dto';
import { ProjectResource, Revision, View } from '@tempus/shared-domain';
import { AsyncRequestState } from '../../enum';
import * as ResourceActions from './resource.actions';

export const RESOURCE_INFO_FEATURE_KEY = 'resource';

export interface ResourceState {
	userId: number;
	firstName: string | null;
	lastName: string | null;
	email: string | null;
	calEmail: string | null;
	phoneNumber: string | null;
	views: View[] | [];
	view: View | null;
	revision: Revision | null;
	resume: Blob | null;
	totalViewsData: number;
	city: string | null;
	province: string | null;
	country: string | null;
	linkedInLink: string | null;
	githubLink: string | null;
	otherLink: string | null;
	projectResources: ProjectResource[] | [];
	approveOrDeny: ApproveViewDto | null;
	error: Error | null;
}

export const initialState: ResourceState = {
	userId: 0,
	firstName: null,
	lastName: null,
	email: null,
	calEmail: null,
	phoneNumber: null,
	views: [],
	view: null,
	revision: null,
	resume: null,
	totalViewsData: 0,
	city: null,
	province: null,
	country: null,
	linkedInLink: null,
	githubLink: null,
	otherLink: null,
	projectResources: [],
	approveOrDeny: null,
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
				calEmail,
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
			calEmail,
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
				calEmail,
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
			calEmail,
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
	// getViewById
	on(ResourceActions.getViewById, state => ({ ...state, status: AsyncRequestState.LOADING })),
	on(ResourceActions.getViewByIdSuccess, (state, { view }) => ({
		...state,
		view,
		status: AsyncRequestState.SUCCESS,
		error: null,
	})),
	on(ResourceActions.getViewByIdFailure, (state, { error }) => ({
		...state,
		error,
		status: AsyncRequestState.ERROR,
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
	// editResourceView
	on(ResourceActions.editResourceView, state => ({ ...state, status: AsyncRequestState.LOADING })),
	on(ResourceActions.editResourceViewSuccess, (state, { revision }) => ({
		...state,
		revision,
		status: AsyncRequestState.SUCCESS,
	})),
	on(ResourceActions.editResourceViewFailure, (state, { error }) => ({
		...state,
		error,
	})),
	// createResourceView
	on(ResourceActions.createResourceView, state => ({ ...state, status: AsyncRequestState.LOADING })),
	on(ResourceActions.createResourceViewSuccess, (state, { view }) => ({
		...state,
		view,
		status: AsyncRequestState.SUCCESS,
	})),
	on(ResourceActions.createResourceViewFailure, (state, { error }) => ({
		...state,
		error,
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
	// approveOrDenyView
	on(ResourceActions.approveOrDenyRevision, state => ({ ...state, status: AsyncRequestState.LOADING })),
	on(ResourceActions.approveOrDenyRevisionSuccess, (state, { approveOrDeny }) => ({
		...state,
		approveOrDeny,
		status: AsyncRequestState.SUCCESS,
	})),
	on(ResourceActions.approveOrDenyRevisionFailure, (state, { error }) => ({
		...state,
		error,
	})),
);
