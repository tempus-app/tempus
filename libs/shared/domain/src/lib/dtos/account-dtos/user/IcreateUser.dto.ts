import { RoleType } from '../../../enums';

export interface ICreateUserDto {
	firstName: string;

	lastName: string;

	email: string;

	password: string;

	roles: RoleType[];

	active: boolean;
}
