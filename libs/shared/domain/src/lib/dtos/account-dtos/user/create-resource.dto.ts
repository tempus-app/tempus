import { ApiProperty } from '@nestjs/swagger';
import { RoleType } from '../../../enums';
import { CreateCertificationDto } from '../../profile-dtos/certification/createCertification.dto';
import { CreateEducationDto } from '../../profile-dtos/education/createEduation.dto';
import { CreateExperienceDto } from '../../profile-dtos/experience/createExperience.dto';
import { CreateSkillDto } from '../../profile-dtos/skill/createSkill.dto';
import { CreateViewDto } from '../../profile-dtos/view/createView.dto';
import { CreateLocationDto } from '../../common-dtos/createLocation.dto';
import { CreateProjectDto } from '../../project-dtos/project/createProject.dto';
import { CreateUserDto } from './create-user.dto';

export class CreateResourceDto extends CreateUserDto {
	@ApiProperty({ enum: ['ASSIGNED_RESOURCE', 'AVAILABLE_RESOURCE', 'SUPERVISOR'] })
	override roles: RoleType[];

	@ApiProperty()
	phoneNumber: string;

	@ApiProperty()
	title: string;

	@ApiProperty()
	location: CreateLocationDto;

	@ApiProperty()
	projects: CreateProjectDto[];

	@ApiProperty()
	views: CreateViewDto[];

	@ApiProperty()
	experiences: CreateExperienceDto[];

	@ApiProperty()
	educations: CreateEducationDto[];

	@ApiProperty()
	skills: CreateSkillDto[];

	@ApiProperty()
	certifications: CreateCertificationDto[];

	@ApiProperty()
	skillsSummary: string;

	@ApiProperty()
	profileSummary: string;

	@ApiProperty()
	educationsSummary: string;

	@ApiProperty()
	experiencesSummary: string;

	constructor(
		firstName: string,
		lastName: string,
		email: string,
		password: string,
		roles: RoleType[],
		phoneNumber: string,
		title: string,
		location: CreateLocationDto,
		projects: CreateProjectDto[],
		views: CreateViewDto[],
		experiences: CreateExperienceDto[],
		educations: CreateEducationDto[],
		skills: CreateSkillDto[],
		certifications: CreateCertificationDto[],
		experiencesSummary: string,
		profileSummary: string,
		educationsSummary: string,
		skillsSummary: string,
	) {
		super(firstName, lastName, email, password, roles);
		this.roles = roles;
		this.phoneNumber = phoneNumber;
		this.title = title;
		this.location = location;
		this.projects = projects;
		this.views = views;
		this.experiences = experiences;
		this.educations = educations;
		this.skills = skills;
		this.certifications = certifications;
		this.experiencesSummary = experiencesSummary;
		this.educationsSummary = educationsSummary;
		this.profileSummary = profileSummary;
		this.skillsSummary = skillsSummary;
	}
}
