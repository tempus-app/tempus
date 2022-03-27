/* eslint-disable @typescript-eslint/return-await */
import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards, Request } from '@nestjs/common';
import { Resource, RoleType, User } from '@tempus/shared-domain';
import { JwtAuthGuard, Roles, RolesGuard } from '@tempus/api/shared/feature-auth';
import { ApiTags } from '@nestjs/swagger';
import { CreateUserDto, CreateResourceDto, UpdateUserDto, UpdateResourceDto } from '@tempus/api/shared/dto';
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

	// creates User
	@Post()
	async createUser(@Body() user: CreateUserDto): Promise<User> {
		return this.userService.createUser(user);
	}

	// creates Resource
	@Post('resource')
	async createResource(@Body() user: CreateResourceDto): Promise<Resource> {
		return await this.resourceService.createResource(user);
	}

	// updates User information
	@UseGuards(JwtAuthGuard)
	@Patch()
	async updateUser(@Request() req, @Body() updateUserData: UpdateUserDto): Promise<User> {
		return await this.userService.updateUser(updateUserData, req.user);
	}

	// update Resource information
	@UseGuards(JwtAuthGuard)
	@Patch('resource')
	async updateResource(@Request() req, @Body() updateResourceData: UpdateResourceDto): Promise<Resource> {
		return await this.resourceService.editResource(updateResourceData, req.user);
	}

	// delete User or Resource
	@UseGuards(JwtAuthGuard)
	@Delete(':userId')
	async deleteUser(@Request() req, @Param('userId') userId: number): Promise<void> {
		return this.userService.deleteUser(userId, req.user);
	}
}
