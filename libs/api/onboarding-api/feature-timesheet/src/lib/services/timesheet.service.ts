import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TimesheetEntity } from '@tempus/api/shared/entity';
import { Repository } from 'typeorm';
import { Timesheet } from '@tempus/shared-domain';
import { CreateTimesheetDto } from '@tempus/api/shared/dto';

@Injectable()
export class TimesheetService {
	constructor(
		@InjectRepository(TimesheetEntity)
		private timesheetRepository: Repository<TimesheetEntity>,
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

	async createTimesheet(timesheet: CreateTimesheetDto): Promise<Timesheet> {
		const timesheetEntity = TimesheetEntity.fromDto(timesheet);
		return this.timesheetRepository.save(timesheetEntity);
	}

	/* async updateTimesheet(updateTimesheetDto: UpdateTimesheetDto): Promise<Timesheet> {
			const timesheetEntity = await this.getTimesheet(updateTimesheetDto.id);
			for (const [key, val] of Object.entries(updateTimesheetDto)) if (!val) delete updateTimesheetDto[key];
			Object.assign(timesheetEntity, updateTimesheetDto);
			return this.timesheetRepository.save(timesheetEntity);
		} */

	async deleteTimesheet(timesheetId: number) {
		const timesheetEntity = await this.getTimesheet(timesheetId);
		await this.timesheetRepository.remove(timesheetEntity);
	}
}
