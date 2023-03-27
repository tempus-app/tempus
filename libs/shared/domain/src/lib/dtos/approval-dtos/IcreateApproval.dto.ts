import { Timestamp } from 'typeorm';

export interface ICreateApprovalDto {
	id?: number;
	timesheetWeek?: string;
	submittedBy?: number;
	submissionDate?: string;
	time?: Timestamp;
	project?: string;
}
