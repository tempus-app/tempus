import { ActionReducerMap, createFeatureSelector } from '@ngrx/store';
import {
	projectManagementReducer,
	ResourceProjectClientManagementState,
	PROJECT_MANAGE_FEATURE_KEY,
} from './resProjClientManagement/resProjClientManagement.reducers';

export const BUSINESS_OWNER_FEATURE_KEY = 'business_owner';

export interface BusinessOwnerState {
	[PROJECT_MANAGE_FEATURE_KEY]: ResourceProjectClientManagementState;
}

export const reducers: ActionReducerMap<BusinessOwnerState> = {
	[PROJECT_MANAGE_FEATURE_KEY]: projectManagementReducer,
};

export const selectBusinessOwnerState = createFeatureSelector<BusinessOwnerState>(BUSINESS_OWNER_FEATURE_KEY);
