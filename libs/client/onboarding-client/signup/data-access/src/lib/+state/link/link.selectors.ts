import { createSelector, StateObservable } from '@ngrx/store';

import { SignupState } from '../signup.state';
import { LinkState } from './link.reducers';

export const selectLink = (state: SignupState) => state.link;
export const selectLinkData = createSelector(selectLink, (state: LinkState) => state.link);
export const selectLinkErrorStatus = createSelector(selectLink, (state: LinkState) => {
	return {
		status: state.status,
		error: state.error,
	};
});
