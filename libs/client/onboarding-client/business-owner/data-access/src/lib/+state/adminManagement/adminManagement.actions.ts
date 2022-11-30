import { createAction, props } from '@ngrx/store';
import { IUserBasicDto } from '@tempus/shared-domain';

export const getAllAdmin = createAction(
	'[Onboarding Client Admin Management Page] Get All Admin Info',
	props<{ pageSize: number; page: number; filter: string }>(),
);
export const getAllAdminSuccess = createAction(
	'[Onboarding Client Admin API] Get All Admin Success',
	props<{ userData: IUserBasicDto[]; totalItems: number }>(),
);
export const getAllAdminFailure = createAction(
	'[Onboarding Client Admin API] Get All Admin Failure',
	props<{ error: Error }>(),
);

export const getAllSearchableTerms = createAction('[Onboarding Client Admin Page] Get All Searchable Terms');
export const getAllSearchableTermsSuccess = createAction(
	'[Onboarding Client Admin API] Get All Searchable Terms Success',
	props<{ searchableTerms: string[] }>(),
);
export const getAllSearchableTermsFailure = createAction(
	'[Onboarding Client Admin API] Get All Resource Info Basic Failure',
	props<{ error: Error }>(),
);

export const resetProjManagementState = createAction(
	'[Onboarding Client Admin Management Page] Reset Proj Management State',
);

export const resetAsyncStatusState = createAction('[Onboarding Client Admin Management Page] Reset Async Status State');
