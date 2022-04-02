import { IUserProjClientDto } from '@tempus/shared-domain';

type ProjectClientData = { project: string; client: string };

export class UserProjectClientDto implements IUserProjClientDto {
	firstName: string;

	lastName: string;

	email: string;

	projectClients: ProjectClientData[];

	id: number;

	reviewNeeded: boolean;

	constructor(
		id: number,
		firstName: string,
		lastName: string,
		email: string,
		reviewNeeded: boolean,
		projectClients: ProjectClientData[],
	) {
		this.firstName = firstName;
		this.id = id;
		this.email = email;
		this.lastName = lastName;
		this.reviewNeeded = reviewNeeded;
		this.projectClients = projectClients;
	}
}
