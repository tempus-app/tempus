import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import {
  SlimEducationDto,
  EducationEntity,
  FullEducationDto,
  ProfileResumeLocationInputDto,
  SlimLocationDto,
} from '@tempus/datalayer'
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
  async createEducation(resourceId: number, dataInput: ProfileResumeLocationInputDto): Promise<FullEducationDto> {
    let educationEntity = SlimEducationDto.toEntity(<SlimEducationDto>dataInput.data)
    let locationEntity = SlimLocationDto.toEntity(dataInput.location)
    educationEntity.location = locationEntity
    let resourceEntity = await this.resourceService.findResourceById(resourceId)

    educationEntity.resource = resourceEntity
    educationEntity = await this.educationRepository.save(educationEntity)

    return FullEducationDto.fromEntity(educationEntity)
  }

  // return all educations by resource
  async findEducationByResource(resourceId: number): Promise<FullEducationDto[]> {
    let educationEntities = await this.educationRepository.find({
      where: { resource: { id: resourceId } },
      relations: ['resource', 'location'],
    })
    let fullEducationDtos = educationEntities.map((entity) => FullEducationDto.fromEntity(entity))
    return fullEducationDtos
  }

  // return education by id
  async findEducationById(educationId: number): Promise<FullEducationDto> {
    let educationEntity = await this.educationRepository.findOne(educationId, { relations: ['resource', 'location'] })
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
    let updatedEntity = await this.educationRepository.findOne(education.id, { relations: ['resource', 'location'] })
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
