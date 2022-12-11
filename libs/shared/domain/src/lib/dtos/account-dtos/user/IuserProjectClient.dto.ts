export type ProjectClientData = {
	projects: { val: string; id: number; title: string; isCurrent: boolean }[];
	client: string;
};

export interface IUserProjClientDto {
	firstName: string;
	lastName: string;
	email: string;
	projectClients: Array<ProjectClientData>;
	id: number;
	reviewNeeded: boolean;
	location: string;
}
