// import { TimesheetEntryEntity } from 'libs/api/shared/entity/src/lib/entities/timesheet-entities/timesheet-entry.entity';
// import { Resource } from '../account-models';

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
	// timesheetEntry: TimesheetEntryEntity[];
}
