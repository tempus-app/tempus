import { createAction, props } from '@ngrx/store';

export const login = createAction(
	'[Onboarding Client Signin Page] Login',
	props<{ password: string; email: string }>(),
);
export const loginSuccess = createAction(
	'[Onboarding Client Auth Api] Login Success',
	props<{
		accessToken: string;
		refreshToken: string;
		firstName: string;
		lastName: string;
		email: string;
	}>(),
);
export const loginFailure = createAction('[Onboarding Client Auth Api] Login Failure', props<{ error: Error }>());
// export const updateInfoFailure = createAction(
// 	'[Onboarding Client Auth Api] Update Info Failure',
// 	props<{ error: Error }>(),
// );
export const logoutSuccess = createAction('[Onboarding Client Auth Api] Logout Success');
export const logoutFailure = createAction('[Onboarding Client Auth Api] Logout Failure', props<{ error: Error }>());
export const logout = createAction('[Onboarding Client Any Page] Logout', props<{ redirect: boolean }>());
export const refreshSuccess = createAction(
	'[Onboarding Client Auth Api] Refresh Success',
	props<{ accessToken: string; refreshToken: string }>(),
);
