import { createSelector } from '@ngrx/store';
import { OnboardingClientState, selectOnboardingClientState } from '../onboardingClient.state';

import { ResourceState, RESOURCE_INFO_FEATURE_KEY } from './resource.reducers';

export const selectState = createSelector(
	selectOnboardingClientState,
	(state: OnboardingClientState) => state[RESOURCE_INFO_FEATURE_KEY],
);

export const selectResourceId = createSelector(selectState, (state: ResourceState) => state.userId);

export const selectResourceDetails = createSelector(selectState, (state: ResourceState) => {
	return {
		firstName: state.firstName,
		lastName: state.lastName,
		email: state.email,
		phoneNumber: state.phoneNumber,
		city: state.city,
		province: state.province,
		country: state.country,
		linkedInLink: state.linkedInLink,
		githubLink: state.githubLink,
		otherLink: state.otherLink,
		projectResources: state.projectResources,
	};
});

export const selectResourceBasicDetails = createSelector(selectState, (state: ResourceState) => {
	return { firstName: state.firstName, lastName: state.lastName, email: state.email };
});

export const selectResourceViews = createSelector(selectState, (state: ResourceState) => {
	return { views: state.views, totalViews: state.totalViewsData };
});

export const selectResourceOriginalResume = createSelector(selectState, (state: ResourceState) => state.resume);

export const selectDownloadProfile = createSelector(selectState, (state: ResourceState) => state.resume);
