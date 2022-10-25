import { createAction, props } from '@ngrx/store';
import {
	Client,
	IAssignProjectDto,
	ICreateClientDto,
	ICreateLinkDto,
	ICreateProjectDto,
	IUserProjClientDto,
	Project,
} from '@tempus/shared-domain';

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

export const getAllClients = createAction('[Onboarding Client Manage Resources Page] Get All Clients');
export const getAllClientsSuccess = createAction(
	'[Onboarding Client Project API] Get All Clients Success',
	props<{ clientData: Client[] }>(),
);
export const getAllClientsBasicFailure = createAction(
	'[Onboarding Client Project API] Get All Clients Failure',
	props<{ error: Error }>(),
);

export const createLink = createAction(
	'[Onboarding Client Manage Resources Page] Create Link',
	props<{ createLinkDto: ICreateLinkDto }>(),
);
export const createLinkSuccess = createAction('[Onboarding Client Link API] Create Link Success');
export const createLinkFailure = createAction(
	'[Onboarding Client Link API] Create Link Failure',
	props<{ error: Error }>(),
);

export const createClient = createAction(
	'[Onboarding Client Project API] Create Client',
	props<{ createClientDto: ICreateClientDto }>(),
);
export const createClientSuccess = createAction(
	'[Onboarding Client Project API] Create Client Success',
	props<{ client: Client }>(),
);
export const createClientFailure = createAction(
	'[Onboarding Client Project API] Create Client Failure',
	props<{ error: Error }>(),
);

export const createProject = createAction(
	'[Onboarding Client Project API] Create Project',
	props<{ createProjectDto: ICreateProjectDto }>(),
);
export const createProjectSuccess = createAction(
	'[Onboarding Client Project API] Create Project Success',
	props<{ project: Project }>(),
);
export const createProjectFailure = createAction(
	'[Onboarding Client Project API] Create Project Failure',
	props<{ error: Error }>(),
);

export const createResourceProjectAssignment = createAction(
	'[Onboarding Client Manage Resources Page] Create Resource Project Assignment',
	props<{ resourceId: number; projectId: number; assignProjectDto: IAssignProjectDto }>(),
);
export const createResourceProjectAssignmentSuccess = createAction(
	'[Onboarding Client Project API] Create Resource Project Assignment Success',
);
export const createResourceProjectAssignmentFailure = createAction(
	'[Onboarding Client Project API] Create Resource Project Assignment Failure',
	props<{ error: Error }>(),
);

export const resetProjManagementState = createAction(
	'[Onboarding Client Manage Resources Page] Reset Proj Management State',
);

export const resetAsyncStatusState = createAction('[Onboarding Client Manage Resources Page] Reset Async Status State');

export const resetCreatedClientState = createAction(
	'[Onboarding Client Manage Resources Page] Reset Create Client State',
);
export const resetCreatedProjectState = createAction(
	'[Onboarding Client Manage Resources Page] Reset Create Project State',
);
