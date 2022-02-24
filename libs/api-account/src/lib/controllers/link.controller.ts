import { Body, Controller, Get, NotImplementedException, Param, Patch, Post, Query } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { CreateLinkDto, Link, LinkEntity, UpdatelinkDto } from '@tempus/datalayer'
import { LinkService } from '../services/link.service'

@ApiTags('Link Components')
@Controller('link')
export class LinkController {
  constructor(private linkService: LinkService) {}

  //Generates a link
  @Post('/')
  async createLink(@Body() createLinkDto: CreateLinkDto): Promise<Link> {
    let LinkEntity: LinkEntity = CreateLinkDto.toEntity(createLinkDto)
    return this.linkService.createLink(LinkEntity)
  }

  //UPDATES:

  //updates link status
  @Patch('/')
  async editLinkStatus(@Body() link: UpdatelinkDto): Promise<Link> {
    throw new NotImplementedException()
  }

  //associate link to user
  @Patch('/:userId')
  async associateUserToLink(@Param('userId') userId, @Body() link: UpdatelinkDto) {
    throw new NotImplementedException()
  }

  //gets link information, should verify validity
  @Get('/:linkId')
  async getLink(@Param('linkId') linkId: number): Promise<Link> {
    return await this.linkService.findLinkById(linkId)
  }

  @Get('/')
  async getLinkByToken(@Query('token') token: string): Promise<Link> {
    return this.linkService.findLinkByToken(token)
  }
}
