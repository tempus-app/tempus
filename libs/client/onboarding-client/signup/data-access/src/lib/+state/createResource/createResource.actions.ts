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
export const createResumeUpload = createAction(
	'[Signup Resume Upload Page] Create Resume Upload',
	props<{ resume: File }>(),
);
export const createUserDetails = createAction(
	'[Signup MyInfoOne Page] Create User Details',
	props<{
		firstName: string;
		lastName: string;
		phoneNumber: string;
		linkedInLink: string;
		githubLink: string;
		otherLink: string;
		location: ICreateLocationDto;
		profileSummary: string;
	}>(),
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

export const setResourceLinkId = createAction(
	'[Signup Credentials Page] Set Resource Link Id',
	props<{
		linkId: number;
	}>(),
);

export const createResource = createAction('[Signup Review Page] Create Resource');

export const resetCreateResourceState = createAction('[Signup Review Page] Reset Create Resource State');

export const createResourceSuccess = createAction('[Onboarding Client User API] Create Resource Success');

export const createResourceFailure = createAction(
	'[Onboarding Client User API] Create Resource Failure',
	props<{
		error: Error;
	}>(),
);
