import { ApiProperty } from '@nestjs/swagger';
import { ICreateTimesheetDto } from '@tempus/shared-domain';

export class CreateTimesheetDto implements ICreateTimesheetDto {
	@ApiProperty()
	id: number;

	@ApiProperty()
	daysWorked: string;

	@ApiProperty()
	totalHoursWorked: number;

	@ApiProperty()
	comments: string;

	@ApiProperty()
	projects: string;

	@ApiProperty()
	audited: boolean;

	@ApiProperty()
	billed: boolean;

	constructor(
		id: number,
		daysWorked: string,
		totalHoursWorked: number,
		comments: string,
		projects: string,
		audited: boolean,
		billed: boolean,
	) {
		this.id = id;
		this.daysWorked = daysWorked;
		this.totalHoursWorked = totalHoursWorked;
		this.comments = comments;
		this.projects = projects;
		this.audited = audited;
		this.billed = billed;
	}
}
