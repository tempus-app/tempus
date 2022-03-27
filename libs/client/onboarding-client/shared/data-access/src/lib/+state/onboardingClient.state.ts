import { ActionReducerMap, createFeatureSelector } from '@ngrx/store';
import { authReducer, AuthState, AUTH_FEATURE_KEY } from './auth/auth.reducers';

export const ONBOARDING_CLIENT_FEATURE_KEY = 'onboardingClient';

export interface OnboardingClientState {
	[AUTH_FEATURE_KEY]: AuthState;
}

export const reducers: ActionReducerMap<OnboardingClientState> = {
	[AUTH_FEATURE_KEY]: authReducer,
};

export const selectOnboardingClientState = createFeatureSelector<OnboardingClientState>(ONBOARDING_CLIENT_FEATURE_KEY);
