import { ProjectStatus } from '../../enums/projectstatus';
import { Resource } from '../account-models/resource.model';
import { ClientRepresentative } from './client-representative.model';
import { Client } from './client.model';
import { ProjectResource } from './project-resource.model';

export interface Project {
	id: number;
	name: string;
	startDate: Date;
	client: Client;
	projectResource: ProjectResource[];
	projectManager: Resource;
	clientRepresentative: ClientRepresentative;
	status: ProjectStatus;
}
