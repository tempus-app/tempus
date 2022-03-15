import { RoleType } from '../../enums';

export interface User {
	id: number;

	firstName: string;

	lastName: string;

	email: string;

	password: string;

	refreshToken: string;

	// TODO: Authroization
	roles: RoleType[];
}
