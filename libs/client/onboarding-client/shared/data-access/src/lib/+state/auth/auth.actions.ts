import { createAction, props } from '@ngrx/store';

export const login = createAction(
	'[Onboarding Client Signin Page] Login',
	props<{ password: string; email: string }>(),
);
export const loginSuccess = createAction(
	'[Onboarding Client Auth Api] Login Success',
	props<{ accessToken: string; loggedInUserId: number; firstName: string; lastName: string; email: string }>(),
);
export const loginFailure = createAction('[Onboarding Client Auth Api] Login Failure', props<{ error: Error }>());
export const logout = createAction('[Onboarding Client Any Page] Logout');
