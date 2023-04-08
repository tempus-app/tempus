import { createSelector } from '@ngrx/store';
import { TIMESHEET_MANAGE_FEATURE_KEY, TimesheetState } from './view-timesheet-approvals.reducers';
import { BUSINESS_OWNER_FEATURE_KEY, BusinessOwnerState, selectBusinessOwnerState } from '../businessOwner.state';

export const selectState = createSelector(
	selectBusinessOwnerState,
	(state: BusinessOwnerState) => state[TIMESHEET_MANAGE_FEATURE_KEY],
);

export const selectSupervisorTimesheets = createSelector(
	selectState, 
	(state: TimesheetState) => {
		return { 
			timesheets: state.timesheets, 
			totalTimesheets: state.totalTimesheetsData 
		};
	},
);