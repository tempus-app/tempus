import { Injectable, NotFoundException, NotImplementedException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Education, EducationEntity } from '@tempus/datalayer'
import { ResourceService } from '@tempus/api-account'
import { Repository } from 'typeorm'

@Injectable()
export class EducationService {
  constructor(
    private readonly resourceService: ResourceService,
    @InjectRepository(EducationEntity)
    private educationRepository: Repository<EducationEntity>,
  ) {}

  // create education for a specific resource
  async createEducation(resourceId: number, education: Omit<Education, 'id'>): Promise<EducationEntity> {
    let educationEntity = <EducationEntity>education
    let resourceEntity = await this.resourceService.findResourceById(resourceId)
    educationEntity.resource = resourceEntity
    return await this.educationRepository.save(educationEntity)
  }

  // return all educations by resource
  findEducationByResource(resourceId: number): Promise<EducationEntity[]> {
    return this.educationRepository.find({ where: { resource: { id: resourceId } } })
  }

  // return education by id
  async findEducationById(educationId: number): Promise<EducationEntity> {
    let educationEntity = await this.educationRepository.findOne(educationId)
    if (!educationEntity) {
      throw new NotFoundException(`Could not find education with id ${educationId}`)
    }
    return educationEntity
  }

  // edit education
  async editEducation(education: Education): Promise<EducationEntity> {
    let educationEntity = await this.educationRepository.findOne(education.id)
    if (!educationEntity) {
      throw new NotFoundException(`Could not find education with id ${education.id}`)
    }
    return await this.educationRepository.save(<EducationEntity>education)
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
