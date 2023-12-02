import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateReportDto } from '@tempus/api/shared/dto';
import { TimesheetEntity, UserEntity, ReportEntity } from '@tempus/api/shared/entity';
import { Repository } from 'typeorm';

@Injectable()
export class ReportService {
	constructor(
		@InjectRepository(ReportEntity)
		private reportRepository: Repository<ReportEntity>,
	) {}

	async generateReportForResource(
		resourceId,
		month: number,
		clientId: number,
		projectId: number,
	): Promise<ReportEntity[]> {
		const reportData: ReportEntity[] = null;
		return reportData;
	}

	async generateReportForSupervisor(
		supervisorId,
		month: number,
		clientId: number,
		projectId: number,
		resourceId: number,
	): Promise<ReportEntity[]> {
		const reportData: ReportEntity[] = null;
		return reportData;
	}

	async generateReportForClient(
		clientId,
		month: number,
		projectId: number,
		resourceId: number,
	): Promise<ReportEntity[]> {
		const reportData: ReportEntity[] = null;
		return reportData;
	}

	async generateReportForOwner(
		month: number,
		clientId: number,
		projectId: number,
		resourceId,
	): Promise<ReportEntity[]> {
		const reportData: ReportEntity[] = null;
		return reportData;
	}

	private processData(): ReportEntity[] {
		const processedData: ReportEntity[] = null;
		return processedData;
	}

	async createReport(createReportDto: CreateReportDto): Promise<ReportEntity> {
		// Here, you'll implement the logic to create a new report entity
		// and save it to the database.

		// For example:
		const report = this.reportRepository.create(createReportDto);
		await this.reportRepository.save(report);
		return report;
	}
}
