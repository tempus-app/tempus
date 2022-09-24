import { createSelector } from '@ngrx/store';
import { BusinessOwnerState, selectBusinessOwnerState } from '../businessOwner.state';
import { PROJECT_MANAGE_FEATURE_KEY } from '../resProjClientManagement/resProjClientManagement.reducers';
import { RESOURCE_VIEW_FEATURE_KEY, ViewState } from './viewResource.reducers';

export const selectViewResource2 = createSelector(
	selectBusinessOwnerState,
	(state: BusinessOwnerState) => state[PROJECT_MANAGE_FEATURE_KEY],
);
export const selectViewResource = createSelector(
	selectBusinessOwnerState,
	(state: BusinessOwnerState) => state[RESOURCE_VIEW_FEATURE_KEY],
);

export const selectOriginalResume = createSelector(selectViewResource, (state: ViewState) => state.resume);
