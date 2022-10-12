import { ClientRepresentative } from './client-representative.model';
import { Project } from './project.model';

export interface Client {
	id: number;
	clientName: string;
	projects: Project[];
	representatives: ClientRepresentative[];
}
