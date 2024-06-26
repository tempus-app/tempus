import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TimesheetEntity, UserEntity } from '@tempus/api/shared/entity';
import { In, OrderByCondition, Repository } from 'typeorm';
import { RoleType, Timesheet, TimesheetRevisionType } from '@tempus/shared-domain';
import { ApproveTimesheetDto, CreateTimesheetDto, UpdateTimesheetDto } from '@tempus/api/shared/dto';
import { ResourceService, UserService } from '@tempus/onboarding-api/feature-account';
import { ClientRepresentativeService, ProjectService } from '@tempus/onboarding-api/feature-project';

@Injectable()
export class TimesheetService {
	constructor(
		@InjectRepository(TimesheetEntity)
		private timesheetRepository: Repository<TimesheetEntity>,
		private userService: UserService,
		private clientRepService: ClientRepresentativeService,
		private resourceService: ResourceService,
		private projectService: ProjectService,
	) {}

	async getTimesheet(timesheetId: number): Promise<Timesheet> {
		const timesheetEntity = await this.timesheetRepository.findOne(timesheetId, {
			relations: ['resource', 'project', 'supervisor'],
		});
		if (!timesheetEntity) throw new NotFoundException(`Could not find timesheet with id ${timesheetId}`);
		return timesheetEntity;
	}

	async getAllTimesheetsforUser(resourceId: number): Promise<Timesheet[]> {
		const timesheets = await this.timesheetRepository.find({
			where: { resource: { id: resourceId } },
			relations: ['resource'],
		});

		return timesheets;
	}

	async getAllSubmittedTimesheetsforUser(resourceId: number): Promise<Timesheet[]> {
		const timesheets = await this.timesheetRepository.find({
			where: {
				/* resource: { 
					id: resourceId 
				}, */
				status: TimesheetRevisionType.SUBMITTED,
			},
			relations: ['resource'],
		});

		return timesheets;
	}

	async getAllTimesheetsforProject(projectId: number): Promise<Timesheet[]> {
		const timesheets = await this.timesheetRepository.find({
			where: { project: { id: projectId } },
			relations: ['project'],
		});

		return timesheets;
	}

	async getAllTimesheetsByResourceId(resourceId: number, page: number, pageSize: number) {
		const timesheetsAndCount = await this.timesheetRepository.findAndCount({
			where: { resource: { id: resourceId } },
			relations: ['supervisor', 'project', 'resource'],
		});

		const statusOrder = [
			TimesheetRevisionType.REJECTED,
			TimesheetRevisionType.SUBMITTED,
			TimesheetRevisionType.CLIENTREVIEW,
			TimesheetRevisionType.NEW,
			TimesheetRevisionType.APPROVED,
		];

		const sortedTimesheets = timesheetsAndCount[0].sort((a, b) =>
			statusOrder.indexOf(a.status) - statusOrder.indexOf(b.status)
		);

		const startIndex = page * pageSize;
		const endIndex = startIndex + pageSize;
		const paginatedTimesheets = sortedTimesheets.slice(startIndex, endIndex);	  
	  
		return { timesheets: paginatedTimesheets, totalTimesheets: timesheetsAndCount[1] };
	}

	async getAllTimesheetsBySupervisorId(supervisorId: number, page: number, pageSize: number) {
		let timesheetsAndCount;
		const userRole = (await this.userService.getUserbyId(supervisorId)).roles[0];

		const statusOrder = [
			TimesheetRevisionType.SUBMITTED,
			TimesheetRevisionType.CLIENTREVIEW,
			TimesheetRevisionType.REJECTED,
			TimesheetRevisionType.APPROVED,
			TimesheetRevisionType.NEW,
		];

		if (userRole == RoleType.SUPERVISOR) {
			timesheetsAndCount = await this.timesheetRepository.findAndCount({
				where: { supervisor: { id: supervisorId } },
				relations: ['supervisor', 'project', 'resource'],
			});
		} else if (userRole == RoleType.CLIENT) {
			return this.getAllTimesheetsByClientId(supervisorId, page, pageSize);
		} else {
			timesheetsAndCount = await this.timesheetRepository.findAndCount({
				relations: ['supervisor', 'project', 'resource'],
			});
		}

		const sortedTimesheets = timesheetsAndCount[0].sort((a, b) =>
			statusOrder.indexOf(a.status) - statusOrder.indexOf(b.status)
		);

		const startIndex = page * pageSize;
		const endIndex = startIndex + pageSize;
		const paginatedTimesheets = sortedTimesheets.slice(startIndex, endIndex);	  
	  

		return { timesheets: paginatedTimesheets, totalTimesheets: timesheetsAndCount[1] };
	}

