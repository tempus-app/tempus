import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Message } from '@tempus/api-interfaces'
import { Repository } from 'typeorm'
import { Resource, User } from '@tempus/account'
import { RoleType } from 'libs/account/src/lib/entities/role'

@Injectable()
export class AppService {
  constructor(@InjectRepository(User) private userRepo: Repository<User>) {}
  getData(): Message {
    return { message: 'Welcome to api!' }
  }

  createUser() {
    const newUser = new User()
    // newUser.firstName = 'test'
    // newUser.lastName = 'test'
    // // newUser.isActive = true
    // this.userRepo.save(newUser)

    const newResource = new Resource()
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
