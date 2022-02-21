import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { SlimEducationDto, EducationEntity, FullEducationDto, LocationEntity } from '@tempus/datalayer'
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
  async createEducation(resourceId: number, education: SlimEducationDto): Promise<FullEducationDto> {
    let educationEntity = SlimEducationDto.toEntity(education)
    let resourceEntity = await this.resourceService.findResourceById(resourceId)

    //let locationEntity = await this.locationRepository.save(educationEntity.location)
    //educationEntity.location = locationEntity
    educationEntity.resource = resourceEntity
    educationEntity = await this.educationRepository.save(educationEntity)

    // if (!resourceEntity.educations) resourceEntity.educations = []
    // resourceEntity.educations.push(educationEntity)
    // let testUser = await this.resourceService.saveResource(resourceEntity)

    // educationEntity.resource = resourceEntity
    // educationEntity = await this.educationRepository.save(educationEntity)

    // if (!resourceEntity.educations) resourceEntity.educations = []
    // resourceEntity.educations.push(educationEntity)
    // await this.resourceService.saveResource(resourceEntity)
    // let test = await this.resourceService.findResourceById(resourceId)
    // console.log(test)
    return FullEducationDto.fromEntity(educationEntity)
  }

  // return all educations by resource
  async findEducationByResource(resourceId: number): Promise<FullEducationDto[]> {
    let educationEntities = await this.educationRepository.find({ where: { resource: { id: resourceId } } })
    let fullEducationDtos = educationEntities.map((entity) => FullEducationDto.fromEntity(entity))
    return fullEducationDtos
  }

  // return education by id
  async findEducationById(educationId: number): Promise<FullEducationDto> {
    let educationEntity = await this.educationRepository.findOne(educationId)
    if (!educationEntity) {
      throw new NotFoundException(`Could not find education with id ${educationId}`)
    }
    return FullEducationDto.fromEntity(educationEntity)
  }

  // edit education
  async editEducation(education: SlimEducationDto): Promise<FullEducationDto> {
    let educationEntity = await this.educationRepository.findOne(education.id)
    if (!educationEntity) {
      throw new NotFoundException(`Could not find education with id ${education.id}`)
    }
    await this.educationRepository.update(education.id, SlimEducationDto.toEntity(education))
    let updatedEntity = await this.educationRepository.findOne(education.id)
    return FullEducationDto.fromEntity(updatedEntity)
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
