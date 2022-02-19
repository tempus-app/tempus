import { Injectable, NotImplementedException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Education } from '../models/education.model'
import { EducationEntity } from '../entities/education.entity'

@Injectable()
export class EducationService {
  constructor(
    @InjectRepository(EducationEntity)
    private educationRepository: Repository<EducationEntity>,
  ) {}

  // create education for a specific resource
  createEducation(resourceId: number, education: Omit<Education, 'id'>): Promise<EducationEntity> {
    throw new NotImplementedException()
  }

  // return all educations by resource
  findEducationByResource(resourceId: number): Promise<EducationEntity[]> {
    throw new NotImplementedException()
  }

  // return education by id
  findEducationById(educationId: number): Promise<EducationEntity> {
    throw new NotImplementedException()
  }

  // edit education
  editEducation(education: Education): Promise<EducationEntity> {
    throw new NotImplementedException()
  }

  // delete education
  deleteEducation(educationId: number) {
    throw new NotImplementedException()
  }
}
