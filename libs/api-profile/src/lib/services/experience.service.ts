import { Injectable, NotImplementedException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Experience } from '../models/experience.model'
import { ExperienceEntity } from '../entities/experience.entity'

@Injectable()
export class ExperienceService {
  constructor(
    @InjectRepository(ExperienceEntity)
    private experienceRepository: Repository<ExperienceEntity>,
  ) {}

  // create experience for specific resource
  createExperience(resourceId: number, experience: Omit<Experience, 'id'>) {
    throw new NotImplementedException()
  }

  // return all experiences by resource
  findExperienceByResource(resourceId: number): Promise<ExperienceEntity> {
    throw new NotImplementedException()
  }

  // return experience by id
  findExperienceById(experienceId: number): Promise<ExperienceEntity> {
    throw new NotImplementedException()
  }

  // edit experience
  editEducation(experience: Experience): Promise<Experience> {
    throw new NotImplementedException()
  }

  // delete experience
  deleteExperience(experienceId: number) {
    throw new NotImplementedException()
  }
}
