import { createAction, props } from '@ngrx/store';
import {
	ICreateCertificationDto,
	ICreateEducationDto,
	ICreateExperienceDto,
	ICreateLocationDto,
	ICreateSkillDto,
	LoadView,
} from '@tempus/shared-domain';

export const createUserProfileViews = createAction(
	'[View Resource Profile] View User Profiles',
	props<{
		loadedViews: LoadView;
	}>(),
);

export const createUserDetails = createAction(
	'[View Resource Profile] View User Details',
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
	'[View Resource Profile] View Work Experience Details',
	props<{ experiencesSummary: string; experiences: ICreateExperienceDto[] }>(),
);
export const createTrainingAndSkillDetails = createAction(
	'[View Resource Profile] View Training and Skill Details',
	props<{
		skillsSummary: string;
		educationsSummary: string;
		educations: ICreateEducationDto[];
		skills: ICreateSkillDto[];
		certifications: ICreateCertificationDto[];
	}>(),
);

export const viewResource = createAction('[View Resource Profile] View Resource');

export const resetCreateResourceState = createAction('[View Resource Profile] Reset View Resource State');

export const viewResourceSuccess = createAction('[Onboarding Client User API] View Resource Success');

export const viewResourceFailure = createAction(
	'[Onboarding Client User API] View Resource Failure',
	props<{
		error: Error;
	}>(),
);
