import { Resource, RoleType, User, UserEntity, UpdateUserDto } from '@tempus/datalayer'
import { ConsoleLogger, Injectable, NotFoundException, NotImplementedException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { ResourceService } from './resource.service'
import { Repository } from 'typeorm'

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    private resourceService: ResourceService
  ) {}

  async createUser(user: UserEntity): Promise<User> {
    if (user.roles.includes(RoleType.BUSINESS_OWNER)) {
      return await this.userRepository.save(user)
    } else {
      console.log(user)
      return await this.resourceService.createResource({
        ...user,
      } as Resource)
    }
  }

  async updateUser(updateUserData: UpdateUserDto): Promise<User> {
    const userEntity = await this.userRepository.findOne(updateUserData.id)
    if (!userEntity) {
      throw new NotFoundException(`Could not find user with id ${userEntity.id}`)
    }
    if (userEntity.roles.includes(RoleType.BUSINESS_OWNER)) {
      const user = UpdateUserDto.toEntity(updateUserData)
      for (const [key, val] of Object.entries(user)) if (!val) delete user[key]

      Object.assign(userEntity, user)
      return await this.userRepository.save(userEntity)
    } else {
      return await this.resourceService.editResource(updateUserData)
    }
  }

  async getUser(userId: number): Promise<User | Resource> {
    const userEntity = await this.userRepository.findOne(userId)
    if (!userEntity) {
      throw new NotFoundException(`Could not find user with id ${userEntity.id}`)
    }
    if (userEntity.roles.includes(RoleType.BUSINESS_OWNER)) {
      return userEntity
    } else {
      const resourceDto = await this.resourceService.getResource(userId)
      return resourceDto
    }
  }

  async findByEmail(email: string): Promise<User> {
    const user = (
      await this.userRepository.find({
        where: { email: email },
      })
    )[0]
    if (!user) {
      throw new NotFoundException(`Could not find resource with id ${email}`)
    }
    if (user.roles.includes(RoleType.BUSINESS_OWNER)) {
      return user
    } else {
      const resource = await this.resourceService.findResourceByEmail(email)
      return resource
    }
  }

  // TODO: filtering
  // ROLES?
  // get by resource etc
  async getAllUsers(): Promise<User[]> {
    // location?: string[] | string,
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
