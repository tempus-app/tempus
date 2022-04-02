import { createReducer, on } from '@ngrx/store';
import { AsyncRequestState } from '@tempus/client/onboarding-client/shared/data-access';
import { Client, IUserProjClientDto, Project } from '@tempus/shared-domain';
import * as ProjectManagementActions from './projManagement.actions';

export const PROJECT_MANAGE_FEATURE_KEY = 'projManagement';

export interface ProjectManagementState {
	error: Error | null;
	status: AsyncRequestState;
	projResClientData: IUserProjClientDto[];
	projects: Project[];
	clients: Client[];
}

export const initialState: ProjectManagementState = {
	error: null,
	status: AsyncRequestState.IDLE,
	projResClientData: [],
	projects: [],
	clients: [],
};

export const projectManagementReducer = createReducer(
	initialState,
	on(ProjectManagementActions.getAllClientsBasic, state => ({ ...state, status: AsyncRequestState.LOADING })),
	on(ProjectManagementActions.getAllProjBasic, state => ({ ...state, status: AsyncRequestState.LOADING })),
	on(ProjectManagementActions.getAllResProjInfo, state => ({ ...state, status: AsyncRequestState.LOADING })),
	on(ProjectManagementActions.getAllClientsBasicFailure, (state, { error }) => ({
		...state,
		error,
		status: AsyncRequestState.ERROR,
	})),
	on(ProjectManagementActions.getAllProjBasicFailure, (state, { error }) => ({
		...state,
		error,
		status: AsyncRequestState.ERROR,
	})),
	on(ProjectManagementActions.getAllResProjInfoFailure, (state, { error }) => ({
		...state,
		error,
		status: AsyncRequestState.ERROR,
	})),
	on(ProjectManagementActions.getAllClientsBasicSuccess, (state, { clientBasicData }) => ({
		...state,
		clientBasicData,
		status: AsyncRequestState.SUCCESS,
		error: null,
	})),
	on(ProjectManagementActions.getAllProjBasicSuccess, (state, { projBasicData }) => ({
		...state,
		projBasicData,
		status: AsyncRequestState.ERROR,
		error: null,
	})),
	on(ProjectManagementActions.getAllResProjInfoSuccess, (state, { projResClientData }) => ({
		...state,
		projResClientData,
		status: AsyncRequestState.ERROR,
		error: null,
	})),
	on(ProjectManagementActions.resetProjManagementState, () => ({
		...initialState,
	})),
);
