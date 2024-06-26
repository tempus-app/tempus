import { createReducer, on } from '@ngrx/store';
import { AsyncRequestState } from '@tempus/client/onboarding-client/shared/data-access';
import { Client, IResourceBasicDto, IUserProjClientDto, Project, View } from '@tempus/shared-domain';
import * as ProjectManagementActions from './resProjClientManagement.actions';

export const PROJECT_MANAGE_FEATURE_KEY = 'resProjClientManagement';

export interface ResourceProjectClientManagementState {
	deletedResource: number | null;
	createdProject: null | Project;
	error: Error | null;
	status: AsyncRequestState;
	projResClientData: IUserProjClientDto[];
	projResClientDataTotalItems: number;
	projAssigned: boolean;
	clients: Client[];
	createdClient: Client | null;
	resourcesBasic: IResourceBasicDto[];
	searchableTerms: string[];
	viewsData: View[] | null;
	totalViewsData: number;
	projects: Project[];
	projectsTotalItems: number;
	projStatusUpdated: boolean;
}

export const initialState: ResourceProjectClientManagementState = {
	error: null,
	deletedResource: null,
	status: AsyncRequestState.IDLE,
	projAssigned: false,
	projResClientData: [],
	projResClientDataTotalItems: 0,
	clients: [],
	resourcesBasic: [],
	searchableTerms: [],
	createdClient: null,
	createdProject: null,
	viewsData: [],
	totalViewsData: 0,
	projects: [],
	projectsTotalItems: 0,
	projStatusUpdated: false,
};

