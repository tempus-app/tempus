import { TimesheetEntry } from '@tempus/shared-domain';
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { TimesheetEntity } from './timesheet.entity';
// import { TimesheetEntity } from './timesheet.entity';

@Entity()
export class TimesheetEntryEntity implements TimesheetEntry {
	constructor(
		id: number,
		date: Date,
		hoursWorked: number,
		startTime: number,
		endTime: number,
		// timesheetID: TimesheetEntity,
	) {
		this.id = id;
		this.date = date;
		this.hoursWorked = hoursWorked;
		this.startTime = startTime;
		this.endTime = endTime;
		// this.timesheetID = timesheetID;
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

	@ManyToOne(() => TimesheetEntity, timesheetID => timesheetID.id, { cascade: ['insert', 'update'] })
	timesheetID: TimesheetEntity;
}
