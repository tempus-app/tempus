import { createReducer, on } from '@ngrx/store';
import { AsyncRequestState } from '@tempus/client/onboarding-client/shared/data-access';
import { Link } from '@tempus/shared-domain';

import * as LinkActions from './link.actions';

export const LINK_FEATURE_KEY = 'link';

export interface LinkState {
	link: Link | null;
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	error: any | null;
	status: AsyncRequestState;
}

export const initialState: LinkState = {
	link: null,
	error: null,
	status: AsyncRequestState.IDLE,
};

export const linkReducer = createReducer(
	initialState,
	on(LinkActions.loadLinkData, state => ({ ...state, status: AsyncRequestState.LOADING, error: null })),
	on(LinkActions.loadLinkDataSucess, (state, { link }) => ({
		...state,
		link,
		error: null,
		status: AsyncRequestState.SUCCESS,
	})),
	on(LinkActions.loadLinkDataFailure, (state, { error }) => ({ ...state, error, status: AsyncRequestState.ERROR })),
);
