import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { CreateResourceDto, CreateUserDto, ResourceEntity, RoleType, User, UserEntity } from '@tempus/datalayer'
import { Repository } from 'typeorm'
import { ResourceService } from '.'

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    private resourceService: ResourceService,
  ) {}

  async createrUser(user: UserEntity): Promise<User> {
    if (user.roles.includes(RoleType.BUSINESS_OWNER)) {
      return await this.userRepository.save(user)
    } else {
      const resourceDto = await this.resourceService.createResource(<ResourceEntity>user)
      return resourceDto
    }
  }

  async editUser(userId: number, user: CreateUserDto): Promise<User> {
    const userEntity = await this.userRepository.findOne(userId)
    if (!userEntity) {
      throw new NotFoundException(`Could not find resource with id ${userEntity.id}`)
    }
    if (userEntity.roles.includes(RoleType.BUSINESS_OWNER)) {
      await this.userRepository.update(userId, user)
      return { user, ...userEntity } as UserEntity
    } else {
      const resourceDto = await this.resourceService.editResource(userId, <CreateResourceDto>user)
      return resourceDto
    }
  }

  async getUser(userId: number): Promise<User> {
    const userEntity = await this.userRepository.findOne(userId)
    if (userEntity.roles.includes(RoleType.BUSINESS_OWNER)) {
      if (!userEntity) {
        throw new NotFoundException(`Could not find resource with id ${userEntity.id}`)
      }
      return userEntity
    } else {
      const resourceDto = await this.resourceService.getResource(userId)
      return resourceDto
    }
  }

  // TODO: filtering
  // ROLES?
  async getAllUsers(
    location?: string[] | string,
    skills?: string[] | string,
    title?: string[] | string,
    project?: string[] | string,
    status?: string[] | string,
    sortBy?: string,
  ): Promise<User[]> {
    const users = await this.userRepository.find()

    return users
  }

  async deleteUser(userId: number) {
    const userEntity = await this.userRepository.findOne(userId)
    if (!userEntity) {
      throw new NotFoundException(`Could not find user with id ${userId}`)
    }
    await this.userRepository.delete(userEntity)
    return true
  }
}
