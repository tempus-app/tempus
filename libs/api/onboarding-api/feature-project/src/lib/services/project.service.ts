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

	async getAllProjects(page: number, pageSize: number): Promise<{ projectData: Project[]; totalItems: number }> {
		const projectsAndCount = await this.projectRepository.findAndCount({
			relations: ['client', 'clientRepresentative'],
			take: Number(pageSize),
			skip: Number(page) * Number(pageSize),
		});

		const projects = projectsAndCount[0];
		const countOfItems = projectsAndCount[1];
		return { projectData: projects, totalItems: countOfItems };
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
				clientEntity.id,
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

		// existing project
		if (projectEntity.projectResources) {
			for (const relation of projectEntity.projectResources) {
				// if there is an active assignment in the project throw an error but not if they are rejoining a project the left
				if (relation.resource.id === resourceId && !relation.endDate) {
					throw new BadRequestException(
						`Project with id ${projectId} already assigned to resource with id ${resourceId}`,
					);
				}
			}
		}

		await this.resourceService.updateRoleType(resourceEntity.id, RoleType.ASSIGNED_RESOURCE);

		await this.projectResourceRepository.save(projectResourceEntity);
	}

	async unassignResourceFromProject(projectId: number, resourceId: number): Promise<void> {
		const projectEntity = await this.getProject(projectId);

		const resourceEntity = await this.resourceService.getResourceInfo(resourceId);

		// only get active assignments
		const projectResources = await this.projectResourceRepository.find({
			where: { project: projectEntity, resource: resourceEntity, endDate: null },
			relations: ['project', 'resource'],
		});

		if (projectResources.length === 0) {
			throw new NotFoundException(
				`Could not find project with id ${projectId} assignment with resource with id ${resourceId}, or they were already unassigned`,
			);
		}
		const projectResourceEntity = projectResources[0];

		const dateToday = new Date();
		dateToday.setHours(0, 0, 0, 0); // we don't care about time
		projectResourceEntity.endDate = dateToday;
		await this.projectResourceRepository.save(projectResourceEntity);

		if (await this.resourceService.isNowAvailable(resourceEntity.id)) {
			await this.resourceService.updateRoleType(resourceEntity.id, RoleType.AVAILABLE_RESOURCE);
		}
	}

	async updateProjStatus(projectId: number, status: ProjectStatus): Promise<ProjectEntity> {
		const projectEntity = await this.getProject(projectId);

    const dateToday = new Date();
		dateToday.setHours(0, 0, 0, 0);

    if (status == ProjectStatus.ACTIVE) {
      projectEntity.status = ProjectStatus.ACTIVE;
      projectEntity.startDate = dateToday;
      return await this.projectRepository.save(projectEntity);
    } else {
      projectEntity.status = ProjectStatus.COMPLETED;
		  projectEntity.endDate = dateToday;
    }

		const { projectResources } = projectEntity;
		await this.projectRepository.save(projectEntity);

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
