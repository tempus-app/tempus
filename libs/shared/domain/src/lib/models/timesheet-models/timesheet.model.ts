import { Project, Resource } from '..';
import { TimesheetRevisionType } from '../../enums/timesheetRevisionType';
import { TimesheetEntry } from './timesheet-entry.model';

export interface Timesheet {
	id: number;
	weekStartDate: Date;
	weekEndDate: Date;
	approvedBySupervisor: boolean;
	approvedByClient: boolean;
	supervisorComment: string;
	clientRepresentativeComment: string;
	audited: boolean;
	billed: boolean;
	timesheetEntries: TimesheetEntry[];
	resource: Resource;
	project: Project;
	status: TimesheetRevisionType;
	dateModified?: Date;
}
