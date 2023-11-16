import { UserEntity } from '@tempus/api/shared/entity';
import { RoleType, User, JwtPayload } from '@tempus/shared-domain';

export const userEntity: User = {
	firstName: 'john',
	lastName: 'doe',
	email: 'test@email.com',
	id: 4,
	roles: [RoleType.BUSINESS_OWNER],
	password: null,
	refreshToken: null,
	supervisedTimesheets:[],
};

export const dbUser = new UserEntity(4, 'john', 'doe', 'test@email.com', 'password', [RoleType.BUSINESS_OWNER], []);

export const jwtPayload = new JwtPayload('test@email.com', [RoleType.BUSINESS_OWNER], 1, 1);

export const createUserEntity = new UserEntity(4, 'john', 'doe', 'test@email.com', 'password', [
	RoleType.BUSINESS_OWNER,
],[]);
