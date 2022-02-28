import { CreateExperienceDto } from '../experience/createExperience.dto';
import { CreateSkillDto } from '../skill/createSkill.dto';
import { CreateEducationDto } from '../education/createEduation.dto';
import { ViewType } from '../../../enums';
import { ApiProperty } from '@nestjs/swagger';
import { ViewEntity } from '../../../entities/profile-entities/view.entity';
import { CreateSkillTypeDto } from '../skill/createSkillType.dto';
import { CertificationEntity, EducationEntity, ExperienceEntity, SkillEntity } from '../../..';
import { CreateCertificationDto } from '..';

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
	}

	public static toEntity(dto: CreateViewDto): ViewEntity {
		if (dto == null) return new ViewEntity();
		return new ViewEntity(
			null,
			dto.profileSummary,
			dto.skillsSummary,
			dto.educationsSummary,
			dto.experiencesSummary,
			'PROFILE',
			[],
			dto.skills as SkillEntity[],
			dto.experiences as ExperienceEntity[],
			dto.educations as EducationEntity[],
			dto.certifications as CertificationEntity[],
			null,
			ViewType.PRIMARY,
		);
	}
}
