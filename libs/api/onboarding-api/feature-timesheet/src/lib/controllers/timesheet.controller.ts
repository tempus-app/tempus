import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '@tempus/api/shared/feature-auth';
import { Timesheet } from '@tempus/shared-domain';
import { CreateTimesheetDto, UpdateTimesheetDto } from '@tempus/api/shared/dto';
import { TimesheetService } from '../services/timesheet.service';

@ApiTags('Timesheet')
@Controller('timesheet')
export class TimesheetController {
	constructor(private timesheetService: TimesheetService) {}

	/*@UseGuards(JwtAuthGuard)
	@Get('/:timesheetId')
	async getTimesheet(@Param('timesheetId') timesheetId: number) {
		return this.timesheetService.getTimesheet(timesheetId);
	}*/

	@UseGuards(JwtAuthGuard)
	@Get('')
	async getTimesheetsForUser(@Param('userId') userId: number): Promise<Timesheet[]> {
		return this.timesheetService.getAllTimesheetsforUser(userId);
	}

	@UseGuards(JwtAuthGuard)
	@Get('supervisor-timesheets/:supervisorId')
	async getTimesheetsForSupervisor(
		@Param('supervisorId') supervisorId: number,
   	 	@Query('page') page: number,
    	@Query('pageSize') pageSize: number,
	): Promise< {timesheets: Timesheet[]; totalTimesheets: number }> {
			const timesheetsAndCount = await this.timesheetService.getAllTimesheetsBySupervisorId(supervisorId, page, pageSize);
			return timesheetsAndCount;
	}

	@UseGuards(JwtAuthGuard)
	@Post('/')
	async createTimesheet(@Body() timesheet: CreateTimesheetDto): Promise<Timesheet> {
		return this.timesheetService.createTimesheet(timesheet);
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
