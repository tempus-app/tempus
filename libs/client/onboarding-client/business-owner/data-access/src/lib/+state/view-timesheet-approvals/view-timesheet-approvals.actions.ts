import { createAction, props } from '@ngrx/store';
import { Timesheet } from '@tempus/shared-domain';

// get all views by resource id
export const getAllTimesheetsBySupervisorId = createAction(
	'[Onboarding Client Timesheets API] Get All Timesheets By Supervisor Id',
	props<{ supervisorId: number; pageNum: number; pageSize: number }>(),
);

export const getAllTimesheetsBySupervisorIdSuccess = createAction(
	'[Onboarding Client Timesheets API] Get All Timesheets By Supervisor Id Success',
	props<{ timesheets: Timesheet[]; totalTimesheets: number }>(),
);

export const getAllTimesheetsBySupervisorIdFailure = createAction(
	'[Onboarding Client Timesheets API] Get All Timesheets By Supervisor Id Failure',
	props<{ error: Error }>(),
);