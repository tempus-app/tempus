import { createSelector } from '@ngrx/store';
import { OnboardingClientState, selectOnboardingClientState } from '../onboardingClient.state';
import { AuthState, AUTH_FEATURE_KEY } from './auth.reducers';

export const selectAuth = createSelector(
	selectOnboardingClientState,
	(state: OnboardingClientState) => state[AUTH_FEATURE_KEY],
);

export const selectAccessTokenAndRoles = createSelector(selectAuth, (state: AuthState) => {
	return {
		accessToken: state.accessToken,
		roles: state.userRoles,
	};
});
export const selectLoggedInUserId = createSelector(selectAuth, (state: AuthState) => state.loggedInUserId);
export const selectLoginStatus = createSelector(selectAuth, (state: AuthState) => {
	return {
		status: state.status,
		error: state.error,
	};
});
