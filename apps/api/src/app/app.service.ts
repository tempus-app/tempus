import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Message } from '@tempus/api-interfaces'
import { Repository } from 'typeorm'
import { Resource, User } from '@tempus/account'

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
    this.userRepo.save(newResource)
  }

  async getUser() {
    return await this.userRepo.find()
  }
}
