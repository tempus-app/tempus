import { HttpException, HttpStatus, Injectable, NotFoundException, NotImplementedException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Project, ResourceEntity, Skill } from '@tempus/datalayer'
import { Repository } from 'typeorm'
import { UserService } from './user.service'

@Injectable()
export class ResourceService extends UserService {
  constructor(
    @InjectRepository(ResourceEntity)
    private resourceRepository: Repository<ResourceEntity>,
  ) {
    super(resourceRepository)
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

  async findResourceById(resourceId: number): Promise<ResourceEntity> {
    let resourceEntity = await this.resourceRepository.findOne(resourceId)
    console.log('yello')
    if (!resourceEntity) {
      throw new NotFoundException(`Could not find resource with id ${resourceId}`)
    }
    return resourceEntity
  }
}
