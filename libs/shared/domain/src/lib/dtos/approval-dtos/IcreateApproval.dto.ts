export interface ICreateApprovalDto {
	id?: number;
	timesheetWeek?: string;
	submittedBy?: number;
	submissionDate?: string;
	time?: number;
	project?: string;
}
