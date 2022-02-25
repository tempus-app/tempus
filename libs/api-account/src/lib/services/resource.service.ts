import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { UpdateUserDto, Resource, ResourceEntity, UserEntity } from '@tempus/datalayer'
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
      // TODO: relations error???
      relations: ['experiences', 'educations', 'skills', 'certifications', 'location'],
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
  async editResource(updateResourceData: UpdateUserDto): Promise<Resource> {
    const resourceEntity = await this.getResource(updateResourceData.id)

    let updatedLocationData = updateResourceData.location
    delete updateResourceData.location

    for (const [key, val] of Object.entries(updateResourceData)) if (!val) delete updateResourceData[key]
    for (const [key, val] of Object.entries(updatedLocationData)) if (!val) delete updatedLocationData[key]

    Object.assign(resourceEntity.location, updatedLocationData)
    Object.assign(resourceEntity, updateResourceData)

    return await this.resourceRepository.save(resourceEntity)
  }
}
