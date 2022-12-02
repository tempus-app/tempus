import { createReducer, on } from '@ngrx/store';
import { RoleType } from '@tempus/shared-domain';
import { AsyncRequestState } from '../../enum';

import * as AuthActions from './auth.actions';

export const AUTH_FEATURE_KEY = 'auth';

export interface AuthState {
	accessToken: string | null;
	refreshToken: string | null;
	loggedInUserId: number | null;
	firstName: string | null;
	lastName: string | null;
	email: string | null;
  roles: RoleType[];
	error: Error | null;
	status: AsyncRequestState;
}

export const initialState: AuthState = {
	accessToken: null,
	refreshToken: null,
	loggedInUserId: null,
	error: null,
	firstName: null,
	lastName: null,
	email: null,
  roles: [],
	status: AsyncRequestState.IDLE,
};

export const authReducer = createReducer(
	initialState,
	on(AuthActions.login, state => ({ ...state, status: AsyncRequestState.LOADING })),
	on(AuthActions.loginSuccess, (state, { accessToken, refreshToken, loggedInUserId, firstName, lastName, email, roles }) => ({
		...state,
		accessToken,
		refreshToken,
		loggedInUserId,
		firstName,
		lastName,
		email,
    roles,
		status: AsyncRequestState.SUCCESS,
		error: null,
	})),
	on(AuthActions.loginFailure, (state, { error }) => ({
		...state,
		status: AsyncRequestState.ERROR,
		error,
	})),
	on(AuthActions.logoutSuccess, () => ({ ...initialState })),
	on(AuthActions.logoutFailure, (state, { error }) => ({
		...state,
		status: AsyncRequestState.ERROR,
		error,
	})),
	on(AuthActions.refreshSuccess, (state, { accessToken, refreshToken }) => ({
		...state,
		accessToken,
		refreshToken,
	})),

	on(AuthActions.forgotPasswordFailure, (state, { error }) => ({
		...state,
		status: AsyncRequestState.ERROR,
		error,
	})),
	on(AuthActions.forgotPassword, state => ({ ...state, status: AsyncRequestState.LOADING })),
	on(AuthActions.forgotPasswordSuccess, state => ({ ...state, status: AsyncRequestState.SUCCESS })),

	on(AuthActions.resetPasswordFailure, (state, { error }) => ({
		...state,
		status: AsyncRequestState.ERROR,
		error,
	})),
	on(AuthActions.resetPassword, state => ({ ...state, status: AsyncRequestState.LOADING })),
	on(AuthActions.resetPasswordSuccess, state => ({ ...state, status: AsyncRequestState.SUCCESS })),
);
