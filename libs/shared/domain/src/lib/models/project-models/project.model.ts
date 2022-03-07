import { Client } from './client.model';
import { Task } from './task.model';

export interface Project {
	id: number;

	name: string;

	startDate: Date;

	endDate: Date;

	hoursPerDay: number;

	client: Client;

	tasks: Task[];
}
