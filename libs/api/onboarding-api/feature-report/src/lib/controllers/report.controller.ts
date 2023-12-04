/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable class-methods-use-this */
/* eslint-disable prettier/prettier */
import { Controller, Get, HttpStatus, Param, Query, Res, UseGuards } from "@nestjs/common";
import { ApiQuery, ApiTags } from "@nestjs/swagger";
import { JwtAuthGuard, Roles, RolesGuard } from '@tempus/api/shared/feature-auth';
import { RoleType } from "@tempus/shared-domain";
import { Response } from 'express';
import { ReportService } from "../services";

@ApiTags('Reports')
@Controller('report')
export class ReportController {
	constructor(
        private reportService: ReportService,
    ) {}

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(RoleType.AVAILABLE_RESOURCE)
    @Get('resource-report/:resourceId')
    async getReportForResource(
        @Res() res: Response,
        @Param('resourceId') resourceId: number,
        @Query('month') month?: number,
        @Query('clientId') clientId?: number,
        @Query('projectId') projectId?: number,
    ): Promise<void> {
        // Available resource shouldn't see anything
        res.status(HttpStatus.FORBIDDEN).send('Forbidden');
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(RoleType.CLIENT)
    @Get('client-report/:clientId')
    async getReportForClient(
        @Res() res: Response,
        @Param('clientId') clientId: number,
        @Query('month') month?: number,
        @Query('projectId') projectId?: number,
        @Query('resourceId') resourceId?: number,
    ): Promise<void> {
        const reportData = await this.reportService.generateReportForClient(clientId, month, projectId, resourceId, RoleType.CLIENT);
        // Send report data or handle as needed
        res.status(HttpStatus.OK).json(reportData);
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(RoleType.SUPERVISOR)
    @Get('supervisor-report/:supervisorId')
    @ApiQuery({ name: 'month', required: false })
    @ApiQuery({ name: 'clientId', required: false })
    @ApiQuery({ name: 'projectId', required: false })
    @ApiQuery({ name: 'resourceId', required: false })
    async getReportForSupervisor(
        @Res() res: Response,
        @Param('supervisorId') supervisorId: number,
        @Query('month') month?: number,
        @Query('clientId') clientId?: number,
        @Query('projectId') projectId?: number,
        @Query('resourceId') resourceId?: number,
    ): Promise<void> {
        const reportData = await this.reportService.generateReportForSupervisor(supervisorId, month, clientId, projectId, resourceId, RoleType.SUPERVISOR);
        // Send report data or handle as needed
        res.status(HttpStatus.OK).json(reportData);
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(RoleType.ASSIGNED_RESOURCE)
    @Get('assigned-resource-report/:resourceId')
    async getReportForAssignedResource(
        @Res() res: Response,
        @Param('resourceId') resourceId: number,
        @Query('month') month?: number,
        @Query('clientId') clientId?: number,
        @Query('projectId') projectId?: number,
    ): Promise<void> {
        const reportData = await this.reportService.generateReportForAssignedResource(resourceId, month, clientId, projectId, RoleType.ASSIGNED_RESOURCE);
        // Send report data or handle as needed
        res.status(HttpStatus.OK).json(reportData);
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(RoleType.BUSINESS_OWNER)
    @Get('business-owner-report')
    @ApiQuery({ name: 'month', required: false })
    @ApiQuery({ name: 'clientId', required: false })
    @ApiQuery({ name: 'projectId', required: false })
    @ApiQuery({ name: 'resourceId', required: false })
    async getReportForBusinessOwner(
        @Res() res: Response,
        @Query('month') month?: number,
        @Query('clientId') clientId?: number,
        @Query('projectId') projectId?: number,
        @Query('resourceId') resourceId?: number,
    ): Promise<void> {
        const reportData = await this.reportService.generateReportForOwner(month, clientId, projectId, resourceId, RoleType.BUSINESS_OWNER);
        // Send report data or handle as needed
        res.status(HttpStatus.OK).json(reportData);
    }
}
