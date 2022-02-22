import { Body, Controller, Get, Post } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { Message } from '@tempus/api-interfaces'
import { SlimUserDto } from '@tempus/datalayer'

import { AppService } from './app.service'

@ApiTags('app')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post('create-user')
  async createUserSwaggerExample(@Body() createUserDto: SlimUserDto) {
    this.appService.createUser()
  }

  @Get('hello')
  getData(): Message {
    return this.appService.getData()
  }

  @Get('create')
  makeUser() {
    this.appService.createUser()
  }
  @Get('getuser')
  getUser() {
    return this.appService.getUser()
  }
}
