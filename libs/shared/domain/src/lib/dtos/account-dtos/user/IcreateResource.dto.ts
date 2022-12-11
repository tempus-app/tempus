import { RoleType } from '../../../enums';
import { ICreateLocationDto } from '../../common-dtos';
import {
	ICreateExperienceDto,
	ICreateSkillDto,
	ICreateCertificationDto,
	ICreateEducationDto,
} from '../../profile-dtos';
import { ICreateUserDto } from './IcreateUser.dto';

export interface ICreateResourceDto extends ICreateUserDto {
	linkId: number;

	roles: RoleType[];

	phoneNumber: string;

	calEmail: string;

	title: string;

	linkedInLink: string;

	githubLink: string;

	otherLink: string;

	location: ICreateLocationDto;

	experiences: ICreateExperienceDto[];

	educations: ICreateEducationDto[];

	skills: ICreateSkillDto[];

	certifications: ICreateCertificationDto[];

	skillsSummary: string;

	profileSummary: string;

	educationsSummary: string;

	experiencesSummary: string;
}
