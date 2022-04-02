import { createAction, props } from '@ngrx/store';
import { Client, IUserProjClientDto, Project } from '@tempus/shared-domain';

export const getAllResProjInfo = createAction(
	'[Onboarding Client Manage Resources Page] Get All Resources Project Info',
);
export const getAllResProjInfoSuccess = createAction(
	'[Onboarding Client Resource API] Get All Resources Project Success',
	props<{ projResClientData: IUserProjClientDto[] }>(),
);
export const getAllResProjInfoFailure = createAction(
	'[Onboarding Client Resource API] Get All Resources Project Failure',
	props<{ error: Error }>(),
);

export const getAllProjBasic = createAction('[Onboarding Client Manage Resources Page] Get All Projects Basic');
export const getAllProjBasicSuccess = createAction(
	'[Onboarding Client Project API] Get All Projects Basic Success',
	props<{ projBasicData: Project[] }>(),
);
export const getAllProjBasicFailure = createAction(
	'[Onboarding Client Project API] Get All Projects Basic Failure',
	props<{ error: Error }>(),
);

export const getAllClientsBasic = createAction('[Onboarding Client Manage Resources Page] Get All Clients Basic');
export const getAllClientsBasicSuccess = createAction(
	'[Onboarding Client Project API] Get All Clients Basic Success',
	props<{ clientBasicData: Client[] }>(),
);
export const getAllClientsBasicFailure = createAction(
	'[Onboarding Client Project API] Get All Clients Basic Failure',
	props<{ error: Error }>(),
);

export const resetProjManagementState = createAction(
	'[Onboarding Client Manage Resources Page] Reset Proj Management State',
);
