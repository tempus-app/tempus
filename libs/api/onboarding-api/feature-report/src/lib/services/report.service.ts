/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable class-methods-use-this */
/* eslint-disable prettier/prettier */
import { Injectable, NotFoundException, Res } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateReportDto } from '@tempus/api/shared/dto';
import { ClientEntity, TimesheetEntity, ProjectEntity, ReportEntity, ResourceEntity, UserEntity, ProjectResourceEntity } from '@tempus/api/shared/entity';
import { Repository } from 'typeorm';
import { Report, RoleType, TimesheetRevisionType, User } from '@tempus/shared-domain';
import { UserService } from '@tempus/onboarding-api/feature-account';
import { createObjectCsvStringifier } from 'csv-writer';

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
    ) { }

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

    async getReport(userId: number, clientId: number, projectId: number, resourceId: number, month: number, year: number): Promise<Report[]> {

        const user = await this.userService.getUserbyId(userId);

        let client = null;
        let project = null;
        let resource = null;
        if (clientId != 0) { client = await this.clientRepository.findOne(clientId); }
        if (projectId != 0) { project = await this.projectRepository.findOne(projectId); }
        if (resourceId != 0) { resource = await this.userService.getResourcebyId(resourceId); }

        switch (user.roles[0]) {
            case RoleType.BUSINESS_OWNER:
                return this.getOwnerReport(client, project, resource, month, year);
            case RoleType.SUPERVISOR:
                return this.getSupervisorReport(user, client, project, resource, month, year);
            case RoleType.CLIENT:
                return this.getClientReport(client, project, resource, month, year);
            case RoleType.ASSIGNED_RESOURCE:
            case RoleType.AVAILABLE_RESOURCE:
                return this.getResourceReport(resource, client, project, month, year);
            default:
                throw new NotFoundException(`Could not find user role`);
        }

        return;
    }

    async getSupervisorReport(supervisor: UserEntity, clientEnt: ClientEntity, projectEnt: ProjectEntity, resourceEnt: ResourceEntity, month: number, year: number): Promise<Report[]> {

        const whereClause: Record<string, any> = {};
        if (projectEnt) { whereClause.project = projectEnt; }
        if (resourceEnt) { whereClause.resource = resourceEnt; }

        whereClause.status = TimesheetRevisionType.APPROVED;
        whereClause.supervisor = supervisor;

        const timesheets = await this.timesheetRepository.find({
            where: whereClause,
            relations: ['project', 'project.client', 'resource', 'supervisor']
        });

        const timesheetsInMonthAndYear = await timesheets.filter(timesheet => {
            const weekStartDateMonth = timesheet.weekStartDate.getMonth() + 1;
            const weekStartDateYear = timesheet.weekStartDate.getFullYear();
            return weekStartDateMonth == month && weekStartDateYear == year;
        });

        console.log(timesheetsInMonthAndYear.length);

        let finalTimesheets = timesheetsInMonthAndYear;

        if (clientEnt) {
            finalTimesheets = await timesheetsInMonthAndYear.filter(timesheet => {
                return timesheet.project.client.id == clientEnt.id
            });
        }

        const reportEntitiesPromises: Promise<ReportEntity>[] = finalTimesheets.map(async (timesheet) => {
            const reportEntity = new ReportEntity();

            reportEntity.clientName = timesheet.project.client.clientName;
            reportEntity.projectName = timesheet.project.name;
            reportEntity.userName = `${timesheet.resource.firstName} ${timesheet.resource.lastName}`;
            reportEntity.startDate = timesheet.weekStartDate.toDateString();
            reportEntity.hoursWorked = this.totalHours(timesheet);

            const projRes = await this.projectResourceRepository.findOne({
                where: {
                    resource: timesheet.resource,
                    project: timesheet.project
                },
            });
            reportEntity.costRate = projRes?.costRate || 0;
            reportEntity.totalCost = reportEntity.costRate * reportEntity.hoursWorked;
            return reportEntity;
        });

        const reportEntities: ReportEntity[] = await Promise.all(reportEntitiesPromises);
        return this.sortReportElements(reportEntities);
    }

    async getResourceReport(resourceEnt: ResourceEntity, clientEnt: ClientEntity, projectEnt: ProjectEntity, month: number, year: number): Promise<Report[]> {

        const whereClause: Record<string, any> = {};
        if (projectEnt) { whereClause.project = projectEnt; }
        if (resourceEnt) { whereClause.resource = resourceEnt; }

        whereClause.status = TimesheetRevisionType.APPROVED;

        const timesheets = await this.timesheetRepository.find({
            where: whereClause,
            relations: ['project', 'project.client', 'resource', 'supervisor']
        });

        const timesheetsInMonthAndYear = await timesheets.filter(timesheet => {
            const weekStartDateMonth = timesheet.weekStartDate.getMonth() + 1;
            const weekStartDateYear = timesheet.weekStartDate.getFullYear();
            return weekStartDateMonth == month && weekStartDateYear == year;
        });

        console.log(timesheetsInMonthAndYear.length);

        let finalTimesheets = timesheetsInMonthAndYear;

        if (clientEnt) {
            finalTimesheets = await timesheetsInMonthAndYear.filter(timesheet => {
                return timesheet.project.client.id == clientEnt.id
            });
        }

        const reportEntitiesPromises: Promise<ReportEntity>[] = finalTimesheets.map(async (timesheet) => {
            const reportEntity = new ReportEntity();

            reportEntity.clientName = timesheet.project.client.clientName;
            reportEntity.projectName = timesheet.project.name;
            reportEntity.userName = `${timesheet.resource.firstName} ${timesheet.resource.lastName}`;
            reportEntity.startDate = timesheet.weekStartDate.toDateString();
            reportEntity.hoursWorked = this.totalHours(timesheet);

            const projRes = await this.projectResourceRepository.findOne({
                where: {
                    resource: timesheet.resource,
                    project: timesheet.project
                },
            });
            reportEntity.costRate = projRes?.costRate || 0;
            reportEntity.totalCost = reportEntity.costRate * reportEntity.hoursWorked;
            return reportEntity;
        });

        const reportEntities: ReportEntity[] = await Promise.all(reportEntitiesPromises);
        return this.sortReportElements(reportEntities);
    }

    async getClientReport(clientEnt: ClientEntity, projectEnt: ProjectEntity, resourceEnt: ResourceEntity, month: number, year: number): Promise<Report[]> {

        const whereClause: Record<string, any> = {};
        if (projectEnt) { whereClause.project = projectEnt; }
        if (resourceEnt) { whereClause.resource = resourceEnt; }

        whereClause.status = TimesheetRevisionType.APPROVED;

        const timesheets = await this.timesheetRepository.find({
            where: whereClause,
            relations: ['project', 'project.client', 'resource', 'supervisor']
        });

        const timesheetsInMonthAndYear = await timesheets.filter(timesheet => {
            const weekStartDateMonth = timesheet.weekStartDate.getMonth() + 1;
            const weekStartDateYear = timesheet.weekStartDate.getFullYear();
            return weekStartDateMonth == month && weekStartDateYear == year;
        });

        console.log(timesheetsInMonthAndYear.length);

        let finalTimesheets = timesheetsInMonthAndYear;

        if (clientEnt) {
            finalTimesheets = await timesheetsInMonthAndYear.filter(timesheet => {
                return timesheet.project.client.id == clientEnt.id
            });
        }

        const reportEntitiesPromises: Promise<ReportEntity>[] = finalTimesheets.map(async (timesheet) => {
            const reportEntity = new ReportEntity();

            reportEntity.clientName = timesheet.project.client.clientName;
            reportEntity.projectName = timesheet.project.name;
            reportEntity.userName = `${timesheet.resource.firstName} ${timesheet.resource.lastName}`;
            reportEntity.startDate = timesheet.weekStartDate.toDateString();
            reportEntity.hoursWorked = this.totalHours(timesheet);

            const projRes = await this.projectResourceRepository.findOne({
                where: {
                    resource: timesheet.resource,
                    project: timesheet.project
                },
            });
            reportEntity.billingRate = projRes?.billRate || 0;
            reportEntity.totalBilling = reportEntity.billingRate * reportEntity.hoursWorked;
            return reportEntity;
        });

        const reportEntities: ReportEntity[] = await Promise.all(reportEntitiesPromises);
        return this.sortReportElements(reportEntities);
    }

    async getOwnerReport(clientEnt: ClientEntity, projectEnt: ProjectEntity, resourceEnt: ResourceEntity, month: number, year: number): Promise<Report[]> {

        const whereClause: Record<string, any> = {};
        if (projectEnt) { whereClause.project = projectEnt; }
        if (resourceEnt) { whereClause.resource = resourceEnt; }

        whereClause.status = TimesheetRevisionType.APPROVED;

        const timesheets = await this.timesheetRepository.find({
            where: whereClause,
            relations: ['project', 'project.client', 'resource', 'supervisor']
        });

        const timesheetsInMonthAndYear = await timesheets.filter(timesheet => {
            const weekStartDateMonth = timesheet.weekStartDate.getMonth() + 1;
            const weekStartDateYear = timesheet.weekStartDate.getFullYear();
            return weekStartDateMonth == month && weekStartDateYear == year;
        });

        console.log(timesheetsInMonthAndYear.length);

        let finalTimesheets = timesheetsInMonthAndYear;

        if (clientEnt) {
            finalTimesheets = await timesheetsInMonthAndYear.filter(timesheet => {
                return timesheet.project.client.id == clientEnt.id
            });
        }

        const reportEntitiesPromises: Promise<ReportEntity>[] = finalTimesheets.map(async (timesheet) => {
            const reportEntity = new ReportEntity();

            reportEntity.clientName = timesheet.project.client.clientName;
            reportEntity.projectName = timesheet.project.name;
            reportEntity.userName = `${timesheet.resource.firstName} ${timesheet.resource.lastName}`;
            reportEntity.startDate = timesheet.weekStartDate.toDateString();
            reportEntity.hoursWorked = this.totalHours(timesheet);

            const projRes = await this.projectResourceRepository.findOne({
                where: {
                    resource: timesheet.resource,
                    project: timesheet.project
                },
            });
            reportEntity.costRate = projRes?.costRate || 0;
            reportEntity.totalCost = reportEntity.costRate * reportEntity.hoursWorked;
            reportEntity.billingRate = projRes?.billRate || 0;
            reportEntity.totalBilling = reportEntity.billingRate * reportEntity.hoursWorked;
            return reportEntity;
        });

        const reportEntities: ReportEntity[] = await Promise.all(reportEntitiesPromises);
        return this.sortReportElements(reportEntities);
    }

    public totalHours(timesheet: TimesheetEntity) {

        let total = timesheet.mondayHours +
            timesheet.tuesdayHours +
            timesheet.wednesdayHours +
            timesheet.thursdayHours +
            timesheet.fridayHours +
            timesheet.saturdayHours +
            timesheet.sundayHours;

        return total;
    }

    public sortReportElements(reportEntities: ReportEntity[]) {

        const groupedEntitiesMap = reportEntities.reduce((map, entity) => {
            const clientName = entity.clientName;

            if (!map.has(clientName)) {
                map.set(clientName, []);
            }

            map.get(clientName)!.push(entity);

            return map;
        }, new Map<string, ReportEntity[]>());

        for (const entities of groupedEntitiesMap.values()) {
            entities.sort((a, b) => {
                const dateA = new Date(a.startDate);
                const dateB = new Date(b.startDate);
                return dateA.getTime() - dateB.getTime();
            });
        }

        const sortedReportEntities: ReportEntity[] = Array.from(groupedEntitiesMap.values()).flat();

        return sortedReportEntities;

    }
}
