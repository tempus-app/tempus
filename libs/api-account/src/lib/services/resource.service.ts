import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { ViewsService } from '@tempus/api-profile'
import { CreateViewDto, EditUserDto, Resource, ResourceEntity, ViewEntity, ViewType } from '@tempus/datalayer'
import { Repository } from 'typeorm'

@Injectable()
export class ResourceService {
  constructor(
    @InjectRepository(ResourceEntity)
    private resourceRepository: Repository<ResourceEntity>,
    private viewService: ViewsService,
  ) {}

  async createResource(resource: ResourceEntity): Promise<Resource> {
    const createdResource = await this.resourceRepository.save(resource)

    //  Initial View
    const view = await this.viewService.createView(
      createdResource.id,
      new ViewEntity(
        null,
        'type',
        null,
        resource.skills,
        resource.experiences,
        resource.educations,
        null,
        ViewType.PRIMARY,
      ),
    )
    createdResource.views.push(view)

    return createdResource
  }

  async getResource(resourceId: number): Promise<Resource> {
    const resourceEntity = await this.resourceRepository.findOne(resourceId, {
      relations: ['projects', 'experiences', 'educations', 'skills', 'certifications', 'views', 'location'],
    })

    if (!resourceEntity) {
      throw new NotFoundException(`Could not find resource with id ${resourceId}`)
    }

    return resourceEntity
  }

  async getResourceInfo(resourceId: number): Promise<Resource> {
    const resourceEntity = await this.resourceRepository.findOne(resourceId)

    if (!resourceEntity) {
      throw new NotFoundException(`Could not find resource with id ${resourceId}`)
    }

    return resourceEntity
  }

  // TODO: filtering

  // CRUD requests
  async getAllResources(): Promise<Resource[]> {
    // location?: string[] | string,
    // skills?: string[] | string,
    // title?: string[] | string,
    // project?: string[] | string,
    // status?: string[] | string,
    // sortBy?: string,

    const resources = await this.resourceRepository.find({
      relations: ['projects', 'experiences', 'educations', 'skills', 'certifications', 'views', 'location'],
    })

    return resources
  }

  // edit resource to be used specifically when updating local information
  async editResource(resource: EditUserDto): Promise<Resource> {
    const resourceEntity = await this.resourceRepository.findOne(resource.id)
    if (!resourceEntity) {
      throw new NotFoundException(`Could not find resource with id ${resource.id}`)
    }

    await this.resourceRepository.update(resource.id, resource)
    return { resource, ...resourceEntity } as ResourceEntity
  }
}
