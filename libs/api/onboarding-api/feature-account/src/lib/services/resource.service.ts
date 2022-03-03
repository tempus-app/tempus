/* eslint-disable no-param-reassign */
/* eslint-disable no-restricted-syntax */
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ViewsService } from '@tempus/onboarding-api/feature-profile';
import { ResourceEntity, Resource, ViewType, CreateResourceDto, UpdateResourceDto } from '@tempus/shared-domain';
import { Repository } from 'typeorm';

@Injectable()
export class ResourceService {
	constructor(
		@InjectRepository(ResourceEntity)
		private resourceRepository: Repository<ResourceEntity>,
		private viewsService: ViewsService,
	) {}

	async createResource(resource: CreateResourceDto): Promise<Resource> {
		const resourceEntity = CreateResourceDto.toEntity(resource);
		let createdResource = await this.resourceRepository.save(resourceEntity);

		const view = await this.viewsService.createView(createdResource.id, {
			viewType: ViewType.PRIMARY,
			educationsSummary: resource.educationsSummary,
			educations: createdResource.educations,
			certifications: createdResource.certifications,
			experiencesSummary: resource.experiencesSummary,
			experiences: createdResource.experiences,
			skillsSummary: resource.skillsSummary,
			skills: createdResource.skills,
			profileSummary: resource.profileSummary,
			type: 'PROFILE',
		});

		createdResource.views.push(view);
		createdResource = await this.resourceRepository.save(resourceEntity);
		return createdResource;
	}

	async getResource(resourceId: number): Promise<Resource> {
		const resourceEntity = await this.resourceRepository.findOne(resourceId, {
			// TODO: relations error???
			relations: ['experiences', 'educations', 'skills', 'certifications', 'location'],
		});

		if (!resourceEntity) {
			throw new NotFoundException(`Could not find resource with id ${resourceId}`);
		}

		return resourceEntity;
	}

	async getResourceInfo(resourceId: number): Promise<Resource> {
		const resourceEntity = await this.resourceRepository.findOne(resourceId);
		if (!resourceEntity) {
			throw new NotFoundException(`Could not find resource with id ${resourceId}`);
		}

		return resourceEntity;
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

	async findResourceByEmail(email: string): Promise<Resource> {
		const resourceEntity = (
			await this.resourceRepository.find({
				where: { email },
				relations: ['location', 'projects', 'views', 'experiences', 'educations', 'skills', 'certifications'],
			})
		)[0];
		if (!resourceEntity) {
			throw new NotFoundException(`Could not find resource with id ${email}`);
		}
		return resourceEntity;
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

		return this.resourceRepository.save(resourceEntity);
	}
}
