import { Body, Controller, Get, Param, Patch, Post, Query } from '@nestjs/common'
import { ResourceEntity, UserEntity, User, Resource, CreateUserDto } from '@tempus/datalayer'
import { UserService } from '../services/user.service'

@Controller('User')
export class UserController {
  constructor(private userService: UserService) {}

  @Get()
  // TODO: filtering
  async getUsers(
    @Query() location: string[] | string,
    @Query() skills: string[] | string,
    @Query() title: string[] | string,
    @Query() project: string[] | string,
    @Query() status: string[] | string,
  ): Promise<User[]> {
    return await this.userService.getAllUsers(location, skills, title, project, status)
  }

  //gets a User  (includes resource)
  @Get('/:userId')
  async getUser(@Param('userId') userId: number): Promise<UserEntity | ResourceEntity> {
    return await this.userService.getUser(userId)
  }

  //creates User (includes resource)
  @Post()
  async createUser(@Body() user: CreateUserDto): Promise<User | Resource> {
    return await this.userService.createrUser(CreateUserDto.toEntity(user))
  }

  //updates user information  (includes resource)
  @Patch(':userId')
  async editUser(@Param('userId') userId: number, @Body() user: CreateUserDto): Promise<User | Resource> {
    return await this.userService.editUser(userId, user)
  }
}
