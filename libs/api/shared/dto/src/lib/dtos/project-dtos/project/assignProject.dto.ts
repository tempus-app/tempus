import { ApiProperty } from '@nestjs/swagger';
import { IAssignProjectDto } from '@tempus/shared-domain';
import { IsNotEmpty } from 'class-validator';

export class AssignProjectDto implements IAssignProjectDto {
	@ApiProperty({ required: true })
	@IsNotEmpty()
	title: string;

	@ApiProperty()
	startDate?: Date;
	@ApiProperty()
	costRate?: number;
	@ApiProperty()
	billRate?: number;

	constructor(title: string, startDate?: Date, costRate?: number, billRate?: number) {
		this.title = title;
		this.startDate = startDate;
		this.costRate = costRate;
		this.billRate = billRate;
	}
}
