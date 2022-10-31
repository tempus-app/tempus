import { createReducer, on } from '@ngrx/store';
import { AsyncRequestState } from '@tempus/client/onboarding-client/shared/data-access';
import { Client, IUserProjClientDto, Project, View } from '@tempus/shared-domain';
import * as ProjectManagementActions from './resProjClientManagement.actions';

export const PROJECT_MANAGE_FEATURE_KEY = 'resProjClientManagement';

export interface ResourceProjectClientManagementState {
	createdProject: null | Project;
	error: Error | null;
	status: AsyncRequestState;
	projResClientData: IUserProjClientDto[];
	projAssigned: boolean;
	clients: Client[];
	createdClient: Client | null;
	viewsData: View[] | null;
}

export const initialState: ResourceProjectClientManagementState = {
	error: null,
	status: AsyncRequestState.IDLE,
	projAssigned: false,
	projResClientData: [],
	clients: [],
	createdClient: null,
	createdProject: null,
	viewsData: [],
};

export const projectManagementReducer = createReducer(
	initialState,
	on(ProjectManagementActions.getAllClients, state => ({ ...state, status: AsyncRequestState.LOADING })),
	on(ProjectManagementActions.getAllResProjInfo, state => ({ ...state, status: AsyncRequestState.LOADING })),
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
	on(ProjectManagementActions.getAllResProjInfoFailure, (state, { error }) => ({
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
	on(ProjectManagementActions.getAllResProjInfoSuccess, (state, { projResClientData }) => ({
		...state,
		projResClientData,
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
	on(ProjectManagementActions.getAllViewsByStatusSuccess, (state, { views }) => ({
		...state,
		viewsData: views,
		status: AsyncRequestState.SUCCESS,
		error: null,
	})),
	on(ProjectManagementActions.getAllViewsByStatusFailure, (state, { error }) => ({
		...state,
		error,
		status: AsyncRequestState.ERROR,
	})),
);