export const projectManagementReducer = createReducer(
	initialState,
	on(ProjectManagementActions.getAllClients, state => ({ ...state, status: AsyncRequestState.LOADING })),
	on(ProjectManagementActions.getAllResourceInfoBasic, state => ({ ...state, status: AsyncRequestState.LOADING })),
	on(ProjectManagementActions.getAllSearchableTerms, state => ({ ...state, status: AsyncRequestState.LOADING })),
	on(ProjectManagementActions.getAllResProjInfo, state => ({
		...state,
		status: AsyncRequestState.LOADING,
		projAssigned: false,
	})),
	on(ProjectManagementActions.updateProjStatus, state => ({
		...state,
		projStatusUpdated: false,
		status: AsyncRequestState.LOADING,
	})),
	on(ProjectManagementActions.createLink, state => ({ ...state, status: AsyncRequestState.LOADING })),
	on(ProjectManagementActions.createClient, state => ({ ...state, status: AsyncRequestState.LOADING })),
	on(ProjectManagementActions.createProject, state => ({ ...state, status: AsyncRequestState.LOADING })),

	on(ProjectManagementActions.createResourceProjectAssignment, state => ({
		...state,
		status: AsyncRequestState.LOADING,
		projAssigned: false,
	})),
	on(ProjectManagementActions.getAllClientsBasicFailure, (state, { error }) => ({
		...state,
		error,
		status: AsyncRequestState.ERROR,
	})),
	on(ProjectManagementActions.getAllResourceInfoBasicFailure, (state, { error }) => ({
		...state,
		error,
		status: AsyncRequestState.ERROR,
	})),
	on(ProjectManagementActions.getAllResProjInfoFailure, (state, { error }) => ({
		...state,
		error,
		status: AsyncRequestState.ERROR,
	})),
	on(ProjectManagementActions.updateProjStatusFailure, (state, { error }) => ({
		...state,
		error,
		status: AsyncRequestState.ERROR,
	})),
	on(ProjectManagementActions.getAllSearchableTermsFailure, (state, { error }) => ({
		...state,
		error,
		status: AsyncRequestState.ERROR,
	})),
	on(ProjectManagementActions.createLinkFailure, (state, { error }) => ({
		...state,
		error,
		status: AsyncRequestState.ERROR,
	})),

	on(ProjectManagementActions.createClientFailure, (state, { error }) => ({
		...state,
		error,
		status: AsyncRequestState.ERROR,
	})),

	on(ProjectManagementActions.createProjectFailure, (state, { error }) => ({
		...state,
		error,
		status: AsyncRequestState.ERROR,
	})),
	on(ProjectManagementActions.createResourceProjectAssignmentFailure, (state, { error }) => ({
		...state,
		error,
		status: AsyncRequestState.ERROR,
	})),

	on(ProjectManagementActions.getAllClientsSuccess, (state, { clientData }) => ({
		...state,
		clients: clientData,
		status: AsyncRequestState.SUCCESS,
		error: null,
	})),
	on(ProjectManagementActions.getAllResourceInfoBasicSuccess, (state, { resourceBasicData }) => ({
		...state,
		resourcesBasic: resourceBasicData,
		status: AsyncRequestState.SUCCESS,
		error: null,
	})),
	on(ProjectManagementActions.getAllSearchableTermsSuccess, (state, { searchableTerms }) => ({
		...state,
		searchableTerms,
		status: AsyncRequestState.SUCCESS,
		error: null,
	})),
	on(ProjectManagementActions.getAllResProjInfoSuccess, (state, { projResClientData, totalItems }) => ({
		...state,
		projResClientData,
		status: AsyncRequestState.SUCCESS,
		projResClientDataTotalItems: totalItems,
		error: null,
	})),
	on(ProjectManagementActions.updateProjStatusSuccess, state => ({
		...state,
		projStatusUpdated: true,
		status: AsyncRequestState.SUCCESS,
		error: null,
	})),
	on(ProjectManagementActions.createLinkSuccess, state => ({
		...state,
		status: AsyncRequestState.SUCCESS,
		error: null,
	})),

	on(ProjectManagementActions.createClientSuccess, (state, { client }) => ({
		...state,
		status: AsyncRequestState.SUCCESS,
		createdClient: client,
		error: null,
	})),

	on(ProjectManagementActions.createProjectSuccess, (state, { project }) => ({
		...state,
		status: AsyncRequestState.SUCCESS,
		createdProject: project,
		error: null,
	})),
	on(ProjectManagementActions.createResourceProjectAssignmentSuccess, state => ({
		...state,
		projAssigned: true,
		status: AsyncRequestState.SUCCESS,
		error: null,
	})),
	on(ProjectManagementActions.resetProjManagementState, () => ({
		...initialState,
	})),
	on(ProjectManagementActions.resetAsyncStatusState, state => ({
		...state,
		status: AsyncRequestState.IDLE,
		error: null,
	})),

	on(ProjectManagementActions.resetCreatedClientState, state => ({
		...state,
		createdClient: null,
	})),
	on(ProjectManagementActions.resetCreatedProjectState, state => ({
		...state,
		status: AsyncRequestState.IDLE,
		createdProject: null,
	})),
	on(ProjectManagementActions.getAllViewsByStatus, state => ({ ...state, status: AsyncRequestState.LOADING })),
	on(ProjectManagementActions.getAllViewsByStatusSuccess, (state, { views, totalPendingApprovals }) => ({
		...state,
		viewsData: views,
		status: AsyncRequestState.SUCCESS,
		totalViewsData: totalPendingApprovals,
		error: null,
	})),
	on(ProjectManagementActions.getAllViewsByStatusFailure, (state, { error }) => ({
		...state,
		error,
		status: AsyncRequestState.ERROR,
	})),
	on(ProjectManagementActions.getAllProjectInfo, state => ({ ...state, status: AsyncRequestState.LOADING })),
	on(ProjectManagementActions.getAllProjectInfoSuccess, (state, { projects, totalItems }) => ({
		...state,
		projects,
		projectsTotalItems: totalItems,
		status: AsyncRequestState.SUCCESS,
		error: null,
	})),
	on(ProjectManagementActions.getAllProjectInfoFailure, (state, { error }) => ({
		...state,
		error,
		status: AsyncRequestState.ERROR,
	})),

	on(ProjectManagementActions.deleteResource, state => ({ ...state, status: AsyncRequestState.LOADING })),
	on(ProjectManagementActions.deleteResourceSuccess, (state, { resourceId }) => ({
		...state,
		status: AsyncRequestState.SUCCESS,
		error: null,
		deletedResource: resourceId,
	})),
	on(ProjectManagementActions.deleteResourceFailure, (state, { error }) => ({
		...state,
		error,
		status: AsyncRequestState.ERROR,
	})),
);
