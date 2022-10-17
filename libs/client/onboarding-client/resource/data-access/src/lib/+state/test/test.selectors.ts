import { createSelector } from '@ngrx/store';
import { ResourceState, selectResourceState } from '../resource.state';
import { TestState, TEST_FEATURE_KEY } from './test.reducers';

export const selectTest = createSelector(selectResourceState, (state: ResourceState) => state[TEST_FEATURE_KEY]);
export const selectTestStatus = createSelector(selectTest, (state: TestState) => {
	return {
		status: state.status,
		error: state.error,
	};
});
