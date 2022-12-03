import { createReducer, on } from '@ngrx/store';
import { AsyncRequestState } from '@tempus/client/onboarding-client/shared/data-access';
import { ICreateResourceDto, RoleType } from '@tempus/shared-domain';

import * as ResourceActions from './createResource.actions';

export const RESOURCE_FEATURE_KEY = 'createResource';

export interface ResourceState {
	createResourceData: ICreateResourceDto;
	credentialsCreated: boolean;
	resumeUploadCreated: boolean;
	userDetailsCreated: boolean;
	workExperienceDetailsCreated: boolean;
	trainingAndSkillDetailsCreated: boolean;
	azureAccountCreated: boolean;
	uploadedResume: File | null;
	error: Error | null;
	status: AsyncRequestState;
	createdResourceId: number | null;
	createdCalEmail: string | null;
	tempPassword: string | null;
	savedResume: boolean;
}

export const initialState: ResourceState = {
	createResourceData: { roles: [RoleType.AVAILABLE_RESOURCE] } as ICreateResourceDto,
	credentialsCreated: false,
	resumeUploadCreated: false,
	userDetailsCreated: false,
	workExperienceDetailsCreated: false,
	trainingAndSkillDetailsCreated: false,
	azureAccountCreated: false,
	uploadedResume: null,
	error: null,
	status: AsyncRequestState.IDLE,
	createdResourceId: null,
	createdCalEmail: null,
	tempPassword: null,
	savedResume: false,
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
	on(
		ResourceActions.createUserDetails,
		(
			state,
			{ firstName, lastName, phoneNumber, linkedInLink, githubLink, otherLink, location, profileSummary },
		) => ({
			...state,
			userDetailsCreated: true,
			createResourceData: {
				...state.createResourceData,
				firstName,
				lastName,
				phoneNumber,
				linkedInLink,
				githubLink,
				otherLink,
				location,
				profileSummary,
			},
		}),
	),
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
	on(ResourceActions.createAzureAccount, state => ({ ...state, status: AsyncRequestState.LOADING })),
	on(ResourceActions.createAzureAccountSuccess, (state, { calEmail, azurePassword }) => ({
		...state,
		error: null,
		status: AsyncRequestState.SUCCESS,
		azureAccountCreated: true,
		createdCalEmail: calEmail || null,
		tempPassword: azurePassword || null,
	})),
	on(ResourceActions.createAzureAccountFailure, (state, { error }) => ({
		...state,
		status: AsyncRequestState.ERROR,
		error,
	})),
	on(ResourceActions.createResource, state => ({ ...state, status: AsyncRequestState.LOADING })),
	on(ResourceActions.createResourceSuccess, (state, { resourceId }) => ({
		...state,
		error: null,
		status: AsyncRequestState.SUCCESS,
		createdResourceId: resourceId,
	})),
	on(ResourceActions.createResourceFailure, (state, { error }) => ({
		...state,
		status: AsyncRequestState.ERROR,
		error,
	})),
	on(ResourceActions.resetCreateResourceState, () => initialState),
	on(ResourceActions.saveResume, state => ({ ...state, status: AsyncRequestState.LOADING })),
	on(ResourceActions.saveResumeSuccess, state => ({
		...state,
		status: AsyncRequestState.SUCCESS,
		error: null,
		savedResume: true,
	})),
	on(ResourceActions.saveResumeFailure, (state, { error }) => ({
		...state,
		status: AsyncRequestState.ERROR,
		error,
	})),
);
