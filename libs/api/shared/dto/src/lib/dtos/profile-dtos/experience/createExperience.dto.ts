import { ApiProperty } from '@nestjs/swagger';
import { ICreateExperienceDto } from '@tempus/shared-domain';
import { CreateLocationDto } from '../../common-dtos';

export class CreateExperienceDto implements ICreateExperienceDto {
	@ApiProperty()
	title: string;

	@ApiProperty()
	summary: string;

	@ApiProperty()
	description: string[];

	@ApiProperty()
	company: string;

	@ApiProperty()
	startDate: Date;

	@ApiProperty()
	endDate: Date | null;

	@ApiProperty()
	location: CreateLocationDto;

	constructor(
		title: string,
		summary: string,
		description: string[],
		company: string,
		startDate: Date,
		endDate: Date | null,
		location: CreateLocationDto,
	) {
		this.title = title;
		this.summary = summary;
		this.description = description;
		this.company = company;
		this.startDate = startDate;
		this.endDate = endDate;
		this.location = location;
	}
}
