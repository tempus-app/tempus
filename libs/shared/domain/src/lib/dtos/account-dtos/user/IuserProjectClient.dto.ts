export interface IUserProjClientDto {
	firstName: string;
	lastName: string;
	email: string;
	projectClients: Array<{ project: {val: string; id: number}; client: string }>;
	id: number;
	reviewNeeded: boolean;
}
