import { createSelector } from '@ngrx/store';
import { BusinessOwnerState, selectBusinessOwnerState } from '../businessOwner.state';
import { TestState, TEST_FEATURE_KEY } from './test.reducers';

export const selectTest = createSelector(
	selectBusinessOwnerState,
	(state: BusinessOwnerState) => state[TEST_FEATURE_KEY],
);
export const selectTestStatus = createSelector(selectTest, (state: TestState) => {
	return {
		status: state.status,
		error: state.error,
	};
});
