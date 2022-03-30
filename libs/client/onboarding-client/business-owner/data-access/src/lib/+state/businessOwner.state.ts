import { ActionReducerMap, createFeatureSelector } from '@ngrx/store';
import { testReducer, TestState, TEST_FEATURE_KEY } from './test/test.reducers';

export const BUSINESS_OWNER_FEATURE_KEY = 'business_owner';

export interface BusinessOwnerState {
	[TEST_FEATURE_KEY]: TestState;
}

export const reducers: ActionReducerMap<BusinessOwnerState> = {
	[TEST_FEATURE_KEY]: testReducer,
};

export const selectBusinessOwnerState = createFeatureSelector<BusinessOwnerState>(BUSINESS_OWNER_FEATURE_KEY);
