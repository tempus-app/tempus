import { createReducer, on } from '@ngrx/store';
import { AsyncRequestState } from '@tempus/client/onboarding-client/shared/data-access';
import { Timesheet } from '@tempus/shared-domain';
import * as TimesheetActions from './view-resource-timesheets.actions';

export const TIMESHEET_VIEW_FEATURE_KEY = 'timesheet';

export interface TimesheetState {
	timesheets: Timesheet[];
	totalTimesheetsData: number;
}

export const initialState: TimesheetState = {
	timesheets: [],
	totalTimesheetsData: 0,
};

export const timesheetReducer = createReducer(
	initialState,
	on(TimesheetActions.getAllTimesheetsByResourceId, state => ({ ...state, status: AsyncRequestState.LOADING })),
	on(TimesheetActions.getAllTimesheetsByResourceIdSuccess, (state, { timesheets, totalTimesheets }) => ({
		...state,
		timesheets,
		totalTimesheetsData: totalTimesheets,
		status: AsyncRequestState.SUCCESS,
		error: null,
	})),
	on(TimesheetActions.getAllTimesheetsByResourceIdFailure, (state, { error }) => ({
		...state,
		status: AsyncRequestState.ERROR,
		error,
	})),
);
