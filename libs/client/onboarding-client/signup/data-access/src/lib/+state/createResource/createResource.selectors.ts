import { createSelector } from '@ngrx/store';

import { SignupState } from '../signup.state';
import { ResourceState } from './createResource.reducers';

export const selectResource = (state: SignupState) => state.resource;
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
