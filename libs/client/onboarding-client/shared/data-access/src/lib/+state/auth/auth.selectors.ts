import { createSelector } from '@ngrx/store';
import { OnboardingClientState, selectOnboardingClientState } from '../onboardingClient.state';
import { AuthState, AUTH_FEATURE_KEY } from './auth.reducers';

export const selectAuth = createSelector(
	selectOnboardingClientState,
	(state: OnboardingClientState) => state[AUTH_FEATURE_KEY],
);

export const selectAccessToken = createSelector(selectAuth, (state: AuthState) => state.accessToken);
export const selectAccessRefreshToken = createSelector(selectAuth, (state: AuthState) => ({
	accessToken: state.accessToken,
	refreshToken: state.refreshToken,
}));
export const selectLoggedInUserId = createSelector(selectAuth, (state: AuthState) => state.loggedInUserId);
export const selectAuthStatus = createSelector(selectAuth, (state: AuthState) => {
	return {
		status: state.status,
		error: state.error,
	};
});
export const selectLoggedInUserNameEmail = createSelector(selectAuth, (state: AuthState) => {
	return { firstName: state.firstName, lastName: state.lastName, email: state.email, roles: state.roles };
});
export const selectLoggedInRoles = createSelector(selectAuth, (state: AuthState) => {
	return { roles: state.roles };
});