import { TimesheetEntry } from '@tempus/shared-domain';
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { TimesheetEntity } from './timesheet.entity';
import { CreateTimesheetEntryDto } from '@tempus/api/shared/dto';

@Entity()
export class TimesheetEntryEntity implements TimesheetEntry {
	constructor(
		id?: number,
		date?: Date,
		hoursWorked?: number,
		startTime?: number,
		endTime?: number,
		timesheet?: TimesheetEntity,
	) {
		this.id = id;
		this.date = date;
		this.hoursWorked = hoursWorked;
		this.startTime = startTime;
		this.endTime = endTime;
		this.timesheet = timesheet;
	}

	@PrimaryGeneratedColumn()
	id: number;

	@Column({ nullable: true })
	date: Date;

	@Column({ nullable: true })
	hoursWorked: number;

	@Column({ nullable: true })
	startTime: number;

	@Column({ nullable: true })
	endTime: number;

	@ManyToOne(() => TimesheetEntity, timesheet => timesheet.timesheetEntries, {
		onDelete: 'CASCADE',
	})
	timesheet: TimesheetEntity;

	public static fromDto(dto: CreateTimesheetEntryDto): TimesheetEntryEntity {
		if (dto == null) return new TimesheetEntryEntity();
		return new TimesheetEntryEntity(
			undefined,
			dto.date,
			dto.hoursWorked,
			dto.startTime,
			dto.endTime,
			undefined,
		);
	}
}
