import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Message } from '@tempus/api-interfaces'
import { Repository } from 'typeorm'
import { RoleType, ResourceEntity, UserEntity } from '@tempus/api-account'

@Injectable()
export class AppService {
  constructor(@InjectRepository(UserEntity) private userRepo: Repository<UserEntity>) {}
  getData(): Message {
    return { message: 'Welcome to api!' }
  }

  createUser() {
    const newUser = new UserEntity()
    // newUser.firstName = 'test'
    // newUser.lastName = 'test'
    // // newUser.isActive = true
    // this.userRepo.save(newUser)

    const newResource = new ResourceEntity()
    newResource.email = 'email'
    const resRoles = [RoleType.AVAILABLE_RESOURCE, RoleType.SUPERVISOR]
    newResource.roles = JSON.stringify(resRoles)

    this.userRepo.save(newResource)
  }

  async getUser() {
    const users = await this.userRepo.find()
    const usersRoles = []
    users.forEach((user) => {
      usersRoles.push(JSON.parse(user.roles).map((role) => <RoleType>role))
    })
    return await { data: users, roles: usersRoles }
  }
}
