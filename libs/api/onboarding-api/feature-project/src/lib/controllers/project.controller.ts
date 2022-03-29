import { Body, Controller, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CreateProjectDto, UpdateProjectDto } from '@tempus/api/shared/dto';
import { JwtAuthGuard } from '@tempus/api/shared/feature-auth';
import { Project } from '@tempus/shared-domain';
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
	async getAllProjects(): Promise<Project[]> {
		return this.projectService.getAllProjects();
	}

	@Post('/')
	async createProject(@Body() createProjectDto: CreateProjectDto): Promise<Project> {
		return this.projectService.createProject(createProjectDto);
	}

	@Post('/:projectId/assign')
	async assignResourceToProject(
		@Param('projectId') projectId: number,
		@Query('resourceId') resourceId: number,
	): Promise<Project> {
		return this.projectService.assignResourceToProject(projectId, resourceId);
	}

	@Patch('/:projectId')
	async editProject(@Body() updateProjectDto: UpdateProjectDto): Promise<Project> {
		return this.projectService.updateProject(updateProjectDto);
	}
}
