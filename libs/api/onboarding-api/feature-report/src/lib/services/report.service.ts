/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable class-methods-use-this */
/* eslint-disable prettier/prettier */
import { Injectable, NotFoundException, Res } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateReportDto } from '@tempus/api/shared/dto';
import { ClientEntity, TimesheetEntity, ProjectEntity, ReportEntity, ResourceEntity, UserEntity, ProjectResourceEntity } from '@tempus/api/shared/entity';
import { Repository } from 'typeorm';
import { Report, RoleType, User } from '@tempus/shared-domain';
import { UserService } from '@tempus/onboarding-api/feature-account';

@Injectable()
export class ReportService {

    constructor(
        @InjectRepository(ReportEntity)
        private reportRepository: Repository<ReportEntity>,
        @InjectRepository(UserEntity)
        private userRepository: Repository<UserEntity>,
        @InjectRepository(ClientEntity)
		private clientRepository: Repository<ClientEntity>,
        @InjectRepository(ProjectEntity)
		private projectRepository: Repository<ProjectEntity>,
        @InjectRepository(TimesheetEntity)
		private timesheetRepository: Repository<TimesheetEntity>,
        @InjectRepository(ProjectResourceEntity)
		private projectResourceRepository: Repository<ProjectResourceEntity>,
        private userService: UserService,
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

    async getReport(userId: number, clientId: number, projectId: number, resourceId: number, month: number, year: number) : Promise<Report[] >{

        const user = await this.userService.getUserbyId(userId);

        let client = null;
        let project = null;
        let resource = null;
        if(clientId != 0){client = await this.clientRepository.findOne(clientId);}
        if(projectId != 0){project = await this.projectRepository.findOne(projectId);}
        if(resourceId != 0){resource = await this.userService.getResourcebyId(resourceId);}

        switch(user.roles[0]){
            case RoleType.BUSINESS_OWNER:
               // this.getOwnerReport(client, project, resource, month, year)
                break;
            case RoleType.SUPERVISOR:
                this.getSupervisorReport(client, project, resource, month, year)
                break;
            case RoleType.CLIENT:
                //this.getClientReport(client, project, resource, month, year)
                break;
            case RoleType.ASSIGNED_RESOURCE:
              //  this.getResourceReport(client, project, resource, month, year)
                break;
            case RoleType.AVAILABLE_RESOURCE:
               // this.getResourceReport(client, project, resource, month, year)
                break;
            default:
                throw new NotFoundException(`Could not find user role`);
        }

        return;
    }

    async getSupervisorReport(clientEnt: ClientEntity, projectEnt: ProjectEntity, resourceEnt: ResourceEntity, month: number, year: number) : Promise<Report[]> {

        const whereClause: Record<string, any> = {};
        if (projectEnt) {whereClause.project = projectEnt;}
        if (resourceEnt) {whereClause.resource = resourceEnt;}

        const timesheets = await this.timesheetRepository.find({
            where: whereClause,
            relations: ['project', 'project.client', 'resource', 'supervisor']
        });

        const timesheetsInMonthAndYear = await timesheets.filter(timesheet => {
            const weekStartDateMonth = timesheet.weekStartDate.getMonth() + 1;
            const weekStartDateYear = timesheet.weekStartDate.getFullYear();
            
            return weekStartDateMonth === month && weekStartDateYear === year;
        });

        let finalTimesheets = timesheetsInMonthAndYear;
        if(clientEnt){
            finalTimesheets = await timesheetsInMonthAndYear.filter(timesheet => timesheet.project.client === clientEnt);
        }

        const reportEntities: ReportEntity[] = finalTimesheets.map((timesheet) => {
            const reportEntity = new ReportEntity();
        
            reportEntity.clientName = timesheet.project.client.clientName;
            reportEntity.projectName = timesheet.project.name;
            reportEntity.userName = timesheet.resource.lastName + ", " + timesheet.resource.firstName;
            reportEntity.startDate = timesheet.weekStartDate;
            reportEntity.hoursWorked = this.totalHours(timesheet);

            const projRes = this.projectResourceRepository.findOne({
                where: {
                    resource: timesheet.resource,
                    project: timesheet.project
                },
            });

            reportEntity.costRate = 0;
            reportEntity.totalCost = 0;
            return reportEntity;
        });


        return reportEntities;
    }

	async generateReportForResource(
			resourceId: number,
			month: number,
			year: number,
			clientId: number,
			projectId: number,
			userRole: string,
	): Promise<ReportEntity[]> {
			// Add logic specific to assigned resources, if needed
			const reportData = await this.reportRepository.find({
					where: {
							userName: resourceId,
							month,
							year,
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
				year: number,
        clientId: number,
        projectId: number,
        resourceId: number,
        userRole: RoleType,
    ): Promise<ReportEntity[]> {
        const reportData = await this.reportRepository.find({
            where: {
                supervisorId,
                month,
								year,
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
				year: number,
        projectId: number,
        resourceId: number,
        userRole: RoleType,
    ): Promise<ReportEntity[]> {
        const reportData = await this.reportRepository.find({
            where: {
                clientId,
                month,
								year,
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
				year: number,
        clientId: number,
        projectId: number,
        resourceId: number,
        userRole: RoleType,
    ): Promise<ReportEntity[]> {
        const reportData = await this.reportRepository.find({
            where: {
                month,
								year,
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

    public totalHours(timesheet: TimesheetEntity){

        let total = timesheet.mondayHours + 
                    timesheet.tuesdayHours + 
                    timesheet.wednesdayHours +
                    timesheet.thursdayHours + 
                    timesheet.fridayHours + 
                    timesheet.saturdayHours + 
                    timesheet.sundayHours;

        return total;

    }
}
