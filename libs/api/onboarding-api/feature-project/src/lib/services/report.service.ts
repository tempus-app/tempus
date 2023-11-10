import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ReportEntity } from '@tempus/api/shared/entity';
import { CreateReportDto } from '@tempus/api/shared/dto';

@Injectable()
export class ReportService {
	private readonly logger = new Logger(ReportService.name);

	constructor(
		@InjectRepository(ReportEntity)
		private reportRepository: Repository<ReportEntity>,
	) {}

	async createReport(createReportDto: CreateReportDto): Promise<ReportEntity> {
		this.logger.log('Entering createReport function');
		try {
			this.logger.log(`Saving report: ${JSON.stringify(createReportDto)}`);
			const report = this.reportRepository.create(createReportDto);
			const savedReport = await this.reportRepository.save(report);
			this.logger.log(`Report saved: ${JSON.stringify(savedReport)}`);
			return savedReport;
		} catch (error) {
			this.logger.error(`Error saving report: ${error.message}`);
			throw error; // rethrow the error to handle it in the calling service
		}
	}
}
