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
	tokenId?: number;

	roles: RoleType[];

	phoneNumber: string;

	title: string;

	personalURL: string;

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
