/* eslint-disable no-param-reassign */
/* eslint-disable no-restricted-syntax */
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateProjectDto, UpdateProjectDto } from '@tempus/api/shared/dto';
import { ProjectEntity } from '@tempus/api/shared/entity';
import { ResourceService } from '@tempus/onboarding-api/feature-account';
import { Project } from '@tempus/shared-domain';
import { Repository } from 'typeorm';
import { ClientService } from '.';

@Injectable()
export class ProjectService {
	constructor(
		@InjectRepository(ProjectEntity)
		private projectRepository: Repository<ProjectEntity>,
		private clientService: ClientService,
		private resourceService: ResourceService,
	) {}

	async getProject(projectId: number): Promise<Project> {
		const projectEntity = await this.projectRepository.findOne(projectId, {
			relations: ['client', 'resources'],
		});
		if (!projectEntity) throw new NotFoundException(`Could not find project with id ${projectEntity.id}`);
		return projectEntity;
	}

	async getProjectInfo(projectId: number): Promise<Project> {
		const projectEntity = await this.projectRepository.findOne(projectId);
		if (!projectEntity) throw new NotFoundException(`Could not find project with id ${projectEntity.id}`);
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
		projectEntity.client = clientEntity;

		return this.projectRepository.save(projectEntity);
	}

	async updateProject(updateProjectDto: UpdateProjectDto): Promise<Project> {
		const projectEntity = await this.getProjectInfo(updateProjectDto.id);
		for (const [key, val] of Object.entries(updateProjectDto)) if (!val) delete updateProjectDto[key];
		Object.assign(projectEntity, updateProjectDto);
		return this.projectRepository.save(projectEntity);
	}

	async assignResourceToProject(projectId: number, resourceId: number): Promise<Project> {
		const projectEntity = await this.getProject(projectId);
		const resourceEntity = await this.resourceService.getResourceInfo(resourceId);

		if (!projectEntity.resources) projectEntity.resources = [resourceEntity];
		else projectEntity.resources.push(resourceEntity);

		return this.projectRepository.save(projectEntity);
	}

	async deleteProject(projectId: number) {
		const projectEntity = await this.projectRepository.findOne(projectId);
		if (!projectEntity) {
			throw new NotFoundException(`Could not find client with id ${projectId}`);
		}
		await this.projectRepository.remove(projectEntity);
	}
}
