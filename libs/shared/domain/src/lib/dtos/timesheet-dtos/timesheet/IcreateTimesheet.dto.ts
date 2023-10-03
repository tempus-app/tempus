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
	mondayHours?:number;
	tuesdayHours?:number;
	wednesdayHours?:number;
	thursdayHours?:number;
	fridayHours?:number;
	saturdayHours?:number;
	sundayHours?:number;
}
