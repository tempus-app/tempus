import { createSelector } from '@ngrx/store';

import { selectSignupState, SignupState } from '../signup.state';
import { ResourceState, RESOURCE_FEATURE_KEY } from './createResource.reducers';

export const selectResource = createSelector(selectSignupState, (state: SignupState) => state[RESOURCE_FEATURE_KEY]);

export const selectResourceData = createSelector(selectResource, (state: ResourceState) => state.createResourceData);
export const selectCredentialsCreated = createSelector(
	selectResource,
	(state: ResourceState) => state.credentialsCreated,
);
export const selectWorkExperienceDetailsCreated = createSelector(
	selectResource,
	(state: ResourceState) => state.workExperienceDetailsCreated,
);
export const selectUserDetailsCreated = createSelector(
	selectResource,
	(state: ResourceState) => state.userDetailsCreated,
);
export const selectTrainingAndSkillsCreated = createSelector(
	selectResource,
	(state: ResourceState) => state.trainingAndSkillDetailsCreated,
);