	async getAllTimesheetsByClientId(clientId: number, page: number, pageSize: number) {
		const clientUser = await this.userService.getUserbyId(clientId);
		const clientRep = await this.clientRepService.getClientRepresentativeByEmail(clientUser.email);
		const projects = await this.projectService.getClientProjects(clientRep.client.id);
		const projectIds = projects.map(project => project.id);

		const timesheetsAndCount = await this.timesheetRepository.findAndCount({
			where: { project: In(projectIds) },
			relations: ['supervisor', 'project', 'resource'],
			take: Number(pageSize),
			skip: Number(page) * Number(pageSize),
		});

		const filteredTimesheets = timesheetsAndCount[0].filter(
			timesheet => timesheet.status == TimesheetRevisionType.CLIENTREVIEW,
		);

		return { timesheets: filteredTimesheets, totalTimesheets: timesheetsAndCount[1] };
	}

	async getAllSubmittedTimesheetsforProject(projectId: number): Promise<Timesheet[]> {
		const timesheets = await this.timesheetRepository.find({
			where: {
				project: { id: projectId },
				status: TimesheetRevisionType.SUBMITTED,
			},
			relations: ['project'],
		});

		return timesheets;
	}

	async submitTimesheet(timesheetId: number): Promise<Timesheet> {
		const timesheetEntity = await this.timesheetRepository.findOne(timesheetId);
		if (!timesheetEntity) throw new NotFoundException(`Could not find timesheet with id ${timesheetId}`);

		timesheetEntity.status = TimesheetRevisionType.SUBMITTED;
		timesheetEntity.dateModified = new Date(Date.now());

		const toReturn = await this.timesheetRepository.save(timesheetEntity);
		return toReturn;
	}

	async approveOrRejectTimesheetSupervisor(
		timesheetId: number,
		approveTimesheetDto: ApproveTimesheetDto,
	): Promise<Timesheet> {
		const { approval, comment, approverId } = approveTimesheetDto;
		const userRole = (await this.userService.getUserbyId(approverId)).roles[0];

		const timesheetEntity = await this.timesheetRepository.findOne(timesheetId);
		if (!timesheetEntity) throw new NotFoundException(`Could not find timesheet with id ${timesheetId}`);

		if (userRole == RoleType.CLIENT) {
			if (approval === true) {
				timesheetEntity.approvedByClient = true;
				timesheetEntity.status = TimesheetRevisionType.APPROVED;
				timesheetEntity.dateModified = new Date(Date.now());
				timesheetEntity.clientRepresentativeComment = comment;
				const toReturn = await this.timesheetRepository.save(timesheetEntity);
				return toReturn;
			}
			if (approval === false) {
				timesheetEntity.status = TimesheetRevisionType.REJECTED;
				timesheetEntity.dateModified = new Date(Date.now());
				timesheetEntity.clientRepresentativeComment = comment;
				const toReturn = await this.timesheetRepository.save(timesheetEntity);
				return toReturn;
			}
		} else {
			if (approval === true) {
				timesheetEntity.approvedBySupervisor = true;
				timesheetEntity.status = TimesheetRevisionType.CLIENTREVIEW;
				timesheetEntity.dateModified = new Date(Date.now());
				timesheetEntity.supervisorComment = comment;
				const toReturn = await this.timesheetRepository.save(timesheetEntity);
				return toReturn;
			}
			if (approval === false) {
				timesheetEntity.status = TimesheetRevisionType.REJECTED;
				timesheetEntity.dateModified = new Date(Date.now());
				timesheetEntity.supervisorComment = comment;
				const toReturn = await this.timesheetRepository.save(timesheetEntity);
				return toReturn;
			}
		}
	}

