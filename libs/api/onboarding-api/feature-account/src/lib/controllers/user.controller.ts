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
	Query,
	ParseArrayPipe,
} from '@nestjs/common';
import { AzureAccount, Project, Resource, RoleType, User } from '@tempus/shared-domain';
// eslint-disable-next-line @nrwl/nx/enforce-module-boundaries
import { JwtAuthGuard, Roles, RolesGuard, PermissionGuard } from '@tempus/api/shared/feature-auth';
import { ApiTags } from '@nestjs/swagger';
import {
	CreateUserDto,
	CreateResourceDto,
	UpdateUserDto,
	UpdateResourceDto,
	UserProjectClientDto,
	ResourceBasicDto,
} from '@tempus/api/shared/dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { Express, Response } from 'express';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Multer } from 'multer'; // hack to use mutler
import { ResourceService } from '../services/resource.service';
import { UserService } from '../services/user.service';
import { GraphService } from '../services/graph.service';
import { Client } from '@microsoft/microsoft-graph-client';
import { ClientEntity } from '@tempus/api/shared/entity';

@ApiTags('User')
@Controller('user')
export class UserController {
	constructor(
		private userService: UserService,
		private resourceService: ResourceService,
		private graphService: GraphService,
	) {}

	@UseGuards(JwtAuthGuard, RolesGuard)
	@Roles(RoleType.BUSINESS_OWNER, RoleType.SUPERVISOR)
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
	@Roles(RoleType.BUSINESS_OWNER, RoleType.SUPERVISOR)
	@Get('searchableTerms')
	async getAllSearchableTerms(): Promise<string[]> {
		return this.resourceService.getAllSearchableTerms();
	}

	@UseGuards(JwtAuthGuard, RolesGuard)
	@Roles(RoleType.BUSINESS_OWNER, RoleType.SUPERVISOR)
	@Get('resProjects')
	async getAllResourceProjInfo(
		@Query('page') page: number,
		@Query('pageSize') pageSize: number,
		@Query('filter') filter: string,
		@Query('country') country?: string,
		@Query('province') province?: string,
		@Query('roleType', new ParseArrayPipe({ items: String, separator: ',', optional: true })) roleType?: RoleType[],
	): Promise<{ userProjClientData: UserProjectClientDto[]; totalItems: number }> {
		return this.resourceService.getAllResourceProjectInfo(page, pageSize, filter, roleType, country, province);
	}

	//@UseGuards(JwtAuthGuard, RolesGuard)
	@Roles(RoleType.BUSINESS_OWNER, RoleType.SUPERVISOR)
	@Get('resources')
	async getResources(): Promise<Resource[]> {
		return this.resourceService.getAllResources();
	}

	@UseGuards(JwtAuthGuard)
	@Get('supervisors')
	async getSupervisors(): Promise<User[]> {
		return this.userService.getAllSupervisors();
	}

	@UseGuards(JwtAuthGuard, RolesGuard)
	@Roles(RoleType.BUSINESS_OWNER, RoleType.SUPERVISOR)
	@Get('resourcesBasic')
	async getResourcesBasic(): Promise<ResourceBasicDto[]> {
		return this.resourceService.getAllResourcesBasic();
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

	@Get('/info/:userId')
	async getUserInfoByID(@Param('userId') userId: number): Promise<User> {
		const user = await this.userService.getUserbyId(userId);
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

	// creates Azure AD account for resource
	@Post('/azureAccount/:resourceId')
	async createResourceAzureAccount(@Param('resourceId') resourceId: number): Promise<AzureAccount> {
		return this.graphService.createUser(resourceId);
	}

	// deletes Azure AD account for resource
	@UseGuards(JwtAuthGuard, RolesGuard)
	@Roles(RoleType.BUSINESS_OWNER)
	@Delete('/azureAccount/:resourceId')
	async deleteResourceAzureAccount(@Param('resourceId') resourceId: number): Promise<void> {
		return this.graphService.deleteUser(resourceId);
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
	@UseGuards(JwtAuthGuard, PermissionGuard)
	@Patch('resource')
	async updateResource(@Body() updateResourceData: UpdateResourceDto): Promise<Resource> {
		console.log("hello");
		console.log(updateResourceData);
		return await this.resourceService.editResource(updateResourceData);
	}

	// delete User or Resource
	@UseGuards(JwtAuthGuard, PermissionGuard)
	@Delete(':userId')
	async deleteUser(@Param('userId') userId: number, @Request() req): Promise<void> {
		return this.userService.deleteUser(req.user, userId);
	}

	@Patch('assign/:supervisorId/:resourceId')
	async assignSupervisorToResource(
		@Param('resourceId') resourceId: number,
		@Param('supervisorId') supervisorId: number,
		): Promise<Resource> {
		return this.resourceService.assignSupervisorToResource(
			supervisorId,
			resourceId
		);
	}

	@Get('resource/projects/:resourceId')
	async getResourceProjects(
		@Param('resourceId') resourceId: number,
	): Promise<Project[]>{
		return this.resourceService.getResourceProjects(resourceId);
	}

	@Get('resource/clients/:resourceId')
	async getResourceClients(
		@Param('resourceId') resourceId: number,
	): Promise<ClientEntity[]>{
		return this.resourceService.getResourceClients(resourceId);
	}

	@Get('supervisor/projects/:supervisorId')
	async getSupervisorProjects(
		@Param('supervisorId') supervisorId: number,
	): Promise<Project[]>{
		return this.userService.getSupervisorProjects(supervisorId);
	}

	@Get('supervisor/resources/:supervisorId')
	async getSupervisorResourcess(
		@Param('supervisorId') supervisorId: number,
	): Promise<Resource[]>{
		return this.userService.getSupervisorResources(supervisorId);
	}

	@Get('supervisor/clients/:supervisorId')
	async getSupervisorClients(
		@Param('supervisorId') supervisorId: number,
	): Promise<ClientEntity[]>{
		return this.userService.getSupervisorClients(supervisorId);
	}

	@Get('client/projects/:clientId')
	async getClientProjects(
		@Param('clientId') clientId: number,
	): Promise<Project[]>{
		return this.userService.getClientProjects(clientId);
	}

	@Get('client/resources/:clientId')
	async getClientResourcess(
		@Param('clientId') clientId: number,
	): Promise<Resource[]>{
		return this.userService.getClientResources(clientId);
	}

}
