import { RoleType } from '../../../enums/role';

export interface IUserBasicDto {
	firstName: string;

	lastName: string;

	email: string;

	id: number;

	roles: RoleType[];
}
