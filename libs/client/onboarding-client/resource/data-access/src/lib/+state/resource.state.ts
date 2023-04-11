import { ActionReducerMap, createFeatureSelector } from '@ngrx/store';
import { ResourceState, resourceReducer, RESOURCE_INFO_FEATURE_KEY } from './resource/resource.reducers';
import {
	TIMESHEET_VIEW_FEATURE_KEY,
	TimesheetState,
	timesheetReducer,
} from './view-resource-timesheets/view-resource-timesheets.reducers';

export const RESOURCE_FEATURE_KEY = 'resource';

export interface TempusResourceState {
	[RESOURCE_INFO_FEATURE_KEY]: ResourceState;
	[TIMESHEET_VIEW_FEATURE_KEY]: TimesheetState;
}

export const reducers: ActionReducerMap<TempusResourceState> = {
	[RESOURCE_INFO_FEATURE_KEY]: resourceReducer,
	[TIMESHEET_VIEW_FEATURE_KEY]: timesheetReducer,
};

export const selectResourceState = createFeatureSelector<TempusResourceState>(RESOURCE_FEATURE_KEY);
