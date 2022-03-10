import { createReducer, on } from '@ngrx/store';
import { CreateResourceDto } from '@tempus/shared-domain';

import * as ResourceActions from './createResource.actions';

export const RESOURCE_FEATURE_KEY = 'resource';

export interface ResourceState {
	createResourceData: CreateResourceDto;
	credentialsCreated: boolean;
	userDetailsCreated: boolean;
	workExperienceDetailsCreated: boolean;
	trainingAndSkillDetailsCreated: boolean;
	error: string | null;
	status: 'pending' | 'loading' | 'error' | 'success';
}

export const initialState: ResourceState = {
	createResourceData: {} as CreateResourceDto,
	credentialsCreated: false,
	userDetailsCreated: false,
	workExperienceDetailsCreated: false,
	trainingAndSkillDetailsCreated: false,
	error: null,
	status: 'pending',
};

export const resourceReducer = createReducer(
	initialState,
	on(ResourceActions.createCredentials, (state, { password, email }) => ({
		...state,
		credentialsCreated: true,
		createResourceData: { ...state.createResourceData, email, password },
	})),
	on(ResourceActions.createUserDetails, (state, { firstName, lastName, phoneNumber, email, location }) => ({
		...state,
		userDetailsCreated: true,
		createResourceData: { ...state.createResourceData, firstName, lastName, phoneNumber, email, location },
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
				certifications,
			},
		}),
	),
	on(ResourceActions.createResource, state => ({ ...state, status: 'pending' })),
	on(ResourceActions.createResourceSuccess, state => ({
		...state,
		status: 'success',
		error: null,
	})),
	on(ResourceActions.createResourceFailure, (state, { error }) => ({
		...state,
		status: 'error',
		error,
	})),
);
