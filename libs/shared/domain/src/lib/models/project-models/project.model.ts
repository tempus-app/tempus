import { Resource } from '../account-models/resource.model';
import { Client } from './client.model';

export interface Project {
	id: number;

	name: string;

	startDate: Date;

	endDate: Date;

	client: Client;

	resources: Resource[];
}
