// import { TimesheetEntity } from '@tempus/api/shared/entity';
// import { Resource } from '../account-models';

export interface TimesheetEntry {
	id: number;
	date: Date;
	hoursWorked: number;
	startTime: number;
	endTime: number;
	// timesheetID: TimesheetEntity;
}
