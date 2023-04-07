import { Project } from './project.model';
import { Client } from './client.model';
import { Timesheet } from '..';

export interface ClientRepresentative {
	id: number;
	firstName: string;
	lastName: string;
	email: string;
	client: Client;
	projects: Project[];
	timesheets: Timesheet[];
}
