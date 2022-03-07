import { ApiProperty } from '@nestjs/swagger';
import { ExperienceEntity } from '../../..';
import { CreateLocationDto } from '../../common-dtos';

export class CreateExperienceDto {
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
	endDate: Date;

	@ApiProperty()
	location: CreateLocationDto;

	constructor(
		title: string,
		summary: string,
		description: string[],
		company: string,
		startDate: Date,
		endDate: Date,
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

	public static toEntity(dto: CreateExperienceDto): ExperienceEntity {
		if (dto == null) return new ExperienceEntity();
		return new ExperienceEntity(
			undefined,
			dto.title,
			dto.company,
			dto.summary,
			dto.description,
			dto.startDate,
			dto.endDate,
			CreateLocationDto.toEntity(dto.location),
		);
	}
}
