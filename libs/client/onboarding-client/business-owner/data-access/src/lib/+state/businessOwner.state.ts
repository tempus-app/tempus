import { ActionReducerMap, createFeatureSelector } from '@ngrx/store';
import {
	projectManagementReducer,
	ResourceProjectClientManagementState,
	PROJECT_MANAGE_FEATURE_KEY,
} from './resProjClientManagement/resProjClientManagement.reducers';
import { RESOURCE_VIEW_FEATURE_KEY, viewReducer, ViewState } from './viewResources/viewResource.reducers';

export const BUSINESS_OWNER_FEATURE_KEY = 'business_owner';

export interface BusinessOwnerState {
	[PROJECT_MANAGE_FEATURE_KEY]: ResourceProjectClientManagementState;
	[RESOURCE_VIEW_FEATURE_KEY]: ViewState;
}

export const reducers: ActionReducerMap<BusinessOwnerState> = {
	[PROJECT_MANAGE_FEATURE_KEY]: projectManagementReducer,
	[RESOURCE_VIEW_FEATURE_KEY]: viewReducer,
};

export const selectBusinessOwnerState = createFeatureSelector<BusinessOwnerState>(BUSINESS_OWNER_FEATURE_KEY);
