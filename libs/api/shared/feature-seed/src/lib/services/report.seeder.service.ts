/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable class-methods-use-this */
/* eslint-disable prettier/prettier */
import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ReportEntity } from '@tempus/api/shared/entity';
import { CreateReportDto } from '@tempus/api/shared/dto';
import { ReportService } from '@tempus/onboarding-api/feature-report';
import { faker } from '@faker-js/faker';

@Injectable()
export class ReportSeederService {
    private readonly logger = new Logger(ReportSeederService.name);

    constructor(
        @InjectRepository(ReportEntity)
        private reportRepository: Repository<ReportEntity>,
        private reportService: ReportService,
    ) {}

    // async seedReports(count: number): Promise<ReportEntity[]> {
    //     this.logger.log(`Starting to seed reports with count: ${count}`);
    //     const reports: ReportEntity[] = [];

    //     for (let i = 0; i < count; i++) {
    //         const createReportDto = this.generateRandomReportDto();

    //         try {
    //             this.logger.log(`Creating report ${i + 1}/${count}`);
    //             this.logger.log(`Calling createReport for report number ${i + 1}`);
    //             const report = await this.reportService.createReport(createReportDto);
    //             this.logger.log(`Created report: ${JSON.stringify(report)}`);
    //             reports.push(report);
    //         } catch (error) {
    //             this.logger.error(`Error creating report ${i + 1}: ${error.message}`);
    //         }
    //     }

    //     this.logger.log(`Total reports created: ${reports.length}`);
    //     return reports;
    // }

    async clear() {
        await this.reportRepository.query('DELETE from report_entity CASCADE');
    }

    private generateRandomReportDto(): CreateReportDto {
        return new CreateReportDto(
            faker.company.companyName(), // clientName
            faker.commerce.productName(), // projectName
            faker.internet.userName(), // userName
            undefined,
						undefined,
            undefined,
            undefined,
            undefined,
            faker.datatype.number({ min: 1, max: 8 }), // hoursWorked
            faker.datatype.number({ min: 100, max: 300 }), // billingRate
        );
    }
}
