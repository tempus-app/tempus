import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Message } from '@tempus/api-interfaces';
import { Repository } from 'typeorm';
import { RoleType, ResourceEntity, UserEntity } from '@tempus/datalayer';

@Injectable()
export class AppService {
  constructor(
    @InjectRepository(UserEntity) private userRepo: Repository<UserEntity>,
    @InjectRepository(ResourceEntity) private resourceRepo: Repository<ResourceEntity>,
  ) {}

  getData(): Message {
    return { message: 'Welcome to api!' };
  }

  createUser() {
    const newUser = new UserEntity();
    newUser.firstName = 'testF';
    newUser.lastName = 'testL';
    newUser.email = 'email@email.com';
    newUser.password = 'fred';
    const roles = [RoleType.BUSINESS_OWNER];
    newUser.roles = roles;
    this.userRepo.save(newUser);

    const newResource = new ResourceEntity();
    newResource.email = 'email';
    const resRoles = [RoleType.AVAILABLE_RESOURCE, RoleType.SUPERVISOR];
    newResource.roles = resRoles;

    this.resourceRepo.save(newResource);
  }

  async getUser() {
    const users = await this.resourceRepo.find();
    const usersRoles = [];
    users.forEach((user) => {
      usersRoles.push(user.roles);
    });
    return { data: users, roles: usersRoles };
  }
}
