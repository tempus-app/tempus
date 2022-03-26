import { createSelector } from '@ngrx/store';
import { ProfileState, selectProfileState } from '../profile.state';
import { AuthState, AUTH_FEATURE_KEY } from './auth.reducers';

export const selectAuth = createSelector(selectProfileState, (state: ProfileState) => state[AUTH_FEATURE_KEY]);

export const selectAccessToken = createSelector(selectAuth, (state: AuthState) => state.accessToken);
export const selectLoggedInUserId = createSelector(selectAuth, (state: AuthState) => state.loggedInUserId);
export const selectLoginStatus = createSelector(selectAuth, (state: AuthState) => {
	return {
		status: state.status,
		error: state.error,
	};
});
