/* eslint-disable @typescript-eslint/return-await */
import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import {
	CreateResourceDto,
	CreateUserDto,
	Resource,
	RoleType,
	UpdateResourceDto,
	UpdateUserDto,
	User,
} from '@tempus/shared-domain';
import { JwtAuthGuard, Roles, RolesGuard } from '@tempus/api/shared/feature-auth';
import { ApiTags } from '@nestjs/swagger';
import { ResourceService } from '../services/resource.service';
import { UserService } from '../services/user.service';

@ApiTags('User')
@Controller('user')
export class UserController {
	constructor(private userService: UserService, private resourceService: ResourceService) {}

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

	@Get('resources')
	async getResources(): Promise<Resource[]> {
		return this.resourceService.getAllResources();
	}

	// gets a User  (includes resource)
	@Get(':userId')
	async getUser(@Param('userId') userId: number): Promise<User | Resource> {
		return this.userService.getUser(userId);
	}

	// creates User (includes resource)
	@Post()
	async createUser(@Body() user: CreateUserDto): Promise<User | Resource> {
		// if (user.roles.includes(RoleType.BUSINESS_OWNER)) {
		return this.userService.createUser(user);
		// return this.resourceService.createResource(user as CreateResourceDto);
	}

	@Post('resource')
	async createResource(@Body() user: CreateResourceDto): Promise<Partial<Resource>> {
		return await this.resourceService.createResource(user as CreateResourceDto);
	}

	// updates user information  (includes resource)
	@Patch()
	async updateUser(@Body() updateUserData: UpdateUserDto): Promise<User> {
		return await this.userService.updateUser(updateUserData);
	}

	@Patch('resource')
	async updateResource(@Body() updateResourceData: UpdateResourceDto): Promise<Resource> {
		return await this.resourceService.editResource(updateResourceData);
	}

	@Delete(':userId')
	async deleteUser(@Param('userId') userId: number): Promise<void> {
		return this.userService.deleteUser(userId);
	}
}
