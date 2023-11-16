import { Controller, Get, HttpStatus, Param, Query, Res, UseGuards } from "@nestjs/common";
import { ApiQuery, ApiTags } from "@nestjs/swagger";
import { ExcelService, ReportService } from "../services";
import { JwtAuthGuard, Roles, RolesGuard } from '@tempus/api/shared/feature-auth';
import { RoleType } from "@tempus/shared-domain";
import { Response } from 'express';

@ApiTags('Reports')
@Controller('report')
export class ReportController {
	constructor(
        private reportService: ReportService,
        private excelService: ExcelService,
    ) {}

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(RoleType.ASSIGNED_RESOURCE,RoleType.AVAILABLE_RESOURCE)
    @Get('resource-report/:resourceId')
   /* @ApiQuery({ name: 'month', required: false })
    @ApiQuery({ name: 'clientId', required: false })
    @ApiQuery({ name: 'projectId', required: false })*/
    async getReportForResource(
        @Res() res: Response,
        @Param('resourceId') resourceId: number,
        @Query('month') month?: number,
        @Query('clientId') clientId?: number,
        @Query('projectId') projectId?: number,
    ) : Promise<void> {
        const reportData = await this.reportService.generateReportForResource(resourceId, month, clientId, projectId);
        const excelBuffer = await this.excelService.exportToExcel(reportData);

        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', 'attachment; filename=custom-report.xlsx');
        res.send(excelBuffer);
        
        return;
       
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
        @Param('supervsisorId') supervsisorId: number,
        @Query('month') month?: number,
        @Query('clientId') clientId?: number,
        @Query('projectId') projectId?: number,
        @Query('resourceId') resourceId?: number,
    ) : Promise<void> {
        const reportData = await this.reportService.generateReportForSupervisor(supervsisorId, month, clientId, projectId, resourceId);
        const excelBuffer = await this.excelService.exportToExcel(reportData);

        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', 'attachment; filename=custom-report.xlsx');
        res.send(excelBuffer);
        return;
    }
    

}