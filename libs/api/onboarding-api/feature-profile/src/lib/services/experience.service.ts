import { forwardRef, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UpdateExperienceDto } from '@tempus/api/shared/dto';
import { ExperienceEntity } from '@tempus/api/shared/entity';
import { ResourceService } from '@tempus/onboarding-api/feature-account';
import { Experience } from '@tempus/shared-domain';
import { Repository } from 'typeorm';

@Injectable()
export class ExperienceService {
	constructor(
		@Inject(forwardRef(() => ResourceService))
		private resourceService: ResourceService,
		@InjectRepository(ExperienceEntity)
		private experienceRepository: Repository<ExperienceEntity>,
	) {}

	// create experience for specific resource
	async createExperience(resourceId: number, experienceEntity: ExperienceEntity): Promise<Experience> {
		let newExperience = experienceEntity;
		const resourceEntity = await this.resourceService.getResourceInfo(resourceId);

		newExperience.resource = resourceEntity;
		newExperience = await this.experienceRepository.save(newExperience);

		return newExperience;
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
		const updatedExperienceData = updateExperienceData;
		const updatedLocationData = updatedExperienceData.location;
		delete updatedExperienceData.location;

		const existingExperienceEntity = await this.experienceRepository.findOne(updatedExperienceData.id, {
			relations: ['location', 'resource'],
		});
		if (!existingExperienceEntity) {
			throw new NotFoundException(`Could not find experience with id ${updatedExperienceData.id}`);
		}

		// Safe guards to prevent data from being overwritten as null
		Object.entries(updatedExperienceData).forEach(entry => {
			if (!entry[1]) {
				delete updatedExperienceData[entry[0]];
			}
		});
		Object.entries(updatedLocationData).forEach(entry => {
			if (!entry[1]) {
				delete updatedLocationData[entry[0]];
			}
		});

		Object.assign(existingExperienceEntity.location, updatedLocationData);
		Object.assign(existingExperienceEntity, updatedExperienceData);

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
