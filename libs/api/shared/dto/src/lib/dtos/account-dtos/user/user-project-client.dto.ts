import { IUserProjClientDto, ProjectClientData } from '@tempus/shared-domain';

export class UserProjectClientDto implements IUserProjClientDto {
	firstName: string;

	lastName: string;

	email: string;

	projectClients: ProjectClientData[];

	id: number;

	reviewNeeded: boolean;

	location: string;

	constructor(
		id: number,
		firstName: string,
		lastName: string,
		email: string,
		reviewNeeded: boolean,
		projectClients: ProjectClientData[],
		location: string,
	) {
		this.firstName = firstName;
		this.id = id;
		this.email = email;
		this.lastName = lastName;
		this.reviewNeeded = reviewNeeded;
		this.projectClients = projectClients;
		this.location = location;
	}
}
