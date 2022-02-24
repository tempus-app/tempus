import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { ResourceEntity, UserEntity, User, Resource, CreateUserDto, EditUserDto } from '@tempus/datalayer'
import { ResourceService } from '../services/resource.service'
import { UserService } from '../services/user.service'

@ApiTags('User')
@Controller('user')
export class UserController {
  constructor(private userService: UserService, private resourceService: ResourceService) {}

  @Get()
  // TODO: filtering
  async getUsers(): Promise<User[]> {// @Query() location: string[] | string,
  // @Query() skills: string[] | string,
  // @Query() title: string[] | string,
  // @Query() project: string[] | string,
  // @Query() status: string[] | string,
    return await this.userService.getAllUsers()
  }

  @Get('resources')
  async getResources(): Promise<ResourceEntity[]> {
    return await this.resourceService.getAllResources();
  }

  //gets a User  (includes resource)
  @Get(':userId')
  async getUser(@Param('userId') userId: number): Promise<UserEntity | ResourceEntity> {
    return await this.userService.getUser(userId)
  }

  //creates User (includes resource)
  @Post()
  async createUser(@Body() user: CreateUserDto): Promise<User | Resource> {
    return await this.userService.createUser(CreateUserDto.toEntity(user))
  }

  //updates user information  (includes resource)
  @Patch(':userId')
  async editUser(@Body() user: EditUserDto): Promise<User | Resource> {
    return await this.userService.editUser(EditUserDto.toEntity(user))
  }

  @Delete(':userId')
  async deleteUser(@Param('userId') userId: number): Promise<void> {
    return await this.userService.deleteUser(userId);
  }
}
