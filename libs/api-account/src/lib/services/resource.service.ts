import { Injectable, NotFoundException, NotImplementedException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { CreateProjectDto, ResourceEntity, CreateSkillDto, Resource } from '@tempus/datalayer'
import { Repository } from 'typeorm'

@Injectable()
export class ResourceService {
  constructor(
    @InjectRepository(ResourceEntity)
    private resourceRepository: Repository<ResourceEntity>,
  ) {}

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

  findResourcesBySkills(skills: CreateProjectDto[]): Promise<ResourceEntity[]> {
    //should interact with profile view
    throw new NotImplementedException()
  }

  findResourcesByProjects(projects: CreateProjectDto[]): Promise<ResourceEntity[]> {
    throw new NotImplementedException()
  }

  async findResourceById(resourceId: number): Promise<ResourceEntity> {
    let resourceEntity = await this.resourceRepository.findOne(resourceId)
    if (!resourceEntity) {
      throw new NotFoundException(`Could not find resource with id ${resourceId}`)
    }
    return resourceEntity
  }

  async findResourceByEamil(email: string): Promise<Resource> {
    let resourceEntity = (
      await this.resourceRepository.find({
        where: { email: email },
        relations: ['location', 'projects', 'views', 'experiences', 'educations', 'skills', 'certifications'],
      })
    )[0]
    if (!resourceEntity) {
      throw new NotFoundException(`Could not find resource with id ${email}`)
    }
    return resourceEntity
  }

  async saveResource(resource: ResourceEntity): Promise<ResourceEntity> {
    return await this.resourceRepository.save(resource)
  }
}
