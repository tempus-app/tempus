import { Body, Controller, Get, NotImplementedException, Param, Patch, Post, Query, UseGuards } from '@nestjs/common'
import { CreateUserDto, ResourceEntity, RoleType, UserEntity } from '@tempus/datalayer'
import { JwtAuthGuard } from '@tempus/api-auth'
import { ResourceService } from '../services/resource.service'
import { UserService } from '../services/user.service'
import { Roles } from '@tempus/api-auth'
import { RolesGuard } from '@tempus/api-auth'

@Controller('User')
export class UserController {
  constructor(private userService: UserService, private resourceService: ResourceService) {}

  //creates User (includes resource)
  @Post()
  async createUser(@Body() user: Omit<CreateUserDto, 'id'>): Promise<UserEntity | ResourceEntity> {
    throw new NotImplementedException()
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RoleType.BUSINESS_OWNER)
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
  async editUser(@Param('userId') userId: number, @Body() user: CreateUserDto): Promise<UserEntity | ResourceEntity> {
    throw new NotImplementedException()
  }
}
