import { ProjectResourceEntity } from '@tempus/api/shared/entity';
import { projectEntityMock } from './project.mock';
import { resourceEntityMock, resourceTwoEntityMock } from './resource.mock';

export const projectResourceEntityMock: ProjectResourceEntity = {
	id: 3,
	startDate: new Date('2022-01-13'),
	endDate: null,
	title: 'UX Developer',
	resource: resourceEntityMock,
	project: projectEntityMock,
	costRate: 30,
	billRate: 50
};

export const projectResourceEntityTwoMock: ProjectResourceEntity = {
	id: 3,
	startDate: new Date('2022-01-13'),
	endDate: null,
	title: 'UX Developer',
	resource: resourceTwoEntityMock,
	project: projectEntityMock,
	costRate: 30,
	billRate: 50
};
