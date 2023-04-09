import { createSelector } from '@ngrx/store';
import { TIMESHEET_VIEW_FEATURE_KEY, TimesheetState } from './view-resource-timesheets.reducers';
import { TempusResourceState, selectResourceState } from '../resource.state';

export const selectTimesheetViewState = createSelector(
	selectResourceState,
	(state: TempusResourceState) => state[TIMESHEET_VIEW_FEATURE_KEY],
);

export const selectResourceTimesheets = createSelector(selectTimesheetViewState, (state: TimesheetState) => {
	return {
		timesheets: state.timesheets,
		totalTimesheets: state.totalTimesheetsData,
	};
});
