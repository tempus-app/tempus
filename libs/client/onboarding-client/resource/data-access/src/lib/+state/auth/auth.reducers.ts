import { createReducer, on } from '@ngrx/store';
import { AsyncRequestState } from '@tempus/client/onboarding-client/shared/data-access';

import * as AuthActions from './auth.actions';

export const AUTH_FEATURE_KEY = 'auth';

export interface AuthState {
	accessToken: string | null;
	refreshToken: string | null;
	loggedInUserId: number | null;
	error: Error | null;
	status: AsyncRequestState;
}

export const initialState: AuthState = {
	accessToken: null,
	refreshToken: null,
	loggedInUserId: null,
	error: null,
	status: AsyncRequestState.IDLE,
};

export const authReducer = createReducer(
	initialState,
	on(AuthActions.login, state => ({ ...state, status: AsyncRequestState.LOADING })),
	on(AuthActions.loginSuccess, (state, { accessToken, loggedInUserId }) => ({
		...state,
		accessToken,
		loggedInUserId,
		status: AsyncRequestState.SUCCESS,
		error: null,
	})),
	on(AuthActions.loginFailure, (state, { error }) => ({
		...state,
		status: AsyncRequestState.ERROR,
		error,
	})),
	on(AuthActions.logout, state => ({ ...initialState })),
);
