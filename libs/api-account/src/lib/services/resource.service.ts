import { Injectable, NotImplementedException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Experience, Skill } from '@tempus/api-profile'
import { Project } from '@tempus/api-project'
import { Repository } from 'typeorm'
import { ResourceEntity } from '..'
import { UserService } from './user.service'

@Injectable()
export class ResourceService extends UserService {
  constructor(
    @InjectRepository(ResourceEntity)
    private resourceEntity: Repository<ResourceEntity>,
  ) {
    super(resourceEntity)
  }

  getAllUsers(
    location?: string[] | string,
    skills?: string[] | string,
    title?: string[] | string,
    project?: string[] | string,
    status?: string[] | string,
    sortBy?: string,
  ): Promise<ResourceEntity[]> {
    throw new NotImplementedException()
  }

  findUsersBySkills(skills: Skill[]): Promise<ResourceEntity[]> {
    //should interact with profile view
    throw new NotImplementedException()
  }

  findUsersByProjects(projects: Project[]): Promise<ResourceEntity[]> {
    throw new NotImplementedException()
  }
}
