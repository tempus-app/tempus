import { createReducer, on } from '@ngrx/store';
import { AsyncRequestState } from '@tempus/client/onboarding-client/shared/data-access';
import * as ResourceActions from './resource.actions';

export const TEST_FEATURE_KEY = 'test';

export interface ResourceState {
	firstName: string | null;
	lastName: string | null;
	email: string | null;
}

export const initialState: ResourceState = {
	firstName: null,
	lastName: null,
	email: null,
};

export const testReducer = createReducer(
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
);
