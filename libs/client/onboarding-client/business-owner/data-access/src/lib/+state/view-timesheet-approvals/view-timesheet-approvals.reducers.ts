import { createReducer, on } from '@ngrx/store';
import { AsyncRequestState } from '@tempus/client/onboarding-client/shared/data-access';
import * as TimesheetActions from './view-timesheet-approvals.actions';
import { Timesheet } from '@tempus/shared-domain';


export const TIMESHEET_MANAGE_FEATURE_KEY = 'timesheet';

export interface TimesheetState {
    timesheets: Timesheet[] | null;
	totalTimesheetsData: number;
}

export const initialState: TimesheetState = {
    timesheets: null,
	totalTimesheetsData: 0,
};

export const timesheetReducer = createReducer(
    initialState,
	on(TimesheetActions.getAllTimesheetsBySupervisorId, state => ({ ...state, status: AsyncRequestState.LOADING })),
	on(TimesheetActions.getAllTimesheetsBySupervisorIdSuccess, (state, { timesheets }) => ({
		...state,
		timesheets,
	})),
	on(TimesheetActions.getAllTimesheetsBySupervisorIdFailure, (state, { error }) => ({
		...state,
		status: AsyncRequestState.ERROR,
		error,
	})),


);