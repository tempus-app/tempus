import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ResourceService } from '@tempus/api-account';
import { Experience, ExperienceEntity, UpdateExperienceDto } from '@tempus/datalayer';
import { Repository } from 'typeorm';

@Injectable()
export class ExperienceService {
	constructor(
		private resourceService: ResourceService,
		@InjectRepository(ExperienceEntity)
		private experienceRepository: Repository<ExperienceEntity>
	) {}

	// create experience for specific resource
	async createExperience(resourceId: number, experienceEntity: ExperienceEntity): Promise<Experience> {
		const resourceEntity = await this.resourceService.getResourceInfo(resourceId);

		experienceEntity.resource = resourceEntity;
		experienceEntity = await this.experienceRepository.save(experienceEntity);

		return experienceEntity;
	}

	// return all experiences by resource
	async findExperienceByResource(resourceId: number): Promise<Experience[]> {
		const experienceEntities = await this.experienceRepository.find({
			where: { resource: { id: resourceId } },
			relations: ['resource', 'location'],
		});
		return experienceEntities;
	}

	// return experience by id
	async findExperienceById(experienceId: number): Promise<Experience> {
		const experienceEntity = await this.experienceRepository.findOne(experienceId, {
			relations: ['resource', 'location'],
		});
		if (!experienceEntity) {
			throw new NotFoundException(`Could not find experience with id ${experienceId}`);
		}
		return experienceEntity;
	}

	// edit experience
	async editExperience(updateExperienceData: UpdateExperienceDto): Promise<Experience> {
		const updatedLocationData = updateExperienceData.location;
		delete updateExperienceData.location;

		const existingExperienceEntity = await this.experienceRepository.findOne(updateExperienceData.id, {
			relations: ['location', 'resource'],
		});
		if (!existingExperienceEntity) {
			throw new NotFoundException(`Could not find experience with id ${updateExperienceData.id}`);
		}

		// Safe guards to prevent data from being overwritten as null
		for (const [key, val] of Object.entries(updatedLocationData)) if (!val) delete updatedLocationData[key];
		for (const [key, val] of Object.entries(updateExperienceData)) if (!val) delete updateExperienceData[key];

		Object.assign(existingExperienceEntity.location, updatedLocationData);
		Object.assign(existingExperienceEntity, updateExperienceData);

		return this.experienceRepository.save(existingExperienceEntity);
	}

	// delete experience
	async deleteExperience(experienceId: number) {
		const experienceEntity = await this.experienceRepository.findOne(experienceId);
		if (!experienceEntity) {
			throw new NotFoundException(`Could not find experience with id ${experienceId}`);
		}
		this.experienceRepository.remove(experienceEntity);
	}
}
