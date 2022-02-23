import { Injectable, NotFoundException, NotImplementedException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { EducationService, ExperienceService } from '@tempus/api-profile'
import { ResourceEntity, SlimSkillDto } from '@tempus/datalayer'
import { Repository } from 'typeorm'
import { UserService } from './user.service'

@Injectable()
export class ResourceService {
  constructor(
    @InjectRepository(ResourceEntity)
    private resourceRepository: Repository<ResourceEntity>,
  ) {}

  async createResource(resource: FullResourceDto): Promise<FullResourceDto> {
    let resourceEntity = FullResourceDto.toEntity(resource)
    resourceEntity = await this.resourceRepository.save(resource)

    // TODO: create initial view with inital data

    // view service
    return FullResourceDto.fromEntity(resourceEntity)
  }

  async getResource(resourceId: FullResourceDto): Promise<FullResourceDto> {
    const resourceEntity = await this.resourceRepository.findOne(resourceId)
    return FullResourceDto.fromEntity(resourceEntity)
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
  ): Promise<FullResourceDto[]> {
    const resources = await this.resourceRepository.find()

    const resourcesDtos = []
    resources.forEach((resource) => {
      resourcesDtos.push(FullResourceDto.fromEntity(resource))
    })
    return resourcesDtos
  }

  async findResourceById(resourceId: number): Promise<FullResourceDto> {
    const resourceEntity = await this.resourceRepository.findOne(resourceId)
    if (!resourceEntity) {
      throw new NotFoundException(`Could not find resource with id ${resourceId}`)
    }
    return FullResourceDto.fromEntity(resourceEntity)
  }

  // edit resource to be used specifically when updating local information
  async editResource(resource: SlimResourceDto): Promise<SlimResourceDto> {
    const resourceEntity = await this.resourceRepository.findOne(resource.id)
    if (!resourceEntity) {
      throw new NotFoundException(`Could not find resource with id ${resource.id}`)
    }

    await this.resourceRepository.update(resource.id, resource)
    const updatedEntity = await this.resourceRepository.findOne(resource.id)
    return SlimResourceDto.fromEntity(updatedEntity)
  }
}
