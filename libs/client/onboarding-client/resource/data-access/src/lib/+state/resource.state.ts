import { ActionReducerMap, createFeatureSelector } from '@ngrx/store';
import { ResourceState, testReducer } from './resource/resource.reducers';

export const RESOURCE_FEATURE_KEY = 'resource';

export interface TempusResourceState {
	[RESOURCE_FEATURE_KEY]: ResourceState;
}

export const reducers: ActionReducerMap<TempusResourceState> = {
	[RESOURCE_FEATURE_KEY]: testReducer,
};

export const selectResourceState = createFeatureSelector<TempusResourceState>(RESOURCE_FEATURE_KEY);
