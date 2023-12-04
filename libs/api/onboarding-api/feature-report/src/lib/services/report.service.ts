/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable class-methods-use-this */
/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateReportDto } from '@tempus/api/shared/dto';
import { ReportEntity } from '@tempus/api/shared/entity';
import { Repository } from 'typeorm';
import { RoleType } from '@tempus/shared-domain';

@Injectable()
export class ReportService {
    constructor(
        @InjectRepository(ReportEntity)
        private reportRepository: Repository<ReportEntity>,
    ) {}

    private filterColumnsForRole(userRole: string): string[] {
			// Define the columns based on the user role
			switch (userRole) {
					case 'CLIENT':
							return ['reportId', 'clientName', 'projectName', 'userName', 'month', 'hoursWorked'];
					case 'SUPERVISOR':
							return ['reportId', 'clientName', 'projectName', 'userName', 'month', 'costRate', 'totalCost', 'hoursWorked'];
					case 'BUSINESS_OWNER':
							return ['reportId', 'clientName', 'projectName', 'userName', 'month', 'hoursWorked', 'costRate', 'totalCost', 'billingRate', 'totalBilling'];
					case 'ASSIGNED_RESOURCE':
							return ['reportId', 'clientName', 'projectName', 'userName', 'month', 'costRate', 'totalCost', 'hoursWorked'];
					default:
							return []; // Empty array for an available resource
			}
	}

	private applyColumnFilter(reportData: ReportEntity[], columns: string[]): ReportEntity[] {
			// Create a new array of report entities with only the allowed columns
			return reportData.map((report) => {
					const filteredReport: ReportEntity = {} as ReportEntity;
					columns.forEach((column) => {
							filteredReport[column] = report[column];
					});
					return filteredReport;
			});
	}

	async generateReportForAssignedResource(
			resourceId: number,
			month: number,
			clientId: number,
			projectId: number,
			userRole: string,
	): Promise<ReportEntity[]> {
			// Add logic specific to assigned resources, if needed
			const reportData = await this.reportRepository.find({
					where: {
							userName: resourceId,
							month,
							clientId,
							projectId,
					},
			});

			const columns = this.filterColumnsForRole(userRole);
			const filteredReportData = this.applyColumnFilter(reportData, columns);

			return filteredReportData;
	}

	async generateReportForAvailableResource(
			userRole: string,
	): Promise<ReportEntity[]> {
			// Add logic specific to available resources, if needed
			return [];
	}

    async generateReportForSupervisor(
        supervisorId: number,
        month: number,
        clientId: number,
        projectId: number,
        resourceId: number,
        userRole: RoleType,
    ): Promise<ReportEntity[]> {
        const reportData = await this.reportRepository.find({
            where: {
                supervisorId,
                month,
                clientId,
                projectId,
                // Possibly filter by all resources supervised by the supervisor
            },
        });

        const columns = this.filterColumnsForRole(userRole);
        const filteredReportData = this.applyColumnFilter(reportData, columns);

        return filteredReportData;
    }

    async generateReportForClient(
        clientId: number,
        month: number,
        projectId: number,
        resourceId: number,
        userRole: RoleType,
    ): Promise<ReportEntity[]> {
        const reportData = await this.reportRepository.find({
            where: {
                clientId,
                month,
                projectId,
                userName: resourceId,
            },
        });

        const columns = this.filterColumnsForRole(userRole);
        const filteredReportData = this.applyColumnFilter(reportData, columns);

        return filteredReportData;
    }

    async generateReportForOwner(
        month: number,
        clientId: number,
        projectId: number,
        resourceId: number,
        userRole: RoleType,
    ): Promise<ReportEntity[]> {
        const reportData = await this.reportRepository.find({
            where: {
                month,
                clientId,
                projectId,
                userName: resourceId,
            },
        });

        const columns = this.filterColumnsForRole(userRole);
        const filteredReportData = this.applyColumnFilter(reportData, columns);

        return filteredReportData;
    }

    async createReport(createReportDto: CreateReportDto): Promise<ReportEntity> {
        const report = this.reportRepository.create(createReportDto);
        await this.reportRepository.save(report);
        return report;
    }
}
