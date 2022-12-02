import { Body, Controller, Get, Param, Patch, Post, Query, UseGuards, Request } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CreateLinkDto, UpdatelinkDto } from '@tempus/api/shared/dto';
import { LinkEntity } from '@tempus/api/shared/entity';
import { JwtAuthGuard, Roles, RolesGuard } from '@tempus/api/shared/feature-auth';
import { Link, RoleType } from '@tempus/shared-domain';
import { LinkService } from '../services/link.service';

@ApiTags('Link Components')
@Controller('link')
export class LinkController {
	constructor(private linkService: LinkService) {}

	// Generates a link
  @UseGuards(JwtAuthGuard, RolesGuard)
	@Roles(RoleType.BUSINESS_OWNER, RoleType.SUPERVISOR)
	@Post('/')
	async createLink(@Request() req): Promise<Link> {
    const createLinkDto: CreateLinkDto = req.body;
		const linkEntity: LinkEntity = LinkEntity.fromDto(createLinkDto);
		return this.linkService.createLink(req.user, linkEntity, createLinkDto.projectId);
	}

	// UPDATES:

	// updates link status
  @UseGuards(JwtAuthGuard, RolesGuard)
	@Roles(RoleType.BUSINESS_OWNER, RoleType.SUPERVISOR)
	@Patch('/:linkId')
	async editLinkStatus(@Body() updatelinkDto: UpdatelinkDto): Promise<Link> {
		return this.linkService.editLink(updatelinkDto);
	}

	// gets link information, should verify validity
	@Get('/:linkId')
	async getLink(@Param('linkId') linkId: number): Promise<Link> {
		return this.linkService.findLinkById(linkId);
	}

	@Get('/')
	async getLinkByToken(@Query('token') token: string): Promise<Link> {
		return this.linkService.findLinkByToken(token);
	}
}
