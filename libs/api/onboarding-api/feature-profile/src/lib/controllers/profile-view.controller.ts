import { Body, Controller, Delete, Get, Param, Post, UseGuards, Request } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CreateViewDto } from '@tempus/api/shared/dto';
import { RoleType, View } from '@tempus/shared-domain';
import { JwtAuthGuard, PermissionGuard, Roles, RolesGuard } from '@tempus/api/shared/feature-auth';
import { ViewsService } from '../services/view.service';

@ApiTags('Profile Views')
@Controller('profile-view')
export class ProfileViewController {
	constructor(private viewSerivce: ViewsService) {}

	// all views of user
	@UseGuards(JwtAuthGuard, PermissionGuard)
	@Get('/:userId')
	async getViews(@Request() req, @Param('userId') userId: number): Promise<View[]> {
		const views = await this.viewSerivce.getViewsByResource(userId);
		return views;
	}

	@UseGuards(JwtAuthGuard)
	@Get('/:viewId')
	async getView(@Param('viewId') viewId: number): Promise<View> {
		const view = await this.viewSerivce.getView(viewId);
		return view;
	}

	@UseGuards(JwtAuthGuard, PermissionGuard)
	@Post('/:resourceId')
	async createView(@Param('resourceId') resourceId: number, @Body() createViewDto: CreateViewDto): Promise<View> {
		const newView = await this.viewSerivce.createView(resourceId, createViewDto);
		return newView;
	}

	// will be used whenever someone edits within a view and presses save
	// this should call the view service which should call individ services and CREATE new things, not edit
	// ONLY when you edit on the main table page does it actually edit
	// @Patch()
	// async editView(@Body() view: any): Promise<View> {
	// 	throw new NotImplementedException();
	// }

	@UseGuards(JwtAuthGuard)
	@Delete('/:viewId')
	async deleteView(@Param('viewId') viewId: number): Promise<void> {
		await this.viewSerivce.deleteView(viewId);
	}
}
