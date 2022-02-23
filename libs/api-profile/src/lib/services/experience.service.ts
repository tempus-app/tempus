import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { ResourceService } from '@tempus/api-account'
import { Experience, ExperienceEntity, UpdateExperienceDto } from '@tempus/datalayer'
import { Repository } from 'typeorm'

@Injectable()
export class ExperienceService {
  constructor(
    private resourceService: ResourceService,
    @InjectRepository(ExperienceEntity)
    private experienceRepository: Repository<ExperienceEntity>,
  ) {}

  // create experience for specific resource
  async createExperience(resourceId: number, experienceEntity: ExperienceEntity): Promise<Experience> {
    const resourceEntity = await this.resourceService.findResourceById(resourceId)

    experienceEntity.resource = resourceEntity
    experienceEntity = await this.experienceRepository.save(experienceEntity)

    return experienceEntity
  }

  // return all experiences by resource
  async findExperienceByResource(resourceId: number): Promise<Experience[]> {
    let experienceEntities = await this.experienceRepository.find({
      where: { resource: { id: resourceId } },
      relations: ['resource', 'location'],
    })
    return experienceEntities
  }

  // return experience by id
  async findExperienceById(experienceId: number): Promise<Experience> {
    let experienceEntity = await this.experienceRepository.findOne(experienceId, {
      relations: ['resource', 'location'],
    })
    if (!experienceEntity) {
      throw new NotFoundException(`Could not find experience with id ${experienceId}`)
    }
    return experienceEntity
  }

  // edit experience
  async editExperience(updateExperienceData: UpdateExperienceDto): Promise<Experience> {
    let updatedLocationData = updateExperienceData.location
    delete updateExperienceData.location

    let existingExperienceEntity = await this.experienceRepository.findOne(updateExperienceData.id, {
      relations: ['location', 'resource'],
    })
    if (!existingExperienceEntity) {
      throw new NotFoundException(`Could not find experience with id ${updateExperienceData.id}`)
    }

    // Safe guards to prevent data from being overwritten as null
    for (let [key, val] of Object.entries(updatedLocationData)) if (!val) delete updatedLocationData[key]
    for (let [key, val] of Object.entries(updateExperienceData)) if (!val) delete updateExperienceData[key]

    Object.assign(existingExperienceEntity.location, updatedLocationData)
    Object.assign(existingExperienceEntity, updateExperienceData)

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
