import { createReducer, on } from '@ngrx/store';
import { AsyncRequestState } from '@tempus/client/onboarding-client/shared/data-access';
import { View } from '@tempus/shared-domain';
import * as ResourceActions from './resource.actions';

export const RESOURCE_INFO_FEATURE_KEY = 'resource';

export interface ResourceState {
	firstName: string | null;
	lastName: string | null;
	email: string | null;
	views: View[] | null;
	totalViewsData: number;
}

export const initialState: ResourceState = {
	firstName: null,
	lastName: null,
	email: null,
	views: null,
	totalViewsData: 0,
};

export const resourceReducer = createReducer(
	initialState,
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
);
