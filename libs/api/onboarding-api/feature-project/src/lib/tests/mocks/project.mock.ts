import { AssignProjectDto, CreateProjectDto, UpdateProjectDto } from '@tempus/api/shared/dto';
import { ProjectEntity } from '@tempus/api/shared/entity';
import { ProjectStatus } from '@tempus/shared-domain';
import { clientEntityMock } from './client.mock';
import { clientRepresentativeMock } from './clientRepresentative.mock';

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

export const updateProjectDtoMock = new UpdateProjectDto(3);
updateProjectDtoMock.status = ProjectStatus.ACTIVE;

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
	client: clientEntityMock,
	clientRepresentative: clientRepresentativeMock,
	projectResources: null,
};

export const assignProjectDetailsMock = new AssignProjectDto('UX Developer', new Date('2022-01-13'));
