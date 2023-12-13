/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable class-methods-use-this */
/* eslint-disable prettier/prettier */
import { Controller, Get, HttpStatus, Param, Query, Res, UseGuards } from "@nestjs/common";
import { ApiQuery, ApiTags } from "@nestjs/swagger";
import { JwtAuthGuard, Roles, RolesGuard } from '@tempus/api/shared/feature-auth';
import { RoleType, Timesheet, Report } from "@tempus/shared-domain";
import { Response } from 'express';
import { ReportService } from "../services";

@ApiTags('Reports')
@Controller('report')
export class ReportController {
	constructor(
        private reportService: ReportService,
    ) {}

    @Get('/:userId')
    async getReport(
      @Param('userId') userId: number,
      @Query('clientId') clientId: number,
      @Query('projectId') projectId?: number,
      @Query('resourceId') resourceId?: number,
      @Query('startDate') startDate?: string,
			@Query('endDate') endDate?: string,
    ): Promise<Report[]> {
      const rows = await this.reportService.getReport(userId, clientId, projectId, resourceId, startDate, endDate)
      return rows;
    }
}
