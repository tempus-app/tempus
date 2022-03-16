import { createAction, props } from '@ngrx/store';

export const login = createAction('[Profile Signin Page] Login', props<{ password: string; email: string }>());
export const loginSuccess = createAction(
	'[Onboarding Client Auth Api] Login Success',
	props<{ accessToken: string; loggedInUserId: number }>(),
);
export const loginFailure = createAction('[Onboarding Client Auth Api] Login Failure', props<{ error: Error }>());
export const logout = createAction('[Profile Any Page] Logout');
