import { ActionReducerMap, createFeatureSelector } from '@ngrx/store';
import { authReducer, AuthState, AUTH_FEATURE_KEY } from './auth/auth.reducers';

export const PROFILE_FEATURE_KEY = 'profile';

export interface ProfileState {
	[AUTH_FEATURE_KEY]: AuthState;
}

export const reducers: ActionReducerMap<ProfileState> = {
	[AUTH_FEATURE_KEY]: authReducer,
};

export const selectProfileState = createFeatureSelector<ProfileState>(PROFILE_FEATURE_KEY);
