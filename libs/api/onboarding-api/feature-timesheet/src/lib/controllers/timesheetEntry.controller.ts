import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '@tempus/api/shared/feature-auth';
import { TimesheetEntry } from '@tempus/shared-domain';
import { CreateTimesheetEntryDto, UpdateTimesheetEntryDto } from '@tempus/api/shared/dto';
import { TimesheetEntryService } from '../services/timesheetEntry.service';

@ApiTags('TimesheetEntry')
@Controller('timesheetEntry')
export class TimesheetEntryController {
	constructor(private timesheetEntryService: TimesheetEntryService) {}

	@UseGuards(JwtAuthGuard)
	@Get('/:timesheetEntryId')
	async getTimesheet(@Param('timesheetEntryId') timesheetEntryId: number) {
		return this.timesheetEntryService.getTimesheetEntry(timesheetEntryId);
	}

	@UseGuards(JwtAuthGuard)
	@Get('')
	async getEntriesForTimesheet(@Param('timesheetId') timesheetId: number): Promise<TimesheetEntry[]> {
		return this.timesheetEntryService.getAllEntriesforTimesheet(timesheetId);
	}

	@UseGuards(JwtAuthGuard)
	@Post('/')
	async createTimesheetEntry(@Body() timesheetEntry: CreateTimesheetEntryDto): Promise<TimesheetEntry> {
		return this.timesheetEntryService.createTimesheetEntry(timesheetEntry);
	}

	@UseGuards(JwtAuthGuard)
	@Patch('/:timesheetEntryId')
	async editTimesheetEntry(@Body() updateTimesheetEntryDto: UpdateTimesheetEntryDto): Promise<TimesheetEntry> {
		return this.timesheetEntryService.updateTimesheetEntry(updateTimesheetEntryDto);
	}

	@UseGuards(JwtAuthGuard)
	@Delete('/:timesheetEntryId')
	async deleteTimesheetEntry(@Param('timesheetEntryId') timesheetEntryId: number) {
		return this.timesheetEntryService.deleteTimesheetEntry(timesheetEntryId);
	}
}
