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

  // create education
  createEducation(education: Omit<Education, 'id'>): Promise<EducationEntity> {
    throw new NotImplementedException()
  }

  // return education by user
  findEducationByResource(userId: number): Promise<Education> {
    throw new NotImplementedException()
  }

  // edit education
  editEducation(education: Education): Promise<Education> {
    throw new NotImplementedException()
  }

  // delete education
  deleteEducation(educationId: number) {
    throw new NotImplementedException()
  }
}
