import { createAction, props } from '@ngrx/store';
import { RoleType } from '@tempus/shared-domain';

export const login = createAction(
	'[Onboarding Client Signin Page] Login',
	props<{ password: string; email: string }>(),
);
export const loginSuccess = createAction(
	'[Onboarding Client Auth Api] Login Success',
	props<{ accessToken: string; loggedInUserId: number; userRoles: RoleType[] }>(),
);
export const loginFailure = createAction('[Onboarding Client Auth Api] Login Failure', props<{ error: Error }>());
export const logout = createAction('[Onboarding Client Any Page] Logout');
