export interface ICreateProjectDto {
	clientId: number;

	name: string;

	startDate: Date;

	clientRepresentativeId?: number;

	clientRepresentativeFirstName?: string;

	clientRepresentativeLastName?: string;

	clientRepresentativeEmail?: string;
}
