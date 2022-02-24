import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Resource, ResourceEntity, RoleType, User, UserEntity } from '@tempus/datalayer'
import { Repository } from 'typeorm'
import { ResourceService } from '.'

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    private resourceService: ResourceService,
  ) {}

  async createUser(user: UserEntity): Promise<UserEntity> {
    if (user.roles.includes(RoleType.BUSINESS_OWNER)) {
      return await this.userRepository.save(user)
    } else {
      console.log(user);
      return await this.resourceService.createResource({
        ...user,
      } as Resource)
    }
  }

  async editUser(user: UserEntity): Promise<UserEntity> {
    const userEntity = await this.userRepository.findOne(user.id)
    if (!userEntity) {
      throw new NotFoundException(`Could not find user with id ${userEntity.id}`)
    }
    if (userEntity['title']) {
      await this.userRepository.update(user.id, user)
      return { user, ...userEntity } as UserEntity
    } else {
      const resourceDto = await this.resourceService.editResource(user)
      return resourceDto
    }
  }

  async getUser(userId: number): Promise<UserEntity> {
    const userEntity = await this.userRepository.findOne(userId)
    if (!userEntity) {
      throw new NotFoundException(`Could not find user with id ${userEntity.id}`)
    }
    if (!userEntity['title']) {
      return userEntity
    } else {
      const resourceDto = await this.resourceService.getResource(userId)
      return resourceDto
    }
  }

  // TODO: filtering
  // ROLES?
  // get by resource etc
  async getAllUsers():Promise<UserEntity[]> { // location?: string[] | string,
  // skills?: string[] | string,
  // title?: string[] | string,
  // project?: string[] | string,
  // status?: string[] | string,
  // sortBy?: string,
    const users = await this.userRepository.find()

    return users
  }

  async deleteUser(userId: number): Promise<void> {
    const userEntity = await this.userRepository.findOne(userId)
    if (!userEntity) {
      throw new NotFoundException(`Could not find user with id ${userId}`)
    }
    await this.userRepository.remove(userEntity)
  }
}
