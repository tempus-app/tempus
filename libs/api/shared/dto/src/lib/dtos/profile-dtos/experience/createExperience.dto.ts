import { ApiProperty } from '@nestjs/swagger';
import { ICreateExperienceDto } from '@tempus/shared-domain';
import { CreateLocationDto } from '../../common-dtos';

export class CreateExperienceDto implements ICreateExperienceDto {
	@ApiProperty()
	title: string;

	@ApiProperty()
	description: string[];

	@ApiProperty()
	company: string;

	@ApiProperty()
	startDate: Date;

	@ApiProperty()
	endDate: Date;

	@ApiProperty()
	location: CreateLocationDto;

	constructor(
		title: string,
		description: string[],
		company: string,
		startDate: Date,
		endDate: Date,
		location: CreateLocationDto,
	) {
		this.title = title;
		this.description = description;
		this.company = company;
		this.startDate = startDate;
		this.endDate = endDate;
		this.location = location;
	}
}
