import { Project } from './project.model';

export interface Client {
	id: number;
	clientName: string;
	projects: Project[];
}
