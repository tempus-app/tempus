import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { EducationEntity, LocationEntity, UpdateEducationDto, Education } from '@tempus/datalayer'
import { ResourceService } from '@tempus/api-account'
import { Repository } from 'typeorm'

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
  async createEducation(resourceId: number, educationEntity: EducationEntity): Promise<Education> {
    const resourceEntity = await this.resourceService.getResourceInfo(resourceId)

    educationEntity.resource = resourceEntity
    educationEntity = await this.educationRepository.save(educationEntity)

    return educationEntity
  }

  // return all educations by resource
  async findEducationByResource(resourceId: number): Promise<Education[]> {
    const educationEntities = await this.educationRepository.find({
      where: { resource: { id: resourceId } },
      relations: ['resource', 'location'],
    })
    return educationEntities
  }

  // return education by id
  async findEducationById(educationId: number): Promise<Education> {
    const educationEntity = await this.educationRepository.findOne(educationId, { relations: ['resource', 'location'] })
    if (!educationEntity) {
      throw new NotFoundException(`Could not find education with id ${educationId}`)
    }
    return educationEntity
  }

  // edit education
  async editEducation(updateEducationData: UpdateEducationDto): Promise<Education> {
    const updatedLocationData = updateEducationData.location
    delete updateEducationData.location

    const existingEducationEntity = await this.educationRepository.findOne(updateEducationData.id, {
      relations: ['location', 'resource'],
    })
    if (!existingEducationEntity) {
      throw new NotFoundException(`Could not find education with id ${updateEducationData.id}`)
    }

    // Safe guards to prevent data from being overwritten as null
    for (const [key, val] of Object.entries(updatedLocationData)) if (!val) delete updatedLocationData[key]
    for (const [key, val] of Object.entries(updateEducationData)) if (!val) delete updateEducationData[key]

    Object.assign(existingEducationEntity.location, updatedLocationData)
    Object.assign(existingEducationEntity, updateEducationData)

    return await this.educationRepository.save(existingEducationEntity)
  }

  // delete education
  async deleteEducation(educationId: number) {
    const educationEntity = await this.educationRepository.findOne(educationId)
    if (!educationEntity) {
      throw new NotFoundException(`Could not find education with id ${educationId}`)
    }
    this.educationRepository.remove(educationEntity)
  }
}