	async approveOrRejectTimesheetClient(
		timesheetId: number,
		approveTimesheetDto: ApproveTimesheetDto,
	): Promise<Timesheet> {
		const { approval, comment } = approveTimesheetDto;
		const timesheetEntity = await this.timesheetRepository.findOne(timesheetId);
		if (!timesheetEntity) throw new NotFoundException(`Could not find timesheet with id ${timesheetId}`);

		if (approval === true) {
			timesheetEntity.approvedByClient = true;
			timesheetEntity.status = TimesheetRevisionType.APPROVED;
			timesheetEntity.dateModified = new Date(Date.now());
			timesheetEntity.clientRepresentativeComment = comment;
			const toReturn = await this.timesheetRepository.save(timesheetEntity);
			return toReturn;
		}
		if (approval === false) {
			timesheetEntity.status = TimesheetRevisionType.REJECTED;
			timesheetEntity.dateModified = new Date(Date.now());
			timesheetEntity.clientRepresentativeComment = comment;
			const toReturn = await this.timesheetRepository.save(timesheetEntity);
			return toReturn;
		}
	}

	async createTimesheet(timesheet: CreateTimesheetDto): Promise<Timesheet> {
		const timesheetEntity = TimesheetEntity.fromDto(timesheet);

		let supervisorEntity: UserEntity = null;
		/* if (timesheet.supervisorId != undefined)
			supervisorEntity = await this.userService.getUserbyId(timesheet.supervisorId); */
		const projectEntity = await this.projectService.getProjectInfo(timesheet.projectId);
		const resourceEntity = await this.resourceService.getResourceInfo(timesheet.resourceId);
		const weekStartDate = new Date(timesheetEntity.weekStartDate);
		const weekEndDate = new Date(timesheetEntity.weekEndDate);

		// Check if there already exists a timesheet with the same date range and project
		const existingTimesheet = await this.timesheetRepository.findOne({
			where: {
				weekStartDate,
				weekEndDate,
				project: projectEntity,
				resource: resourceEntity,
			},
		});

		// Throw a forbidden exception if the timesheet already exists with the same date range and project
		if (existingTimesheet) {
			throw new ForbiddenException('There already exists a timesheet in that date range');
		}

		if (resourceEntity.supervisorId != undefined || null) {
			supervisorEntity = await this.userService.getUserbyId(resourceEntity.supervisorId);
		}
		timesheetEntity.status = TimesheetRevisionType.SUBMITTED;
		timesheetEntity.dateModified = new Date(Date.now());
		timesheetEntity.supervisor = supervisorEntity;
		timesheetEntity.resource = resourceEntity;
		timesheetEntity.project = projectEntity;
		return this.timesheetRepository.save(timesheetEntity);
	}

	async updateTimesheet(updateTimesheetDto: UpdateTimesheetDto): Promise<Timesheet> {
		const timesheetEntity = await this.getTimesheet(updateTimesheetDto.id);

		if (timesheetEntity === undefined) {
			throw new NotFoundException(`Could not find timesheet with id ${updateTimesheetDto.id}`);
		}
		if (timesheetEntity.billed) {
			throw new ForbiddenException("This timesheet has already been billed and can't be modified");
		}
		for (const [key, val] of Object.entries(updateTimesheetDto)) if (!val) delete updateTimesheetDto[key];
		Object.assign(timesheetEntity, updateTimesheetDto);
		timesheetEntity.status = TimesheetRevisionType.SUBMITTED;
		return this.timesheetRepository.save(timesheetEntity);
	}

	async deleteTimesheet(timesheetId: number) {
		const timesheetEntity = await this.getTimesheet(timesheetId);
		if (timesheetEntity.billed) {
			throw new ForbiddenException('Cannot delete a timesheet that has been billed');
		}
		await this.timesheetRepository.remove(timesheetEntity);
	}
}
