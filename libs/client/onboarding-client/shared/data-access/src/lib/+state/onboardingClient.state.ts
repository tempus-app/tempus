import { ActionReducerMap, createFeatureSelector } from '@ngrx/store';
import { authReducer, AuthState, AUTH_FEATURE_KEY } from './auth/auth.reducers';
import { resourceReducer, ResourceState, RESOURCE_INFO_FEATURE_KEY } from './resource/resource.reducers';

export const ONBOARDING_CLIENT_FEATURE_KEY = 'onboardingClient';

export interface OnboardingClientState {
	[AUTH_FEATURE_KEY]: AuthState;
	[RESOURCE_INFO_FEATURE_KEY]: ResourceState;
}

export const reducers: ActionReducerMap<OnboardingClientState> = {
	[AUTH_FEATURE_KEY]: authReducer,
	[RESOURCE_INFO_FEATURE_KEY]: resourceReducer,
};

export const selectOnboardingClientState = createFeatureSelector<OnboardingClientState>(ONBOARDING_CLIENT_FEATURE_KEY);
