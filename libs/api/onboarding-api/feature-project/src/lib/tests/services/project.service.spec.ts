// eslint-disable-next-line import/no-extraneous-dependencies
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ProjectEntity, ProjectResourceEntity } from '@tempus/api/shared/entity';
import { ResourceService } from '@tempus/onboarding-api/feature-account';
import { Repository } from 'typeorm';
import { createMock } from '@golevelup/ts-jest';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { ProjectStatus, RoleType } from '@tempus/shared-domain';
import { ClientRepresentativeService, ClientService, ProjectService } from '../../services';
import {
	assignProjectDetailsMock,
	createProjectMock,
	createProjectMockClientRepresentativeDetails,
	projectEntityMock,
	updateProjectDtoMock,
} from '../mocks/project.mock';
import { clientEntityMock } from '../mocks/client.mock';
import { resourceEntityMock } from '../mocks/resource.mock';
import { projectResourceEntityMock, projectResourceEntityTwoMock } from '../mocks/projectResource.mock';

import { clientRepresentativeMock } from '../mocks/clientRepresentative.mock';

const mockProjectRepository = createMock<Repository<ProjectEntity>>();
const mockProjectResourceRepository = createMock<Repository<ProjectResourceEntity>>();
const mockClientService = createMock<ClientService>();
const mockClientRepresentativeService = createMock<ClientRepresentativeService>();
const mockResourceService = createMock<ResourceService>();

const dateToday = new Date();
dateToday.setHours(0, 0, 0, 0);

