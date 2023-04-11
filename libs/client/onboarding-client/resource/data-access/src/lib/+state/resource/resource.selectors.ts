import { createSelector } from '@ngrx/store';
import { RESOURCE_FEATURE_KEY, selectResourceState, TempusResourceState } from '../resource.state';
import { ResourceState } from './resource.reducers';

export const selectState = createSelector(
	selectResourceState,
	(state: TempusResourceState) => state[RESOURCE_FEATURE_KEY],
);

export const selectResourceBasicDetails = createSelector(selectState, (state: ResourceState) => {
	return { firstName: state.firstName, lastName: state.lastName, email: state.email };
});

export const selectResourceProjectDetails = createSelector(selectState, (state: ResourceState) => {
	return { projectResources: state.projectResources };
});

export const selectResourceViews = createSelector(selectState, (state: ResourceState) => {
	return { views: state.views, totalViews: state.totalViewsData };
});

export const selectResourceTimesheet = createSelector(selectState, (state: ResourceState) => {
	return { timesheet: state.timesheet };
});
export const selectResourceOriginalResume = createSelector(selectState, (state: ResourceState) => state.resume);

export const selectDownloadProfile = createSelector(selectState, (state: ResourceState) => state.resume);

export const selectCreatedTimesheetData = createSelector(
	selectState,
	(state: ResourceState) => state.createdTimesheet,
);
