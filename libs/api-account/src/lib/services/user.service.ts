import { Injectable, NotImplementedException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { User, UserEntity } from '@tempus/datalayer'
import { Repository } from 'typeorm'

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
  ) {}

  createrUser(user: Omit<User, 'id'>): Promise<UserEntity> {
    throw new NotImplementedException()
  }

  editUser(user: User): Promise<UserEntity> {
    throw new NotImplementedException()
  }

  getUser(userId: number): Promise<UserEntity> {
    throw new NotImplementedException()
  }

  async findByEmail(email: string): Promise<UserEntity> {
    return this.userRepository.find({ where: { email: email } })[0]
  }
}
