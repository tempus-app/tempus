import { Project } from '..';
import { Resource } from '../account-models/resource.model';

export interface ProjectResource {
	id: number;
	startDate: Date;
	endDate: Date;
	resource: Resource;
	project: Project;
	title: string;
	costRate: number;
	billRate: number;
}
