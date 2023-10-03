import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TimesheetEntity, UserEntity } from '@tempus/api/shared/entity';
import { Repository } from 'typeorm';
import { Timesheet, TimesheetRevisionType } from '@tempus/shared-domain';
import { ApproveTimesheetDto, CreateTimesheetDto, UpdateTimesheetDto } from '@tempus/api/shared/dto';
import { ResourceService, UserService } from '@tempus/onboarding-api/feature-account';
import { ProjectService } from '@tempus/onboarding-api/feature-project';

@Injectable()
export class TimesheetService {
	constructor(
		@InjectRepository(TimesheetEntity)
		private timesheetRepository: Repository<TimesheetEntity>,
		private userService: UserService,
		private resourceService: ResourceService,
		private projectService: ProjectService,
	) {}

	async getTimesheet(timesheetId: number): Promise<Timesheet> {
		const timesheetEntity = await this.timesheetRepository.findOne(timesheetId);
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
			where: { resource: { id: resourceId }, status: TimesheetRevisionType.SUBMITTED },
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
			take: Number(pageSize),
			skip: Number(page) * Number(pageSize),
		});

		return { timesheets: timesheetsAndCount[0], totalTimesheets: timesheetsAndCount[1] };
	}

	async getAllTimesheetsBySupervisorId(supervisorId: number, page: number, pageSize: number) {
		const timesheetsAndCount = await this.timesheetRepository.findAndCount({
			where: { supervisor: { id: supervisorId } },
			relations: ['supervisor', 'project', 'resource'],
			take: Number(pageSize),
			skip: Number(page) * Number(pageSize),
		});

		return { timesheets: timesheetsAndCount[0], totalTimesheets: timesheetsAndCount[1] };
	}

	async getAllSubmittedTimesheetsforProject(projectId: number): Promise<Timesheet[]> {
		const timesheets = await this.timesheetRepository.find({
			where: { project: { id: projectId }, status: TimesheetRevisionType.SUBMITTED },
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

	async approveOrRejectTimesheet(timesheetId: number, approveTimesheetDto: ApproveTimesheetDto): Promise<Timesheet> {
		const { approval, comment } = approveTimesheetDto;
		const timesheetEntity = await this.timesheetRepository.findOne(timesheetId);
		if (!timesheetEntity) throw new NotFoundException(`Could not find timesheet with id ${timesheetId}`);

		if (approval === true) {
			timesheetEntity.approvedBySupervisor = true;
			timesheetEntity.status = TimesheetRevisionType.APPROVED;
			timesheetEntity.dateModified = new Date(Date.now());
			timesheetEntity.supervisorComment = comment;
			const toReturn = await this.timesheetRepository.save(timesheetEntity);
			return toReturn;
		}
		timesheetEntity.status = TimesheetRevisionType.REJECTED;
		timesheetEntity.dateModified = new Date(Date.now());
		timesheetEntity.supervisorComment = comment;
		const toReturn = await this.timesheetRepository.save(timesheetEntity);
		return toReturn;
	}

	async createTimesheet(timesheet: CreateTimesheetDto): Promise<Timesheet> {
		const timesheetEntity = TimesheetEntity.fromDto(timesheet);
		let supervisorEntity : UserEntity = null;
		if(timesheet.supervisorId != undefined)
			supervisorEntity = await this.userService.getUserbyId(timesheet.supervisorId);
		const projectEntity = await this.projectService.getProjectInfo(timesheet.projectId);
		const resourceEntity = await this.resourceService.getResourceInfo(timesheet.resourceId);
		timesheetEntity.status = TimesheetRevisionType.NEW;
		timesheetEntity.dateModified = new Date(Date.now());
		timesheetEntity.supervisor = supervisorEntity;
		timesheetEntity.resource = resourceEntity;
		timesheetEntity.project = projectEntity;
		return this.timesheetRepository.save(timesheetEntity);
	}

	async updateTimesheet(updateTimesheetDto: UpdateTimesheetDto): Promise<Timesheet> {
		const timesheetEntity = await this.getTimesheet(updateTimesheetDto.id);
		/*const updatedTimesheetEntryDto = { ...updateTimesheetDto };
		Object.keys(updatedTimesheetEntryDto).forEach(key => {
			const val = updatedTimesheetEntryDto[key];
			if (!val) {
				delete updatedTimesheetEntryDto[key];
			}
		});*/
		for (const [key, val] of Object.entries(updateTimesheetDto)) if (!val) delete updateTimesheetDto[key];
		Object.assign(timesheetEntity, updateTimesheetDto);
		return this.timesheetRepository.save(timesheetEntity);
	}

	async deleteTimesheet(timesheetId: number) {
		const timesheetEntity = await this.getTimesheet(timesheetId);
		await this.timesheetRepository.remove(timesheetEntity);
	}
}
