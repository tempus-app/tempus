/* eslint-disable no-param-reassign */
/* eslint-disable no-restricted-syntax */
import {
	ForbiddenException,
	Injectable,
	InternalServerErrorException,
	NotFoundException,
	StreamableFile,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
// eslint-disable-next-line @nrwl/nx/enforce-module-boundaries
import { ViewsService } from '@tempus/onboarding-api/feature-profile';
import {
	Project,
	ProjectClientData,
	Resource,
	RevisionType,
	RoleType,
	StatusType,
	ViewType,
} from '@tempus/shared-domain';
import { FindConditions, In, Repository } from 'typeorm';
import { genSalt, hash } from 'bcrypt';
import { ProjectEntity, ProjectResourceEntity, ResourceEntity } from '@tempus/api/shared/entity';
import { CreateResourceDto, ResourceBasicDto, UpdateResourceDto, UserProjectClientDto } from '@tempus/api/shared/dto';
import { LinkService } from './link.service';

@Injectable()
export class ResourceService {
	constructor(
		@InjectRepository(ResourceEntity)
		private resourceRepository: Repository<ResourceEntity>,
		@InjectRepository(ProjectEntity)
		private projectRespository: Repository<ProjectEntity>,
		@InjectRepository(ProjectResourceEntity)
		private projectResourceRepository: Repository<ProjectResourceEntity>,
		private viewsService: ViewsService,
		private configService: ConfigService,
		private linkService: LinkService,
	) {}

	async createResource(resource: CreateResourceDto): Promise<Resource> {
		const link = await this.linkService.findLinkById(resource.linkId);
		if (link.status === StatusType.COMPLETED || link.status === StatusType.INACTIVE) {
			throw new ForbiddenException('Link is not valid');
		}
		const resourceEntity = ResourceEntity.fromDto(resource);
		resourceEntity.password = await this.hashPassword(resourceEntity.password);

		// resourceEntity.projects = [link.project];
		let createdResource = await this.resourceRepository.save(resourceEntity);

		if (createdResource.roles.includes(RoleType.AVAILABLE_RESOURCE)) {
			const view = await this.viewsService.createView(createdResource.id, {
				viewType: ViewType.PRIMARY,
				type: 'Primary',
				educationsSummary: resource.educationsSummary,
				educations: createdResource.educations,
				certifications: createdResource.certifications,
			//	timesheets: createdResource.timesheets,
				experiencesSummary: resource.experiencesSummary,
				experiences: createdResource.experiences,
				skillsSummary: resource.skillsSummary,
				skills: createdResource.skills,
				profileSummary: resource.profileSummary,
			});

			if (!createdResource.views) createdResource.views = [];
			createdResource.views.push(view);
			createdResource = await this.resourceRepository.save(createdResource);
			createdResource.password = null;
		}
		await this.linkService.editLinkStatus(resource.linkId, StatusType.COMPLETED);
		await this.linkService.assignResourceToLink(resource.linkId, createdResource);

		return createdResource;
	}

	async saveResume(resourceId: number, resume: Express.Multer.File): Promise<void> {
		const resourceEntity = await this.resourceRepository.findOne(resourceId);
		if (!resourceEntity) {
			throw new NotFoundException(`Could not find resource with id ${resourceId}`);
		}
		const buffer = await resume.buffer;
		resourceEntity.resume = new Uint8Array(buffer);
		await this.resourceRepository.save(resourceEntity);
	}

	async getResume(resourceId: number): Promise<StreamableFile | null> {
		const resourceEntity = await this.resourceRepository.findOne(resourceId);
		if (!resourceEntity) {
			throw new NotFoundException(`Could not find resource with id ${resourceId}`);
		}
		if (resourceEntity.resume) {
			return new StreamableFile(resourceEntity.resume);
		}
		return null;
	}

	async getResource(resourceId: number): Promise<Resource> {
		const resourceEntity = await this.resourceRepository.findOne(resourceId, {
			relations: [
				'experiences',
				'educations',
				'skills',
				'certifications',
				'timesheets',
				'location',
				'projectResources',
				'projectResources.project',
				'projectResources.project.client',
			],
		});

		if (!resourceEntity) {
			throw new NotFoundException(`Could not find resource with id ${resourceId}`);
		}

		return resourceEntity;
	}

	// Lightweight method to find resource without the extra linked data
	async getResourceInfo(resourceId: number): Promise<Resource> {
		const resourceEntity = await this.resourceRepository.findOne(resourceId);
		if (!resourceEntity) {
			throw new NotFoundException(`Could not find resource with id ${resourceId}`);
		}

		return resourceEntity;
	}

	async getAllSearchableTerms(): Promise<Array<string>> {
		const resources = await this.resourceRepository.find({
			relations: [
				'projectResources',
				'projectResources.project',
				'views',
				'projectResources.project.client',
				'views.revision',
			],
		});
		let allSearchableTerms = [];

		resources.forEach(res => {
			allSearchableTerms.push(`${res.firstName} ${res.lastName}`);
			res.projectResources.forEach(projRes => {
				allSearchableTerms.push(projRes.project.client.clientName);
				allSearchableTerms.push(projRes.project.name);
			});
		});

		allSearchableTerms = Array.from(new Set(allSearchableTerms));

		return allSearchableTerms;
	}

	async getProjectWithMatchingFilter(filter: string): Promise<Project[]> {
		const projects = await this.projectRespository
			.createQueryBuilder('project')
			.leftJoinAndSelect('project.client', 'client')
			.where('"project"."name" like :query OR "client"."clientName" like :query', { query: `%${filter}%` })
			.getMany();
		return projects;
	}

	async getProjResourcesMatchingFilter(filter: string): Promise<ProjectResourceEntity[]> {
		const projWithFilter = await this.getProjectWithMatchingFilter(filter);
		const projIds = projWithFilter.map(proj => proj.id);

		// If no projects or client with matching filter, need this redundant id to prevent syntax error in query below
		// as empty array of project ids causes issues
		if (projIds.length === 0) {
			projIds.push(-999);
		}
		const projResourcesMatchingFilter = await this.projectResourceRepository
			.createQueryBuilder('projRes')
			.leftJoinAndSelect('projRes.project', 'project')
			.leftJoinAndSelect('projRes.resource', 'resource')
			.where(
				`CONCAT("resource"."firstName", ' ', "resource"."lastName") like :query OR "project"."id" IN (:...projIds)`,
				{ query: `%${filter}%`, projIds },
			)
			.getMany();
		return projResourcesMatchingFilter;
	}

	async getAllResourceProjectInfo(
		page: number,
		pageSize: number,
		filter: string,
		roleType?: RoleType[],
		country?: string,
		province?: string,
	): Promise<{ userProjClientData: UserProjectClientDto[]; totalItems: number }> {
		let resourcesAndCount: [ResourceEntity[], number] = [[], 0];

		const whereClause: FindConditions<ResourceEntity> = {};

		if (filter !== '') {
			const projResources = await this.getProjResourcesMatchingFilter(filter);
			const resMatchingFilterIds = Array.from(new Set(projResources.map(projRes => projRes.resource.id)));
			whereClause.id = In(resMatchingFilterIds);
		}
		if (roleType && roleType.length > 0) {
			const roleQuery = roleType.map(role => [role]);
			whereClause.roles = In(roleQuery);
		}

		if (country) {
			whereClause.location = { country };
			if (province) {
				// only search by province if country is present
				whereClause.location = { ...whereClause.location, province };
			}
		}

		resourcesAndCount = await this.resourceRepository.findAndCount({
			relations: [
				'projectResources',
				'projectResources.project',
				'views',
				'projectResources.project.client',
				'views.revision',
				'location',
			],
			take: Number(pageSize),
			skip: Number(page) * Number(pageSize),
			where: whereClause,
		});

		const resources = resourcesAndCount[0];
		const countOfItems = resourcesAndCount[1];

		// Converting to relevant dto array data
		const userProjectInfo: Array<UserProjectClientDto> = resources.map(res => {
			const clientProjsMap = {};
			// eslint-disable-next-line array-callback-return
			res.projectResources.map(relation => {
				const projData = {
					val: relation.project.name,
					id: relation.project.id,
					title: relation.title,
					isCurrent: relation.endDate == null,
				};
				const { clientName } = relation.project.client;
				if (clientProjsMap[clientName]) {
					clientProjsMap[clientName].push(projData);
				} else {
					clientProjsMap[clientName] = [projData];
				}
			});
			const revNeeded = res.views.some(view => view.revisionType === RevisionType.PENDING);
			const projClientData: ProjectClientData[] = Object.keys(clientProjsMap).map(clientName => {
				return {
					client: clientName,
					projects: clientProjsMap[clientName],
				} as ProjectClientData;
			});
			return new UserProjectClientDto(
				res.id,
				res.firstName,
				res.lastName,
				res.email,
				revNeeded,
				projClientData,
				`${res.location.province}, ${res.location.country}`,
			);
		});

		return { userProjClientData: userProjectInfo, totalItems: countOfItems };
	}

	async getAllResourcesBasic(): Promise<ResourceBasicDto[]> {
		const resources = await this.resourceRepository.find();
		return resources.map(res => {
			return {
				firstName: res.firstName,
				lastName: res.lastName,
				email: res.email,
				id: res.id,
			} as ResourceBasicDto;
		});
	}

	// TODO: filtering
	// CRUD requests
	async getAllResources(): Promise<Resource[]> {
		// location?: string[] | string,
		// skills?: string[] | string,
		// title?: string[] | string,
		// project?: string[] | string,
		// status?: string[] | string,
		// sortBy?: string,

		const resources = await this.resourceRepository.find({
			relations: ['projects', 'experiences', 'educations', 'skills', 'certifications', 'timesheets', 'views', 'location'],
		});

		return resources;
	}

	// edit resource to be used specifically when updating local information
	async editResource(updateResourceData: UpdateResourceDto): Promise<Resource> {
		const resourceEntity = await this.getResource(updateResourceData.id);

		const updatedLocationData = updateResourceData.location;
		delete updateResourceData.location;

		for (const [key, val] of Object.entries(updateResourceData)) if (!val) delete updateResourceData[key];
		if (updatedLocationData) {
			for (const [key, val] of Object.entries(updatedLocationData)) if (!val) delete updatedLocationData[key];
		}
		Object.assign(resourceEntity.location, updatedLocationData);
		Object.assign(resourceEntity, updateResourceData);

		const updatedResource = await this.resourceRepository.save(resourceEntity);
		updatedResource.password = null;
		updatedResource.refreshToken = null;

		return updatedResource;
	}

	public async hashPassword(password: string): Promise<string> {
		try {
			const salt = await genSalt(this.configService.get('saltSecret'));
			return hash(password, salt);
		} catch (e) {
			throw new InternalServerErrorException(e);
		}
	}

	async assignSupervisorToResource(supervisorId: number, resourceId: number): Promise<Resource> {
		const resourceEntity = await this.resourceRepository.findOne(resourceId);
		resourceEntity.supervisorId = supervisorId;
		return await this.resourceRepository.save(resourceEntity);
	}

	public async isNowAvailable(resourceId: number) {
		const existingResourceEntity = await this.resourceRepository.findOne(resourceId, {
			relations: ['projectResources'],
		});
		// if there is a project with no end date, then there is one active project
		return !existingResourceEntity.projectResources.find(projectResource => {
			return projectResource.endDate === null;
		});
	}

	public async updateRoleType(resourceId: number, newRole: RoleType): Promise<Resource> {
		const existingResourceEntity = await this.resourceRepository.findOne(resourceId);
		if (!existingResourceEntity) {
			throw new NotFoundException(`Could not find resource with id ${resourceId}`);
		}
		if (!existingResourceEntity.roles.includes(newRole)) {
			existingResourceEntity.roles.push(newRole);
		}
		if (newRole === RoleType.AVAILABLE_RESOURCE) {
			const index = existingResourceEntity.roles.findIndex(el => el === RoleType.ASSIGNED_RESOURCE);
			if (index !== -1) {
				existingResourceEntity.roles.splice(index, 1);
			}
		}
		if (newRole === RoleType.ASSIGNED_RESOURCE) {
			const index = existingResourceEntity.roles.findIndex(el => el === RoleType.AVAILABLE_RESOURCE);
			if (index !== -1) {
				existingResourceEntity.roles.splice(index, 1);
			}
		}
		return this.resourceRepository.save(existingResourceEntity);
	}
}
