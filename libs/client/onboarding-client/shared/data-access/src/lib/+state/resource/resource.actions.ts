import { createAction, props } from '@ngrx/store';
import { IUpdateResourceDto, ProjectResource, View } from '@tempus/shared-domain';

export const getResourceInformation = createAction('[Onboarding Client User Api] Get Resource Information');

export const getResourceInformationSuccess = createAction(
	'[Onboarding Client User Api] Get Resource Information Success',
	props<{
		userId: number;
		firstName: string;
		lastName: string;
		email: string;
		phoneNumber: string;
		city: string;
		province: string;
		country: string;
		linkedInLink: string;
		githubLink: string;
		otherLink: string;
		projectResources: ProjectResource[];
	}>(),
);

export const getResourceInformationFailure = createAction(
	'[Onboarding Client User Api] Get Resource Information Failure',
	props<{ error: Error }>(),
);

export const getResourceInformationById = createAction(
	'[Onboarding Client User Api] Get Resource Information By Id',
	props<{ resourceId: number }>(),
);

export const getResourceInformationByIdSuccess = createAction(
	'[Onboarding Client User Api] Get Resource Information By Id Success',
	props<{
		firstName: string;
		lastName: string;
		email: string;
		phoneNumber: string;
		city: string;
		province: string;
		country: string;
		linkedInLink: string;
		githubLink: string;
		otherLink: string;
		projectResources: ProjectResource[];
	}>(),
);

export const getResourceInformationByIdFailure = createAction(
	'[Onboarding Client User Api] Get Resource Information By Id Failure',
	props<{ error: Error }>(),
);

export const updateUserInfo = createAction(
	'[Onboarding Client Api] Update Info',
	props<{
		updatedPersonalInformation: IUpdateResourceDto;
	}>(),
);

export const updateUserInfoSuccess = createAction(
	'[Onboarding Client Api] Update Info Success',
	props<{
		firstName: string;
		lastName: string;
		email: string;
	}>(),
);

export const updateInfoFailure = createAction(
	'[Onboarding Client Auth Api] Update Info Failure',
	props<{ error: Error }>(),
);

// get all views by resource id
export const getAllViewsByResourceId = createAction(
	'[Onboarding Client Profile Views API] Get All Views By Resource Id',
	props<{ resourceId: number; pageNum: number; pageSize: number }>(),
);

export const getAllViewsByResourceIdSuccess = createAction(
	'[Onboarding Client Profile Views API] Get All Views By Resource Id Success',
	props<{ views: View[]; totalViews: number }>(),
);

export const getAllViewsByResourceIdFailure = createAction(
	'[Onboarding Client Profile Views API] Get All Views By Resource Id Failure',
	props<{ error: Error }>(),
);

// get original resume by resource id
export const getResourceOriginalResumeById = createAction(
	'[Onboarding Client User API] Get Original Resume By Resource Id',
	props<{ resourceId: number }>(),
);

export const getResourceOriginalResumeByIdSuccess = createAction(
	'[Onboarding Client User API] Get Original Resume By Resource Id Success',
	props<{ resume: Blob }>(),
);

export const getResourceOriginalResumeByIdFailure = createAction(
	'[Onboarding Client User API] Get Original Resume By Resource Id Failure',
	props<{ error: Error }>(),
);

// download profile/resume
export const downloadProfileByViewId = createAction(
	'[Onboarding Client Profile Views API] Download Profile By View Id',
	props<{ viewId: number }>(),
);

export const downloadProfileByViewIdSuccess = createAction(
	'[Onboarding Client Profile Views API] Download Profile By View Id Success',
	props<{ resume: Blob }>(),
);

export const downloadProfileByViewIdFailure = createAction(
	'[Onboarding Client Profile Views API] Download Profile By View Id Failure',
	props<{ error: Error }>(),
);
