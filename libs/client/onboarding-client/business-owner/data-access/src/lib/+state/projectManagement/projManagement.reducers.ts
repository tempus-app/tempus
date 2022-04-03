import { createReducer, on } from '@ngrx/store';
import { AsyncRequestState } from '@tempus/client/onboarding-client/shared/data-access';
import { Client, IUserProjClientDto, Project } from '@tempus/shared-domain';
import * as ProjectManagementActions from './projManagement.actions';

export const PROJECT_MANAGE_FEATURE_KEY = 'projManagement';

export interface ProjectManagementState {
	error: Error | null;
	status: AsyncRequestState;
	projResClientData: IUserProjClientDto[];
	projAssigned: boolean;
	clients: Client[];
}

export const initialState: ProjectManagementState = {
	error: null,
	status: AsyncRequestState.IDLE,
	projAssigned: false,
	projResClientData: [],
	clients: [],
};

export const projectManagementReducer = createReducer(
	initialState,
	on(ProjectManagementActions.getAllClients, state => ({ ...state, status: AsyncRequestState.LOADING })),
	on(ProjectManagementActions.getAllResProjInfo, state => ({ ...state, status: AsyncRequestState.LOADING })),
	on(ProjectManagementActions.createLink, state => ({ ...state, status: AsyncRequestState.LOADING })),
	on(ProjectManagementActions.createResourceProjectAssignment, state => ({ ...state, status: AsyncRequestState.LOADING, projAssigned: false, })),
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
	on(ProjectManagementActions.createResourceProjectAssignmentSuccess, state => ({
		...state,
		projAssigned: true,
		status: AsyncRequestState.SUCCESS,
		error: null,
	})),
	on(ProjectManagementActions.resetProjManagementState, () => ({
		...initialState,
	})),
);
