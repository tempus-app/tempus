import { Injectable, NotFoundException, NotImplementedException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { ResourceService } from '@tempus/api-account'
import { SlimExperienceDto, ExperienceEntity, FullExperienceDto } from '@tempus/datalayer'
import { Repository } from 'typeorm'

@Injectable()
export class ExperienceService {
  constructor(
    private resourceService: ResourceService,
    @InjectRepository(ExperienceEntity)
    private experienceRepository: Repository<ExperienceEntity>,
  ) {}

  // create experience for specific resource
  async createExperience(resourceId: number, experience: SlimExperienceDto): Promise<FullExperienceDto> {
    let experienceEntity = SlimExperienceDto.toEntity(experience)
    let resourceEntity = await this.resourceService.findResourceById(resourceId)

    experienceEntity.resource = resourceEntity
    experienceEntity = await this.experienceRepository.save(experienceEntity)

    return FullExperienceDto.fromEntity(experienceEntity)
  }

  // return all experiences by resource
  async findExperienceByResource(resourceId: number): Promise<FullExperienceDto[]> {
    let experienceEntities = await this.experienceRepository.find({
      where: { resource: { id: resourceId } },
      relations: ['resource'],
    })
    let fullExperienceDtos = experienceEntities.map((entity) => FullExperienceDto.fromEntity(entity))
    return fullExperienceDtos
  }

  // return experience by id
  async findExperienceById(experienceId: number): Promise<FullExperienceDto> {
    let experienceEntity = await this.experienceRepository.findOne(experienceId, { relations: ['resource'] })
    if (!experienceEntity) {
      throw new NotFoundException(`Could not find experience with id ${experienceId}`)
    }
    return FullExperienceDto.fromEntity(experienceEntity)
  }

  // edit experience
  async editExperience(experience: SlimExperienceDto): Promise<FullExperienceDto> {
    let experienceEntity = await this.experienceRepository.findOne(experience.id)
    if (!experienceEntity) {
      throw new NotFoundException(`Could not find experience with id ${experience.id}`)
    }
    await this.experienceRepository.update(experience.id, SlimExperienceDto.toEntity(experience))
    let updatedEntity = await this.experienceRepository.findOne(experience.id, { relations: ['resource'] })
    return FullExperienceDto.fromEntity(updatedEntity)
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
