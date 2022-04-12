import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ClientEntity, ProjectEntity, ResourceEntity } from '@tempus/api/shared/entity';
import { Repository } from 'typeorm';
// eslint-disable-next-line import/no-extraneous-dependencies
import { faker } from '@faker-js/faker';
import { ProjectService } from '@tempus/onboarding-api/feature-project';
import { CreateProjectDto } from '@tempus/api/shared/dto';
import { RoleType } from '@tempus/shared-domain';

@Injectable()
export class ProjectSeederService {
	/**
	 * Seeds the project database table with test data
	 * @param projectRepository project database repository
	 */
	constructor(
		@InjectRepository(ProjectEntity)
		private projectRepository: Repository<ProjectEntity>,
		private projectService: ProjectService,
	) {}

	/**
	 * drops all entities in the project repository
	 */
	async clear() {
		this.projectRepository.query('DELETE from project_entity Cascade');
	}

	/**
	 * seeds database with projects
	 * @param clients clients to associate with projects
	 * @param count number of projects to create (in total)
	 * @returns  array of created clients
	 */
	async seedProjects(clients: ClientEntity[], count = 6): Promise<ProjectEntity[]> {
		const createdProjects: ProjectEntity[] = [];
		// eslint-disable-next-line no-plusplus
		for (let i = 0; i < count; i++) {
			const createProject: CreateProjectDto = new CreateProjectDto(
				clients[i % clients.length].id,
				faker.random.word(),
				faker.date.soon(3), // 3 days from today
				faker.date.future(2),
			);

			const project = await this.projectService.createProject(createProject);
			createdProjects.push(project);
		}
		return createdProjects;
	}

	async seedAssignedResources(projects: ProjectEntity[], resources: ResourceEntity[]) {
		const assignedResources: ResourceEntity[] = [];
		for (let i = 0; i < resources.length; i++) {
			await this.projectService.assignResourceToProject(projects[i % projects.length].id, resources[i].id);
			assignedResources.push({ ...resources[i], roles: [RoleType.ASSIGNED_RESOURCE] });
		}
		return assignedResources;
	}
}
