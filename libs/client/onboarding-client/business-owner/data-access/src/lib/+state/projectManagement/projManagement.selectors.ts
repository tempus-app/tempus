import { createSelector } from '@ngrx/store';
import { BusinessOwnerState, selectBusinessOwnerState } from '../businessOwner.state';
import { ProjectManagementState, PROJECT_MANAGE_FEATURE_KEY } from './projManagement.reducers';

export const selectProjManagementState = createSelector(
	selectBusinessOwnerState,
	(state: BusinessOwnerState) => state[PROJECT_MANAGE_FEATURE_KEY],
);

export const selectResProjClientData = createSelector(
	selectProjManagementState,
	(state: ProjectManagementState) => state.projResClientData,
);
export const selectClientData = createSelector(
	selectProjManagementState,
	(state: ProjectManagementState) => state.clients,
);
export const selectProjectAssigned = createSelector(
	selectProjManagementState,
	(state: ProjectManagementState) => state.projAssigned,
);
export const selectAsyncStatus = createSelector(selectProjManagementState, (state: ProjectManagementState) => {
	return {
		status: state.status,
		error: state.error,
	};
});
