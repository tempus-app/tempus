import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { EducationEntity, LocationEntity, ProfileResumeLocationInputDto, SlimEducationDto } from '@tempus/datalayer'
import { ResourceService } from '@tempus/api-account'
import { Repository } from 'typeorm'
import { keyframes } from '@angular/animations'

@Injectable()
export class EducationService {
  constructor(
    private resourceService: ResourceService,
    @InjectRepository(EducationEntity)
    private educationRepository: Repository<EducationEntity>,
    @InjectRepository(LocationEntity)
    private locationRepository: Repository<LocationEntity>,
  ) {}

  // create education for a specific resource
  async createEducation(
    resourceId: number,
    educationEntity: EducationEntity,
    locationEntity: LocationEntity,
  ): Promise<EducationEntity> {
    locationEntity.education = educationEntity
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
  async editEducation(updatedEducationLocationData: ProfileResumeLocationInputDto): Promise<EducationEntity> {
    let updatedEducationData = <SlimEducationDto>updatedEducationLocationData.data
    let updatedLocationData = updatedEducationLocationData.location

    let existingEducationEntity = await this.educationRepository.findOne(updatedEducationData.id, {
      relations: ['location', 'location.education', 'resource'],
    })
    if (!existingEducationEntity) {
      throw new NotFoundException(`Could not find education with id ${updatedEducationData.id}`)
    }

    // Safe guards to prevent data from being overwritten as null or id being replaced if passed in
    delete updatedLocationData.id
    for (let [key, val] of Object.entries(updatedLocationData)) if (!val) delete updatedLocationData[key]
    for (let [key, val] of Object.entries(updatedEducationData)) if (!val) delete updatedEducationData[key]

    Object.assign(existingEducationEntity.location, updatedLocationData)
    Object.assign(existingEducationEntity, updatedEducationData)

    return await this.educationRepository.save(existingEducationEntity)
  }

  // delete education
  async deleteEducation(educationId: number) {
    let educationEntity = await this.educationRepository.findOne(educationId)
    if (!educationEntity) {
      throw new NotFoundException(`Could not find education with id ${educationId}`)
    }
    this.educationRepository.remove(educationEntity)
  }
}
