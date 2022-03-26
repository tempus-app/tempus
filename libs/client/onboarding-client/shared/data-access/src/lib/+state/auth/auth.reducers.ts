import { createReducer, on } from '@ngrx/store';
import { AsyncRequestState } from '../../enum';

import * as AuthActions from './auth.actions';

export const AUTH_FEATURE_KEY = 'auth';

export interface AuthState {
	accessToken: string | null;
	refreshToken: string | null;
	loggedInUserId: number | null;
	userRoles: string[];
	error: Error | null;
	status: AsyncRequestState;
}

export const initialState: AuthState = {
	accessToken: null,
	refreshToken: null,
	loggedInUserId: null,
	userRoles: [],
	error: null,
	status: AsyncRequestState.IDLE,
};

export const authReducer = createReducer(
	initialState,
	on(AuthActions.login, state => ({ ...state, status: AsyncRequestState.LOADING })),
	on(AuthActions.loginSuccess, (state, { accessToken, loggedInUserId, userRoles }) => ({
		...state,
		accessToken,
		loggedInUserId,
		userRoles,
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
