/* eslint-disable no-param-reassign */
/* eslint-disable no-restricted-syntax */
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AssignProjectDto, CreateProjectDto, UpdateProjectDto } from '@tempus/api/shared/dto';
import { ClientRepresentativeEntity, ProjectEntity, ProjectResourceEntity } from '@tempus/api/shared/entity';
import { ResourceService } from '@tempus/onboarding-api/feature-account';
import { Project, ProjectStatus, RoleType } from '@tempus/shared-domain';
import { Repository } from 'typeorm';
import { ClientService } from './client.service';
import { ClientRepresentativeService } from './clientRepresentative.service';

@Injectable()
export class ProjectService {
	constructor(
		@InjectRepository(ProjectResourceEntity)
		private projectResourceRepository: Repository<ProjectResourceEntity>,
		@InjectRepository(ProjectEntity)
		private projectRepository: Repository<ProjectEntity>,
		private clientService: ClientService,
		private clientRepresentativeService: ClientRepresentativeService,
		private resourceService: ResourceService,
	) {}

	async getProject(projectId: number): Promise<Project> {
		const projectEntity = await this.projectRepository.findOne(projectId, {
			relations: [
				'client',
				'clientRepresentative',
				'projectResources',
				'projectResources.resource',
				'projectResources.project',
			],
		});
		if (!projectEntity) throw new NotFoundException(`Could not find project with id ${projectId}`);
		return projectEntity;
	}

	async getProjectInfo(projectId: number): Promise<Project> {
		const projectEntity = await this.projectRepository.findOne(projectId);
		if (!projectEntity) throw new NotFoundException(`Could not find project with id ${projectId}`);
		return projectEntity;
	}

	async getAllProjects(): Promise<Project[]> {
		return this.projectRepository.find({ relations: ['client'] });
	}

	async getAllProjectInfo(): Promise<Project[]> {
		return this.projectRepository.find();
	}

	async createProject(createProjectDto: CreateProjectDto): Promise<Project> {
		const projectEntity = ProjectEntity.fromDto(createProjectDto);
		const clientEntity = await this.clientService.getClientInfo(createProjectDto.clientId);

		let clientRepresentative: ClientRepresentativeEntity;
		if (createProjectDto.clientRepresentativeId) {
			clientRepresentative = await this.clientRepresentativeService.getClientRepresentativeInfo(
				createProjectDto.clientRepresentativeId,
			);
		} else if (
			createProjectDto.clientRepresentativeFirstName &&
			createProjectDto.clientRepresentativeLastName &&
			createProjectDto.clientRepresentativeEmail
		) {
			clientRepresentative = await this.clientRepresentativeService.createClientRepresentative(
				createProjectDto.clientRepresentativeFirstName,
				createProjectDto.clientRepresentativeLastName,
				createProjectDto.clientRepresentativeEmail,
				clientEntity,
			);
		} else {
			throw new BadRequestException('Please specifiy client representative details');
		}

		projectEntity.client = clientEntity;
		projectEntity.clientRepresentative = clientRepresentative;

		return this.projectRepository.save(projectEntity);
	}

	async updateProject(updateProjectDto: UpdateProjectDto): Promise<Project> {
		const projectEntity = await this.getProjectInfo(updateProjectDto.id);
		for (const [key, val] of Object.entries(updateProjectDto)) if (!val) delete updateProjectDto[key];
		Object.assign(projectEntity, updateProjectDto);
		return this.projectRepository.save(projectEntity);
	}

	async assignResourceToProject(projectId: number, resourceId: number, assignDetails: AssignProjectDto): Promise<void> {
		const projectEntity = await this.getProject(projectId);
		const resourceEntity = await this.resourceService.getResourceInfo(resourceId);

		const dateToday = new Date();
		dateToday.setHours(0, 0, 0, 0); // we don't care about time
		const projectResourceEntity = new ProjectResourceEntity(
			null,
			assignDetails.startDate || dateToday,
			null,
			resourceEntity,
			projectEntity,
			assignDetails.title,
		);

		if (projectEntity.projectResources?.some(projectResource => projectResource.resource.id === resourceId)) {
			throw new BadRequestException(`Project with id ${projectId} already assigned to resource with id ${resourceId}`);
		}

		await this.resourceService.updateRoleType(resourceEntity.id, RoleType.ASSIGNED_RESOURCE);

		await this.projectResourceRepository.save(projectResourceEntity);
	}

	async unassignResourceFromProject(projectId: number, resourceId: number): Promise<void> {
		const projectEntity = await this.getProject(projectId);

		const resourceEntity = await this.resourceService.getResourceInfo(resourceId);

		const projectResources = await this.projectResourceRepository.find({
			where: { project: projectEntity, resource: resourceEntity },
			relations: ['project', 'resource'],
		});

		const projectResourceEntity = projectResources[0];
		if (!projectResourceEntity) {
			throw new NotFoundException(
				`Could not find project with id ${projectId} assigned to resource with id ${resourceId}`,
			);
		}
		if (projectResourceEntity.endDate) {
			throw new BadRequestException(
				`Resource with id ${resourceId} was already unassigned from project with id ${projectId}`,
			);
		}
		const dateToday = new Date();
		dateToday.setHours(0, 0, 0, 0); // we don't care about time
		projectResourceEntity.endDate = dateToday;
		await this.projectResourceRepository.save(projectResourceEntity);

		if (await this.resourceService.isNowAvailable(resourceEntity.id)) {
			await this.resourceService.updateRoleType(resourceEntity.id, RoleType.AVAILABLE_RESOURCE);
		}
	}

	async completeProject(projectId: number): Promise<ProjectEntity> {
		const projectEntity = await this.getProject(projectId);

		projectEntity.status = ProjectStatus.COMPLETED;
		const dateToday = new Date();
		dateToday.setHours(0, 0, 0, 0);
		projectEntity.endDate = dateToday;

		const { projectResources } = projectEntity;
		await this.projectRepository.save(projectEntity);
		console.log('hi');

		// end the project for all resources
		for (const relation of projectResources) {
			if (!relation.endDate) {
				await this.unassignResourceFromProject(projectId, relation.resource.id);
			}
		}

		return projectEntity;
	}

	async deleteProject(projectId: number) {
		const projectEntity = await this.getProject(projectId);
		await this.projectRepository.remove(projectEntity);
	}
}
