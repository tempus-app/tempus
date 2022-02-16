import { Body, Controller, Get, NotImplementedException, Param, Patch, Post, Query, Req } from '@nestjs/common'
import { Link, LinkEntity, User } from '..'
import { StatusType } from '../models/status'
import { LinkService } from '../services/link.service'

@Controller('link')
export class LinkController {
  constructor(private linkService: LinkService) {}

  //Generates a link
  @Post()
  async createLink(@Body() link: Omit<Link, 'id'>): Promise<LinkEntity> {
    throw new NotImplementedException()
  }

  //gets link information, should verify validity
  @Get('/:linkId')
  async getLink(@Param('linkId') linkId: number): Promise<LinkEntity> {
    throw new NotImplementedException()
  }

  @Patch('status/:linkId')
  async editLinkStatus(@Param('linkId') linkId: number, @Body() status: StatusType): Promise<LinkEntity> {
    throw new NotImplementedException()
  }

  @Post('/user/:linkId')
  async associateUserToLink(@Param('linkId') linkId: number, @Body() user: User) {
    throw new NotImplementedException()
  }
}
