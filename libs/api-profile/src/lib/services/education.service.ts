import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { EducationEntity, LocationEntity } from '@tempus/datalayer'
import { ResourceService } from '@tempus/api-account'
import { Repository } from 'typeorm'

@Injectable()
export class EducationService {
  constructor(
    private resourceService: ResourceService,
    @InjectRepository(EducationEntity)
    private educationRepository: Repository<EducationEntity>,
  ) {}

  // create education for a specific resource
  async createEducation(
    resourceId: number,
    educationEntity: EducationEntity,
    locationEntity: LocationEntity,
  ): Promise<EducationEntity> {
    educationEntity.location = locationEntity
    let resourceEntity = await this.resourceService.findResourceById(resourceId)

    educationEntity.resource = resourceEntity
    educationEntity = await this.educationRepository.save(educationEntity)

    return educationEntity
  }

  // return all educations by resource
  async findEducationByResource(resourceId: number): Promise<EducationEntity[]> {
    let educationEntities = await this.educationRepository.find({
      where: { resource: { id: resourceId } },
      relations: ['resource', 'location'],
    })
    return educationEntities
  }

  // return education by id
  async findEducationById(educationId: number): Promise<EducationEntity> {
    let educationEntity = await this.educationRepository.findOne(educationId, { relations: ['resource', 'location'] })
    if (!educationEntity) {
      throw new NotFoundException(`Could not find education with id ${educationId}`)
    }
    return educationEntity
  }

  // edit education
  async editEducation(education: EducationEntity): Promise<EducationEntity> {
    let educationEntity = await this.educationRepository.findOne(education.id)
    if (!educationEntity) {
      throw new NotFoundException(`Could not find education with id ${education.id}`)
    }
    await this.educationRepository.update(education.id, education)
    let updatedEntity = await this.educationRepository.findOne(education.id, { relations: ['resource', 'location'] })
    return updatedEntity
  }

  // delete education
  async deleteEducation(educationId: number) {
    let educationEntity = await this.educationRepository.findOne(educationId)
    if (!educationEntity) {
      throw new NotFoundException(`Could not find education with id ${educationId}`)
    }
    this.educationRepository.delete(educationEntity)
  }
}
