import { createReducer, on } from '@ngrx/store';
import { AsyncRequestState } from '@tempus/client/onboarding-client/shared/data-access';
import { ICreateResourceDto } from '@tempus/shared-domain';

import * as ResourceActions from './createResource.actions';

export const RESOURCE_FEATURE_KEY = 'createResource';

export interface ResourceState {
	createResourceData: ICreateResourceDto;
	credentialsCreated: boolean;
	resumeUploadCreated: boolean;
	userDetailsCreated: boolean;
	workExperienceDetailsCreated: boolean;
	trainingAndSkillDetailsCreated: boolean;
	uploadedResume: File | null;
	error: Error | null;
	status: AsyncRequestState;
}

export const initialState: ResourceState = {
	createResourceData: {} as ICreateResourceDto,
	credentialsCreated: false,
	resumeUploadCreated: false,
	userDetailsCreated: false,
	workExperienceDetailsCreated: false,
	trainingAndSkillDetailsCreated: false,
	uploadedResume: null,
	error: null,
	status: AsyncRequestState.IDLE,
};

export const resourceReducer = createReducer(
	initialState,
	on(ResourceActions.createCredentials, (state, { password, email }) => ({
		...state,
		credentialsCreated: true,
		createResourceData: { ...state.createResourceData, email, password },
	})),
	on(ResourceActions.createResumeUpload, (state, { resume }) => ({
		...state,
		resumeUploadCreated: true,
		uploadedResume: resume,
	})),
	on(ResourceActions.createUserDetails, (state, { firstName, lastName, phoneNumber, personalURL, location }) => ({
		...state,
		userDetailsCreated: true,
		createResourceData: { ...state.createResourceData, firstName, lastName, phoneNumber, personalURL, location },
	})),
	on(ResourceActions.createWorkExperienceDetails, (state, { experiencesSummary, experiences }) => ({
		...state,
		workExperienceDetailsCreated: true,
		createResourceData: {
			...state.createResourceData,
			experiencesSummary,
			experiences,
		},
	})),
	on(
		ResourceActions.createTrainingAndSkillDetails,
		(state, { skillsSummary, educationsSummary, educations, skills, certifications }) => ({
			...state,
			trainingAndSkillDetailsCreated: true,
			createResourceData: {
				...state.createResourceData,
				educationsSummary,
				skillsSummary,
				skills,
				educations,
				certifications,
			},
		}),
	),
	on(ResourceActions.setResourceLinkId, (state, { linkId }) => ({
		...state,
		createResourceData: { ...state.createResourceData, linkId },
	})),
	on(ResourceActions.createResource, state => ({ ...state, status: AsyncRequestState.LOADING })),
	on(ResourceActions.createResourceSuccess, state => ({
		...state,
		status: AsyncRequestState.SUCCESS,
		error: null,
	})),
	on(ResourceActions.createResourceFailure, (state, { error }) => ({
		...state,
		status: AsyncRequestState.ERROR,
		error,
	})),
	on(ResourceActions.resetCreateResourceState, state => initialState),
);
