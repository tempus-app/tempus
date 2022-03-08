import { ApiProperty } from '@nestjs/swagger';
import { CreateLocationDto } from '../../common-dtos';

export class CreateEducationDto {
	@ApiProperty()
	degree: string;

	@ApiProperty()
	institution: string;

	@ApiProperty()
	startDate: Date;

	@ApiProperty()
	endDate: Date;

	@ApiProperty()
	location: CreateLocationDto;

	constructor(degree: string, institution: string, startDate: Date, endDate: Date, location: CreateLocationDto) {
		this.degree = degree;
		this.institution = institution;
		this.startDate = startDate;
		this.endDate = endDate;
		this.location = location;
	}
}
