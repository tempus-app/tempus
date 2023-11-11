// reports.controller.ts
import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ReportEntity } from '@tempus/api/shared/entity';
import { ReportService } from '../services/report.service';

@ApiTags('Reports')
@Controller('reports')
export class ReportsController {
	constructor(private reportService: ReportService) {}

	@Get()
	async findAll(): Promise<ReportEntity[]> {
		return this.reportService.findAll();
	}
}
