/* eslint-disable no-param-reassign */
/* eslint-disable no-restricted-syntax */
import { BadGatewayException, BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateProjectDto, UpdateProjectDto } from '@tempus/api/shared/dto';
import { ClientRepresentativeEntity, ProjectEntity, ProjectResourceEntity } from '@tempus/api/shared/entity';
import { ResourceService } from '@tempus/onboarding-api/feature-account';
import { Project, ProjectStatus, RoleType } from '@tempus/shared-domain';
import { Repository } from 'typeorm';
import { ClientRepresentativeService, ClientService } from '.';

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
			relations: ['client', 'clientRepresentative', 'projectResource', 'projectResource.resource'],
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
			throw new BadGatewayException('Please specifiy client representative details');
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

	async assignResourceToProject(projectId: number, resourceId: number, title: string): Promise<void> {
		const projectEntity = await this.getProject(projectId);
		if (!projectEntity) {
			throw new NotFoundException(`Could not find project with id ${projectId}`);
		}
		const resourceEntity = await this.resourceService.getResourceInfo(resourceId);

		if (!resourceEntity) {
			throw new NotFoundException(`Could not find resource with id ${resourceId}`);
		}
		const projectResourceEntity = new ProjectResourceEntity(
			null,
			new Date(),
			null,
			resourceEntity,
			projectEntity,
			title,
		);

		if (!projectEntity.projectResource) projectEntity.projectResource = [projectResourceEntity];
		else if (projectEntity.projectResource.some(projectResource => projectResource.resource.id === resourceId)) {
			throw new BadRequestException(`Project with id ${projectId} already assigned to resource with id ${resourceId}`);
		} else {
			projectEntity.projectResource.push(projectResourceEntity);
		}
		await this.resourceService.updateRoleType(resourceEntity.id, RoleType.ASSIGNED_RESOURCE);
		await this.projectResourceRepository.save(projectResourceEntity);
	}

	async unassignResourceFromProject(projectId: number, resourceId: number): Promise<void> {
		const projectEntity = await this.getProject(projectId);
		if (!projectEntity) {
			throw new NotFoundException(`Could not find project with id ${projectId}`);
		}
		const resourceEntity = await this.resourceService.getResourceInfo(resourceId);

		if (!resourceEntity) {
			throw new NotFoundException(`Could not find resource with id ${resourceId}`);
		}

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
		projectResourceEntity.endDate = new Date();
		await this.projectResourceRepository.save(projectResourceEntity);

		if (await this.resourceService.isNowAvailable(resourceEntity.id)) {
			await this.resourceService.updateRoleType(resourceEntity.id, RoleType.AVAILABLE_RESOURCE);
		}
	}

	async completeProject(projectId: number): Promise<ProjectEntity> {
		const projectEntity = await this.projectRepository.findOne(projectId, {
			relations: ['projectResource', 'projectResource.resource', 'projectResource.project'],
		});
		if (!projectEntity) {
			throw new NotFoundException(`Could not find project with id ${projectId}`);
		}
		projectEntity.status = ProjectStatus.COMPLETED;
		const projectResources = projectEntity.projectResource;
		console.log(projectEntity);
		await this.projectRepository.save(projectEntity);

		// end the project for all resources
		await projectResources.forEach(async relation => {
			if (!relation.endDate) {
				await this.unassignResourceFromProject(projectId, relation.resource.id);
			}
		});
		console.log('here4');
		return projectEntity;
	}

	async deleteProject(projectId: number) {
		const projectEntity = await this.projectRepository.findOne(projectId);
		if (!projectEntity) {
			throw new NotFoundException(`Could not find project with id ${projectId}`);
		}
		await this.projectRepository.remove(projectEntity);
	}
}
