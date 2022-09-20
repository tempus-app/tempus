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
import { Resource, RoleType, StatusType, ViewType } from '@tempus/shared-domain';
import { Repository } from 'typeorm';
import { genSalt, hash } from 'bcrypt';
import { ResourceEntity } from '@tempus/api/shared/entity';
import { CreateResourceDto, UpdateResourceDto, UserProjectClientDto } from '@tempus/api/shared/dto';
import { LinkService } from './link.service';

@Injectable()
export class ResourceService {
	constructor(
		@InjectRepository(ResourceEntity)
		private resourceRepository: Repository<ResourceEntity>,
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

		const view = await this.viewsService.createView(createdResource.id, {
			viewType: ViewType.PRIMARY,
			type: 'PROFILE',
			educationsSummary: resource.educationsSummary,
			educations: createdResource.educations,
			certifications: createdResource.certifications,
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

	async getResume(resourceId: number): Promise<StreamableFile> {
		const resourceEntity = await this.resourceRepository.findOne(resourceId);
		if (!resourceEntity) {
			throw new NotFoundException(`Could not find resource with id ${resourceId}`);
		}
		return new StreamableFile(resourceEntity.resume);
	}

	async getResource(resourceId: number): Promise<Resource> {
		const resourceEntity = await this.resourceRepository.findOne(resourceId, {
			relations: ['experiences', 'educations', 'skills', 'certifications', 'location'],
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

	async getAllResourceProjectInfo(): Promise<UserProjectClientDto[]> {
		const resources = await this.resourceRepository.find({
			relations: ['projects', 'views', 'projects.client', 'views.revision'],
		});
		const userProjectInfo: Array<UserProjectClientDto> = resources.map(res => {
			const projClients = res.projects.map(proj => {
				return {
					project: { val: proj.name, id: proj.id },
					client: proj.client.clientName,
				};
			});
			const revNeeded = res.views.some(view => view.revision);
			return new UserProjectClientDto(res.id, res.firstName, res.lastName, res.email, revNeeded, projClients);
		});
		return userProjectInfo;
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
			relations: ['projects', 'experiences', 'educations', 'skills', 'certifications', 'views', 'location'],
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
