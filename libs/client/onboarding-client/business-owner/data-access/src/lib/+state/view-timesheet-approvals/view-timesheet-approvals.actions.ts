import { createAction, props } from '@ngrx/store';
import { IApproveTimesheetDto, Timesheet } from '@tempus/shared-domain';

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

export const updateTimesheetStatusAsSupervisor = createAction(
	'[Onboarding Client Timesheets API] Update Timesheet Status By Supervisor',
	props<{ timesheetId: number; approveTimesheetDto: IApproveTimesheetDto}>(),
);

export const updateTimesheetStatusAsSupervisorSuccess = createAction(
	'[Onboarding Client Timesheets API] Update Timesheet Status By Supervisor Success'
);

export const updateTimesheetStatusAsSupervisorFailure = createAction(
	'[Onboarding Client Timesheets API] Update Timesheet Status By Supervisor Failure',
	props<{ error: Error }>(),
);