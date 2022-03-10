import { createReducer, on } from '@ngrx/store';
import { Link } from '@tempus/shared-domain';

import * as LinkActions from './link.actions';

export const LINK_FEATURE_KEY = 'link';

export interface LinkState {
	link: Link;
	error: string | null;
	status: 'pending' | 'loading' | 'error' | 'success';
}

export const initialState: LinkState = {
	link: {} as Link,
	error: null,
	status: 'pending',
};

export const linkReducer = createReducer(
	initialState,
	on(LinkActions.loadLinkData, state => ({ ...state, status: 'loading', error: null })),
	on(LinkActions.loadLinkDataSucess, (state, { link }) => ({
		...state,
		link,
		error: null,
		status: 'success',
	})),
	on(LinkActions.loadLinkDataFailure, (state, { error }) => ({ ...state, error, status: 'error' })),
);
