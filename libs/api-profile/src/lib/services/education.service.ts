import { forwardRef, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EducationEntity, LocationEntity, UpdateEducationDto, Education } from '@tempus/datalayer';
import { ResourceService } from '@tempus/api-account';
import { Repository } from 'typeorm';

@Injectable()
export class EducationService {
	constructor(
		@Inject(forwardRef(() => ResourceService))
		private resourceService: ResourceService,
		@InjectRepository(EducationEntity)
		private educationRepository: Repository<EducationEntity>,
		@InjectRepository(LocationEntity)
		private locationRepository: Repository<LocationEntity>,
	) {}

	// create education for a specific resource
	async createEducation(resourceId: number, educationEntity: EducationEntity): Promise<Education> {
		const resourceEntity = await this.resourceService.getResourceInfo(resourceId);
		let newEducationEntity = educationEntity;
		newEducationEntity.resource = resourceEntity;
		newEducationEntity = await this.educationRepository.save(newEducationEntity);

		return educationEntity;
	}

	// return all educations by resource
	async findEducationByResource(resourceId: number): Promise<Education[]> {
		const educationEntities = await this.educationRepository.find({
			where: { resource: { id: resourceId } },
			relations: ['resource', 'location'],
		});
		return educationEntities;
	}

	// return education by id
	async findEducationById(educationId: number): Promise<Education> {
		const educationEntity = await this.educationRepository.findOne(educationId, {
			relations: ['resource', 'location'],
		});
		if (!educationEntity) {
			throw new NotFoundException(`Could not find education with id ${educationId}`);
		}
		return educationEntity;
	}

	// edit education
	async editEducation(updateEducationData: UpdateEducationDto): Promise<Education> {
		const updatedEducationData = updateEducationData;
		const updatedLocationData = updatedEducationData.location;
		delete updatedEducationData.location;

		const existingEducationEntity = await this.educationRepository.findOne(updateEducationData.id, {
			relations: ['location', 'resource'],
		});
		if (!existingEducationEntity) {
			throw new NotFoundException(`Could not find education with id ${updateEducationData.id}`);
		}

		// Safe guards to prevent data from being overwritten as null
		Object.entries(updatedEducationData).forEach(entry => {
			if (!entry[1]) {
				delete updatedEducationData[entry[0]];
			}
		});
		Object.entries(updatedLocationData).forEach(entry => {
			if (!entry[1]) {
				delete updatedLocationData[entry[0]];
			}
		});

		Object.assign(existingEducationEntity.location, updatedLocationData);
		Object.assign(existingEducationEntity, updatedEducationData);

		return this.educationRepository.save(existingEducationEntity);
	}

	// delete education
	async deleteEducation(educationId: number) {
		const educationEntity = await this.educationRepository.findOne(educationId);
		if (!educationEntity) {
			throw new NotFoundException(`Could not find education with id ${educationId}`);
		}
		this.educationRepository.remove(educationEntity);
	}
}
