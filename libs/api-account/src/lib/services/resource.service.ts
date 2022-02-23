import { Injectable, NotFoundException, NotImplementedException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { CreateResourceDto, Resource, ResourceEntity } from '@tempus/datalayer'
import { Repository } from 'typeorm'

@Injectable()
export class ResourceService {
  constructor(
    @InjectRepository(ResourceEntity)
    private resourceRepository: Repository<ResourceEntity>,
  ) {}

  async createResource(resource: ResourceEntity): Promise<Resource> {
    const createdResource = await this.resourceRepository.save(resource)

    // TODO: create initial view with inital data

    // view service
    return createdResource
  }

  async getResource(resourceId: number): Promise<Resource> {
    const resourceEntity = await this.resourceRepository.findOne(resourceId, {
      relations: ['projects', 'experiences', 'educations', 'skills', 'certifications', 'views'],
    })

    if (!resourceEntity) {
      throw new NotFoundException(`Could not find resource with id ${resourceId}`)
    }

    return resourceEntity
  }

  // TODO: filtering

  // CRUD requests
  async getAllResources(
    location?: string[] | string,
    skills?: string[] | string,
    title?: string[] | string,
    project?: string[] | string,
    status?: string[] | string,
    sortBy?: string,
  ): Promise<Resource[]> {
    const resources = await this.resourceRepository.find()

    return resources
  }

  // edit resource to be used specifically when updating local information
  async editResource(resourceId: number, resource: CreateResourceDto): Promise<Resource> {
    const resourceEntity = await this.resourceRepository.findOne(resourceId)
    if (!resourceEntity) {
      throw new NotFoundException(`Could not find resource with id ${resourceId}`)
    }

    await this.resourceRepository.update(resourceId, resource)
    return { resource, ...resourceEntity } as ResourceEntity
  }
}
