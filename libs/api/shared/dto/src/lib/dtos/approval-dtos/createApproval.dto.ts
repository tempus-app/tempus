import { ApiProperty } from '@nestjs/swagger';
import { ICreateApprovalDto } from '@tempus/shared-domain';

export class CreateApprovalDto implements ICreateApprovalDto {
	@ApiProperty()
	id: number;

	@ApiProperty()
	timesheetWeek?: string;

	@ApiProperty()
	submittedBy?: number;

	@ApiProperty()
	submissionDate?: string;

	@ApiProperty()
	time?: number;

	@ApiProperty()
	project?: string;

	constructor(
		id?: number,
		timesheetWeek?: string,
		submittedBy?: number,
		submissionDate?: string,
		time?: number,
		project?: string,
	) {
		this.id = id;
		this.timesheetWeek = timesheetWeek;
		this.submittedBy = submittedBy;
		this.submissionDate = submissionDate;
		this.time = time;
		this.project = project;
	}
}
