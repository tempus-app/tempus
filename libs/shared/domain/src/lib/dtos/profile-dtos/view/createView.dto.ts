import { ApiProperty } from '@nestjs/swagger';
import { ViewType } from '../../../enums';
import { CreateCertificationDto } from '../certification';
import { CreateEducationDto } from '../education';
import { CreateExperienceDto } from '../experience';
import { CreateSkillDto } from '../skill';

export class CreateViewDto {
	@ApiProperty()
	skillsSummary: string;

	@ApiProperty()
	profileSummary: string;

	@ApiProperty()
	educationsSummary: string;

	@ApiProperty()
	experiencesSummary: string;

	@ApiProperty()
	type: string;

	@ApiProperty()
	skills: CreateSkillDto[];

	@ApiProperty()
	experiences: CreateExperienceDto[];

	@ApiProperty()
	educations: CreateEducationDto[];

	@ApiProperty()
	certifications: CreateCertificationDto[];

	@ApiProperty({ enum: ['PRIMARY', 'SECONDARY'] })
	viewType: ViewType;

	constructor(
		skills: CreateSkillDto[],
		experiences: CreateExperienceDto[],
		educations: CreateEducationDto[],
		certifications: CreateCertificationDto[],
		viewType: ViewType,
		type: string,
		skillsSummary: string,
		profileSummary: string,
		educationsSummary: string,
		experiencesSummary: string,
	) {
		this.skills = skills;
		this.experiences = experiences;
		this.educations = educations;
		this.viewType = viewType;
		this.skillsSummary = skillsSummary;
		this.profileSummary = profileSummary;
		this.educationsSummary = educationsSummary;
		this.experiencesSummary = experiencesSummary;
		this.certifications = certifications;
		this.type = type;
	}
}
