import { createReducer, on } from '@ngrx/store';
import { AsyncRequestState } from '@tempus/client/onboarding-client/shared/data-access';
import * as TimesheetActions from './view-timesheet-approvals.actions';
import { Timesheet } from '@tempus/shared-domain';


export const TIMESHEET_MANAGE_FEATURE_KEY = 'timesheet';

export interface TimesheetState {
    timesheets: Timesheet[];
	totalTimesheetsData: number;
	timesheetStatusUpdated: boolean;
}

export const initialState: TimesheetState = {
    timesheets: [],
	totalTimesheetsData: 0,
	timesheetStatusUpdated: false,
};

export const timesheetReducer = createReducer(
    initialState,
	on(TimesheetActions.getAllTimesheetsBySupervisorId, state => ({ ...state, status: AsyncRequestState.LOADING })),
	on(TimesheetActions.getAllTimesheetsBySupervisorIdSuccess, (state, { timesheets, totalTimesheets }) => ({
		...state,
		timesheets,
		totalTimesheetsData : totalTimesheets,
		status: AsyncRequestState.SUCCESS,
		error: null,
	})),
	on(TimesheetActions.getAllTimesheetsBySupervisorIdFailure, (state, { error }) => ({
		...state,
		status: AsyncRequestState.ERROR,
		error,
	})),
	on(TimesheetActions.updateTimesheetStatusAsSupervisor, state => ({
		...state,
		timesheetStatusUpdated: false,
		status: AsyncRequestState.LOADING,
	})),
	on(TimesheetActions.updateTimesheetStatusAsSupervisorFailure, (state, { error }) => ({
		...state,
		error,
		status: AsyncRequestState.ERROR,
	})),
	on(TimesheetActions.updateTimesheetStatusAsSupervisorSuccess, state => ({
		...state,
		timesheetStatusUpdated: true,
		status: AsyncRequestState.SUCCESS,
		error: null,
	})),


);