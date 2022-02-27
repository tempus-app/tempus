import { Body, Controller, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CreateLinkDto, Link, LinkEntity, UpdatelinkDto } from '@tempus/datalayer';
import { LinkService } from '../services/link.service';

@ApiTags('Link Components')
@Controller('link')
export class LinkController {
	constructor(private linkService: LinkService) {}

	// Generates a link
	@Post('/')
	async createLink(@Body() createLinkDto: CreateLinkDto): Promise<Link> {
		const linkEntity: LinkEntity = CreateLinkDto.toEntity(createLinkDto);
		return this.linkService.createLink(linkEntity);
	}

	// UPDATES:

	// updates link status
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
