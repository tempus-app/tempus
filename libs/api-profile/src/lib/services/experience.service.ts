import { Injectable, NotFoundException, NotImplementedException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { ResourceService } from '@tempus/api-account'
import { SlimExperienceDto, ExperienceEntity, LocationEntity } from '@tempus/datalayer'
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
      relations: ['resource', ' experience'],
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
  async editExperience(experience: SlimExperienceDto): Promise<ExperienceEntity> {
    let experienceEntity = await this.experienceRepository.findOne(experience.id)
    if (!experienceEntity) {
      throw new NotFoundException(`Could not find experience with id ${experience.id}`)
    }
    await this.experienceRepository.update(experience.id, experience)
    let updatedEntity = await this.experienceRepository.findOne(experience.id, { relations: ['resource', 'location'] })
    return experienceEntity
  }

  // delete experience
  async deleteExperience(experienceId: number) {
    let experienceEntity = await this.experienceRepository.findOne(experienceId)
    if (!experienceEntity) {
      throw new NotFoundException(`Could not find experience with id ${experienceId}`)
    }
    this.experienceRepository.delete(experienceEntity)
  }
}
