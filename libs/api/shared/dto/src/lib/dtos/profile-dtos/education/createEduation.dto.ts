import { ApiProperty } from '@nestjs/swagger';
import { ICreateEducationDto } from '@tempus/shared-domain';
import { CreateLocationDto } from '../../common-dtos';

export class CreateEducationDto implements ICreateEducationDto {
	@ApiProperty()
	degree: string;

	@ApiProperty()
	institution: string;

	@ApiProperty()
	startDate: Date;

	@ApiProperty()
	endDate: Date | null;

	@ApiProperty()
	location: CreateLocationDto;

	constructor(degree: string, institution: string, startDate: Date, endDate: Date | null, location: CreateLocationDto) {
		this.degree = degree;
		this.institution = institution;
		this.startDate = startDate;
		this.endDate = endDate;
		this.location = location;
	}
}
