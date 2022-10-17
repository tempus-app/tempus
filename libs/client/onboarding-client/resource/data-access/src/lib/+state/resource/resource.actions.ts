import { createAction, props } from '@ngrx/store';
import { IUpdateResourceDto } from '@tempus/shared-domain';

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
