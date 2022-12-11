import { ResourceEntity } from '@tempus/api/shared/entity';
import { RoleType } from '@tempus/shared-domain';

export const resourceEntityMock: ResourceEntity = {
	phoneNumber: '',
	calEmail: '',
	location: undefined,
	title: '',
	projectResources: [],
	views: [],
	experiences: [],
	educations: [],
	skills: [],
	certifications: [],
	linkedInLink: '',
	githubLink: '',
	otherLink: '',
	id: 6,
	firstName: 'Winston',
	lastName: 'Bishop',
	email: 'wbishop@gmail.com',
	password: 'password',
	refreshToken: '',
	roles: [RoleType.AVAILABLE_RESOURCE],
	resume: undefined,
};

export const resourceTwoEntityMock: ResourceEntity = {
	phoneNumber: '',
	calEmail: '',
	location: undefined,
	title: '',
	projectResources: [],
	views: [],
	experiences: [],
	educations: [],
	skills: [],
	certifications: [],
	linkedInLink: '',
	githubLink: '',
	otherLink: '',
	id: 3,
	firstName: 'Jane',
	lastName: 'Decker',
	email: 'jdecker@gmail.com',
	password: 'password4',
	refreshToken: '',
	roles: [RoleType.AVAILABLE_RESOURCE],
	resume: undefined,
};
