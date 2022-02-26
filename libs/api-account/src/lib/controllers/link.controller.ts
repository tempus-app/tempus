import { Body, Controller, Get, NotImplementedException, Param, Patch, Post } from '@nestjs/common';
import { SlimLinkDto, LinkEntity, StatusType } from '@tempus/datalayer';
import { SlimUserDto } from 'libs/datalayer/src/lib/dtos/account-dtos/user/slimUser.dto';
import { LinkService } from '../services/link.service';

@Controller('link')
export class LinkController {
  constructor(private linkService: LinkService) {}

  // Generates a link
  @Post()
  async createLink(@Body() link: Omit<SlimLinkDto, 'id'>): Promise<LinkEntity> {
    throw new NotImplementedException();
  }

  // gets link information, should verify validity
  @Get('/:linkId')
  async getLink(@Param('linkId') linkId: number): Promise<LinkEntity> {
    throw new NotImplementedException();
  }

  // updates link status
  @Patch('status/:linkId')
  async editLinkStatus(@Param('linkId') linkId: number, @Body() status: StatusType): Promise<LinkEntity> {
    throw new NotImplementedException();
  }

  // associate link to user
  @Post('/user/:linkId')
  async associateUserToLink(@Param('linkId') linkId: number, @Body() user: SlimUserDto) {
    throw new NotImplementedException();
  }
}
