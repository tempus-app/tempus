import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AssignProjectDto, CreateProjectDto, UpdateProjectDto } from '@tempus/api/shared/dto';
import { JwtAuthGuard, Roles, RolesGuard } from '@tempus/api/shared/feature-auth';
import { Project, ProjectStatus, RoleType } from '@tempus/shared-domain';
import { ProjectService } from '../services/project.service';

@ApiTags('Projects')
@Controller('project')
export class ProjectController {
	constructor(private projectService: ProjectService) {}

	@UseGuards(JwtAuthGuard)
	@Get('/:projectId')
	async getProject(@Param('projectId') projectId: number): Promise<Project> {
		return this.projectService.getProject(projectId);
	}

	@UseGuards(JwtAuthGuard)
	@Get('/')
	async getAllProjects(
		@Query('page') page: number,
		@Query('pageSize') pageSize: number,
	): Promise<{ projectData: Project[]; totalItems: number }> {
		return this.projectService.getAllProjects(page, pageSize);
	}

	//@UseGuards(JwtAuthGuard)
	@Get('/client/:clientId')
	async getClientProjects(@Param('clientId') clientId: number) {
		return this.projectService.getClientProjects(clientId);
	}

	@UseGuards(JwtAuthGuard, RolesGuard)
	@Roles(RoleType.BUSINESS_OWNER)
	@Post('/')
	async createProject(@Body() createProjectDto: CreateProjectDto): Promise<Project> {
		return this.projectService.createProject(createProjectDto);
	}

	@UseGuards(JwtAuthGuard, RolesGuard)
	@Roles(RoleType.BUSINESS_OWNER, RoleType.SUPERVISOR)
	@Patch('/:projectId/:resourceId/assign')
	async assignResourceToProject(
		@Param('projectId') projectId: string,
		@Param('resourceId') resourceId: string,
		@Body() assignProjectDto: AssignProjectDto,
	): Promise<void> {
		await this.projectService.assignResourceToProject(
			parseInt(projectId, 10),
			parseInt(resourceId, 10),
			assignProjectDto,
		);
	}

	@UseGuards(JwtAuthGuard, RolesGuard)
	@Roles(RoleType.BUSINESS_OWNER)
	@Patch('/:projectId/:resourceId/unassign')
	async unassignResourceToProject(
		@Param('projectId') projectId: number,
		@Param('resourceId') resourceId: number,
	): Promise<void> {
		return this.projectService.unassignResourceFromProject(projectId, resourceId);
	}

	@UseGuards(JwtAuthGuard, RolesGuard)
	@Roles(RoleType.BUSINESS_OWNER, RoleType.SUPERVISOR)
	@Patch('/:projectId')
	async editProject(@Body() updateProjectDto: UpdateProjectDto): Promise<Project> {
		return this.projectService.updateProject(updateProjectDto);
	}

	@UseGuards(JwtAuthGuard, RolesGuard)
	@Roles(RoleType.BUSINESS_OWNER, RoleType.SUPERVISOR)
	@Patch('/:projectId/updateStatus')
	async completeProject(
    @Param('projectId') projectId: number,
    @Query('status') status: ProjectStatus): Promise<Project> {
		return this.projectService.updateProjStatus(projectId, status);
	}

	@UseGuards(JwtAuthGuard, RolesGuard)
	@Roles(RoleType.BUSINESS_OWNER, RoleType.SUPERVISOR)
	@Delete('/:clientId')
	async deleteProject(@Param('projectId') projectId: number) {
		return this.projectService.deleteProject(projectId);
	}
}
