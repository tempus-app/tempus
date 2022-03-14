import { createFeatureSelector, createSelector, StateObservable } from '@ngrx/store';

import { selectSignupState, SignupState } from '../signup.state';
import { LinkState, LINK_FEATURE_KEY } from './link.reducers';

export const selectLink = createSelector(selectSignupState, (state: SignupState) => state[LINK_FEATURE_KEY]);

export const selectLinkData = createSelector(selectLink, (state: LinkState) => state.link);
export const selectLinkErrorStatus = createSelector(selectLink, (state: LinkState) => {
	return {
		status: state.status,
		error: state.error,
	};
});
