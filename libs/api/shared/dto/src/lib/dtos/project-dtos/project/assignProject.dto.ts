import { ApiProperty } from '@nestjs/swagger';
import { IAssignProjectDto } from '@tempus/shared-domain';
import { IsNotEmpty } from 'class-validator';

export class AssignProjectDto implements IAssignProjectDto {
	@ApiProperty({ required: true })
	@IsNotEmpty()
	title: string;

	@ApiProperty()
	startDate?: Date;

	constructor(title: string, startDate?: Date) {
		this.title = title;
		this.startDate = startDate;
	}
}
