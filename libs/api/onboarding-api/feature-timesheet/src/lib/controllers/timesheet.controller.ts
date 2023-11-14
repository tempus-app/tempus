import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard, Roles } from '@tempus/api/shared/feature-auth';
import { RoleType, Timesheet } from '@tempus/shared-domain';
import { ApproveTimesheetDto, CreateTimesheetDto, UpdateTimesheetDto } from '@tempus/api/shared/dto';
import { TimesheetService } from '../services/timesheet.service';
import { Time } from '@faker-js/faker/time';

@ApiTags('Timesheet')
@Controller('timesheet')
export class TimesheetController {
	constructor(private timesheetService: TimesheetService) {}

	@UseGuards(JwtAuthGuard)
	@Get('/:timesheetId')
	async getTimesheet(@Param('timesheetId') timesheetId: number) :Promise<Timesheet> {
		const timesheet = await this.timesheetService.getTimesheet(timesheetId);
		return timesheet;
	}

	@UseGuards(JwtAuthGuard)
	@Get('resource-timesheets/:resourceId')
	async getTimesheetsForResource(
		@Param('resourceId') resourceId: number,
		@Query('page') page: number,
		@Query('pageSize') pageSize: number,
	): Promise<{ timesheets: Timesheet[]; totalTimesheets: number }> {
		const timesheetsAndCount = await this.timesheetService.getAllTimesheetsByResourceId(resourceId, page, pageSize);
		return timesheetsAndCount;
	}

	@UseGuards(JwtAuthGuard)
	@Get('supervisor-timesheets/:supervisorId')
	async getTimesheetsForSupervisor(
		@Param('supervisorId') supervisorId: number,
		@Query('page') page: number,
		@Query('pageSize') pageSize: number,
	): Promise<{ timesheets: Timesheet[]; totalTimesheets: number }> {
		const timesheetsAndCount = await this.timesheetService.getAllTimesheetsBySupervisorId(
			supervisorId,
			page,
			pageSize,
		);
		return timesheetsAndCount;
	}

	@UseGuards(JwtAuthGuard)
	@Post('/')
	async createTimesheet(@Body() timesheet: CreateTimesheetDto): Promise<Timesheet> {
		return this.timesheetService.createTimesheet(timesheet);
	}

	@UseGuards(JwtAuthGuard)
	@Roles(RoleType.BUSINESS_OWNER, RoleType.SUPERVISOR)
	@Patch('/approve/:timesheetId')
	async updateTimesheetStatus(
		@Param('timesheetId') timesheetId: number,
		@Body() approveTimesheetDto: ApproveTimesheetDto,
	) : Promise<Timesheet> {
		return await this.timesheetService.approveOrRejectTimesheet(timesheetId, approveTimesheetDto);
	}

	@UseGuards(JwtAuthGuard)
	@Patch('/:timesheetId')
	async editTimesheet(@Body() updateTimesheetDto: UpdateTimesheetDto): Promise<Timesheet> {
		return this.timesheetService.updateTimesheet(updateTimesheetDto);
	}

	@UseGuards(JwtAuthGuard)
	@Delete('/:timesheetId')
	async deleteTimesheet(@Param('timesheetId') timesheetId: number) {
		return this.timesheetService.deleteTimesheet(timesheetId);
	}
}
