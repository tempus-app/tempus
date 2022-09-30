import { UpdateEducationDto, UpdateExperienceDto, UpdateLocationDto } from '@tempus/api/shared/dto';
import { EducationEntity, ExperienceEntity } from '@tempus/api/shared/entity';
import { Location } from '@tempus/shared-domain';

export const experienceEntity: ExperienceEntity = {
	id: null,
	company: 'company',
	title: 'title',
	summary: 'summary',
	description: [],
	startDate: new Date(1, 2, 3),
	endDate: new Date(1, 2, 3),
	location: {
		province: 'province',
		city: 'city',
		country: 'country',
	} as Location,
	resource: undefined,
};

export const updateExperienceDtoNullAndMissingData: UpdateExperienceDto = {
	id: 3,
	location: {
		city: 'new city',
	} as UpdateLocationDto,
	summary: 'new summary',
};
