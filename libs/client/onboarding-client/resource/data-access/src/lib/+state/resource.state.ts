import { ActionReducerMap, createFeatureSelector } from '@ngrx/store';
import { testReducer, TestState, TEST_FEATURE_KEY } from './test/test.reducers';

export const RESOURCE_FEATURE_KEY = 'resource';

export interface ResourceState {
	[TEST_FEATURE_KEY]: TestState;
}

export const reducers: ActionReducerMap<ResourceState> = {
	[TEST_FEATURE_KEY]: testReducer,
};

export const selectResourceState = createFeatureSelector<ResourceState>(RESOURCE_FEATURE_KEY);
