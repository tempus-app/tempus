import { ApiProperty } from '@nestjs/swagger';
import { ICreateResourceDto, RoleType } from '@tempus/shared-domain';
import { CreateCertificationDto } from '../../profile-dtos/certification/createCertification.dto';
import { CreateEducationDto } from '../../profile-dtos/education/createEduation.dto';
import { CreateExperienceDto } from '../../profile-dtos/experience/createExperience.dto';
import { CreateSkillDto } from '../../profile-dtos/skill/createSkill.dto';
import { CreateLocationDto } from '../../common-dtos/createLocation.dto';
import { CreateUserDto } from './create-user.dto';
import { CreateTimesheetDto } from '../../timesheet-dtos/timesheet/createTimesheet.dto';

export class CreateResourceDto extends CreateUserDto implements ICreateResourceDto {
	@ApiProperty()
	linkId: number;

	@ApiProperty({ enum: ['ASSIGNED_RESOURCE', 'AVAILABLE_RESOURCE', 'SUPERVISOR'] })
	override roles: RoleType[];

	@ApiProperty()
	phoneNumber: string;

	@ApiProperty()
	calEmail: string;

	@ApiProperty()
	linkedInLink: string;

	@ApiProperty()
	githubLink: string;

	@ApiProperty()
	otherLink: string;

	@ApiProperty()
	title: string;

	@ApiProperty()
	location: CreateLocationDto;

	@ApiProperty()
	experiences: CreateExperienceDto[];

	@ApiProperty()
	educations: CreateEducationDto[];

	@ApiProperty()
	skills: CreateSkillDto[];

	@ApiProperty()
	certifications: CreateCertificationDto[];

	@ApiProperty()
	timesheets: CreateTimesheetDto[];

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
		calEmail: string,
		title: string,
		linkedInLink: string,
		githubLink: string,
		otherLink: string,
		location: CreateLocationDto,
		experiences: CreateExperienceDto[],
		educations: CreateEducationDto[],
		skills: CreateSkillDto[],
		certifications: CreateCertificationDto[],
		timesheets: CreateTimesheetDto[],
		experiencesSummary: string,
		profileSummary: string,
		educationsSummary: string,
		skillsSummary: string,
		linkId: number,
	) {
		super(firstName, lastName, email, password, roles);
		this.roles = roles;
		this.phoneNumber = phoneNumber;
		this.calEmail = calEmail;
		this.title = title;
		this.location = location;
		this.experiences = experiences;
		this.educations = educations;
		this.skills = skills;
		this.certifications = certifications;
		this.timesheets = timesheets;
		this.experiencesSummary = experiencesSummary;
		this.educationsSummary = educationsSummary;
		this.profileSummary = profileSummary;
		this.skillsSummary = skillsSummary;
		this.linkedInLink = linkedInLink;
		this.githubLink = githubLink;
		this.otherLink = otherLink;
		this.linkId = linkId;
	}
}
