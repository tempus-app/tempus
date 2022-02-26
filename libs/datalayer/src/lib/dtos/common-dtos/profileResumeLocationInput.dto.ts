import { SlimLocationDto } from '.';
import { SlimEducationDto, SlimExperienceDto, SlimResourceDto } from '..';

export class ProfileResumeLocationInputDto {
	location: SlimLocationDto;
	data: SlimEducationDto | SlimExperienceDto | SlimResourceDto;

	constructor(location?: SlimLocationDto, data?: SlimEducationDto | SlimExperienceDto | SlimResourceDto) {
		this.location = location;
		this.data = data;
	}
}
