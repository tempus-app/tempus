import { Resource } from '../account-models';

export interface Timesheet {
	id: number;
	daysWorked: string;
	totalHoursWorked: number;
	comments: string;
	projects: string;
	audited: boolean;
	billed: boolean;
	resource: Resource;
}
