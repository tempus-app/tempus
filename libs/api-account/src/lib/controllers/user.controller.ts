import { Body, Controller, Get, NotImplementedException, Param, Patch, Post, Query, UseGuards } from '@nestjs/common'
import { LocalAuthGuard } from 'libs/api-auth/src/lib/local-auth.guard'
import { ResourceEntity, User, UserEntity } from '..'
import { ResourceService } from '../services/resource.service'
import { UserService } from '../services/user.service'

@Controller('User')
export class UserController {
  constructor(private userService: UserService, private resourceService: ResourceService) {}

  //creates User (includes resource)
  @Post()
  async createUser(@Body() user: Omit<User, 'id'>): Promise<UserEntity | ResourceEntity> {
    throw new NotImplementedException()
  }

  @UseGuards(LocalAuthGuard)
  @Get()
  async getAllUsers(
    @Query() location: string[] | string,
    @Query() skill: string[] | string,
    @Query() title: string[] | string,
    @Query() project: string[] | string,
    @Query() status: string[] | string,
  ): Promise<ResourceEntity> {
    throw new NotImplementedException()
  }

  //gets a User  (includes resource)
  @Get('/:userId')
  async getUser(@Param('userId') userId: number): Promise<UserEntity | ResourceEntity> {
    throw new NotImplementedException()
  }

  //updates user information  (includes resource)
  @Patch('/:userId')
  async editUser(@Param('userId') userId: number, @Body() user: User): Promise<UserEntity | ResourceEntity> {
    throw new NotImplementedException()
  }
}
