import { Injectable, NotFoundException, NotImplementedException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { FullResourceDto, FullUserDto, RoleType, SlimResourceDto, SlimUserDto, UserEntity } from '@tempus/datalayer'
import { Repository } from 'typeorm'
import { ResourceService } from '.'

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    private resourceService: ResourceService,
  ) {}

  async createrUser(user: Omit<FullUserDto | FullResourceDto, 'id'>): Promise<UserEntity> {
    if (user.roles.includes(RoleType.BUSINESS_OWNER)) {
      let userEntity = FullUserDto.toEntity(<FullUserDto>user)
      userEntity = await this.userRepository.save(userEntity)
      return FullUserDto.fromEntity(userEntity)
    } else {
      const resourceDto = await this.resourceService.createResource(<FullResourceDto>user)
      return resourceDto
    }
  }

  async editUser(user: SlimUserDto): Promise<SlimUserDto> {
    const userEntity = await this.userRepository.findOne(user.id)
    if (!userEntity) {
      throw new NotFoundException(`Could not find resource with id ${userEntity.id}`)
    }

    if (userEntity.roles.includes(RoleType.BUSINESS_OWNER)) {
      await this.userRepository.update(user.id, userEntity)
      return FullUserDto.fromEntity(userEntity)
    } else {
      const resourceDto = await this.resourceService.editResource(<SlimResourceDto>userEntity)
      return resourceDto
    }
  }

  async getUser(userId: number): Promise<FullUserDto> {
    const userEntity = await this.userRepository.findOne(userId)
    if (userEntity.roles.includes(RoleType.BUSINESS_OWNER)) {
      return FullUserDto.fromEntity(userEntity)
    } else {
      const resourceDto = await this.resourceService.getResource(<FullResourceDto>userEntity)
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
  ): Promise<FullUserDto[]> {
    const users = await this.userRepository.find()

    const userDtos = []
    users.forEach((user) => {
      userDtos.push(FullUserDto.fromEntity(user))
    })
    return userDtos
  }

  async deleteUser(userId: number) {
    const userEntity = await this.userRepository.findOne(userId)
    if (!userEntity) {
      throw new NotFoundException(`Could not find user with id ${userId}`)
    }
    await this.userRepository.delete(userEntity)
  }
}
