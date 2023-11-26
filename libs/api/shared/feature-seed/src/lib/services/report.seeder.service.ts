import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ReportEntity } from '@tempus/api/shared/entity';
import { Repository } from 'typeorm';
// eslint-disable-next-line import/no-extraneous-dependencies
import { faker } from '@faker-js/faker';
import { CreateReportDto } from '@tempus/api/shared/dto';
import { ReportService } from '@tempus/onboarding-api/feature-report';

@Injectable()
export class ReportSeederService {
	private readonly logger = new Logger(ReportSeederService.name);

	constructor(
		@InjectRepository(ReportEntity)
		private reportRepository: Repository<ReportEntity>,
		private reportService: ReportService,
	) {}

	async seedReports(count: number): Promise<ReportEntity[]> {
		this.logger.log(`Starting to seed reports with count: ${count}`);
		const reports: ReportEntity[] = [];

		for (let i = 0; i < count; i++) {
			const createReportDto = new CreateReportDto(
				undefined, // reportId (auto-generated)
				faker.company.companyName(), // clientName
				faker.commerce.productName(), // projectName
				faker.internet.userName(), // userName
				undefined,
				undefined,
				undefined,
				faker.datatype.number({ min: 1, max: 8 }), // hoursWorked
				faker.datatype.number({ min: 100, max: 300 }), // billingRate
			);

			try {
				this.logger.log(`Creating report ${i + 1}/${count}`);
				this.logger.log(`Calling createReport for report number ${i + 1}`);
				const report = await this.reportService.createReport(createReportDto);
				this.logger.log(`Created report: ${JSON.stringify(report)}`);
				reports.push(report);
			} catch (error) {
				this.logger.error(`Error creating report ${i + 1}: ${error.message}`);
			}
		}

		this.logger.log(`Total reports created: ${reports.length}`);
		return reports;
	}

	async clear() {
		await this.reportRepository.query('DELETE from report_entity CASCADE');
	}
}
