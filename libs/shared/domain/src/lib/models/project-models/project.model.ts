import { ProjectStatus } from '../../enums/projectstatus';
import { Timesheet } from '../timesheet-models';
import { ClientRepresentative } from './client-representative.model';
import { Client } from './client.model';
import { ProjectResource } from './project-resource.model';

export interface Project {
	id: number;
	name: string;
	startDate: Date;
	client: Client;
	projectResources: ProjectResource[];
	timesheets: Timesheet[];
	clientRepresentative: ClientRepresentative;
	status: ProjectStatus;
	endDate: Date;
}
