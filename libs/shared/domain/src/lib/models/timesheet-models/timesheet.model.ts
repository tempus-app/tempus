import { Project, Resource, User } from '..';
import { TimesheetRevisionType } from '../../enums/timesheetRevisionType';
import { TimesheetEntry } from './timesheet-entry.model';

export interface Timesheet {
	id: number;
	weekStartDate: Date;
	weekEndDate: Date;
	approvedBySupervisor: boolean;
	approvedByClient: boolean;
	resourceComment: string;
	supervisorComment: string;
	clientRepresentativeComment: string;
	audited: boolean;
	billed: boolean;
	mondayHours: number;
	tuesdayHours: number;
	wednesdayHours: number;
	thursdayHours: number;
	fridayHours: number;
	saturdayHours: number;
	sundayHours: number;
	resource: Resource;
	project: Project;
	supervisor: User;
	status: TimesheetRevisionType;
	dateModified?: Date;
}
