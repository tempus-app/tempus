/* eslint-disable no-param-reassign */
/* eslint-disable no-restricted-syntax */
import { ForbiddenException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { ViewsService } from '@tempus/onboarding-api/feature-profile';
import { Resource, StatusType, ViewType } from '@tempus/shared-domain';
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
		
		resourceEntity.projects = [link.project]
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
		this.linkService.editLinkStatus(resource.linkId, StatusType.COMPLETED);
		return createdResource;
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
					project: {val: proj.name, id: proj.id},
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

	private async hashPassword(password: string): Promise<string> {
		try {
			const salt = await genSalt(this.configService.get('saltSecret'));
			return hash(password, salt);
		} catch (e) {
			throw new InternalServerErrorException(e);
		}
	}
}
