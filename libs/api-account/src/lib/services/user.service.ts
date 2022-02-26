import {
  ConsoleLogger,
  Injectable,
  NotFoundException,
  NotImplementedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto, RoleType, User, UserEntity } from '@tempus/datalayer';
import { Repository } from 'typeorm';
import { ResourceService } from './resource.service';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    private resourceService: ResourceService,
  ) {}

  createrUser(user: Omit<CreateUserDto, 'id'>): Promise<UserEntity> {
    throw new NotImplementedException();
  }

  editUser(user: CreateUserDto): Promise<UserEntity> {
    throw new NotImplementedException();
  }

  getUser(userId: number): Promise<UserEntity> {
    throw new NotImplementedException();
  }

  async findByEmail(email: string): Promise<User> {
    const user = (
      await this.userRepository.find({
        where: { email },
      })
    )[0];
    if (!user) {
      throw new NotFoundException(`Could not find resource with id ${email}`);
    }
    if (user.roles.includes(RoleType.BUSINESS_OWNER)) {
      return user;
    }
    const resource = await this.resourceService.findResourceByEmail(email);
    return resource;
  }
}
