import {
	Body,
	Controller,
	Delete,
	Get,
	Param,
	Post,
	UseGuards,
	Request,
	Patch,
	NotImplementedException,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CreateViewDto } from '@tempus/api/shared/dto';
import { Revision, RoleType, View } from '@tempus/shared-domain';
import { JwtAuthGuard, PermissionGuard, Roles, RolesGuard, ViewsGuard } from '@tempus/api/shared/feature-auth';
import { ViewsService } from '../services/view.service';

@ApiTags('Profile Views')
@Controller('profile-view')
export class ProfileViewController {
	constructor(private viewSerivce: ViewsService) {}

	// all views of user
	@UseGuards(JwtAuthGuard, PermissionGuard)
	@Get('/:userId')
	async getViews(@Param('userId') userId: number): Promise<View[]> {
		const views = await this.viewSerivce.getViewsByResource(userId);
		return views;
	}

	@UseGuards(JwtAuthGuard, ViewsGuard)
	@Get('/view/:viewId')
	async getView(@Param('viewId') viewId: number): Promise<View> {
		const view = await this.viewSerivce.getView(viewId);
		return view;
	}

	@UseGuards(JwtAuthGuard)
	@Post('/approve/:viewId')
	async approveView(@Param('viewId') viewId: number): Promise<Revision> {
		throw new NotImplementedException();
	}

	@UseGuards(JwtAuthGuard, PermissionGuard)
	@Post('/:resourceId')
	async createView(@Param('resourceId') resourceId: number, @Body() createViewDto: CreateViewDto): Promise<View> {
		const newView = await this.viewSerivce.createView(resourceId, createViewDto);
		return newView;
	}

	@UseGuards(JwtAuthGuard)
	@Patch('/:resourceId/:viewId')
	async editView(
		@Param('resourceId') resourceId: number,
		@Param('viewId') viewId: number,
		@Body() createViewDto: CreateViewDto,
	): Promise<Revision> {
		const revision = await this.viewSerivce.reviseView(resourceId, viewId, createViewDto);
		return revision;
	}

	@UseGuards(JwtAuthGuard, ViewsGuard)
	@Delete('/:viewId')
	async deleteView(@Param('viewId') viewId: number): Promise<void> {
		await this.viewSerivce.deleteView(viewId);
	}
}
