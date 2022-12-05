import { createAction, props } from '@ngrx/store';
import { ApproveViewDto } from '@tempus/api/shared/dto';
import { ICreateViewDto, IUpdateResourceDto, ProjectResource, Revision, View } from '@tempus/shared-domain';

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

// get view by id
export const getViewById = createAction(
	'[Onboarding Client Profile Views API] Get View By Id',
	props<{ viewId: number }>(),
);

export const getViewByIdSuccess = createAction(
	'[Onboarding Client Profile Views API] Get View By Id Success',
	props<{ view: View }>(),
);

export const getViewByIdFailure = createAction(
	'[Onboarding Client Profile Views API] Get View By Id Failure',
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

// edit resource view
export const editResourceView = createAction(
	'[Onboarding Client Profile Views API] Edit Resource View',
	props<{ viewId: number; newView: ICreateViewDto }>(),
);

export const editResourceViewSuccess = createAction(
	'[Onboarding Client Profile Views API] Edit Resource View Success',
	props<{ revision: Revision }>(),
);

export const editResourceViewFailure = createAction(
	'[Onboarding Client Profile Views API] Edit Resource View Failure',
	props<{ error: Error }>(),
);

// create resource view
export const createResourceView = createAction(
	'[Onboarding Client Profile Views API] Create Resource View',
	props<{ resourceId: number; newView: ICreateViewDto }>(),
);

export const createResourceViewSuccess = createAction(
	'[Onboarding Client Profile Views API] Create Resource View Success',
	props<{ view: View }>(),
);

export const createResourceViewFailure = createAction(
	'[Onboarding Client Profile Views API] Create Resource View Failure',
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

// approve or deny revision
export const approveOrDenyRevision = createAction(
	'[Onboarding Client Profile Views API] Approve Or Deny Revision',
	props<{ viewId: number; comment: string; approval: boolean }>(),
);

export const approveOrDenyRevisionSuccess = createAction(
	'[Onboarding Client Profile Views API] Approve Or Deny Revision Success',
	props<{ approveOrDeny: ApproveViewDto }>(),
);

export const approveOrDenyRevisionFailure = createAction(
	'[Onboarding Client Profile Views API] Approve Or Deny Revision Failure',
	props<{ error: Error }>(),
);
