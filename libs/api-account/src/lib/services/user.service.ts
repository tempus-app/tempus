import { Injectable, NotImplementedException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { User, UserEntity } from '..'

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private userEntity: Repository<UserEntity>,
  ) {}

  createrUser(userId: Omit<User, 'id'>): Promise<UserEntity> {
    throw new NotImplementedException()
  }

  editUser(userId: User): Promise<UserEntity> {
    throw new NotImplementedException()
  }

  getUser(userId: number): Promise<UserEntity> {
    throw new NotImplementedException()
  }

  hashPassword(password: string): String {
    throw new NotImplementedException()
  }
}
