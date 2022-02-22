import { Body, Controller, Get, Param, Patch, Post, Query } from '@nestjs/common'
import { FullResourceDto, FullUserDto, ResourceEntity, UserEntity, SlimUserDto } from '@tempus/datalayer'
import { ResourceService } from '../services/resource.service'
import { UserService } from '../services/user.service'

@Controller('User')
export class UserController {
  constructor(private userService: UserService) {}

  @Get('')
  // TODO: filtering
  async getUsers(
    @Query() location: string[] | string,
    @Query() skills: string[] | string,
    @Query() title: string[] | string,
    @Query() project: string[] | string,
    @Query() status: string[] | string,
  ): Promise<FullUserDto[]> {
    return await this.userService.getAllUsers(location, skills, title, project, status)
  }

  //gets a User  (includes resource)
  @Get('/:userId')
  async getUser(@Param('userId') userId: number): Promise<UserEntity | ResourceEntity> {
    return await this.userService.getUser(userId)
  }

  //creates User (includes resource)
  @Post()
  async createUser(@Body() user: Omit<FullResourceDto | FullUserDto, 'id'>): Promise<FullUserDto | FullResourceDto> {
    return await this.userService.createrUser(user)
  }

  //updates user information  (includes resource)
  @Patch('')
  async editUser(@Body() user: SlimUserDto): Promise<UserEntity | ResourceEntity> {
    return await this.userService.editUser(user)
  }
}
