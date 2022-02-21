import { Injectable, NotImplementedException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { SlimExperienceDto, ExperienceEntity } from '@tempus/datalayer'
import { Repository } from 'typeorm'

@Injectable()
export class ExperienceService {
  constructor(
    @InjectRepository(ExperienceEntity)
    private experienceRepository: Repository<ExperienceEntity>,
  ) {}

  // create experience for specific resource
  createExperience(resourceId: number, experience: Omit<SlimExperienceDto, 'id'>) {
    throw new NotImplementedException()
  }

  // return all experiences by resource
  findExperienceByResource(resourceId: number): Promise<ExperienceEntity[]> {
    throw new NotImplementedException()
  }

  // return experience by id
  findExperienceById(experienceId: number): Promise<ExperienceEntity> {
    throw new NotImplementedException()
  }

  // edit experience
  editExperience(experience: SlimExperienceDto): Promise<ExperienceEntity> {
    throw new NotImplementedException()
  }

  // delete experience
  deleteExperience(experienceId: number) {
    throw new NotImplementedException()
  }
}
