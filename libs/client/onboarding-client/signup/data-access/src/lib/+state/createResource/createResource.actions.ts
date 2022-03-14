import { createAction, props } from '@ngrx/store';
import {
	ICreateCertificationDto,
	ICreateEducationDto,
	ICreateExperienceDto,
	ICreateLocationDto,
	ICreateSkillDto,
} from '@tempus/shared-domain';

export const createCredentials = createAction(
	'[Signup Credentials Page] Create Credentials',
	props<{ password: string; email: string }>(),
);
export const createUserDetails = createAction(
	'[Signup MyInfoOne Page] Create User Details',
	props<{ firstName: string; lastName: string; phoneNumber: string; email: string; location: ICreateLocationDto }>(),
);
export const createWorkExperienceDetails = createAction(
	'[Signup MyInfoTwo Page] Create Work Experience Details',
	props<{ experiencesSummary: string; experiences: ICreateExperienceDto[] }>(),
);
export const createTrainingAndSkillDetails = createAction(
	'[Signup MyInfoThree Page] Create Training and Skill Details',
	props<{
		skillsSummary: string;
		educationsSummary: string;
		educations: ICreateEducationDto[];
		skills: ICreateSkillDto[];
		certifications: ICreateCertificationDto[];
	}>(),
);

export const createResource = createAction('[Signup Review Page] Create Resource');

export const createResourceSuccess = createAction('[Onboarding Client User API] Create Resource Success');

export const createResourceFailure = createAction(
	'[Onboarding Client User API] Create Resource Failure',
	props<{
		error: string;
	}>(),
);
