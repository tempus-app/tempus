import { Project } from './project.model';

export interface Task {
	id: number;

	taskName: string;

	project: Project;
}
