import { Timesheet } from './timesheet.model';

export interface TimesheetEntry {
	id: number;
	date: Date;
	hoursWorked: number;
	startTime: number;
	endTime: number;
	//timesheet: Timesheet;
}
