import { createReducer, on } from '@ngrx/store';
import { AsyncRequestState } from '@tempus/client/onboarding-client/shared/data-access';
import * as ViewResourceActions from './viewResource.actions';

export const RESOURCE_VIEW_FEATURE_KEY = 'viewResourceManagement';

export interface ViewState {
	resume: Blob | null;
	error: Error | null;
	test: string;
	status: AsyncRequestState;
}
const initialState: ViewState = {
	resume: null,
	error: null,
	test: 'string',
	status: AsyncRequestState.IDLE,
};
export const viewReducer = createReducer(
	initialState,
	on(ViewResourceActions.getOriginalResume, state => ({ ...state, status: AsyncRequestState.LOADING })),
	on(ViewResourceActions.getOriginalResumeSuccess, (state, { resume }) => ({
		...state,
		resume,
		status: AsyncRequestState.SUCCESS,
	})),
	on(ViewResourceActions.getOriginalResumeFailure, (state, { error }) => ({
		...state,
		error,
	})),
);
