import { createAction, props } from '@ngrx/store';
import { IUpdateResourceDto, View } from '@tempus/shared-domain';

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

export const getAllViewsByResourceId = createAction(
	'[Onboarding Client Profile Views API] Get All Views By Resource Id',
	props<{ resourceId: number }>(),
);

export const getAllViewsByResourceIdSuccess = createAction(
	'[Onboarding Client Profile Views API] Get All Views By Resource Id Success',
	props<{ views: View[] }>(),
);

export const getAllViewsByResourceIdFailure = createAction(
	'[Onboarding Profile Views API] Get All Views By Resource Id Failure',
	props<{ error: Error }>(),
);
