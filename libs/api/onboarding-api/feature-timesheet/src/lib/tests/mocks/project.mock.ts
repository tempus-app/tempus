import { AssignProjectDto, CreateProjectDto, UpdateProjectDto } from '@tempus/api/shared/dto';
import { ProjectEntity } from '@tempus/api/shared/entity';
import { ProjectStatus } from '@tempus/shared-domain';

export const createProjectMock = new CreateProjectDto(
	2,
	'Project Tempus',
	new Date('2022-01-04'),
	3,
	null,
	null,
	null,
	ProjectStatus.NOT_STARTED,

);

export const createProjectMockClientRepresentativeDetails = new CreateProjectDto(
	2,
	'Project Tempus',
	new Date('2022-01-04'),
	null,
	'Jessica',
	'Day',
	'jessica.day@hotmail.com',
	ProjectStatus.NOT_STARTED,
);

export const projectEntityMock: ProjectEntity = {
	id: 3,
	name: 'Project Tempus',
	startDate: new Date('2022-01-04'),
	endDate: undefined,
	status: ProjectStatus.NOT_STARTED,
	client: null,
	clientRepresentative: null,
	projectResources: null,
	timesheets: null,
};

