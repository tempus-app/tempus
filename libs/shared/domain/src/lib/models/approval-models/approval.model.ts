import { Timestamp } from 'typeorm';

export interface Approval {
	id: number;
	timesheetWeek?: string;
	submittedBy?: number;
	submissionDate?: string;
	time?: Timestamp;
	project?: string;
}
