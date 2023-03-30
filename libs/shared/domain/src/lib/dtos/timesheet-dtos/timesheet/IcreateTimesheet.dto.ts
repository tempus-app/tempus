export interface ICreateTimesheetDto {
	id?: number;
	weekStartDate?: Date;
	weekEndDate?: Date;
	approvedBySupervisor?: boolean;
	approvedByClient?: boolean;
	supervisorComment?: string;
	clientRepresentativeComment?: string;
	audited?: boolean;
	billed?: boolean;
}
