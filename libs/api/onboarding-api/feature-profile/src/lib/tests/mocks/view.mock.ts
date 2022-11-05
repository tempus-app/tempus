import { ApproveViewDto, CreateViewDto } from '@tempus/api/shared/dto';
import { UserEntity, ViewEntity } from '@tempus/api/shared/entity';
import { RevisionType, RoleType, ViewType } from '@tempus/shared-domain';
import { resourceEntity } from './resource.mock';

export const viewEntity: ViewEntity = {
	id: 3,
	profileSummary: 'profileSummary',
	skillsSummary: 'skillSummary',
	educationsSummary: 'educationSummary',
	experiencesSummary: 'experiencesSummary',
	type: 'Primary',
	locked: false,
	skills: [],
	experiences: [],
	educations: [],
	certifications: [],
	resource: resourceEntity,
	createdAt: new Date(Date.parse('2017-01-14')),
	createdBy: RoleType.ASSIGNED_RESOURCE,
	viewType: ViewType.PRIMARY,
};

export const viewEntity2: ViewEntity = {
	id: 4,
	profileSummary: 'profileSummary2',
	skillsSummary: 'skillsSummary2',
	educationsSummary: 'educationsSummary2',
	experiencesSummary: 'experiencesSummary2',
	type: '',
	locked: false,
	skills: [],
	experiences: [],
	educations: [],
	certifications: [],
	resource: resourceEntity,
	createdAt: new Date(Date.parse('2017-02-14')),
	createdBy: RoleType.ASSIGNED_RESOURCE,
	viewType: ViewType.SECONDARY,
};

export const viewEntity3: ViewEntity = {
	id: 6,
	profileSummary: 'profileSummary3',
	skillsSummary: 'skillSummary3',
	educationsSummary: 'educationSummary3',
	experiencesSummary: 'experiencesSummary3',
	type: 'Primary',
	locked: false,
	skills: [],
	experiences: [],
	educations: [],
	certifications: [],
	resource: resourceEntity,
	createdAt: new Date(Date.parse('2017-03-14')),
	createdBy: RoleType.ASSIGNED_RESOURCE,
	viewType: ViewType.PRIMARY,
};

export const resourceUserEntity: UserEntity = {
	id: 3,
	firstName: 'resource',
	lastName: 'resource',
	email: 'resource@gmail.com',
	password: 'password',
	refreshToken: 'token',
	roles: [RoleType.AVAILABLE_RESOURCE],
};
export const businessOwnerUserEntity: UserEntity = {
	id: 4,
	firstName: 'businessOwner',
	lastName: 'businessOwner',
	email: 'businessOwner@gmail.com',
	password: 'password',
	refreshToken: 'token',
	roles: [RoleType.BUSINESS_OWNER],
};
export const supervisorUserEntity: UserEntity = {
	id: 5,
	firstName: 'supervisor',
	lastName: 'supervisor',
	email: 'supervisor@gmail.com',
	password: 'password',
	refreshToken: 'token',
	roles: [RoleType.SUPERVISOR],
};

export const newViewDto: CreateViewDto = {
	skillsSummary: 'newSkillsSummary',
	profileSummary: 'newProfileSummary',
	educationsSummary: 'newEducationsSummary',
	experiencesSummary: 'newExperiencesSummary',
	type: 'Primary',
	skills: [],
	experiences: [],
	educations: [],
	certifications: [],
	viewType: ViewType.PRIMARY,
};

export const createdViewEntityPostRevision: ViewEntity = {
	id: 5,
	profileSummary: 'newProfileSummary',
	skillsSummary: 'newSkillsSummary',
	educationsSummary: 'newEducationsSummary',
	experiencesSummary: 'newExperiencesSummary',
	type: 'Primary',
	locked: true,
	skills: [],
	experiences: [],
	educations: [],
	certifications: [],
	revision: undefined,
	resource: resourceEntity,
	createdAt: null,
	lastUpdateDate: null,
	createdBy: RoleType.ASSIGNED_RESOURCE,
	viewType: ViewType.PRIMARY,
	revisionType: RevisionType.PENDING,
};

export const approveViewDto: ApproveViewDto = {
	comment: '',
	approval: true,
};

export const rejectViewDto: ApproveViewDto = {
	comment: 'approvalComment',
	approval: false,
};

export const createdViewEntity: ViewEntity = {
	id: 7,
	profileSummary: 'newProfileSummary',
	skillsSummary: 'newSkillsSummary',
	educationsSummary: 'newEducationsSummary',
	experiencesSummary: 'newExperiencesSummary',
	type: 'Primary',
	locked: false,
	skills: [],
	experiences: [],
	educations: [],
	certifications: [],
	resource: undefined,
	createdAt: null,
	lastUpdateDate: null,
	revision: undefined,
	createdBy: undefined,
	viewType: ViewType.PRIMARY,
	revisionType: RevisionType.APPROVED,
};

export const newSecondaryViewDto: CreateViewDto = {
	skillsSummary: 'newSkillsSummary',
	profileSummary: 'newProfileSummary',
	educationsSummary: 'newEducationsSummary',
	experiencesSummary: 'newExperiencesSummary',
	type: 'NEW VIEW',
	skills: [],
	experiences: [],
	educations: [],
	certifications: [],
	viewType: ViewType.SECONDARY,
};

export const resourceCreatedSecondaryViewEntity: ViewEntity = {
	id: 8,
	profileSummary: 'newProfileSummary',
	skillsSummary: 'newSkillsSummary',
	educationsSummary: 'newEducationsSummary',
	experiencesSummary: 'newExperiencesSummary',
	type: 'NEW VIEW',
	locked: true,
	skills: [],
	experiences: [],
	educations: [],
	certifications: [],
	resource: undefined,
	createdAt: null,
	lastUpdateDate: null,
	revision: undefined,
	createdBy: RoleType.USER,
	viewType: ViewType.SECONDARY,
	revisionType: RevisionType.PENDING,
};

export const businessOwnerCreatedSecondaryViewEntity: ViewEntity = {
	id: 9,
	profileSummary: 'newProfileSummary',
	skillsSummary: 'newSkillsSummary',
	educationsSummary: 'newEducationsSummary',
	experiencesSummary: 'newExperiencesSummary',
	type: 'NEW VIEW',
	locked: false,
	skills: [],
	experiences: [],
	educations: [],
	certifications: [],
	resource: undefined,
	createdAt: null,
	lastUpdateDate: null,
	revision: undefined,
	createdBy: RoleType.BUSINESS_OWNER,
	viewType: ViewType.SECONDARY,
	revisionType: RevisionType.APPROVED,
};
