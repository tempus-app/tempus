import { ApiProperty } from '@nestjs/swagger';
import { ICreateProjectDto } from '@tempus/shared-domain';

export class CreateProjectDto implements ICreateProjectDto {
	@ApiProperty()
	name: string;

	@ApiProperty()
	startDate: Date;

	@ApiProperty()
	endDate: Date;

	@ApiProperty()
	hoursPerDay: number;

	constructor(name: string, startDate: Date, endDate: Date, hoursPerDay: number) {
		this.endDate = endDate;
		this.name = name;
		this.startDate = startDate;
		this.hoursPerDay = hoursPerDay;
	}
}
