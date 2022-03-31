import { createReducer, on } from '@ngrx/store';
import { AsyncRequestState } from '@tempus/client/onboarding-client/shared/data-access';
import * as TestActions from './test.actions';

export const TEST_FEATURE_KEY = 'test';

export interface TestState {
	error: Error | null;
	status: AsyncRequestState;
}

export const initialState: TestState = {
	error: null,
	status: AsyncRequestState.IDLE,
};

export const testReducer = createReducer(
	initialState,
	on(TestActions.test, state => ({ ...state, status: AsyncRequestState.LOADING })),
	on(TestActions.testSuccess, state => ({
		...state,
		status: AsyncRequestState.SUCCESS,
		error: null,
	})),
	on(TestActions.testFailure, (state, { error }) => ({
		...state,
		status: AsyncRequestState.ERROR,
		error,
	})),
);
