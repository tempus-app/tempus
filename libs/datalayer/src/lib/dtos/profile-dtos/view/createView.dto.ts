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
	type: string;

	@ApiProperty()
	skills: SkillEntity[];

	@ApiProperty()
	experiences: ExperienceEntity[];

	@ApiProperty()
	educations: EducationEntity[];

	@ApiProperty()
	certifications: CertificationEntity[];

	@ApiProperty({ enum: ['PRIMARY', 'SECONDARY'] })
	viewType: ViewType;

	constructor(
		skills: SkillEntity[],
		experiences: ExperienceEntity[],
		educations: EducationEntity[],
		certifications: CertificationEntity[],
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

	public static toEntity(dto: CreateViewDto): ViewEntity {
		if (dto == null) return new ViewEntity();
		return new ViewEntity(
			null,
			dto.profileSummary,
			dto.skillsSummary,
			dto.educationsSummary,
			dto.experiencesSummary,
			dto.type,
			[],
			dto.skills,
			dto.experiences,
			dto.educations,
			dto.certifications,
			null,
			dto.viewType,
		);
	}
}
