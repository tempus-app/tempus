import { ActionReducerMap, createFeatureSelector } from '@ngrx/store';
import {
	projectManagementReducer,
	ResourceProjectClientManagementState,
	PROJECT_MANAGE_FEATURE_KEY,
} from './resProjClientManagement/resProjClientManagement.reducers';
import { RESOURCE_VIEW_FEATURE_KEY, viewReducer, ViewState } from './viewResources/viewResource.reducers';
import { TIMESHEET_MANAGE_FEATURE_KEY, TimesheetState, timesheetReducer } from './view-timesheet-approvals/view-timesheet-approvals.reducers';

export const BUSINESS_OWNER_FEATURE_KEY = 'business_owner';

export interface BusinessOwnerState {
	[PROJECT_MANAGE_FEATURE_KEY]: ResourceProjectClientManagementState;
	[RESOURCE_VIEW_FEATURE_KEY]: ViewState;
	[TIMESHEET_MANAGE_FEATURE_KEY]: TimesheetState;
}

export const reducers: ActionReducerMap<BusinessOwnerState> = {
	[PROJECT_MANAGE_FEATURE_KEY]: projectManagementReducer,
	[RESOURCE_VIEW_FEATURE_KEY]: viewReducer,
	[TIMESHEET_MANAGE_FEATURE_KEY]: timesheetReducer,
};

export const selectBusinessOwnerState = createFeatureSelector<BusinessOwnerState>(BUSINESS_OWNER_FEATURE_KEY);
