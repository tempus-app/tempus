import { ResourceEntity, UserEntity, ViewEntity } from '@tempus/api/shared/entity';
import { RoleType, ViewType } from '@tempus/shared-domain';

export const businessOwnerEntity: UserEntity = {
	id: 1,
	firstName: 'Jane',
	lastName: 'Doe',
	email: 'j.doe@gmail.com',
	password: 'password',
	refreshToken: null,
	roles: [RoleType.BUSINESS_OWNER],
};

export const resourceEntity: ResourceEntity = {
	id: 6,
	firstName: 'Jessica',
	lastName: 'Day',
	email: 'j.day@gmail.com',
	password: 'bad_password',
	refreshToken: null,
	roles: [RoleType.AVAILABLE_RESOURCE],
	phoneNumber: '614-244-2343',
	linkedInLink: 'https://link.com',
	githubLink: 'https://link.com',
	otherLink: 'https://link2.com',
	title: 'UX Designer',
	location: {
		id: 3,
		city: 'Los Angeles',
		province: 'California',
		country: 'USA',
	},
	projects: null,
	views: null,
	experiences: null,
	educations: null,
	certifications: null,
	skills: null,
};

export const badUserEntity: ResourceEntity = {
	id: 4,
	firstName: 'Jessica',
	lastName: 'Day',
	email: 'no.role@gmail.com',
	password: 'bad_password',
	refreshToken: null,
	roles: [],
	phoneNumber: '614-244-2343',
	linkedInLink: 'https://link.com',
	githubLink: 'https://link.com',
	otherLink: 'https://link2.com',
	title: 'UX Designer',
	location: {
		id: 3,
		city: 'Los Angeles',
		province: 'California',
		country: 'USA',
	},
	projects: null,
	views: null,
	experiences: null,
	educations: null,
	certifications: null,
	skills: null,
};

export const viewEntity: ViewEntity = {
	id: 1,
	educationsSummary: 'summary of education',
	skillsSummary: 'summary of skills',
	profileSummary: 'summary of profile',
	experiencesSummary: 'summary of experiences',
	type: 'Developer',
	locked: false,
	experiences: null,
	educations: null,
	certifications: null,
	skills: null,
	createdAt: new Date('2022-01-04'),
	createdBy: RoleType.SUPERVISOR,
	viewType: ViewType.PRIMARY,
	resource: resourceEntity,
};
