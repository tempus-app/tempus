import { RoleType } from '../../../enums';

export interface ICreateLinkDto {
	firstName: string;

	lastName: string;

	email: string;

	expiry?: Date;

	projectId?: number;

	userType: RoleType;
}
