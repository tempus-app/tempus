import { createAction, props } from '@ngrx/store';
import {
	Client,
	IAssignProjectDto,
	ICreateClientDto,
	ICreateLinkDto,
	ICreateProjectDto,
	IResourceBasicDto,
	IUserProjClientDto,
	Project,
	ProjectStatus,
	RevisionType,
	RoleType,
	View,
} from '@tempus/shared-domain';

export const getAllResProjInfo = createAction(
	'[Onboarding Client Manage Resources Page] Get All Resources Project Info',
	props<{
		pageSize: number;
		page: number;
		filter: string;
		roleType?: RoleType[];
		country?: string;
		province?: string;
	}>(),
);
export const getAllResProjInfoSuccess = createAction(
	'[Onboarding Client Resource API] Get All Resources Project Success',
	props<{ projResClientData: IUserProjClientDto[]; totalItems: number }>(),
);
export const getAllResProjInfoFailure = createAction(
	'[Onboarding Client Resource API] Get All Resources Project Failure',
	props<{ error: Error }>(),
);

export const getAllResourceInfoBasic = createAction(
	'[Onboarding Client Manage Resources Page] Get All Resource Info Basic',
);
export const getAllResourceInfoBasicSuccess = createAction(
	'[Onboarding Client Project API] Get All Resource Info Basic Success',
	props<{ resourceBasicData: IResourceBasicDto[] }>(),
);
export const getAllResourceInfoBasicFailure = createAction(
	'[Onboarding Client Project API] Get All Resource Info Basic Failure',
	props<{ error: Error }>(),
);

export const getAllSearchableTerms = createAction('[Onboarding Client Manage Resources Page] Get All Searchable Terms');
export const getAllSearchableTermsSuccess = createAction(
	'[Onboarding Client Project API] Get All Searchable Terms Success',
	props<{ searchableTerms: string[] }>(),
);
export const getAllSearchableTermsFailure = createAction(
	'[Onboarding Client Project API] Get All Resource Info Basic Failure',
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

export const getAllProjectInfo = createAction(
	'[Onboarding Client Project API] Get All Projects Info',
	props<{ pageSize: number; page: number }>(),
);
export const getAllProjectInfoSuccess = createAction(
	'[Onboarding Client Project API] Get All Projects Info Success',
	props<{ projects: Project[]; totalItems: number }>(),
);
export const getAllProjectInfoFailure = createAction(
	'[Onboarding Client Project API]  Get All Projects Info Failure',
	props<{ error: Error }>(),
);

export const updateProjStatus = createAction(
	'[Onboarding Client Project API] Update Project Status',
	props<{ projId: number; status: ProjectStatus }>(),
);
export const updateProjStatusSuccess = createAction('[Onboarding Client Project API] Update Project Status Success');
export const updateProjStatusFailure = createAction(
	'[Onboarding Client Project API]  Update Project Status Failure',
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

export const getAllViewsByStatus = createAction(
	'[Onboarding Profile Views API] Get All Views By Status',
	props<{ status: RevisionType; pageNum: number; pageSize: number }>(),
);

export const getAllViewsByStatusSuccess = createAction(
	'[Onboarding Profile Views API] Get All Views By Status Success',
	props<{ views: View[]; totalPendingApprovals: number }>(),
);

export const getAllViewsByStatusFailure = createAction(
	'[Onboarding Profile Views API] Get All Views By Status Failure',
	props<{ error: Error }>(),
);

export const deleteResource = createAction(
	'[Onboarding Client Resource API] Delete Resource',
	props<{ resourceId: number }>(),
);

export const deleteResourceSuccess = createAction(
	'[Onboarding Client Resource API] Delete Resource Success',
	props<{ resourceId: number }>(),
);

export const deleteResourceFailure = createAction(
	'[Onboarding Client Resource API] Delete Resource Failure',
	props<{ error: Error }>(),
);
