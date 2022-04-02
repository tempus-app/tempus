export interface IUserProjClientDto {
	firstName: string;
	lastName: string;
	email: string;
	projectClients: Array<{ project: string; client: string }>;
	id: number;
}
