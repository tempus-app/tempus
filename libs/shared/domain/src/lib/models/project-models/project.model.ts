import { ProjectStatus } from '../../enums/projectstatus';
import { Resource } from '../account-models/resource.model';
import { ClientRepresentative } from './client-representative.model';
import { Client } from './client.model';

export interface Project {
	id: number;
	name: string;
	startDate: Date;
	client: Client;
	resources: Resource[];
	projectManager: Resource;
	clientRepresentative: ClientRepresentative;
	status: ProjectStatus;
}
