import { Injectable, NotImplementedException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Skill } from '@tempus/api-profile'
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

  getAllResources(
    location?: string[] | string,
    skills?: string[] | string,
    title?: string[] | string,
    project?: string[] | string,
    status?: string[] | string,
    sortBy?: string,
  ): Promise<ResourceEntity[]> {
    throw new NotImplementedException()
  }

  findResourcesBySkills(skills: Skill[]): Promise<ResourceEntity[]> {
    //should interact with profile view
    throw new NotImplementedException()
  }

  findResourcesByProjects(projects: Project[]): Promise<ResourceEntity[]> {
    throw new NotImplementedException()
  }
}
