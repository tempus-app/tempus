import { ViewType } from '../../../enums';
import { ICreateCertificationDto } from '../certification';
import { ICreateEducationDto } from '../education';
import { ICreateExperienceDto } from '../experience';
import { ICreateSkillDto } from '../skill';

export interface ICreateViewDto {
	skillsSummary: string;

	profileSummary: string;

	educationsSummary: string;

	experiencesSummary: string;

	skills: ICreateSkillDto[];

	experiences: ICreateExperienceDto[];

	educations: ICreateEducationDto[];

	certifications: ICreateCertificationDto[];

	viewType: ViewType;
}
