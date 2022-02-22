import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { ResourceService } from '@tempus/api-account'
import { SlimExperienceDto, ExperienceEntity, LocationEntity, ProfileResumeLocationInputDto } from '@tempus/datalayer'
import { Repository } from 'typeorm'

@Injectable()
export class ExperienceService {
  constructor(
    private resourceService: ResourceService,
    @InjectRepository(ExperienceEntity)
    private experienceRepository: Repository<ExperienceEntity>,
  ) {}

  // create experience for specific resource
  async createExperience(
    resourceId: number,
    experienceEntity: ExperienceEntity,
    locationEntity: LocationEntity,
  ): Promise<ExperienceEntity> {
    locationEntity.experience = experienceEntity
    experienceEntity.location = locationEntity

    let resourceEntity = await this.resourceService.findResourceById(resourceId)

    experienceEntity.resource = resourceEntity
    experienceEntity = await this.experienceRepository.save(experienceEntity)

    return experienceEntity
  }

  // return all experiences by resource
  async findExperienceByResource(resourceId: number): Promise<ExperienceEntity[]> {
    let experienceEntities = await this.experienceRepository.find({
      where: { resource: { id: resourceId } },
      relations: ['resource', 'location'],
    })
    return experienceEntities
  }

  // return experience by id
  async findExperienceById(experienceId: number): Promise<ExperienceEntity> {
    let experienceEntity = await this.experienceRepository.findOne(experienceId, {
      relations: ['resource', 'location'],
    })
    if (!experienceEntity) {
      throw new NotFoundException(`Could not find experience with id ${experienceId}`)
    }
    return experienceEntity
  }

  // edit experience
  async editExperience(updatedExperienceLocationData: ProfileResumeLocationInputDto): Promise<ExperienceEntity> {
    let updatedExperienceData = <SlimExperienceDto>updatedExperienceLocationData.data
    let updatedLocationData = updatedExperienceLocationData.location

    let existingExperienceEntity = await this.experienceRepository.findOne(updatedExperienceData.id, {
      relations: ['location', 'location.experience', 'resource'],
    })
    if (!existingExperienceEntity) {
      throw new NotFoundException(`Could not find experience with id ${updatedExperienceData.id}`)
    }

    // Safe guards to prevent data from being overwritten as null or id being replaced if passed in
    delete updatedLocationData.id
    for (let [key, val] of Object.entries(updatedLocationData)) if (!val) delete updatedLocationData[key]
    for (let [key, val] of Object.entries(updatedExperienceData)) if (!val) delete updatedExperienceData[key]

    Object.assign(existingExperienceEntity.location, updatedLocationData)
    Object.assign(existingExperienceEntity, updatedExperienceData)

    return await this.experienceRepository.save(existingExperienceEntity)
  }

  // delete experience
  async deleteExperience(experienceId: number) {
    let experienceEntity = await this.experienceRepository.findOne(experienceId)
    if (!experienceEntity) {
      throw new NotFoundException(`Could not find experience with id ${experienceId}`)
    }
    this.experienceRepository.remove(experienceEntity)
  }
}