describe('ProjectService', () => {
	let moduleRef: TestingModule;
	let projectService: ProjectService;

	beforeEach(async () => {
		jest.resetModules();
		moduleRef = await Test.createTestingModule({
			providers: [
				ProjectService,
				{
					provide: getRepositoryToken(ProjectEntity),
					useValue: mockProjectRepository,
				},
				{
					provide: getRepositoryToken(ProjectResourceEntity),
					useValue: mockProjectResourceRepository,
				},
				{
					provide: ClientService,
					useValue: mockClientService,
				},

				{
					provide: ClientRepresentativeService,
					useValue: mockClientRepresentativeService,
				},

				{
					provide: ResourceService,
					useValue: mockResourceService,
				},
			],
		}).compile();

		projectService = moduleRef.get<ProjectService>(ProjectService);

		// more imports
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	describe('Create Project', () => {
		it('should create a project with valid client id and client representative id', async () => {
			mockClientService.getClientInfo.mockResolvedValue(clientEntityMock);
			mockProjectRepository.save.mockResolvedValue(projectEntityMock);
			mockClientRepresentativeService.getClientRepresentativeInfo.mockResolvedValue(clientRepresentativeMock);

			const res = await projectService.createProject(createProjectMock);

			expect(mockClientService.getClientInfo).toBeCalledWith(createProjectMock.clientId);
			expect(mockClientRepresentativeService.getClientRepresentativeInfo).toBeCalledWith(
				createProjectMock.clientRepresentativeId,
			);
			// no id when first created
			expect(mockProjectRepository.save).toBeCalledWith({ ...projectEntityMock, id: null });

			expect(res).toEqual(projectEntityMock);
		});

		it('should create a project with valid client id, and create client representative with new info', async () => {
			mockClientService.getClientInfo.mockResolvedValue(clientEntityMock);
			mockProjectRepository.save.mockResolvedValue(projectEntityMock);
			mockClientRepresentativeService.getClientRepresentativeInfo.mockResolvedValue(clientRepresentativeMock);

			const res = await projectService.createProject(createProjectMockClientRepresentativeDetails);

			expect(mockClientService.getClientInfo).toBeCalledWith(createProjectMockClientRepresentativeDetails.clientId);
			expect(mockClientRepresentativeService.createClientRepresentative).toBeCalledWith(
				createProjectMockClientRepresentativeDetails.clientRepresentativeFirstName,
				createProjectMockClientRepresentativeDetails.clientRepresentativeLastName,
				createProjectMockClientRepresentativeDetails.clientRepresentativeEmail,
				clientEntityMock,
			);

			expect(mockProjectRepository.save).toBeCalledWith({ ...projectEntityMock, id: null });
			expect(res).toEqual(projectEntityMock);
		});
		it('should create throw an erorr if no client id', async () => {
			mockClientService.getClientInfo.mockRejectedValue(new NotFoundException('foo'));
			let error;
			try {
				await projectService.createProject(createProjectMockClientRepresentativeDetails);
			} catch (e) {
				error = e;
			}
			expect(error).toBeInstanceOf(NotFoundException);
			expect(error.message).toEqual('foo');
			// should not be created
			expect(mockProjectRepository.save).not.toBeCalled();
		});

		it('should create throw an error if no client representative found', async () => {
			mockClientService.getClientInfo.mockResolvedValue(clientEntityMock);
			mockClientRepresentativeService.getClientRepresentativeInfo.mockRejectedValue(new NotFoundException('bar'));
			let error;
			try {
				await projectService.createProject(createProjectMock);
			} catch (e) {
				error = e;
			}
			expect(error).toBeInstanceOf(NotFoundException);
			expect(error.message).toEqual('bar');
			// should not be created
			expect(mockProjectRepository.save).not.toBeCalled();
		});

		it('should create throw an erorr if no client representative id, and no details', async () => {
			const createProjectMockMissingDetails = createProjectMock;
			createProjectMockMissingDetails.clientRepresentativeId = null;
			let error;
			try {
				await projectService.createProject(createProjectMockMissingDetails);
			} catch (e) {
				error = e;
			}
			expect(error).toBeInstanceOf(BadRequestException);
			expect(error.message).toEqual('Please specifiy client representative details');
		});
	});

	describe('Assign Resource', () => {
		it('should assign resource to project with date and role', async () => {
			mockProjectRepository.findOne.mockResolvedValue(projectEntityMock);
			mockResourceService.getResourceInfo.mockResolvedValue(resourceEntityMock);

			await projectService.assignResourceToProject(3, 6, assignProjectDetailsMock);

			expect(mockResourceService.getResourceInfo).toBeCalledWith(6);
			expect(mockResourceService.updateRoleType).toBeCalledWith(6, RoleType.ASSIGNED_RESOURCE);
			expect(mockProjectRepository.findOne).toBeCalledWith(3, {
				relations: ['client', 'clientRepresentative', 'projectResources', 'projectResources.resource'],
			});
			expect(mockProjectResourceRepository.save).toBeCalledWith({ ...projectResourceEntityMock, id: null });
		});

		it('should set date to today if it is not provided', async () => {
			mockProjectRepository.findOne.mockResolvedValue(projectEntityMock);
			console.log(projectEntityMock);
			mockResourceService.getResourceInfo.mockResolvedValue(resourceEntityMock);
			const assignProjectDetailsMockWithoutDate = { ...assignProjectDetailsMock, startDate: null };

			await projectService.assignResourceToProject(3, 6, assignProjectDetailsMockWithoutDate);

			expect(mockResourceService.getResourceInfo).toBeCalledWith(6);
			expect(mockResourceService.updateRoleType).toBeCalledWith(6, RoleType.ASSIGNED_RESOURCE);
			expect(mockProjectRepository.findOne).toBeCalledWith(3, {
				relations: ['client', 'clientRepresentative', 'projectResources', 'projectResources.resource'],
			});

			expect(mockProjectResourceRepository.save).toBeCalledWith({
				...projectResourceEntityMock,
				id: null,
				startDate: dateToday,
			});
		});

		it('should not assign resource if they are assigned', async () => {
			const projectEntityMockWithResources = { ...projectEntityMock };

			mockProjectRepository.findOne.mockResolvedValue(projectEntityMockWithResources);
			mockResourceService.getResourceInfo.mockResolvedValue(resourceEntityMock);

			projectEntityMockWithResources.projectResources = [];
			projectEntityMockWithResources.projectResources.push(projectResourceEntityMock); // already added as a resource to project

			let error;
			try {
				await projectService.assignResourceToProject(3, 6, assignProjectDetailsMock);
			} catch (e) {
				error = e;
			}
			expect(error).toBeInstanceOf(BadRequestException);
			expect(error.message).toEqual(
				`Project with id ${projectEntityMock.id} already assigned to resource with id ${resourceEntityMock.id}`,
			);

			expect(mockProjectResourceRepository.save).not.toBeCalled();
		});

		it('should throw error if project does not exist', async () => {
			mockProjectRepository.findOne.mockRejectedValue(new NotFoundException('foo'));

			let error;
			try {
				await projectService.assignResourceToProject(3, 6, assignProjectDetailsMock);
			} catch (e) {
				error = e;
			}
			expect(mockProjectRepository.findOne).toBeCalledWith(3, {
				relations: ['client', 'clientRepresentative', 'projectResources', 'projectResources.resource'],
			});
			expect(error).toBeInstanceOf(NotFoundException);
			expect(error.message).toEqual('foo');
		});

		it('should throw error if resource does not exist', async () => {
			mockProjectRepository.findOne.mockResolvedValue(projectEntityMock);
			mockResourceService.getResourceInfo.mockRejectedValue(new NotFoundException('bar'));

			let error;
			try {
				await projectService.assignResourceToProject(3, 6, assignProjectDetailsMock);
			} catch (e) {
				error = e;
			}
			expect(error).toBeInstanceOf(NotFoundException);
			expect(error.message).toEqual('bar');
			expect(mockResourceService.getResourceInfo).toBeCalledWith(6);
		});
	});

	describe('Unassign Resource', () => {
		it('should unassign resource and update resource status with end date = current date', async () => {
			mockResourceService.getResourceInfo.mockResolvedValue(resourceEntityMock);
			mockProjectResourceRepository.find.mockResolvedValue([{ ...projectResourceEntityMock }]);
			mockResourceService.isNowAvailable.mockResolvedValue(true);
			mockProjectRepository.findOne.mockResolvedValue(projectEntityMock);

			await projectService.unassignResourceFromProject(3, 6);

			expect(mockProjectResourceRepository.find).toBeCalledWith({
				where: { project: projectEntityMock, resource: resourceEntityMock },
				relations: ['project', 'resource'],
			});
			expect(mockResourceService.updateRoleType).toBeCalledWith(6, RoleType.AVAILABLE_RESOURCE);
			expect(mockProjectResourceRepository.save).toBeCalledWith({ ...projectResourceEntityMock, endDate: dateToday });
		});

		it('should unassign resource with end date = current date and not update if they are still not available', async () => {
			mockResourceService.getResourceInfo.mockResolvedValue(resourceEntityMock);
			mockProjectResourceRepository.find.mockResolvedValue([{ ...projectResourceEntityMock }]);
			mockResourceService.isNowAvailable.mockResolvedValue(false);
			mockProjectRepository.findOne.mockResolvedValue(projectEntityMock);

			await projectService.unassignResourceFromProject(3, 6);

			expect(mockProjectResourceRepository.find).toBeCalledWith({
				where: { project: projectEntityMock, resource: resourceEntityMock },
				relations: ['project', 'resource'],
			});
			expect(mockResourceService.updateRoleType).not.toBeCalled();
			expect(mockProjectResourceRepository.save).toBeCalledWith({ ...projectResourceEntityMock, endDate: dateToday });
		});

		it('should throw an error if the assignment does not exist', async () => {
			mockResourceService.getResourceInfo.mockResolvedValue(resourceEntityMock);
			mockProjectResourceRepository.find.mockResolvedValue([]);
			mockProjectRepository.findOne.mockResolvedValue(projectEntityMock);

			let error;
			try {
				await projectService.unassignResourceFromProject(3, 6);
			} catch (e) {
				error = e;
			}
			expect(mockProjectResourceRepository.find).toBeCalledWith({
				where: { project: projectEntityMock, resource: resourceEntityMock },
				relations: ['project', 'resource'],
			});
			expect(error).toBeInstanceOf(NotFoundException);
			expect(error.message).toEqual(
				`Could not find project with id ${projectEntityMock.id} assigned to resource with id ${resourceEntityMock.id}`,
			);

			expect(mockProjectResourceRepository.save).not.toBeCalled();
		});

		it('should throw an error if resource was already unassigned', async () => {
			mockResourceService.getResourceInfo.mockResolvedValue(resourceEntityMock);
			mockProjectResourceRepository.find.mockResolvedValue([{ ...projectResourceEntityMock, endDate: new Date() }]);

			let error;
			try {
				await projectService.unassignResourceFromProject(3, 6);
			} catch (e) {
				error = e;
			}
			expect(error).toBeInstanceOf(BadRequestException);
			expect(error.message).toEqual(
				`Resource with id ${resourceEntityMock.id} was already unassigned from project with id ${projectEntityMock.id}`,
			);

			expect(mockProjectResourceRepository.save).not.toBeCalled();
		});

		it('should throw error if project does not exist', async () => {
			mockProjectRepository.findOne.mockRejectedValue(new NotFoundException('foo'));

			let error;
			try {
				await projectService.unassignResourceFromProject(3, 6);
			} catch (e) {
				error = e;
			}
			expect(error).toBeInstanceOf(NotFoundException);
			expect(error.message).toEqual('foo');
		});

		it('should throw error if resource does not exist', async () => {
			mockProjectRepository.findOne.mockResolvedValue(projectEntityMock);
			mockResourceService.getResourceInfo.mockRejectedValue(new NotFoundException('bar'));

			let error;
			try {
				await projectService.assignResourceToProject(3, 6, assignProjectDetailsMock);
			} catch (e) {
				error = e;
			}
			expect(error).toBeInstanceOf(NotFoundException);
			expect(error.message).toEqual('bar');
			expect(mockResourceService.getResourceInfo).toBeCalledWith(6);
		});
	});

	describe('Update Project', () => {
		it('should update project details', async () => {
			const projectEntitySlimmedMock = { ...projectEntityMock, clientRepresentative: null, client: null };
			mockProjectRepository.findOne.mockResolvedValue(projectEntitySlimmedMock);
			mockProjectRepository.save.mockResolvedValue({
				...projectEntitySlimmedMock,
				status: ProjectStatus.ACTIVE,
			});
			await projectService.updateProject(updateProjectDtoMock);

			expect(mockProjectRepository.findOne).toBeCalledWith(projectEntityMock.id);

			expect(mockProjectRepository.save).toBeCalledWith({ ...projectEntitySlimmedMock, status: ProjectStatus.ACTIVE });
		});
	});

	describe('Complete Project', () => {
		beforeEach(() => {
			mockResourceService.getResourceInfo.mockResolvedValue(resourceEntityMock);
		});
		it('update status, end date, and set end date for all resources', async () => {
			mockProjectRepository.findOne.mockResolvedValue({
				...projectEntityMock,
				projectResources: [{ ...projectResourceEntityMock }, projectResourceEntityTwoMock],
			});
			mockProjectRepository.save.mockResolvedValue({
				...projectEntityMock,
				endDate: dateToday,
				status: ProjectStatus.COMPLETED,
			});

			mockProjectResourceRepository.find.mockResolvedValueOnce([{ ...projectResourceEntityMock }]);
			mockProjectResourceRepository.find.mockResolvedValueOnce([projectResourceEntityTwoMock]);

			await projectService.completeProject(projectEntityMock.id);

			expect(mockProjectRepository.findOne).toBeCalledWith(projectEntityMock.id, {
				relations: ['client', 'clientRepresentative', 'projectResources', 'projectResources.resource'],
			});

			expect(mockProjectRepository.save).toBeCalledWith({
				...projectEntityMock,
				projectResources: [{ ...projectResourceEntityMock }, projectResourceEntityTwoMock],
				endDate: dateToday,
				status: ProjectStatus.COMPLETED,
			});

			expect(mockProjectResourceRepository.save).toBeCalledTimes(2);

			expect(mockProjectResourceRepository.save).toHaveBeenNthCalledWith(1, {
				...projectResourceEntityMock,
				endDate: dateToday,
			});
			expect(mockProjectResourceRepository.save).toHaveBeenNthCalledWith(2, {
				...projectResourceEntityTwoMock,
				endDate: dateToday,
			});
		});

		it('should not unassign a resource if they already exited the project', async () => {
			const endedAssignment = { ...projectResourceEntityTwoMock, endDate: dateToday };
			mockProjectRepository.findOne.mockResolvedValue({
				...projectEntityMock,
				projectResources: [{ ...projectResourceEntityMock }, endedAssignment],
			});
			mockProjectRepository.save.mockResolvedValue({
				...projectEntityMock,
				endDate: dateToday,
				status: ProjectStatus.COMPLETED,
			});

			mockProjectResourceRepository.find.mockResolvedValueOnce([{ ...projectResourceEntityMock }]);

			await projectService.completeProject(projectEntityMock.id);

			expect(mockProjectRepository.findOne).toBeCalledWith(projectEntityMock.id, {
				relations: ['client', 'clientRepresentative', 'projectResources', 'projectResources.resource'],
			});

			expect(mockProjectRepository.save).toBeCalledWith({
				...projectEntityMock,
				projectResources: [{ ...projectResourceEntityMock }, endedAssignment],
				endDate: dateToday,
				status: ProjectStatus.COMPLETED,
			});

			// don't alter the resource that already exited
			expect(mockProjectResourceRepository.save).toBeCalledTimes(1);

			expect(mockProjectResourceRepository.save).toHaveBeenNthCalledWith(1, {
				...projectResourceEntityMock,
				endDate: dateToday,
			});
			expect(mockProjectResourceRepository.save).not.toBeCalledWith({
				...projectResourceEntityTwoMock,
				endDate: dateToday,
			});
		});
	});

	describe('Delete Project', () => {
		it('delete project fromr repository', () => {});

		it('should throw error if project does not exist', () => {});
	});
});
