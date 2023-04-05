import { ApiProperty } from '@nestjs/swagger';
import { ICreateApprovalDto } from '@tempus/shared-domain';

export class CreateApprovalDto implements ICreateApprovalDto {
	@ApiProperty()
	id: number;

	@ApiProperty()
	timesheetWeek: string;

	@ApiProperty()
	submittedBy: string;

	@ApiProperty()
	submissionDate: string;

	@ApiProperty()
	time: string;

	@ApiProperty()
	project: string;

	constructor(
		id: number,
		timesheetWeek: string,
		submittedBy: string,
		submissionDate: string,
		time: string,
		project: string,
	) {
		this.id = id;
		this.timesheetWeek = timesheetWeek;
		this.submittedBy = submittedBy;
		this.submissionDate = submissionDate;
		this.time = time;
		this.project = project;
	}
}
