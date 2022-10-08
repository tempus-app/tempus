import { LinkEntity, ProjectEntity } from '@tempus/api/shared/entity';
import { Link, RoleType, StatusType } from '@tempus/shared-domain';

export const linkEntity: Link = {
	firstName: 'john',
	lastName: 'doe',
	token: 'random-string',
	email: 'test@email.com',
	expiry: new Date('01-03-2024'),
	id: 3,
	status: StatusType.ACTIVE,
	createdAt: new Date('01-01-2022'),
  userType: RoleType.AVAILABLE_RESOURCE
};

export const createLinkEntity = new LinkEntity(
	null,
	'john',
	'doe',
	'test@email.com',
	new Date('01-03-2024'),
	null,
	null,
);
export const dbLink = new LinkEntity(
	3,
	'john',
	'doe',
	'test@email.com',
	new Date('01-03-2024'),
	'random-string',
	StatusType.ACTIVE,
  undefined,
  RoleType.AVAILABLE_RESOURCE
);
dbLink.createdAt = new Date('01-01-2022');

export const expiredDBLink = new LinkEntity(
	3,
	'john',
	'doe',
	'test@email.com',
	new Date('01-01-2000'),
	'random-string',
	StatusType.ACTIVE,
  undefined,
  RoleType.AVAILABLE_RESOURCE
);
expiredDBLink.createdAt = new Date('01-01-2022');

export const mockProject = new ProjectEntity(1, 'CIBC Mobile App');
