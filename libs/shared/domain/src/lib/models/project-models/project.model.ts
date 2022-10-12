import { ProjectStatus } from '../../enums/projectstatus';
import { ClientRepresentative } from './client-representative.model';
import { Client } from './client.model';
import { ProjectResource } from './project-resource.model';

export interface Project {
	id: number;
	name: string;
	startDate: Date;
	client: Client;
	projectResources: ProjectResource[];
	clientRepresentative: ClientRepresentative;
	status: ProjectStatus;
	endDate: Date;
}
