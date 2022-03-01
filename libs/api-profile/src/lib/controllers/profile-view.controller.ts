import { Body, Controller, Delete, Get, NotImplementedException, Param, Patch, Post, Req } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CreateViewDto, View, ViewEntity } from '@tempus/datalayer';
import { ViewsService } from '../services/view.service';

@ApiTags('Profile Views')
@Controller('profile-view')
export class ProfileViewController {
	constructor(private viewSerivce: ViewsService) {}

	// all views of user
	@Get('/:userId')
	async getViews(@Param('userId') userId: number): Promise<View[]> {
		return await this.viewSerivce.getViewsByResource(userId);
	}

	@Get('/:viewId')
	async getView(@Param('viewId') viewId: number): Promise<View> {
		return await this.viewSerivce.getView(viewId);
	}

	@Post('/:resourceId')
	async createView(@Param('resourceId') resourceId: number, @Body() createViewDto: CreateViewDto): Promise<View> {
		return await this.viewSerivce.createView(resourceId, createViewDto);
	}

	// will be used whenever someone edits within a view and presses save
	// this should call the view service which should call individ services and CREATE new things, not edit
	// ONLY when you edit on the main table page does it actually edit
	@Patch()
	async editView(@Body() view: any): Promise<View> {
		throw new NotImplementedException();
	}

	@Delete('/:viewId')
	async deleteView(@Param('viewId') viewId: number) {
		return await this.viewSerivce.deleteView(viewId);
	}
}
