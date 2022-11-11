import { createSelector } from '@ngrx/store';
import { BusinessOwnerState, selectBusinessOwnerState } from '../businessOwner.state';
import { ResourceProjectClientManagementState, PROJECT_MANAGE_FEATURE_KEY } from './resProjClientManagement.reducers';

export const selectProjManagementState = createSelector(
	selectBusinessOwnerState,
	(state: BusinessOwnerState) => state[PROJECT_MANAGE_FEATURE_KEY],
);

export const selectResProjClientData = createSelector(
	selectProjManagementState,
	(state: ResourceProjectClientManagementState) => {
		return {
			projResClientData: state.projResClientData,
			totalItems: state.projResClientDataTotalItems,
		};
	},
);
export const selectClientData = createSelector(
	selectProjManagementState,
	(state: ResourceProjectClientManagementState) => state.clients,
);

export const selectResourceBasicData = createSelector(
	selectProjManagementState,
	(state: ResourceProjectClientManagementState) => state.resourcesBasic,
);

export const selectSearchableTerms = createSelector(
	selectProjManagementState,
	(state: ResourceProjectClientManagementState) => state.searchableTerms,
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

export const selectAllProjects = createSelector(
	selectProjManagementState,
	(state: ResourceProjectClientManagementState) => {
		return {
			projects: state.projects,
			totalItems: state.projectsTotalItems,
		};
	},
);

export const selectViewsByStatus = createSelector(
	selectProjManagementState,
	(state: ResourceProjectClientManagementState) => {
		return {
			views: state.viewsData,
			totalNumItems: state.totalViewsData,
		};
	},
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
