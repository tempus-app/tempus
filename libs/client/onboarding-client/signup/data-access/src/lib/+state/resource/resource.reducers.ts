import { createReducer, on } from '@ngrx/store';
import { CreateResourceDto } from '@tempus/shared-domain';

import * as ResourceActions from './resource.actions';

export const RESOURCE_FEATURE_KEY = 'resource';

export interface ResourceState {
	createResourceData: CreateResourceDto;
	error: string | null;
	status: 'pending' | 'loading' | 'error' | 'success';
}

export const initialState: ResourceState = {
	createResourceData: {} as CreateResourceDto,
	error: null,
	status: 'pending',
};

export const resourceReducer = createReducer(
	initialState,
	on(ResourceActions.createCredentials, (state, { password, email }) => ({
		...state,
		createResourceData: { ...state.createResourceData, email, password },
	})),
	on(ResourceActions.createUserDetails, (state, { firstName, lastName, phoneNumber, email, location }) => ({
		...state,
		createResourceData: { ...state.createResourceData, firstName, lastName, phoneNumber, email, location },
	})),
	on(ResourceActions.createWorkExperienceDetails, (state, { experiencesSummary, experiences }) => ({
		...state,
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
