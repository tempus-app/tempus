import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TimesheetEntryEntity } from '@tempus/api/shared/entity';
import { Repository } from 'typeorm';
import { TimesheetEntry } from '@tempus/shared-domain';
import { CreateTimesheetEntryDto, UpdateTimesheetEntryDto } from '@tempus/api/shared/dto';

@Injectable()
export class TimesheetEntryService {
	constructor(
		@InjectRepository(TimesheetEntryEntity)
		private timesheetEntryRepository: Repository<TimesheetEntryEntity>,
	) {}

	async getTimesheetEntry(timesheetEntryId: number): Promise<TimesheetEntry> {
		const timesheetEntryEntity = await this.timesheetEntryRepository.findOne(timesheetEntryId);
		if (!timesheetEntryEntity)
			throw new NotFoundException(`Could not find timesheet entry with id ${timesheetEntryId}`);
		return timesheetEntryEntity;
	}

	async getAllEntriesforTimesheet(timesheetId: number): Promise<TimesheetEntry[]> {
		const timesheetentries = await this.timesheetEntryRepository.find({
			where: { timesheet: { id: timesheetId } },
			relations: ['timesheet'],
		});
		return timesheetentries;
	}

	async createTimesheetEntry(timesheetEntry: CreateTimesheetEntryDto): Promise<TimesheetEntry> {
		const timesheetEntryEntity = TimesheetEntryEntity.fromDto(timesheetEntry);
		return this.timesheetEntryRepository.save(timesheetEntryEntity);
	}

	/* async updateTimesheetEntry(updateTimesheetEntryDto: UpdateTimesheetEntryDto): Promise<TimesheetEntry> {
            const timesheetEntryEntity = await this.getTimesheetEntry(updateTimesheetEntryDto.id);
            Object.keys(updateTimesheetEntryDto).forEach((key) => {
              const val = updateTimesheetEntryDto[key];
              if (!val) {
                delete updateTimesheetEntryDto[key];
              }
            });
            Object.assign(timesheetEntryEntity, updateTimesheetEntryDto);
            return this.timesheetEntryRepository.save(timesheetEntryEntity);
          } */

	async updateTimesheetEntry(updateTimesheetEntryDto: UpdateTimesheetEntryDto): Promise<TimesheetEntry> {
		const timesheetEntryEntity = await this.getTimesheetEntry(updateTimesheetEntryDto.id);
		const updatedTimesheetEntryDto = { ...updateTimesheetEntryDto };
		Object.keys(updatedTimesheetEntryDto).forEach(key => {
			const val = updatedTimesheetEntryDto[key];
			if (!val) {
				delete updatedTimesheetEntryDto[key];
			}
		});
		Object.assign(timesheetEntryEntity, updatedTimesheetEntryDto);
		return this.timesheetEntryRepository.save(timesheetEntryEntity);
	}

	async deleteTimesheetEntry(timesheetEntryId: number) {
		const timesheetEntryEntity = await this.getTimesheetEntry(timesheetEntryId);
		await this.timesheetEntryRepository.remove(timesheetEntryEntity);
	}
}
