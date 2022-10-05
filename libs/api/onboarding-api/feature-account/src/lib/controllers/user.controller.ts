/* eslint-disable @typescript-eslint/return-await */
import {
	Body,
	Controller,
	Delete,
	Get,
	Param,
	Patch,
	Post,
	UseGuards,
	Request,
	UseInterceptors,
	UploadedFile,
	StreamableFile,
	Res,
} from '@nestjs/common';
import { Resource, RoleType, User } from '@tempus/shared-domain';
import { JwtAuthGuard, Roles, RolesGuard, PermissionGuard } from '@tempus/api/shared/feature-auth';
import { ApiTags } from '@nestjs/swagger';
import {
	CreateUserDto,
	CreateResourceDto,
	UpdateUserDto,
	UpdateResourceDto,
	UserProjectClientDto,
} from '@tempus/api/shared/dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { Express, Response } from 'express';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Multer } from 'multer'; // hack to use mutler
import { ResourceService } from '../services/resource.service';
import { UserService } from '../services/user.service';

@ApiTags('User')
@Controller('user')
export class UserController {
	constructor(
		private userService: UserService,
		private resourceService: ResourceService, // private authService: AuthService,
	) {}

	@UseGuards(JwtAuthGuard, RolesGuard)
	@Roles(RoleType.BUSINESS_OWNER)
	@Get()
	// TODO: filtering
	async getUsers(): Promise<User[]> {
		// @Query() location: string[] | string,
		// @Query() skills: string[] | string,
		// @Query() title: string[] | string,
		// @Query() project: string[] | string,
		// @Query() status: string[] | string,
		return this.userService.getAllUsers();
	}

	@UseGuards(JwtAuthGuard, RolesGuard)
	@Roles(RoleType.BUSINESS_OWNER)
	@Get('basic')
	async getAllResourceProjInfo(): Promise<UserProjectClientDto[]> {
		return this.resourceService.getAllResourceProjectInfo();
	}

	@UseGuards(JwtAuthGuard, RolesGuard)
	@Roles(RoleType.BUSINESS_OWNER)
	@Get('resources')
	async getResources(): Promise<Resource[]> {
		return this.resourceService.getAllResources();
	}

	// gets a User or Resource
	@UseGuards(JwtAuthGuard)
	@Get('user')
	async getUser(@Request() req): Promise<User | Resource> {
		return this.userService.getUser(req.user);
	}

	// Gets a Resource
	@UseGuards(JwtAuthGuard)
	@Get('/:userId')
	async getUserByID(@Param('userId') userId: number): Promise<Resource> {
		const user = await this.resourceService.getResource(userId);
		return user;
	}

	// creates User
	@Post()
	async createUser(@Body() user: CreateUserDto): Promise<User> {
		return this.userService.createUser(user);
	}

	// creates Resource
	@Post('resource')
	async createResource(@Body() user: CreateResourceDto): Promise<Resource> {
		return this.resourceService.createResource(user);
	}

	@Patch(':resourceId/resume')
	@UseInterceptors(FileInterceptor('resume'))
	async saveResume(
		@Param('resourceId') resourceId: number,
		@UploadedFile() resume: Express.Multer.File,
	): Promise<void> {
		return this.resourceService.saveResume(resourceId, resume);
	}

	@Get(':resourceId/resume')
	async getResume(
		@Param('resourceId') resourceId: number,
		@Res({ passthrough: true }) res: Response,
	): Promise<StreamableFile> {
		res.set({ 'Content-Type': 'application/pdf' });
		return this.resourceService.getResume(resourceId);
	}

	// updates User information
	@UseGuards(JwtAuthGuard, PermissionGuard)
	@Patch()
	async updateUser(@Body() updateUserData: UpdateUserDto): Promise<User> {
		return await this.userService.updateUser(updateUserData);
	}

	// update Resource information
	@Patch('resource')
	async updateResource(@Body() updateResourceData: UpdateResourceDto): Promise<Resource> {
		return await this.resourceService.editResource(updateResourceData);
	}

	// delete User or Resource
	@UseGuards(JwtAuthGuard, PermissionGuard)
	@Delete(':userId')
	async deleteUser(@Param('userId') userId: number): Promise<void> {
		return this.userService.deleteUser(userId);
	}
}
