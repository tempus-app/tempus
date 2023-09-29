import { ICreateTimesheetEntryDto } from "../timesheet-entry";

export interface ICreateTimesheetDto {

	projectId?: number;
	resourceId?:number;
	supervisorId?: number;
	weekStartDate?: Date;
	weekEndDate?: Date;
	approvedBySupervisor?: boolean;
	approvedByClient?: boolean;
	supervisorComment?: string;
	clientRepresentativeComment?: string;
	audited?: boolean;
	billed?: boolean;
	timesheetEntries?: ICreateTimesheetEntryDto[];
}
