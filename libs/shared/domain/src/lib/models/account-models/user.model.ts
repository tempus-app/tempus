import { Timesheet } from '..';
import { RoleType } from '../../enums';

export interface User {
	id: number;

	firstName: string;

	lastName: string;

	email: string;

	password: string;

	refreshToken: string;

	roles: RoleType[];

	supervisedTimesheets: Timesheet[];
}
