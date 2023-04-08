import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TimesheetEntity } from '@tempus/api/shared/entity';
import { Repository } from 'typeorm';
import { Timesheet, TimesheetRevisionType } from '@tempus/shared-domain';
import { ApproveTimesheetDto, CreateTimesheetDto, UpdateTimesheetDto } from '@tempus/api/shared/dto';
import { ResourceService, UserService } from '@tempus/onboarding-api/feature-account';

@Injectable()
export class TimesheetService {
	constructor(
		@InjectRepository(TimesheetEntity)
		private timesheetRepository: Repository<TimesheetEntity>,
		private userService: UserService,
		private resourceService: ResourceService,
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
		const supervisorEntity = await this.userService.getUserbyId(timesheet.supervisorId);
		const resourceEntity = await this.resourceService.getResourceInfo(timesheet.resourceId);
		timesheetEntity.status = TimesheetRevisionType.NEW;
		timesheetEntity.dateModified = new Date(Date.now());
		timesheetEntity.supervisor = supervisorEntity;
		timesheetEntity.resource = resourceEntity;
		return this.timesheetRepository.save(timesheetEntity);
	}

	async updateTimesheet(updateTimesheetDto: UpdateTimesheetDto): Promise<Timesheet> {
		const timesheetEntity = await this.getTimesheet(updateTimesheetDto.id);
		const updatedTimesheetEntryDto = { ...updateTimesheetDto };
		Object.keys(updatedTimesheetEntryDto).forEach(key => {
			const val = updatedTimesheetEntryDto[key];
			if (!val) {
				delete updatedTimesheetEntryDto[key];
			}
		});
		Object.assign(timesheetEntity, updatedTimesheetEntryDto);
		return this.timesheetRepository.save(timesheetEntity);
	}

	async deleteTimesheet(timesheetId: number) {
		const timesheetEntity = await this.getTimesheet(timesheetId);
		await this.timesheetRepository.remove(timesheetEntity);
	}
}
