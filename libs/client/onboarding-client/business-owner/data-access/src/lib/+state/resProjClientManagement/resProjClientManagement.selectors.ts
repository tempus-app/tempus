import { createSelector } from '@ngrx/store';
import { BusinessOwnerState, selectBusinessOwnerState } from '../businessOwner.state';
import { ResourceProjectClientManagementState, PROJECT_MANAGE_FEATURE_KEY } from './resProjClientManagement.reducers';

export const selectProjManagementState = createSelector(
	selectBusinessOwnerState,
	(state: BusinessOwnerState) => state[PROJECT_MANAGE_FEATURE_KEY],
);

export const selectResProjClientData = createSelector(
	selectProjManagementState,
	(state: ResourceProjectClientManagementState) => state.projResClientData,
);
export const selectClientData = createSelector(
	selectProjManagementState,
	(state: ResourceProjectClientManagementState) => state.clients,
);

export const selectCreatedClientData = createSelector(
	selectProjManagementState,
	(state: ResourceProjectClientManagementState) => state.createdClient,
);

export const selectCreatedProjectData = createSelector(
	selectProjManagementState,
	(state: ResourceProjectClientManagementState) => state.createdProject,
);

export const selectProjectAssigned = createSelector(
	selectProjManagementState,
	(state: ResourceProjectClientManagementState) => state.projAssigned,
);

export const selectViewsByStatus = createSelector(
	selectProjManagementState,
	(state: ResourceProjectClientManagementState) => state.viewsData,
);

export const selectAsyncStatus = createSelector(
	selectProjManagementState,
	(state: ResourceProjectClientManagementState) => {
		return {
			status: state.status,
			error: state.error,
		};
	},
);
