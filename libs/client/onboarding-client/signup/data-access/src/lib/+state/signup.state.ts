import { ActionReducerMap, createFeatureSelector } from '@ngrx/store';
import { linkReducer, LinkState, LINK_FEATURE_KEY } from './link/link.reducers';
import { resourceReducer, ResourceState, RESOURCE_FEATURE_KEY } from './createResource/createResource.reducers';

export const SIGNUP_FEATURE_KEY = 'signup';

export interface SignupState {
	[LINK_FEATURE_KEY]: LinkState;
	[RESOURCE_FEATURE_KEY]: ResourceState;
}

export const reducers: ActionReducerMap<SignupState> = {
	[LINK_FEATURE_KEY]: linkReducer,
	[RESOURCE_FEATURE_KEY]: resourceReducer,
};

export const selectSignupState = createFeatureSelector<SignupState>(SIGNUP_FEATURE_KEY);
