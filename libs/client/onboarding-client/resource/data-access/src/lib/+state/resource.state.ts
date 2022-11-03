import { ActionReducerMap, createFeatureSelector } from '@ngrx/store';
import { ResourceState, resourceReducer, RESOURCE_INFO_FEATURE_KEY } from './resource/resource.reducers';

export const RESOURCE_FEATURE_KEY = 'resource';

export interface TempusResourceState {
	[RESOURCE_INFO_FEATURE_KEY]: ResourceState;
}

export const reducers: ActionReducerMap<TempusResourceState> = {
	[RESOURCE_INFO_FEATURE_KEY]: resourceReducer,
};

export const selectResourceState = createFeatureSelector<TempusResourceState>(RESOURCE_FEATURE_KEY);
