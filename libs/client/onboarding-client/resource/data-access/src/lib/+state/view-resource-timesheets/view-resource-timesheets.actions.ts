import { createAction, props } from '@ngrx/store';
import { Timesheet } from '@tempus/shared-domain';

export const getAllTimesheetsByResourceId = createAction(
	'[Onboarding Client Timesheets API] Get All Timesheets By Resource Id',
	props<{ resourceId: number; pageNum: number; pageSize: number }>(),
);

export const getAllTimesheetsByResourceIdSuccess = createAction(
	'[Onboarding Client Timesheets API] Get All Timesheets By Resource Id Success',
	props<{ timesheets: Timesheet[]; totalTimesheets: number }>(),
);

export const getAllTimesheetsByResourceIdFailure = createAction(
	'[Onboarding Client Timesheets API] Get All Timesheets By Resource Id Failure',
	props<{ error: Error }>(),
);
